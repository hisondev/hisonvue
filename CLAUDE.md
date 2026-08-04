# hisonvue — hisondev Vue 3 UI 컴포넌트 라이브러리 (npm)

hisonjs를 포함/확장하는 Vue 3 컴포넌트 25종. nonoshow 프론트엔드의 핵심 라이브러리.
npm `hisonvue` **v1.1.44** (2026-08-04 무의존 엑셀(XLSX) 라이터 신규 — ★미배포) / MIT / 의존: hisonjs ^1.2.12, vanillagrid2 ^1.0.9, vanillanote2 ^1.1.1, chart.js, vue-cal / peer: vue 3, @nuxt/kit. **의존성 추가 0건 유지**
(v1.1.36 = 보완 프로젝트 7단계 산출 — 변경 내역: `../../../md/hisondev-hisonvue.md` 9절, 1.1.37 hotfix는 9-1절, 1.1.38~39 = date input·HImagebox 수정, 1.1.40 = HDropdown scoped slots `item`/`toggle-label` + HDropdownOption 커스텀 필드 허용, 1.1.41 = HInput 언마운트 blur null 가드, 1.1.42 = HLabel 텍스트 슬롯 반응성, 1.1.43 = HCalendar 셀 클릭 크래시)

### v1.1.44 — 무의존 엑셀(XLSX) 다운로드 (2026-08-04, 신규 기능)

- **진입점 2개 / writer 1개 공유**
  - `grid.downloadExcel(options?)` — HGrid 런타임 메서드. colInfo에서 헤더·타입·표시형식·너비·숨김을 읽어 **화면에 보이는 그대로** 내보낸다 (`getDataModel()`과 같은 hisonvue 확장 지점)
  - `hison.excel.download(sheets, options?)` / `.getBlob()` / `.save()` / `.setSaveHandler()` — 그리드가 없는 계산된 표(손익계산서 등)·다중 시트용
- **의존성 0**: XLSX = ZIP + XML이라는 사실을 그대로 구현. `src/excel/zip.ts`(STORE ZIP + CRC32 + `CompressionStream` 분기) · `xlsx.ts`(XML 6장 + 셀 타입/서식) · `gridExcel.ts`(colInfo → 시트). **minify 15.1KB / gzip 5.8KB**
- 🔴 **STORE(무압축)가 기본인 이유 = iOS 13**: `CompressionStream('deflate-raw')`는 Safari 16.4+다. 있으면 쓰고 없으면 무압축으로 떨어진다(엑셀·Numbers·LibreOffice 모두 무압축 xlsx를 정상 개봉). 500행×6열 기준 무압축 186KB / 압축 21KB
- `sharedStrings.xml`을 만들지 않는다 — `t="inlineStr"`로 문자열을 셀에 직접 박는다
- **날짜는 엑셀 날짜형**(epoch 1899-12-30 시리얼 + `yyyy-mm-dd` numFmt)이라 엑셀에서 정렬·계산이 된다. `dateAsText: true`로 문자열 강제 가능
- 서식 기본 세트: 헤더 굵게+배경(FFF2F2F2)+밑줄, 숫자 천단위(colFormat 그대로 numFmt로 통과), 날짜 서식, 열너비(px→문자수 `(px-5)/7`), 헤더 고정(freeze), 자동필터, 합계행 굵게
- 🔴 **제어문자 제거 필수** — XLSX는 `0x00-0x08`·`0x0B`·`0x0C`·`0x0E-0x1F`를 거부해 "파일이 손상되었습니다"가 뜬다. 수기 입력 칸의 붙여넣기에서 실제로 들어온다. `escapeXml()`이 제거 후 이스케이프
- **웹뷰 저장**: `a[download]`가 iOS WKWebView에서 안 먹는 경우가 있어 `hison.excel.setSaveHandler()`로 네이티브 브리지에 위임 가능(핸들러가 `false`를 반환하면 기본 다운로드로 폴백)
- **가드레일**: `maxRows` 초과 시 **조용히 자르지 않고 throw**. 내장 컬럼(`v-g-rownum`·`v-g-status`)·숨김 컬럼·필터로 숨겨진 행은 기본 제외
- ⚠️ **다단 헤더(`'그룹;세부'`)는 마지막 조각만** 쓴다 — Excel `mergeCells` 매핑은 v2
- 검증: `npm test` 56케이스(엑셀 24케이스 신규) + **openpyxl(실제 엑셀 파서)로 STORE/DEFLATE 양쪽 개봉 확인** — 날짜·숫자·불리언 타입, numFmt, freeze, 자동필터, 열너비, 헤더/합계행 서식, 제어문자 제거, 다중 시트

