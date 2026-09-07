# Cross-platform Compatibility v0.1

## 권위 기준

Dot Event Protocol의 권위 기준은 특정 프로그래밍 언어의 타입이 아니라 `schemas/` 아래 JSON Schema와 `fixtures/`의 적합성 예제다.

- TypeScript 모델은 첫 번째 참조 구현이다.
- React와 React Native는 동일한 TypeScript 모델·클라이언트를 사용한다.
- Android 네이티브 모듈은 Kotlin 모델과 sink를 사용한다.
- iOS 네이티브 모듈은 Swift `Codable` 모델과 sink를 사용한다.
- 서버와 장치는 CloudEvents 호환 UTF-8 JSON을 직접 생산하거나 공식 SDK를 사용한다.

언어별 SDK가 JSON Schema에 없는 필드를 독자적으로 추가하거나 의미를 바꾸어서는 안 된다.

## 플랫폼 매핑

| 환경 | 모델 | 큐·전송 어댑터 |
|---|---|---|
| React Web | TypeScript SDK | IndexedDB + HTTP batch |
| React Native | TypeScript SDK | AsyncStorage/SQLite + native network |
| Android native | generated Kotlin | Room/file queue + WorkManager |
| iOS native | generated Swift Codable | file/SQLite queue + background task |
| Node server | TypeScript 또는 JSON Schema | message broker/HTTP |
| Python | generated dataclass (무의존성) | 표준 라이브러리 |
| 기타 서버 | 언어별 생성 모델 | CloudEvents HTTP/message binding |
| Dot device | 최소 wire encoder | gateway 또는 연결 앱으로 전달 |

## 언어 중립 wire 규칙

- UTF-8 JSON을 사용한다.
- 필드 이름은 `camelCase`, 이벤트 타입은 `com.dot.*.vN` 형식이다.
- 시간은 UTC RFC 3339 문자열로 보낸다.
- ID는 숫자가 아닌 문자열이다.
- 선택 필드는 값이 없으면 `null` 대신 생략한다.
- 정수는 JavaScript 안전 정수 범위를 넘지 않는다.
- 바이너리·문서·이미지 원문은 이벤트에 넣지 않고 승인된 객체 저장소 참조만 사용한다.
- JSON 객체의 키 순서나 직렬화 바이트가 아니라 파싱된 의미를 비교한다.
- 생산자는 같은 `source + id`로 재전송하여 멱등 처리가 가능하게 한다.

## 적합성 테스트

모든 SDK는 다음 테스트를 통과해야 한다.

1. `fixtures/valid` 이벤트를 디코딩하고 다시 인코딩할 수 있다.
2. `fixtures/invalid` 이벤트를 거부한다.
3. 알 수 없는 선택 필드는 무시하되 필수 필드 손실은 거부한다.
4. 시간, ID, enum과 숫자를 의미 손실 없이 왕복한다.
5. 개인정보 분류와 lane을 로컬 코드가 임의로 변경하지 않는다.

## SDK 생성 정책

`codegen/targets.json`은 지원 언어와 산출 위치를 선언하고 `codegen/generate.ts`가 JSON Schema에서 Kotlin·Swift 모델을 만든다.

- `npm run codegen`: Kotlin·Swift 모델 재생성
- `npm run codegen:check`: 커밋된 산출물이 현재 스키마와 어긋나면 실패

네 언어를 같은 CI에서 검증한다. TypeScript는 ubuntu에서 JSON Schema 적합성까지, Kotlin은 ubuntu에서 Gradle, Swift는 macOS에서 SwiftPM, Python은 ubuntu에서 unittest로 같은 fixture를 돌린다. 스키마 변경으로 생성 결과가 바뀌면 계약 리뷰를 요구한다.

## enum 전방 호환

lane, 개인정보 등급, 프로필처럼 값이 늘어날 수 있는 필드는 닫힌 enum으로 만들지 않는다. Kotlin은 `value class`, Swift는 `RawRepresentable` 구조체로 생성하므로 **더 새로운 계약을 쓰는 생산자가 보낸 모르는 값도 예외 없이 디코딩된다.** 알려진 값인지는 `isKnown`으로 구분한다.

