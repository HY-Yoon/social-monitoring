# Social Monitoring

브랜드별 소셜 데이터를 모아 언급량, 증감 추이, 감성, 키워드를 분석하는 **소셜 모니터링 대시보드**입니다.

Vue 실무 경험을 바탕으로 React와 Next.js 기반 서비스를 처음부터 설계·구현·배포하는 과정을 기록하는 학습 프로젝트입니다. 모든 데이터는 직접 구성한 가상 데이터이며, 특정 서비스나 회사의 코드·데이터·디자인을 사용하지 않습니다.

> 🚧 진행 중 — 현재 1단계(React 핵심 개념)를 진행하고 있습니다. [로드맵](#로드맵)

<br>

## 주요 기능

### 구현됨

- [x] 브랜드별 언급량 목록과 전체 언급량 합계
- [x] 전일 대비 증감률 표시 (상승 ▲ / 하락 ▼ / 변동 없음 -)
- [x] 정렬: 언급량순, 증감률순, 이름순
- [x] 브랜드명 실시간 검색 (대소문자·앞뒤 공백 무시)
- [x] 증감 방향 필터: 전체 / 증가 / 감소 / 변화 없음
- [x] 브랜드 카드 선택과 선택 해제
- [x] 결과 건수 표시, 빈 결과 상태 구분 (데이터 없음 / 조건 불일치)

### 예정

- [ ] 기간별 언급량 추이 차트
- [ ] 채널별 게시물·언급량 분석
- [ ] 긍정·부정·중립 감성 분석
- [ ] 키워드 및 연관어 분석
- [ ] 게시물 검색, 상세 조회, 페이지네이션
- [ ] 검색 조건 URL 동기화
- [ ] 데이터 다운로드

<br>

## 기술 스택

### 현재 사용 중

| 분류 | 기술       |
| ---- | ---------- |
| UI   | React 19   |
| 언어 | TypeScript |
| 빌드 | Vite 8     |
| 린트 | Oxlint     |

### 도입 예정

학습 단계에 맞춰 필요해지는 시점에 도입합니다.

| 분류             | 기술                                           |
| ---------------- | ---------------------------------------------- |
| 라우팅·서버 상태 | React Router, TanStack Query                   |
| 클라이언트 상태  | Zustand                                        |
| 스타일·차트      | Tailwind CSS, ECharts                          |
| 백엔드           | Node.js, Fastify, PostgreSQL, Prisma, Zod      |
| 테스트           | Vitest, React Testing Library, MSW, Playwright |
| 배포·운영        | Docker, GitHub Actions, Vercel                 |
| 확장             | Next.js App Router                             |

<br>

## 실행 방법

**요구 사항:** Node.js `^20.19.0` 또는 `>=22.12.0`

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 타입 체크 + 프로덕션 빌드
npm run lint      # Oxlint
npm run preview   # 빌드 결과 미리보기
```

<br>

## 프로젝트 구조

```
src/
├── components/          # 공통 컴포넌트 (도메인을 모름)
│   ├── change-rate/     #   증감률 표시
│   └── panel/           #   제목 + children 섹션
├── features/            # 도메인 기능
│   └── dashboard/
│       ├── BrandSection.tsx   # 필터·선택 state 보유, 목록 계산
│       ├── BrandFilter.tsx    # 정렬·필터·검색 UI (state 없음)
│       ├── BrandList.tsx      # 목록 표시 전용
│       └── BrandCard.tsx      # 브랜드 카드
├── types/               # 도메인 타입
├── utils/               # 숫자 포맷, 증감률 판정
├── App.tsx
└── main.tsx
```

- `components/`에는 특정 도메인에 의존하지 않고 어디서든 재사용할 수 있는 컴포넌트를 둡니다.
- `features/`에는 기능 단위로 도메인 컴포넌트를 묶습니다. state를 가진 컴포넌트와 표시만 하는 컴포넌트를 구분합니다.

<br>

## 설계 원칙

기능을 구현하면서 정한 원칙입니다. 결정 과정과 대안 검토는 각 PR에 기록되어 있습니다.

| 원칙                                                                                                                                               | 적용                                                      | PR                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **state는 읽고 바꾸는 컴포넌트들의 가장 가까운 공통 부모에 둔다.** 처음부터 위로 올리지 않고, 사용하는 곳 가까이에 두었다가 필요해지면 끌어올린다. | 정렬·필터·선택 state를 `App`이 아닌 `BrandSection`에 배치 | [#4](https://github.com/HY-Yoon/social-monitoring/pull/4)                                                            |
| **계산할 수 있는 값은 state에 저장하지 않는다.** state에는 사용자 입력만 두고, 결과는 렌더 중에 계산한다.                                          | 걸러지고 정렬된 목록, 결과 건수, 빈 결과 문구             | [#4](https://github.com/HY-Yoon/social-monitoring/pull/4), [#6](https://github.com/HY-Yoon/social-monitoring/pull/6) |
| **같은 데이터를 두 곳에 저장하지 않는다.** 선택 state에는 객체가 아니라 id만 저장한다.                                                             | `selectedBrandSeq`로 원본에서 조회                        | [#4](https://github.com/HY-Yoon/social-monitoring/pull/4)                                                            |
| **변경을 감시하지 않고, 변경을 일으킨 이벤트에서 처리한다.** `useEffect`로 state를 맞추지 않는다.                                                  | 목록 조건이 바뀌면 이벤트 핸들러에서 선택 해제            | [#6](https://github.com/HY-Yoon/social-monitoring/pull/6)                                                            |
| **판정과 표시는 같은 기준을 쓴다.** 반올림한 숫자 하나로 판정하고, 그 값을 포맷해 표시한다.                                                        | 증감률 판정 로직을 util로 분리해 표시와 필터가 공유       | [#2](https://github.com/HY-Yoon/social-monitoring/pull/2), [#6](https://github.com/HY-Yoon/social-monitoring/pull/6) |
| **렌더는 순수하게 유지한다.** 렌더 중에 외부 값을 변경하지 않는다.                                                                                 | `sort()` 대신 `toSorted()`                                | [#4](https://github.com/HY-Yoon/social-monitoring/pull/4)                                                            |

<br>

## 개발 방식

- 모든 작업은 **이슈 → 브랜치 → PR** 순서로 진행합니다.
  - 이슈: 목표, 요구사항, 완료 기준을 구현 전에 정의 ([템플릿](.github/ISSUE_TEMPLATE/study-task.md))
  - PR: 변경 사항, 설계 결정과 대안, 학습 내용, 확인 방법을 기록 ([템플릿](.github/pull_request_template.md))
- 구현 전에 설계 메모(state 위치, 파생 값, 컴포넌트 책임)를 먼저 작성합니다.
- PR은 Squash and merge로 병합합니다.

<br>

## 로드맵

| 단계 | 내용                                                   | 상태       |
| ---- | ------------------------------------------------------ | ---------- |
| 1    | React 핵심 개념: JSX, Props, State, Hooks, TypeScript  | 🚧 진행 중 |
| 2    | 렌더링 원리, Custom Hook, React Router, TanStack Query | ⏳         |
| 3    | 프론트엔드 아키텍처, MSW, ECharts, 대시보드            | ⏳         |
| 4    | Node.js, Fastify, PostgreSQL, Prisma, REST API         | ⏳         |
| 5    | 프론트엔드·백엔드 통합, 인증                           | ⏳         |
| 6    | Vitest, React Testing Library, Playwright              | ⏳         |
| 7    | Docker, CI/CD, 배포, 운영                              | ⏳         |
| 8    | Next.js App Router, SSR, SSG, SEO                      | ⏳         |