### v1.1.43 — HCalendar 셀 클릭이 터치 지원 환경에서 죽던 버그 (2026-07-29)

- **증상**: 날짜를 클릭하면 `Uncaught TypeError: Cannot read properties of null (reading 'date')`가 나고 **선택이 아예 안 된다**. (실사고 = nonoshow 예약 플로우 날짜 스텝 — 다음 스텝으로 넘어가지 못함)
- **원인**: vue-cal v4는 클릭된 셀의 날짜를 **mousedown/touchstart에서만** 채운다(`timeAtCursor`). 그런데 셀의 `onCellMouseDown` 첫 줄이 `if ("ontouchstart" in window && !touch) return false` — **터치를 지원하는 환경에서 마우스로 클릭하면**(하이브리드 노트북·브라우저 디바이스 모드 등) 그 경로가 통째로 막히고 click만 도달해 `$emit('cell-click', undefined)`가 나간다. 구현이 그 값을 `_date.date`로 바로 읽어 예외가 났고, 그 예외 때문에 선택 로직까지 중단됐다.
- **수정**: ①널 가드(`_date?.date ?? null`) — 어떤 경우에도 던지지 않는다 ②**복원 폴백**: month 뷰라면 `view-change`의 `firstCellDate`(그리드 첫 셀) + 클릭된 셀의 그리드 순번으로 날짜를 되살린다. 래퍼 루트의 `@click.capture`가 순번만 기록한다(이벤트를 삼키지 않음)
- ⚠️ **week/day 뷰는 복원하지 않는다** — 시각(시:분)까지 필요해 순번만으로는 정확히 만들 수 없다. 그 경우 클릭은 조용히 무시된다(예전처럼 예외로 화면이 멈추지는 않는다)
- 📌 nonoshow에는 배포 전까지 같은 원리의 임시 폴백이 `pages/product/reserve/[id].vue`에 들어가 있다 — **이 버전 반영 후 제거 가능**(해당 주석에 원복 조건 명시)

### v1.1.42 — HLabel 텍스트 전용 슬롯이 갱신되지 않던 버그 (2026-07-26)

- **증상**: `<HLabel>{{ 변수 }}</HLabel>`처럼 **텍스트만** 슬롯으로 주면, 부모가 값을 바꿔도 라벨이 **마운트 시점 값으로 굳었다**. (실사고 = nonoshow 상단 네브: 계정 전환으로 앱 언어가 바뀌어도 메뉴명만 이전 언어로 남음)
- **원인**: 구현이 `onMounted`에서 슬롯 텍스트를 `internalText`로 **1회 스냅샷**하고 `watch(slotNodes, …)`로 갱신하려 했는데, 그 watch가 **발화하지 않았다**. `$slots`는 반응형 객체가 아니라(컴파일된 슬롯은 부모 리렌더 시 슬롯 함수만 교체) `computed(() => slots.default())`에 의존을 걸 수 없어 재평가 트리거가 없다.
- **수정**: 텍스트 전용 슬롯도 **`<slot/>`을 그대로 렌더**(요소 슬롯 경로는 원래 정상 동작했으므로 통일). 스냅샷·죽은 watch 제거. `href` 분기도 동일 적용.
  - `.hison-label-text` 래퍼 **유지** — 이 클래스에 스타일을 건 앱이 깨지지 않게
  - `setText()` 계약 보존 — `textOverridden` 플래그로 슬롯보다 우선
  - `getText()` — 슬롯 사용 중이면 호출 시점에 슬롯을 직접 평가(`slotNodes` 캐시는 신뢰 불가)
- ⚠️ **남은 한계**: `isTextOnlySlot` 판정도 같은 `slotNodes` computed를 쓰므로, **슬롯의 종류가 런타임에 텍스트↔요소로 바뀌는 경우**는 여전히 첫 판정에 고정된다(실사용에선 거의 없어 방치).
- 📌 **권장 사용법**: 단순 텍스트 라벨은 슬롯이 아니라 **`:text` prop**으로 줄 것 — 1차 API이고 `watch(() => props.text)`로 확실히 갱신된다.

