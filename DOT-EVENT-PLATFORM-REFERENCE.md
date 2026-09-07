# Dot Event Platform — 공통 참조 문서

> 문서 상태: v0.1  
> 기준 저장소: `D:\work\dot-dashboard` (패키지 `@dot/event-protocol`)  
> 적용 범위: 모든 Dot 웹·모바일·서버·장치 제품

## 1. 목적

Dot Event Platform은 Canvas 통계만을 위한 시스템이 아니다. Cloud, Book, Quiz, Class, Music, Mini Games, Document, Dot Pad 장치와 앞으로 만들어질 모든 Dot 제품이 같은 의미로 이벤트를 생산하고 소비하기 위한 공통 언어다.

이 문서는 새 제품, 서버, SDK 또는 분석 시스템이 Dot 이벤트를 연동할 때 가장 먼저 읽는 단일 입문 문서다.

## 2. 핵심 결정

1. 특정 분석 벤더, 데이터베이스 또는 프로그래밍 언어에 종속되지 않는다.
2. CloudEvents 1.0 호환 JSON 봉투를 사용한다.
3. 실제 권위 기준은 TypeScript 코드가 아니라 `schemas/`의 JSON Schema다.
4. 이벤트 의미는 Actor–Action–Object–Context–Outcome 모델로 표현한다.
5. 제품 사용 통계, 학습 기록, 감사 로그, 운영 관측과 실시간 이벤트를 분리한다.
6. React와 React Native는 TypeScript SDK를 공유한다.
7. Android 네이티브는 Kotlin, iOS 네이티브는 Swift SDK를 동일 Schema에서 생성한다.
8. 이벤트 전송 실패가 제품 기능, 문서 저장 또는 수업 진행을 막아서는 안 된다.
9. 원문 콘텐츠와 개인정보는 기본 제품 통계에 넣지 않는다.
10. 이벤트 이름과 버전은 중앙 카탈로그에서 관리한다.

## 3. 전체 구조

```text
모든 Dot 제품·서버·장치
    │
    ├─ React Web ───────── TypeScript SDK
    ├─ React Native ────── TypeScript SDK
    ├─ Android Native ──── generated Kotlin SDK
    ├─ iOS Native ──────── generated Swift SDK
    ├─ Backend ─────────── JSON Schema 또는 언어별 SDK
    └─ Dot Device ──────── 최소 wire encoder 또는 gateway
            │
            ▼
      Dot Event Gateway
            │
      Schema·정책 검증
            │
    ┌───────┼─────────┬──────────┬──────────┐
    ▼       ▼         ▼          ▼          ▼
 제품통계  학습기록  감사로그   운영관측   실시간처리
```

## 4. 권위 기준과 파일 위치

| 목적 | 파일 |
|---|---|
| 언어 중립 wire schema | `schemas/v0.1/dot-event-envelope.schema.json` |
| TypeScript 참조 SDK | `src/` |
| 등록 이벤트 | `src/catalog.ts` |
| 다중 언어 적합성 예제 | `fixtures/` |
| SDK 생성 대상 | `codegen/targets.json` |
| 프로토콜 상세 | `docs/DOT-EVENT-PROTOCOL.md` |
| 플랫폼 호환 규칙 | `docs/CROSS-PLATFORM-COMPATIBILITY.md` |
| 개인정보·라우팅 | `docs/PRIVACY-AND-ROUTING.md` |
| 이벤트 목록 | `docs/EVENT-CATALOG.md` |

문서와 코드가 충돌하면 JSON Schema와 등록된 fixture를 먼저 확인한다. Schema 자체를 변경하는 경우에는 프로토콜 호환성 리뷰가 필요하다.

## 5. 공통 이벤트 봉투

