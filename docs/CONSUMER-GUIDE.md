# 소비자 가이드 — `@dot/event-protocol` 가져다 쓰기

**대상 독자: 이 패키지를 설치해 이벤트를 보내는 모든 저장소의 개발자와 에이전트.**
저장소마다 다른 방식을 쓰지 않는다. 배포하는 쪽의 절차는 `README.md`에 있다.

## 1. 설치

```json
"@dot/event-protocol": "github:dotincorp/dot-event-protocol#v0.3.0"
```

- **태그로 고정한다.** 브랜치(`#main`, `#dev`)를 가리키면 설치할 때마다 내용이 달라진다.
  범위 지정(`^`, `*`)은 git 의존성에 semver 해석이 없어 아무 의미가 없다.
- 비공개 저장소라 설치 환경에 GitHub 접근 권한이 필요하다. SSH를 쓰면
  `git+ssh://git@github.com/dotincorp/dot-event-protocol.git#v0.3.0`, CI에는 deploy key나 PAT.
- **런타임 의존성이 0개다.** 설치해도 다른 패키지가 따라오지 않고, `prepare` 스크립트가 없어
  컴파일러도 돌지 않는다. npm은 커밋된 `dist/`를 그대로 가져간다.

```bash
node -e "import('@dot/event-protocol').then(m => console.log(Object.keys(m).length))"
```

### 태그를 올릴 때 조용히 실패하는 자리

`package.json`의 태그만 고치고 `npm install`을 돌리면 npm이 `up to date`라고만 답하고 아무것도
하지 않는 경우가 있다. 잠금 파일이 옛 커밋을 가리키고 있어서다. 설치 후에는 잠금 파일이 **태그가
아니라 새 커밋 SHA**를 가리키는지 확인한다. 그대로면 `node_modules/@dot/event-protocol`을 지우고
다시 설치한다.

## 2. 무엇이 들어 있나

| import | 무엇 |
|---|---|
| `@dot/event-protocol` | 이벤트 카탈로그, 기능 카탈로그, 타입, 봉투를 만드는 `DotEventClient`, 검증기 |
| `@dot/event-protocol/transport` | 참조 HTTP 전송 `createHttpSink` — 배치·재시도·오프라인 큐 |

```js
import {
  DotEventClient,      // 봉투를 만든다
  validateDotEvent,    // 봉투가 계약에 맞는지 본다
  eventCatalog,        // 등록된 이벤트 이름과 lane·개인정보 등급
  featureCatalog,      // 등록된 기능 키와 사람이 읽는 이름
  productLabel,        // 앱 id → 제품 이름
} from "@dot/event-protocol";
import { createHttpSink } from "@dot/event-protocol/transport";
```

전송은 계약이 아니다. `transport`는 "배치로 POST하고 실패해도 아무것도 깨지 않는다"는 흔한 경우를
한 번만 구현해 둔 것이고, 제품이 자기 큐를 쓰고 싶으면 `EventSink`(=`emit(event)` 하나)만 맞추면 된다.

## 3. 이벤트 하나 보내기

```js
const sink = createHttpSink(endpoint, { ingestKey: process.env.DOT_INGEST_KEY });

const client = new DotEventClient(
  {
    source: "dot://dot-quiz/web",        // dot://<앱 id>/<표면>
    schemaBaseUrl: "https://schemas.dot/event/v0.1",
    producer: { app: "dot-quiz", appVersion: "1.2.0", platform: "web" },
    sessionId,                            // 이 실행의 세션 id
    tenantId,                             // 있을 때만
    countryCode,                          // 계정 설정값. IP·위치에서 추론 금지
  },
  { createId: () => crypto.randomUUID(), now: () => new Date().toISOString() },
  sink ?? { emit() {} },                  // 주소가 없으면 sink 는 undefined 다
);

await client.emit("com.dot.activity.completed.v1", {
  action: "completed",
  actor: { type: "user", id: pseudonymousId },   // 가명 id 만. 없으면 통째로 생략
  outcome: { status: "success", count: 12, score: 80 },
  attributes: { featureKey: "dot-quiz.play.single-round" },
});
```

클라이언트가 채워 주는 것: `specversion`, `id`, `time`, `dataschema`, 그리고 카탈로그에서 읽은
`lane`·`privacyClass`·`profile`·`eventVersion`. **등록되지 않은 이벤트 이름을 주면 즉시 throw 한다** —
lane과 개인정보 등급을 제품이 정하지 못하게 하려는 것이다.

### `featureKey`가 집계의 기준

