import type { HExcelCompression } from '../types'

/**
 * Minimal ZIP writer — no dependency.
 *
 * An `.xlsx` file is a ZIP archive of XML parts. A **STORE** (uncompressed) archive
 * needs nothing more than the local file header / central directory / EOCD records
 * plus a CRC-32, so no deflate implementation is required. When the browser exposes
 * `CompressionStream('deflate-raw')` the entries are deflated instead.
 */

/** One file inside the archive. */
export interface ZipEntry {
    /** Path inside the archive, e.g. `xl/worksheets/sheet1.xml`. */
    path: string
    /** Raw file bytes. */
    data: Uint8Array
}

const SIG_LOCAL = 0x04034b50
const SIG_CENTRAL = 0x02014b50
const SIG_EOCD = 0x06054b50
const METHOD_STORE = 0
const METHOD_DEFLATE = 8
/** ZIP 스펙상 압축 해제에 필요한 최소 버전 (2.0) */
const VERSION_NEEDED = 20

/** CRC-32 테이블은 최초 1회만 만들어 재사용 */
let crcTable: Uint32Array | null = null
const getCrcTable = () => {
    if (crcTable) return crcTable
    const table = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
        let c = i
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
        table[i] = c >>> 0
    }
    crcTable = table
    return table
}

/** ZIP 엔트리 무결성 검증에 쓰이는 CRC-32 (표준 다항식 0xEDB88320) */
export const crc32 = (data: Uint8Array) => {
    const table = getCrcTable()
    let c = 0xFFFFFFFF
    for (let i = 0; i < data.length; i++) {
        c = table[(c ^ data[i]) & 0xFF] ^ (c >>> 8)
    }
    return (c ^ 0xFFFFFFFF) >>> 0
}

/**
 * `CompressionStream`이 있으면 raw deflate, 없으면 null.
 * ⚠️ Safari 16.4+ (iOS 16.4+) 부터라 구형 WebView에서는 항상 null → STORE로 떨어진다.
 */
const deflateRaw = async (data: Uint8Array): Promise<Uint8Array | null> => {
    const CompressionStreamCtor = (globalThis as any).CompressionStream
    if (typeof CompressionStreamCtor !== 'function') return null
    try {
        const stream = new CompressionStreamCtor('deflate-raw')
        const writer = stream.writable.getWriter()
        // 반환 Promise를 await하지 않는다 — reader가 소비하기 전에 write가 완료되지 않을 수 있다
        writer.write(data)
        writer.close()

        const reader = stream.readable.getReader()
        const chunks: Uint8Array[] = []
        let total = 0
        for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = value as Uint8Array
            chunks.push(chunk)
            total += chunk.length
        }
        const out = new Uint8Array(total)
        let offset = 0
        for (const chunk of chunks) {
            out.set(chunk, offset)
            offset += chunk.length
        }
        return out
    } catch {
        return null
    }
}

/** JS Date → MS-DOS 날짜/시간 필드 (ZIP은 1980년 이전을 표현하지 못한다) */
const toDosDateTime = (date: Date) => {
    const year = date.getFullYear() < 1980 ? 1980 : date.getFullYear()
    return {
        time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >>> 1),
        date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    }
}

/**
 * Builds a ZIP archive from the given entries.
 *
 * @param entries     Files to pack.
 * @param compression `'auto'` (default) deflates when the browser supports it,
 *                    `'store'` never compresses, `'deflate'` behaves like `'auto'`.
 * @returns The archive bytes.
 */
export const createZip = async (entries: ZipEntry[], compression: HExcelCompression = 'auto'): Promise<Uint8Array> => {
    const encoder = new TextEncoder()
    const { time: dosTime, date: dosDate } = toDosDateTime(new Date())
    const allowDeflate = compression !== 'store'

    const prepared: {
        nameBytes: Uint8Array
        body: Uint8Array
        method: number
        crc: number
        rawSize: number
        offset: number
    }[] = []

    for (const entry of entries) {
        const raw = entry.data
        let body = raw
        let method = METHOD_STORE
        if (allowDeflate) {
            const packed = await deflateRaw(raw)
            // 압축 결과가 원본보다 크면 STORE 유지 (작은 XML 조각에서 실제로 일어난다)
            if (packed && packed.length < raw.length) {
                body = packed
                method = METHOD_DEFLATE
            }
        }
        prepared.push({
            nameBytes: encoder.encode(entry.path),
            body,
            method,
            crc: crc32(raw),
            rawSize: raw.length,
            offset: 0,
        })
    }

    let localSize = 0
    let centralSize = 0
    for (const item of prepared) {
        localSize += 30 + item.nameBytes.length + item.body.length
        centralSize += 46 + item.nameBytes.length
    }

    const out = new Uint8Array(localSize + centralSize + 22)
    const view = new DataView(out.buffer)
    let pos = 0

    // 1) 로컬 파일 헤더 + 데이터
    for (const item of prepared) {
        item.offset = pos
        view.setUint32(pos, SIG_LOCAL, true)
        view.setUint16(pos + 4, VERSION_NEEDED, true)
        view.setUint16(pos + 6, 0, true)                    // general purpose flag
        view.setUint16(pos + 8, item.method, true)
        view.setUint16(pos + 10, dosTime, true)
        view.setUint16(pos + 12, dosDate, true)
        view.setUint32(pos + 14, item.crc, true)
        view.setUint32(pos + 18, item.body.length, true)    // compressed size
        view.setUint32(pos + 22, item.rawSize, true)        // uncompressed size
        view.setUint16(pos + 26, item.nameBytes.length, true)
        view.setUint16(pos + 28, 0, true)                   // extra field length
        pos += 30
        out.set(item.nameBytes, pos)
        pos += item.nameBytes.length
        out.set(item.body, pos)
        pos += item.body.length
    }

    // 2) 중앙 디렉터리
    const centralStart = pos
    for (const item of prepared) {
        view.setUint32(pos, SIG_CENTRAL, true)
        view.setUint16(pos + 4, VERSION_NEEDED, true)       // version made by
        view.setUint16(pos + 6, VERSION_NEEDED, true)       // version needed
        view.setUint16(pos + 8, 0, true)
        view.setUint16(pos + 10, item.method, true)
        view.setUint16(pos + 12, dosTime, true)
        view.setUint16(pos + 14, dosDate, true)
        view.setUint32(pos + 16, item.crc, true)
        view.setUint32(pos + 20, item.body.length, true)
        view.setUint32(pos + 24, item.rawSize, true)
        view.setUint16(pos + 28, item.nameBytes.length, true)
        view.setUint16(pos + 30, 0, true)                   // extra field length
        view.setUint16(pos + 32, 0, true)                   // file comment length
        view.setUint16(pos + 34, 0, true)                   // disk number start
        view.setUint16(pos + 36, 0, true)                   // internal attributes
        view.setUint32(pos + 38, 0, true)                   // external attributes
        view.setUint32(pos + 42, item.offset, true)         // local header offset
        pos += 46
        out.set(item.nameBytes, pos)
        pos += item.nameBytes.length
    }

    // 3) EOCD
    view.setUint32(pos, SIG_EOCD, true)
    view.setUint16(pos + 4, 0, true)                        // this disk
    view.setUint16(pos + 6, 0, true)                        // disk with central directory
    view.setUint16(pos + 8, prepared.length, true)
    view.setUint16(pos + 10, prepared.length, true)
    view.setUint32(pos + 12, pos - centralStart, true)      // central directory size
    view.setUint32(pos + 16, centralStart, true)            // central directory offset
    view.setUint16(pos + 20, 0, true)                       // comment length

    return out
}