```json
{
  "specversion": "1.0",
  "id": "event-unique-id",
  "source": "dot://product/platform",
  "type": "com.dot.activity.completed.v1",
  "time": "2026-08-11T12:00:00.000Z",
  "subject": "activity/pseudonymous-id",
  "dataschema": "https://schemas.dot/event/v0.1/com.dot.activity.completed.v1.schema.json",
  "dot": {
    "protocolVersion": "0.1",
    "eventVersion": 1,
    "lane": "product",
    "privacyClass": "pseudonymous",
    "profile": "activity",
    "producer": {
      "app": "dot-mini-games",
      "appVersion": "1.0.0",
      "platform": "android"
    },
    "tenantId": "tenant-id",
    "sessionId": "session-id",
    "correlationId": "correlation-id"
  },
  "data": {
    "actor": {
      "type": "user",
      "id": "pseudonymous-user-id"
    },
    "action": "completed",
    "object": {
      "type": "game.round",
      "id": "round-id"
    },
    "outcome": {
      "status": "success",
      "durationMs": 42000,
      "score": 850
    }
  }
}
```

### 필수 CloudEvents 필드

- `specversion`: 현재 `1.0`
- `id`: 이벤트 인스턴스 식별자
- `source`: 이벤트 생산자 범위
- `type`: 등록된 이벤트 타입
- `time`: 발생 시각
- `dataschema`: payload 스키마 위치

재전송할 때는 동일한 `source + id`를 유지하며 소비자는 이 조합으로 중복을 제거한다.

## 6. 의미 모델

### Actor

행위 주체다. 가능하면 실명, 이메일 대신 서버가 발급한 가명 ID를 사용한다.

```json
{ "type": "student", "id": "pseudonymous-student" }
```

### Action

완료된 의미 있는 동작이다. `clicked` 같은 UI 구현보다 `opened`, `created`, `completed`, `submitted`, `exported` 같은 도메인 의미를 우선한다.

### Object

행위 대상이다.

```json
{ "type": "document", "id": "pseudonymous-document" }
```

### Context

조직, 클래스, 문서, 활동, 모드와 입력 방식 등 사건을 이해하는 데 필요한 참조다.

### Outcome

성공 여부, 지속 시간, 건수, 점수 또는 분류된 오류를 표현한다.

## 7. 범용 프로필

| 프로필 | 의미 | 적용 예 |
|---|---|---|
| lifecycle | 앱·세션 수명주기 | 모든 제품 |
| interaction | 편집 명령·도구 | Canvas, Document, Music |
| content | 문서·페이지·리소스 | Book, Document, Canvas |
| activity | 게임·연습·업무 흐름 | Mini Games, Class |
| assessment | 시도·답안·채점 | Quiz, Class |
| collaboration | 참여·공유·피드백 | Class, Cloud |
| storage | 업로드·동기화·복구 | Cloud, 모든 앱 |
| media | 음악·음성·영상 | Music, Book |
| device | 연결·상태·프레임 | Dot Pad 연계 앱 |
| accessibility | 모드·입력 방식 | 모든 사용자 앱 |
| ai | 생성·변환·검토 | 향후 AI 기능 |
| operational | 오류·지연·상태 | 앱·서버·장치 |

새 제품은 새로운 이벤트 시스템을 만들지 않고 필요한 프로필을 조합한다.

```text
Mini Games = lifecycle + activity + assessment + accessibility
Document   = lifecycle + content + interaction + storage
Music      = content + media + interaction + device
Class      = lifecycle + collaboration + assessment + storage
Canvas     = content + interaction + device + accessibility
```

## 8. 데이터 lane

공통 봉투를 사용하더라도 목적에 따라 저장소와 접근 권한을 분리한다.

| lane | 목적 | 대표 데이터 |
|---|---|---|
| product | 기능 사용성과 채택 | 도구 사용, 리소스 열기 |
| learning | 학습 과정과 결과 | 평가 시도, 점수, 진도 |
| audit | 보안·관리자 추적 | 권한 변경, 공유, 강제 로그아웃 |
| operational | 오류·성능 | 동기화 실패, 처리 시간 |
| realtime | 현재 세션 반응 | 클래스 참여, 공동 작업 상태 |

