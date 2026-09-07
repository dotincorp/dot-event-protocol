# Event Catalog v0.1

## 프로필

| 프로필 | 공통 의미 | 대표 소비자 |
|---|---|---|
| lifecycle | 앱·세션 수명주기 | 모든 제품 |
| interaction | 편집 명령과 도구 사용 | Canvas, Document, Music |
| content | 문서·페이지·리소스 | Canvas, Book, Document |
| activity | 게임·연습·업무 흐름 | Mini Games, Class |
| assessment | 답안·시도·채점 | Quiz, Class |
| collaboration | 참여·공유·피드백 | Class, Cloud |
| storage | 업로드·동기화·복구 | Cloud, 모든 앱 |
| media | 음악·음성·영상 재생 | Music, Book |
| device | 연결·상태·프레임 전송 | Dot Pad 연계 앱 |
| accessibility | UI 모드·입력 방법 | 모든 사용자 앱 |
| ai | 생성·변환·검토 | 향후 AI 기능 |
| operational | 오류·지연·자원 상태 | 앱·서버·장치 |

## 등록 이벤트

| 이벤트 | 프로필 | lane | 개인정보 |
|---|---|---|---|
| `com.dot.app.session.started.v1` | lifecycle | product | pseudonymous |
| `com.dot.app.session.ended.v1` | lifecycle | product | pseudonymous |
| `com.dot.resource.opened.v1` | content | product | pseudonymous |
| `com.dot.resource.created.v1` | content | product | pseudonymous |
| `com.dot.operation.completed.v1` | interaction | product | pseudonymous |
| `com.dot.operation.failed.v1` | operational | operational | non_personal |
| `com.dot.activity.started.v1` | activity | product | pseudonymous |
| `com.dot.activity.completed.v1` | activity | product | pseudonymous |
| `com.dot.assessment.attempt.completed.v1` | assessment | learning | learning_record |
| `com.dot.collaboration.member.joined.v1` | collaboration | realtime | pseudonymous |
| `com.dot.storage.sync.completed.v1` | storage | operational | pseudonymous |
| `com.dot.media.playback.started.v1` | media | product | pseudonymous |
| `com.dot.device.connection.changed.v1` | device | operational | non_personal |
| `com.dot.accessibility.mode.changed.v1` | accessibility | product | pseudonymous |

## 등록 절차

새 이벤트는 다음 질문에 답해야 한다.

1. 어떤 제품 결정, 학습 분석, 감사 또는 운영 대응에 사용되는가?
2. 기존 이벤트로 표현하면 의미가 손실되는가?
3. 데이터 발생 빈도와 예상 크기는 얼마인가?
4. 개인정보와 학습 기록이 포함되는가?
5. 보존 기간과 접근 가능한 역할은 무엇인가?
6. 재전송과 중복 처리는 안전한가?

