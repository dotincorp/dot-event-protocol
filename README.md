# @dot/event-protocol

Dot 제품·서비스·기기가 공유하는 이벤트 계약. 이벤트 이름, JSON Schema, lane과
개인정보 등급, 그리고 그것을 만들고 보내는 브라우저·Node 라이브러리를 담는다.

수집 게이트웨이와 대시보드는 여기 없다. 그쪽은 `dot-dashboard`에 있고, 이 계약을
소비하는 쪽이다.

## 설치

```json
"@dot/event-protocol": "github:dotincorp/dot-event-protocol#v0.1.0"
```

태그로 고정한다. 브랜치(`#dev`, `#main`)를 참조하면 설치할 때마다 내용이 달라진다.
비공개 저장소이므로 설치 환경에 GitHub 접근 권한이 필요하다.

```js
import { DotEventClient, validateDotEvent } from "@dot/event-protocol";
import { createHttpSink } from "@dot/event-protocol/transport";
```

**런타임 의존성이 없다.** 이 패키지를 설치해도 다른 패키지가 따라오지 않는다.

## `dist/`가 저장소에 있는 이유

`prepare` 스크립트를 두지 않는다. 두면 git URL로 설치하는 쪽이 **이 저장소의
devDependencies 를 전부 설치하고 컴파일러를 돌려야 한다** — 브라우저 번들 하나
만들자고 AWS SDK, mysql2, 테스트 러너를 받는 일이 실제로 있었다. 스크립트가 없으면
npm 은 커밋된 것을 그대로 가져간다.

대가는 커밋된 빌드 산출물의 흔한 문제, 즉 소스보다 뒤처질 수 있다는 것이다. 그래서
믿지 않고 검사한다 — `test/dist-is-current.test.ts` 가 `dist/` 를 갓 컴파일한 결과와
대조한다. 남의 빌드 산출물을 복사해 두는 것과 다른 점이 이것이다: 확인할 수 있다.

소스를 고쳤으면 `npm run build` 로 다시 만들어 함께 커밋한다.

## 개발

```bash
npm install
npm test        # 타입 검사 + 계약 테스트 + dist 최신성
npm run build   # src → dist
```

## 계약을 바꿀 때

1. `src/` 또는 `schemas/` 를 고친다
2. `npm run build` 로 `dist/` 를 다시 만든다
3. `npm test` 를 통과시킨다
4. `package.json` 의 버전을 올리고 같은 이름의 태그를 만든다
5. 태그를 push 한다 — **태그 push 가 배포다.** 밀지 않으면 소비자는 가져갈 수 없다

소비자는 태그를 올려야 새 계약을 받는다. 자동으로 따라오지 않는 것이 의도다.

## 문서

- `docs/DOT-EVENT-PROTOCOL.md` — 봉투 구조와 규칙
- `docs/EVENT-CATALOG.md` — 등록된 이벤트
- `docs/PRIVACY-AND-ROUTING.md` — lane 과 개인정보 등급
- `docs/CROSS-PLATFORM-COMPATIBILITY.md` — 플랫폼별 주의점
- `DOT-EVENT-PLATFORM-REFERENCE.md` — 플랫폼 전체 참조