하나의 원본 이벤트를 필요에 따라 여러 lane으로 복제하지 않는다. 목적이 다른 경우 명시적으로 분리된 이벤트 계약을 사용한다.

## 9. 개인정보 분류

| 등급 | 의미 |
|---|---|
| non_personal | 사용자·조직과 연결되지 않는 기술 상태 |
| anonymous | 안정 식별자가 없는 익명 이벤트 |
| pseudonymous | 가명 ID와 연결되는 이벤트 |
| personal | 직접·간접 식별 정보 |
| learning_record | 답안·점수·진도 등 학습 기록 |
| sensitive | 장애·건강 등 특별 보호 정보 |
| security | 인증·권한·위협 대응 정보 |

### 기본 금지 데이터

- 문서 본문과 점자 내용
- 퀴즈 답안 원문
- 파일명, 수업명, 자유 입력 텍스트
- 실명, 이메일, 전화번호
- 이미지·음성·음악 원본
- 포인터 이동 전체 좌표
- 토큰, 로컬 경로와 원본 서버 응답

집중 모드 사용은 UI 기능 사용일 뿐 장애 여부가 아니다. 사용자의 장애 유형을 추론하거나 프로파일링하지 않는다.

## 10. 이벤트 이름과 버전

```text
com.dot.<domain>.<entity>.<past-action>.v<major>
```

예시:

- `com.dot.resource.opened.v1`
- `com.dot.activity.completed.v1`
- `com.dot.assessment.attempt.completed.v1`

규칙:

- 이름에는 사용자·문서·도구 ID 같은 동적 값을 넣지 않는다.
- 같은 이름은 항상 같은 의미와 구조를 가져야 한다.
- 선택 필드 추가는 기존 버전에서 허용할 수 있다.
- 필수 필드 추가, 삭제, 타입·의미 변경은 새 major 이벤트다.
- 앱이 중앙 카탈로그에 없는 이벤트를 임의로 만들지 않는다.

## 11. 언어와 플랫폼

### React Web

`@dot/event-protocol` TypeScript SDK와 IndexedDB 기반 sink를 사용한다.

### React Native

동일 TypeScript SDK를 사용하되 큐는 AsyncStorage 또는 SQLite, 전송은 모바일 네트워크 어댑터로 교체한다.

### Android

JSON Schema에서 생성한 Kotlin 모델을 사용한다. Room/file queue와 WorkManager는 별도 sink에 둔다.

### iOS

JSON Schema에서 생성한 Swift `Codable` 모델을 사용한다. 파일/SQLite 큐와 background task는 별도 sink에 둔다.

### 서버·기타 언어

CloudEvents JSON을 직접 검증하거나 Java, C#, Python, Go 등의 생성 SDK를 추가한다.

### Wire 호환 규칙

- UTF-8 JSON
- `camelCase` 필드
- UTC RFC 3339 timestamp
- ID는 문자열
- 선택 필드는 `null`보다 생략
- JavaScript 안전 정수 범위 준수
- JSON 키 순서가 아닌 파싱된 의미 비교

## 12. 제품 적용 방식

제품 코어는 분석 벤더를 직접 호출하지 않는다.

```text
Domain command
    → Domain event
    → Dot event mapper
    → EventSink
        ├─ Noop/Memory
        ├─ OfflineQueue
        └─ HTTP/Message adapter
```

```ts
await eventClient.emit("com.dot.operation.completed.v1", {
  action: "exported",
  object: { type: "document", id: documentRef },
  outcome: { status: "success", durationMs: 320 },
  attributes: { format: "dtms-v2" },
});
```

고빈도 입력은 포인터·핀 단위로 보내지 않고 완료된 명령 단위로 집계한다.