## 구조

```
js/hisonvue/
├─ package.json           ← Vite 빌드, "./nuxt" 서브패스로 Nuxt 모듈 제공
├─ nuxt/                  ← Nuxt 모듈/플러그인 (hisonvue/nuxt)
└─ src/
   ├─ index.ts            ← hison(=createHison() 확장) export + hisonvue 플러그인(install) + 25개 SSR래퍼 등록
   ├─ core/               ← getDefaultHisonConfig(519줄, 기본값 전부), setHison(267줄, component/style/cssEvent 부착),
   │                         createHisonCloser(내부 상태 저장소), createSSRClientOnly, deviceStore, setDocumentFromHisonCloser(CSS변수)
   ├─ plugins/            ← hisonjs/vanillagrid/vanillanote/chart 연동 초기화
   ├─ types/              ← component.ts(4,980줄 = HXxxMethods 전부), hisonConfig.ts(759줄), hison.ts
   ├─ enums/              ← Size(xs~xl), Color(11종), InputType(15종), EditMode, 컴포넌트별 enum
   ├─ styles/             ← hisonvue.scss
   └─ components/HXxx/    ← 컴포넌트 25종. 각 폴더: HXxx.vue + props.ts (전부 props.ts 보유)
```

## 핵심 사실

- **hison 싱글톤**: hisonjs hison + `component`(getXxx 25종) + `style`(setter 17/getter 90여) + `cssEvent`(Button 14·Input 12) + fileset 한도 4종. 내부 상태는 hisonCloser에 보관
- **플러그인 install**: 사용자 config **deepMerge**(중첩 키 단위로 기본값 폴백, v1.1.36~) → CSS 변수 적용 → 디바이스 리스너 → `provide('hison')` → 컴포넌트 전역 등록(createSSRClientOnly로 SSR-safe)
- **getXxx 반환**: 베이스 ComponentMethods(getId/getType/isVisible/setVisible/reload) 확장. 특수: getGrid=+vanillagrid GridMethods, getNote=+VanillanoteElement, getChart=+Chart.js Chart, getInputGroup은 visible 계열 없음
- **HisonConfig** = hisonjs 4설정 + componentStyle(size xs~xl, 11색, minHeight/fontSize) + component(grid/note/chart config 주입 + fileset 한도) + event.cssEvent
- **hison.style.setXxx는 호출 즉시** CSS 변수 재적용 + (v1.1.36~) **색상 setter는 restyle**(무파괴 in-place — grid 데이터·note 내용 보존), **setSize만 전 컴포넌트 reload**(재구축)
- 빌드: `npm run build`(vite + append-global-components) / `npm test`(jsdom 스모크 23케이스) / `npm run type-check`
- 디바이스 기준: mb<768, tb<1200, pc<1980, wd≥1980 (SSR은 'pc')
- CSS 클래스: `hison-col-*`(12분할/5%/3·7분할), `hison-size-*`, `hison-color-*`, `hison-pos-*`, 접미어 `-mb/-tb/-pc/-wd`
- `Befoer` 철자(cssEvent)는 의도된 공식 표기

## 상세 문서

- 코어 가이드 + API 표: `../../../md/hisondev-hisonvue.md` (소스 검증 완료)
- **컴포넌트별 상세: `../../../md/hisonvue-components/HXxx.md`** (파일명 = 컴포넌트명) ← 컴포넌트 작업 시 여기부터
- 원천 라이브러리: `../../../md/hisondev-vanillagrid.md`(HGrid), `../../../md/hisondev-vanillanote.md`(HNote)
- 실동작 예시 코드: `../../github.io/src/components/sample/*.vue` (컴포넌트별 데모)

## 알려진 이슈 (수정 금지 — 추후 소유자와 재정리 예정)

1. Size에 `xs` 존재하나 사이트 문서는 4단계(s~xl)로 기재
2. hisonConfig.event.cssEvent의 textbox_* 훅은 hison.cssEvent에 런타임 setter 없음
3. 사이트 표의 getList/getModal 파라미터명 오타(listtId)

## 작업 규칙

- 이 저장소의 소스 수정은 사용자의 명시적 지시가 있을 때만 진행 (프로젝트 루트 CLAUDE.md 규칙 준수)
