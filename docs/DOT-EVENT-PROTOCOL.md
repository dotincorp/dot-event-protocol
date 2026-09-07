# Dot Event Protocol v0.1

## 목적

Dot Event Protocol은 제품 목록과 무관하게 웹, 모바일, 서버, 장치가 동일한 의미로 이벤트를 생산하고 소비하도록 하는 공통 언어다. Canvas 통계에 종속되지 않으며 Cloud, Book, Quiz, Class, Music, Mini Games, Document와 미래 제품을 모두 수용한다.

이 프로토콜은 분석 제품이나 저장소를 선택하지 않는다. 이벤트 생산자와 소비자 사이의 의미, 스키마, 개인정보 분류와 호환성만 규정한다.

## 계층

1. **Envelope**: CloudEvents 1.0 호환 `id`, `source`, `type`, `time`, `subject`, `dataschema`
2. **Dot metadata**: 프로토콜·이벤트 버전, 프로필, lane, 개인정보 등급, producer, 상관관계
3. **Domain data**: Actor–Action–Object–Context–Outcome와 도메인별 details
4. **Catalog**: 등록된 이벤트 이름, 기본 라우팅과 개인정보 등급
5. **Adapters**: Caliper, xAPI, OpenTelemetry 또는 분석 벤더 변환

## 공통 의미 모델

- Actor: 행위 주체. 가능한 경우 실명이 아닌 서버 발급 가명 식별자를 쓴다.
- Action: 완료, 열기, 생성, 제출처럼 과거형 의미의 안정적인 동작 이름이다.
- Object: 문서, 게임 라운드, 평가 시도, 장치 프레임 등 행위 대상이다.
- Context: 관련 조직, 클래스, 문서, 활동과 입력 방식이다.
- Outcome: 성공 여부, 지속 시간, 건수, 점수 또는 분류된 오류다.

## 이벤트 이름

`com.dot.<domain>.<entity>.<past-action>.v<major>` 형식을 사용한다.

예시:

- `com.dot.resource.opened.v1`
- `com.dot.activity.completed.v1`
- `com.dot.assessment.attempt.completed.v1`

이름에는 사용자 ID, 문서 ID, 도구 이름처럼 변하는 값을 넣지 않는다. 의미나 필수 필드가 호환되지 않게 변하면 새 major 이벤트를 만든다.

## 호환성

- 등록된 v1 이벤트의 의미와 기존 필드 타입은 변경하지 않는다.
- 선택 필드 추가는 허용하되 소비자는 알 수 없는 필드를 안전하게 무시해야 한다.
- 필수 필드 추가, 필드 제거, 의미 변경은 새 이벤트 major 버전이다.
- 생산자는 `dataschema`에 정확한 이벤트 스키마 URI를 기록한다.
- 소비자는 `source + id`를 중복 제거 키로 사용한다.

## 범용성과 구체성의 균형

모든 행동을 `feature.used` 하나로 축소하지 않는다. 공통 봉투와 의미 블록은 재사용하지만, 조회할 때 동일 이름이 동일 의미를 보장하도록 중요한 도메인 사건은 별도 등록 이벤트로 만든다.

## 비목표

- 통계 데이터베이스 선정
- 대시보드 도구 선정
- 사용자 실명 또는 문서 원문 수집
- 앱 동작을 통계 전송 성공 여부에 의존시키기