## 13. 생산자 체크리스트

- [ ] 등록된 이벤트 이름을 사용한다.
- [ ] JSON Schema와 fixture를 확인한다.
- [ ] 올바른 profile, lane, privacyClass를 사용한다.
- [ ] ID, 시간과 source를 안정적으로 생성한다.
- [ ] 원문 콘텐츠와 개인정보를 넣지 않는다.
- [ ] 오프라인·재전송·중복 상황을 처리한다.
- [ ] 이벤트 실패가 제품 기능을 막지 않는다.
- [ ] 고빈도 이벤트는 명령 완료 단위로 집계한다.
- [ ] 단위 테스트에서 생성 이벤트를 검증한다.

## 14. 소비자 체크리스트

- [ ] 수집 시 Schema를 다시 검증한다.
- [ ] `source + id`로 중복을 제거한다.
- [ ] lane과 개인정보 등급에 따라 저장소를 분리한다.
- [ ] 알 수 없는 이벤트 버전을 격리한다.
- [ ] 원문 payload를 무기한 보관하지 않는다.
- [ ] tenant 접근 경계를 강제한다.
- [ ] 분석·학습·감사·운영 목적을 혼합하지 않는다.

## 15. 새 이벤트 제안 절차

새 이벤트를 추가하기 전에 다음 질문에 답한다.

1. 어떤 제품 또는 운영 결정을 위해 필요한가?
2. 기존 이벤트로 표현하면 어떤 의미가 손실되는가?
3. 발생 빈도와 최대 payload 크기는 얼마인가?
4. 개인정보·학습 기록·보안 정보가 포함되는가?
5. 어느 lane으로 라우팅하고 누가 볼 수 있는가?
6. 보존 기간과 삭제 정책은 무엇인가?
7. React/RN·Kotlin·Swift에서 동일하게 표현 가능한가?
8. 유효·무효 fixture와 호환성 테스트가 추가됐는가?

## 16. 외부 표준 연계

- 전송 봉투: CloudEvents 1.0
- 운영 관측: OpenTelemetry adapter
- 교육 활동: 1EdTech Caliper adapter
- LRS 연동이 필요한 경우: xAPI adapter

외부 표준은 adapter이며 Dot 내부 의미 모델의 소유자가 아니다.

## 17. 다른 프로젝트에서 참조하는 방법

새 프로젝트의 `README.md`, `AGENTS.md` 또는 시작 프롬프트에 다음을 넣는다.

```markdown
## 공통 이벤트 계약

이 프로젝트의 이벤트는 `@dot/event-protocol` 패키지가 소유한 `DOT-EVENT-PLATFORM-REFERENCE.md`를 따른다.
구현 전 JSON Schema와 등록 이벤트 카탈로그를 확인한다.
프로젝트 내부에서 독자 이벤트 이름, lane 또는 개인정보 등급을 정의하지 않는다.
```

저장소가 다른 환경으로 이동하면 이 문서만 복사하는 것으로 끝내지 않고 `schemas/`, `fixtures/`와 해당 버전 SDK도 함께 배포한다.

## 18. 관련 문서

- `@dot/event-protocol` -> `docs/DOT-EVENT-PROTOCOL.md`
- `@dot/event-protocol` -> `docs/CROSS-PLATFORM-COMPATIBILITY.md`
- `@dot/event-protocol` -> `docs/PRIVACY-AND-ROUTING.md`
- `@dot/event-protocol` -> `docs/EVENT-CATALOG.md`
- `@dot/event-protocol` -> `schemas/v0.1/dot-event-envelope.schema.json`
- `@dot/event-protocol` -> `fixtures`

## 19. 제품 사용량 분석 공통 계약

이 절은 여러 Dot 제품에서 "어떤 기능이 실제로 채택되고 반복 사용되는가"를 같은 기준으로 측정하기 위한 공통 계약이다. 제품별 대시보드 구현이나 분석 저장소 선택보다 이 계약이 우선한다.