대시보드는 `data.attributes.featureKey`로 기능을 센다. 키는 `<product>.<surface>.<capability>`
세 구간이고 `featureCatalog`에 등록된 것만 이름으로 표시된다. 미등록 키도 버려지지는 않지만 화면에
키 문자열이 그대로 나온다. **즉석에서 문자열을 만들지 말고 상수로 두고 쓴다.**

### 수명주기 이벤트를 빼먹지 않는다

`com.dot.app.session.started.v1` / `…ended.v1`이 없으면 활성 사용자와 세션이 집계되지 않는다.
이 둘에는 `featureKey`를 붙이지 않는다.

## 4. 수집 키

게이트웨이가 키를 요구하면 bearer 토큰으로 실린다.

```js
createHttpSink(endpoint, { ingestKey: process.env.DOT_INGEST_KEY });
```

키는 앱에 묶여 있어 다른 제품 이름으로는 이벤트를 넣지 못한다. 넘기지 않으면 요청에 키가 실리지
않고, 키를 요구하는 게이트웨이는 401을 준다 — 그때 배치는 유실되지 않고 재시도 대기열에 남는다.

**브라우저에 실린 키는 비밀이 아니다.** 네트워크 탭에서 읽힌다. 서버가 있는 제품(Next.js 등)은
키를 서버에 두고, 브라우저는 자기 서버의 라우트로만 보낸 뒤 서버가 헤더를 붙여 넘기는 편이 낫다.
`NEXT_PUBLIC_`/`VITE_` 접두사를 붙이면 그 값은 번들에 들어간다.

## 5. SDK를 브라우저에 들이고 싶지 않을 때

빌드 도구가 없거나 번들을 늘리기 싫은 저장소는 봉투를 직접 만들어도 된다. 대신 **그 봉투가 계약을
만족하는지 테스트에서 진짜 패키지로 검증한다.**

```js
import { validateDotEvent, eventCatalog } from "@dot/event-protocol";

test("봉투가 계약에 맞는다", () => {
  expect(validateDotEvent(buildEvent())).toEqual([]);
});

test("lane 과 개인정보 등급을 옮겨 적은 값이 카탈로그와 같다", () => {
  expect(MY_COPY["com.dot.activity.completed.v1"]).toMatchObject(
    eventCatalog["com.dot.activity.completed.v1"],
  );
});
```

계약이 바뀌면 테스트가 먼저 깨진다. 이름·lane·개인정보 등급을 제품이 새로 정하는 것이 아니라
등록된 값을 옮겨 적고 테스트가 대조하는 것이 요점이다. `fixtures/valid/*.json`에 올바른 봉투 예가,
`fixtures/invalid/`에 거절돼야 하는 예가 있다.

JVM·Swift·Python 쪽은 같은 카탈로그에서 생성한 코드가 `dot-dashboard`의 `sdk/`에 있다.

## 6. 넣지 않는 것

- 문서 본문, 점자 내용, 답안 원문
- 파일명, 수업명, 검색어, 자유 입력 텍스트
- 실명, 이메일, 전화번호 — `actor.id`는 가명 id만
- 이미지·음성·음악 원본, 포인터 이동 전체 좌표
- 예외 메시지에 섞인 로컬 경로·토큰·서버 응답 본문

`attributes`에는 등록된 식별자만 넣는다. 실패는 `com.dot.operation.failed.v1`과
`outcome.errorType`의 **분류된 오류 종류**로 보내고 메시지 원문은 싣지 않는다.
자세한 규칙은 `docs/PRIVACY-AND-ROUTING.md`.

## 7. 전송이 제품을 깨뜨리지 않는다

- 전송 실패가 기능을 막지 않는다. `createHttpSink`는 실패를 삼키고 `onError`로만 알린다.
- 재시도는 같은 `source + id`를 유지한다 — 게이트웨이가 그것으로 중복을 지운다.
- 고빈도 동작은 포인터 단위가 아니라 완료된 명령 단위로 집계한다.
- 오프라인 큐에는 상한이 있고, 넘치면 **오래된 것부터** 버린다.

## 8. 새 이벤트나 기능 키가 필요할 때

키는 저장된 이벤트에 그대로 박혀 나중에 못 바꾼다. 소비자 저장소가 자기 목록을 갖지 않는다.
필요한 것이 카탈로그에 없으면 무엇을 왜 재고 싶은지 정리해 이 저장소에 등록을 요청한다.
새 이벤트 이름은 `docs/EVENT-CATALOG.md`의 등록 절차 여섯 질문에 답해야 한다.

등록과 태그가 나오면 소비자는 `package.json`의 태그를 올려 가져간다. 자동으로 따라오지 않는 것이
의도다.
