# hisonvue — hisondev Vue 3 UI 컴포넌트 라이브러리 (npm)

hisonjs를 포함/확장하는 Vue 3 컴포넌트 25종. nonoshow 프론트엔드의 핵심 라이브러리.
npm `hisonvue` v1.1.40 (2026-07-18 HDropdown scoped slots `item`/`toggle-label` + HDropdownOption 커스텀 필드 허용 — publish 대기) / MIT / 의존: hisonjs ^1.2.12, vanillagrid2 ^1.0.9, vanillanote2 ^1.1.1, chart.js, vue-cal / peer: vue 3, @nuxt/kit.
(v1.1.36 = 보완 프로젝트 7단계 산출 — 변경 내역: `../../../md/hisondev-hisonvue.md` 9절, 1.1.37 hotfix는 9-1절, 1.1.38~39 = date input·HImagebox 수정)

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