현재 v0.1 저장소에는 제품별 기능 카탈로그 Schema와 파일이 아직 포함되어 있지 않다. 생산 환경에서 기능 사용량 이벤트를 연동하려면 이 절만 구현 근거로 삼지 말고, 같은 변경에서 기능 정의 Schema, 중앙 카탈로그, 유효·무효 fixture와 SDK 타입을 추가해야 한다.

### 19.1 제품 사용량 분석의 공통 목적

제품 사용량 분석은 다음 제품 결정을 지원한다.

- 어떤 기능이 사용자, 세션과 tenant에 실제로 채택되었는지 확인한다.
- 한 번 사용한 기능이 이후 세션에서도 반복 사용되는지 확인한다.
- 역할, 제품, 플랫폼과 앱 버전별 채택 차이를 확인한다.
- 기능 개선, 유지, 통합 또는 폐기 우선순위를 정한다.
- 기능 사용의 성공 결과와 별도로 운영 실패·지연을 개선한다.

제품 사용량 분석은 개인의 행동을 감시하거나, 학생의 능력·장애·학습 성과를 추론하거나, 교사·학생 개인의 순위를 만드는 용도로 사용하지 않는다. 답안, 점수와 진도는 `learning` lane, 오류와 성능은 `operational` lane에서 각 목적에 맞는 별도 계약으로 다룬다.

### 19.2 `featureKey` 명명 규칙

기능 사용량 이벤트는 중앙 기능 카탈로그에 등록된 안정적인 `featureKey`를 `data.attributes.featureKey`에 넣는다.

```text
<product>.<surface>.<capability>
```

예시:

- `dot-class.author.bulk-edit`
- `dot-class.class.voice-broadcast`
- `dot-class.report.csv-export`
- `dot-document.editor.braille-convert`

규칙:

- 각 구간은 영문 소문자와 숫자를 사용하고 여러 단어는 `kebab-case`로 쓴다.
- 제품, 사용자 작업 영역(surface), 안정적인 기능(capability)의 세 구간 이상을 사용한다.
- UI 레이블, 번역 문자열, 버튼 ID, 화면 경로 또는 내부 컴포넌트 이름을 사용하지 않는다.
- 사용자·tenant·문서·수업·장치 ID와 타임스탬프 같은 동적 값을 넣지 않는다.
- 앱 버전, 플랫폼과 실험 variant는 키에 넣지 않고 producer 또는 등록된 별도 속성으로 표현한다.
- `featureKey`는 기능 자체를 나타내며 `created`, `applied`, `exported` 같은 행위는 `data.action`으로 분리한다.
- 자유 문자열로 즉석 생성하지 않고 SDK가 제공하는 생성 타입 또는 상수를 사용한다.

### 19.3 제품별 기능 등록 절차

제품 기능은 이벤트를 배포하기 전에 중앙 기능 카탈로그에 등록한다. 제품 저장소가 독자적인 기능 키 목록을 권위 기준으로 소유해서는 안 된다.

기능 정의에는 최소한 다음 정보가 필요하다.

| 필드 | 의미 |
|---|---|
| `key` | 전역에서 안정적인 `featureKey` |
| `product` | 기능을 제공하는 제품 |
| `surface` | author, class, report, editor 같은 작업 영역 |
| `category` | authoring, collaboration, export 같은 분석 분류 |
| `description` | 사용자가 완료한 기능의 의미 |
| `eventType` | 기능 사용을 표현하는 등록 이벤트 타입 |
| `action` | 완료된 도메인 행위 |
| `objectType` | 행위 대상의 안정적인 타입 |
| `owner` | 의미와 수명주기를 관리하는 제품 팀 |
| `status` | proposed, active, deprecated 또는 retired |
| `introducedVersion` | 처음 생산한 제품 버전 |
| `replacedBy` | 대체 기능 키. 대체가 없으면 생략 |

등록 순서:

1. 이 기능 사용이 어떤 제품 결정을 지원하는지 기록한다.
2. 기존 `featureKey`와 이벤트 조합으로 표현할 수 없는지 확인한다.
3. 기능 정의 Schema와 중앙 카탈로그에 항목을 추가한다.
4. 이벤트 이름, action, object type, 허용 속성, lane과 개인정보 등급을 검토한다.
5. 원문 콘텐츠와 고카디널리티 속성이 없는 유효 fixture와 금지 사례 fixture를 추가한다.
6. TypeScript, Kotlin과 Swift 등 대상 SDK의 기능 키 타입을 다시 생성한다.
7. 생산자 테스트에서 정확한 이벤트 1건이 생성되고 재시도 시 ID가 유지되는지 검증한다.

### 19.4 공통 지표 정의

지표는 기간, 제품, actor type과 tenant 접근 범위를 먼저 고정한 뒤 계산한다. 교사와 학생, 웹과 모바일을 하나의 순위로 섞지 않는다.

| 지표 | 공통 정의 |
|---|---|
| 활성 사용자 | 기간 내 `com.dot.app.session.started.v1`이 1회 이상 있는 고유 `actor.id` 수 |
| 활성 세션 | 기간 내 고유 `sessionId` 수 |
| 기능 사용 횟수 | 등록된 `featureKey`에 대해 성공적으로 완료된 의미 이벤트 수 |
| 기능 사용자 | 기간 내 해당 기능을 1회 이상 성공적으로 사용한 고유 `actor.id` 수 |
| 기능 채택률 | 기능 사용자 수 / 같은 제품·역할의 활성 사용자 수 |
| 기능 세션 | 해당 기능을 1회 이상 사용한 고유 `sessionId` 수 |
| 세션 침투율 | 기능 세션 수 / 같은 제품·역할의 활성 세션 수 |
| 사용자당 사용 빈도 | 기능 사용 횟수 / 기능 사용자 수 |
| 반복 사용자 비율 | 둘 이상의 서로 다른 세션에서 기능을 사용한 사용자 수 / 기능 사용자 수 |
| tenant 채택률 | 기능 사용 tenant 수 / 활성 tenant 수 |

분모가 0인 비율은 0으로 만들지 않고 계산 불가로 표시한다. 익명 이벤트처럼 안정적인 `actor.id`가 없으면 사용자 기반 지표를 계산하지 않고 세션 기반 지표만 계산한다. 단순 이벤트 횟수만으로 기능 인기 순위를 정하지 않고 기능 사용자, 세션 침투율과 반복 사용을 함께 본다.

운영 실패율과 지연시간은 `operational` lane에서 별도로 계산한다. 제품 사용 원본과 운영 원본을 사용자 단위로 결합하지 않으며, 필요한 경우 개인정보가 제거된 `featureKey` 단위 집계만 함께 표시한다.

### 19.5 이벤트 발생 위치와 중복 방지 규칙

- 버튼 클릭이나 화면 렌더링보다 사용자가 의도한 도메인 동작이 성공적으로 완료된 시점에 발생시킨다.
- 로컬에서 완결되는 동작은 클라이언트가, 서버 승인이 필요한 동작은 서버가 최종 이벤트를 소유하는 것을 기본으로 한다.
- 하나의 의미 동작에는 하나의 생산자만 지정한다. 클라이언트와 서버가 같은 성공 이벤트를 각각 만들지 않는다.
- 앱 복원, 상태 재동기화, 화면 재렌더링과 서버 응답 재적용은 새로운 기능 사용으로 기록하지 않는다.
- 네트워크 재전송과 오프라인 큐 재처리는 원래의 `source + id`를 유지한다. 전송할 때마다 새 ID를 만들지 않는다.
- 소비자는 `source + id`에 고유 제약을 적용해 최소 한 번 전송에서 발생하는 중복을 제거한다.
- `correlationId`는 클라이언트 명령과 서버 처리의 연관관계에 사용하며 중복 제거 키로 사용하지 않는다.
- 이벤트 생성·저장·전송 실패는 원래 제품 동작의 성공을 실패로 바꾸지 않는다.
- 하나의 사용자 흐름이 서로 다른 목적의 이벤트를 필요로 하면 각 lane의 의미 계약을 따르되, 같은 원본 payload를 여러 lane으로 복제하지 않는다.

### 19.6 고빈도 이벤트 제한

다음 원시 입력과 전송 단위는 제품 사용량 이벤트로 직접 수집하지 않는다.

- 포인터 이동, 드래그 중간 좌표, 스크롤 위치와 키 입력 하나하나
- Dot Pad 핀·프레임 하나하나와 장치 heartbeat
- 음성·음악·영상 패킷과 재생 위치의 연속 변화
- 동기화 polling, presence heartbeat와 내부 재시도
- React 렌더링, 화면 focus와 컴포넌트 lifecycle 자체

연속 입력은 완료된 명령 1건, 제한된 시간 구간의 집계 또는 세션 종료 요약으로 변환한다. 횟수는 가능하면 `outcome.count`, 지속 시간은 `outcome.durationMs`에 넣는다. 한 도메인 명령이 여러 내부 작업을 수행해도 기본적으로 기능 사용 이벤트는 1건만 생성한다.

샘플링이 필요한 규모라면 생산자가 임의 비율을 적용하지 않는다. 샘플링 기준, 비율, 대상 기능과 지표 보정 방법을 중앙 카탈로그 또는 라우팅 정책에 등록한 뒤 적용한다.

### 19.7 기능 폐기·이름 변경 정책

- 화면 문구, 위치 또는 내부 구현만 바뀌고 사용자 의미가 같다면 기존 `featureKey`를 유지한다.
- 기능 의미가 달라지거나 하나의 기능이 여러 기능으로 분리되거나 여러 기능이 하나로 합쳐지면 새 키를 등록한다.
- 폐기한 키는 `deprecated`, 생산이 완전히 끝나면 `retired`로 표시한다.
- 폐기한 키를 다른 기능에 재사용하지 않는다.
- 대체 기능이 있으면 `replacedBy`를 기록하되 과거 원본 이벤트의 키를 새 키로 다시 쓰지 않는다.
- 장기 추세에서 합산이 필요한 경우 원본 변경이 아니라 별도의 계보·보고 매핑으로 처리한다.
- 생산자는 지원 종료 버전 이후 폐기 키를 생성하지 않는 테스트를 추가한다.

### 19.8 소규모 집단 통계 보호 정책

- 사용자 기반 집계는 기본적으로 고유 사용자가 5명 이상일 때만 표시한다. 제품, 계약, 지역 또는 정보 등급에 따라 더 높은 기준을 적용할 수 있다.
- 기준은 이벤트 횟수가 아니라 고유 `actor.id` 수로 판단한다. 한 사용자의 반복 사용으로 공개 기준을 충족한 것으로 보지 않는다.
- 기준보다 작은 역할·tenant·플랫폼·버전 집단은 숨기거나 충분히 큰 상위 집단 또는 `기타`로 합친다.
- 여러 필터 조합이나 기간 축소로 5명 미만 집단을 역산할 수 없도록 동일한 억제 규칙을 적용한다.
- 개인별 기능 사용 내역, 개인 순위와 개인의 장애·학습 능력 추론 결과를 제품 분석 화면에 제공하지 않는다.
- 분석 내보내기와 API에도 화면과 같은 소집단 억제와 tenant 접근 경계를 적용한다.
- 원본 이벤트 접근은 승인된 최소 인원으로 제한하고, 일반 제품 담당자는 보호된 집계만 조회한다.

