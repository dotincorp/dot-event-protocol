/**
 * The central feature catalog.
 *
 * The usage contract requires features to be registered here before a product
 * ships events for them, and forbids a product repository from owning its own
 * list. Until now the registry did not exist, so a `featureKey` was the only
 * thing a screen could show — and `dot-class.author.lesson-save` is an
 * identifier, not something a reader recognises. A key answers "which feature";
 * only a registered label answers "what is it".
 *
 * The key stays the stable identity. The label is presentation and may be
 * rewritten freely; the key may not, because rewriting it breaks every stored
 * event that carries it.
 */
export interface FeatureDefinition {
    /** Stable `<product>.<surface>.<capability>` identity. */
    readonly key: string;
    /** What a person calls this feature. */
    readonly label: string;
    /** Producing product. */
    readonly product: string;
    /** Work area inside the product — author, report, editor, play. */
    readonly surface: string;
    /** What the user completed, in one sentence. */
    readonly description: string;
    /** Optional label for summed `outcome.count`, such as pages or affected pins. */
    readonly quantityLabel?: string;
    readonly status: "proposed" | "active" | "deprecated" | "retired";
}
/** Product identity, so a screen does not print `dot-mini-games` at a reader. */
export declare const productLabels: Readonly<Record<string, string>>;
export declare const featureCatalog: {
    readonly "dot-canvas.editor.command": {
        readonly key: "dot-canvas.editor.command";
        readonly label: "편집 명령";
        readonly product: "dot-canvas";
        readonly surface: "편집기";
        readonly description: "캔버스에서 실행한 편집 명령을 완료한다.";
        readonly quantityLabel: "변경 돌기";
        readonly status: "active";
    };
    readonly "dot-canvas.editor.tool-select": {
        readonly key: "dot-canvas.editor.tool-select";
        readonly label: "도구 선택";
        readonly product: "dot-canvas";
        readonly surface: "편집기";
        readonly description: "그리기·도형·점자 등 편집 도구를 선택한다.";
        readonly status: "active";
    };
    readonly "dot-canvas.navigation.menu-open": {
        readonly key: "dot-canvas.navigation.menu-open";
        readonly label: "도구 메뉴 열기";
        readonly product: "dot-canvas";
        readonly surface: "탐색";
        readonly description: "도구 그룹 메뉴를 열어 기능을 탐색한다.";
        readonly status: "active";
    };
    readonly "dot-canvas.output.dotpad-print": {
        readonly key: "dot-canvas.output.dotpad-print";
        readonly label: "DOT PAD 출력";
        readonly product: "dot-canvas";
        readonly surface: "출력";
        readonly description: "현재 페이지나 발표 화면을 DOT PAD로 출력한다.";
        readonly quantityLabel: "출력 페이지";
        readonly status: "active";
    };
    readonly "dot-class.author.lesson-save": {
        readonly key: "dot-class.author.lesson-save";
        readonly label: "교재 저장";
        readonly product: "dot-class";
        readonly surface: "교재 만들기";
        readonly description: "교사가 만든 교재를 저장해 수업에서 쓸 수 있게 한다.";
        readonly quantityLabel: "교재 단계";
        readonly status: "active";
    };
    readonly "dot-class.author.template-apply": {
        readonly key: "dot-class.author.template-apply";
        readonly label: "서식 적용";
        readonly product: "dot-class";
        readonly surface: "교재 만들기";
        readonly description: "미리 만들어 둔 서식을 교재에 적용한다.";
        readonly status: "active";
    };
    readonly "dot-class.author.bulk-edit": {
        readonly key: "dot-class.author.bulk-edit";
        readonly label: "단계 일괄 편집";
        readonly product: "dot-class";
        readonly surface: "교재 만들기";
        readonly description: "여러 교재 단계를 한 번에 변경한다.";
        readonly quantityLabel: "변경 단계";
        readonly status: "active";
    };
    readonly "dot-class.author.preview": {
        readonly key: "dot-class.author.preview";
        readonly label: "교재 미리보기";
        readonly product: "dot-class";
        readonly surface: "교재 만들기";
        readonly description: "학생에게 보일 교재를 미리 확인한다.";
        readonly status: "active";
    };
    readonly "dot-class.class.session-start": {
        readonly key: "dot-class.class.session-start";
        readonly label: "수업 시작";
        readonly product: "dot-class";
        readonly surface: "수업";
        readonly description: "교사가 실시간 수업을 시작한다.";
        readonly status: "active";
    };
    readonly "dot-class.student.assignment-open": {
        readonly key: "dot-class.student.assignment-open";
        readonly label: "과제 열기";
        readonly product: "dot-class";
        readonly surface: "학생";
        readonly description: "학생이 배정된 과제를 연다.";
        readonly quantityLabel: "과제 활동";
        readonly status: "active";
    };
    readonly "dot-class.student.assignment-submit": {
        readonly key: "dot-class.student.assignment-submit";
        readonly label: "과제 제출";
        readonly product: "dot-class";
        readonly surface: "학생";
        readonly description: "학생이 과제를 완료해 제출한다.";
        readonly quantityLabel: "제출 활동";
        readonly status: "active";
    };
    readonly "dot-class.student.hand-raise": {
        readonly key: "dot-class.student.hand-raise";
        readonly label: "도움 요청";
        readonly product: "dot-class";
        readonly surface: "학생";
        readonly description: "학생이 수업 중 교사에게 도움을 요청한다.";
        readonly status: "active";
    };
    readonly "dot-class.report.csv-export": {
        readonly key: "dot-class.report.csv-export";
        readonly label: "CSV 내보내기";
        readonly product: "dot-class";
        readonly surface: "보고서";
        readonly description: "수업 기록을 표 파일로 내려받는다.";
        readonly status: "active";
    };
    readonly "dot-class.class.voice-broadcast": {
        readonly key: "dot-class.class.voice-broadcast";
        readonly label: "음성 방송";
        readonly product: "dot-class";
        readonly surface: "수업";
        readonly description: "수업 중 교사의 음성을 학생 기기로 보낸다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-open": {
        readonly key: "dot-cloud.drive.file-open";
        readonly label: "파일 열기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "클라우드에 있는 파일을 연다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-upload": {
        readonly key: "dot-cloud.drive.file-upload";
        readonly label: "파일 올리기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "내 기기의 파일을 클라우드에 올린다.";
        readonly quantityLabel: "올린 파일";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-download": {
        readonly key: "dot-cloud.drive.file-download";
        readonly label: "파일 내려받기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "클라우드의 파일을 내 기기로 내려받는다.";
        readonly quantityLabel: "내려받은 파일";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.folder-create": {
        readonly key: "dot-cloud.drive.folder-create";
        readonly label: "폴더 만들기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일을 정리할 폴더를 만든다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-rename": {
        readonly key: "dot-cloud.drive.file-rename";
        readonly label: "이름 바꾸기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일이나 폴더의 이름을 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-move": {
        readonly key: "dot-cloud.drive.file-move";
        readonly label: "파일 옮기기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일이나 폴더를 다른 위치로 옮긴다.";
        readonly quantityLabel: "옮긴 파일";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-delete": {
        readonly key: "dot-cloud.drive.file-delete";
        readonly label: "휴지통으로 보내기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일이나 폴더를 휴지통으로 보낸다.";
        readonly quantityLabel: "버린 파일";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.file-share": {
        readonly key: "dot-cloud.drive.file-share";
        readonly label: "파일 공유";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일이나 폴더를 다른 사용자와 공유한다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.search": {
        readonly key: "dot-cloud.drive.search";
        readonly label: "검색";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "이름이나 태그로 파일을 찾는다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.favorite-add": {
        readonly key: "dot-cloud.drive.favorite-add";
        readonly label: "즐겨찾기 추가";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "자주 쓰는 파일을 즐겨찾기에 넣는다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.collection-create": {
        readonly key: "dot-cloud.drive.collection-create";
        readonly label: "컬렉션 만들기";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "여러 파일을 묶어 보는 컬렉션을 만든다.";
        readonly status: "active";
    };
    readonly "dot-cloud.drive.tag-edit": {
        readonly key: "dot-cloud.drive.tag-edit";
        readonly label: "태그 편집";
        readonly product: "dot-cloud";
        readonly surface: "드라이브";
        readonly description: "파일에 붙은 분류 태그를 고친다.";
        readonly status: "active";
    };
    readonly "dot-cloud.comms.chat-send": {
        readonly key: "dot-cloud.comms.chat-send";
        readonly label: "대화 보내기";
        readonly product: "dot-cloud";
        readonly surface: "소통";
        readonly description: "친구나 그룹에 대화를 보낸다.";
        readonly quantityLabel: "보낸 대화";
        readonly status: "active";
    };
    readonly "dot-cloud.shell.accessibility-mode": {
        readonly key: "dot-cloud.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-cloud";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-cloud.shell.language-change": {
        readonly key: "dot-cloud.shell.language-change";
        readonly label: "언어 변경";
        readonly product: "dot-cloud";
        readonly surface: "셸";
        readonly description: "화면에 쓰는 언어를 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-document.editor.braille-convert": {
        readonly key: "dot-document.editor.braille-convert";
        readonly label: "점자 변환";
        readonly product: "dot-document";
        readonly surface: "편집기";
        readonly description: "문서를 점자로 조판한다.";
        readonly status: "active";
    };
    readonly "dot-document.editor.document-export": {
        readonly key: "dot-document.editor.document-export";
        readonly label: "문서 내보내기";
        readonly product: "dot-document";
        readonly surface: "편집기";
        readonly description: "조판 결과를 지정한 형식으로 내보낸다.";
        readonly status: "active";
    };
    readonly "dot-hub.shell.app-open": {
        readonly key: "dot-hub.shell.app-open";
        readonly label: "앱 열기";
        readonly product: "dot-hub";
        readonly surface: "셸";
        readonly description: "허브에서 위성앱을 열어 실행한다.";
        readonly status: "active";
    };
    readonly "dot-hub.account.sign-in": {
        readonly key: "dot-hub.account.sign-in";
        readonly label: "로그인";
        readonly product: "dot-hub";
        readonly surface: "계정";
        readonly description: "허브 계정으로 로그인한다.";
        readonly status: "active";
    };
    readonly "dot-hub.comms.chat-send": {
        readonly key: "dot-hub.comms.chat-send";
        readonly label: "대화 보내기";
        readonly product: "dot-hub";
        readonly surface: "소통";
        readonly description: "친구나 그룹에 대화를 보낸다.";
        readonly quantityLabel: "보낸 대화";
        readonly status: "active";
    };
    readonly "dot-hub.comms.friend-add": {
        readonly key: "dot-hub.comms.friend-add";
        readonly label: "친구 추가";
        readonly product: "dot-hub";
        readonly surface: "소통";
        readonly description: "다른 사용자를 친구로 추가한다.";
        readonly status: "active";
    };
    readonly "dot-hub.comms.group-create": {
        readonly key: "dot-hub.comms.group-create";
        readonly label: "그룹 만들기";
        readonly product: "dot-hub";
        readonly surface: "소통";
        readonly description: "여러 명이 함께 쓰는 대화 그룹을 만든다.";
        readonly status: "active";
    };
    readonly "dot-hub.shell.settings-change": {
        readonly key: "dot-hub.shell.settings-change";
        readonly label: "설정 변경";
        readonly product: "dot-hub";
        readonly surface: "셸";
        readonly description: "표시와 소리 같은 사용 환경 설정을 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-hub.shell.accessibility-mode": {
        readonly key: "dot-hub.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-hub";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-hub.shell.language-change": {
        readonly key: "dot-hub.shell.language-change";
        readonly label: "언어 변경";
        readonly product: "dot-hub";
        readonly surface: "셸";
        readonly description: "화면에 쓰는 언어를 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-hub.device.dotpad-connection": {
        readonly key: "dot-hub.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-hub";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
    readonly "dot-mini-games.play.game-round": {
        readonly key: "dot-mini-games.play.game-round";
        readonly label: "게임 한 판";
        readonly product: "dot-mini-games";
        readonly surface: "플레이";
        readonly description: "게임 한 판을 끝까지 진행한다.";
        readonly status: "active";
    };
    readonly "dot-mini-games.device.dotpad-connection": {
        readonly key: "dot-mini-games.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-mini-games";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
    readonly "dot-mini-games.shell.accessibility-mode": {
        readonly key: "dot-mini-games.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-mini-games";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-music.learn.score-read": {
        readonly key: "dot-music.learn.score-read";
        readonly label: "악보 읽기";
        readonly product: "dot-music";
        readonly surface: "배우기";
        readonly description: "점자 악보를 열어 읽는다.";
        readonly status: "active";
    };
    readonly "dot-music.learn.chord-practice": {
        readonly key: "dot-music.learn.chord-practice";
        readonly label: "화음 연습";
        readonly product: "dot-music";
        readonly surface: "배우기";
        readonly description: "화음을 듣고 손으로 확인하며 연습한다.";
        readonly status: "active";
    };
    readonly "dot-music.make.melody-station": {
        readonly key: "dot-music.make.melody-station";
        readonly label: "멜로디 만들기";
        readonly product: "dot-music";
        readonly surface: "만들기";
        readonly description: "음을 이어 붙여 멜로디를 만든다.";
        readonly status: "active";
    };
    readonly "dot-music.make.loop-station": {
        readonly key: "dot-music.make.loop-station";
        readonly label: "루프 연주";
        readonly product: "dot-music";
        readonly surface: "만들기";
        readonly description: "반복되는 소리를 겹쳐 연주한다.";
        readonly status: "active";
    };
    readonly "dot-music.make.ensemble": {
        readonly key: "dot-music.make.ensemble";
        readonly label: "합주";
        readonly product: "dot-music";
        readonly surface: "만들기";
        readonly description: "여러 악기 소리를 함께 울리는 합주를 구성한다.";
        readonly status: "active";
    };
    readonly "dot-music.make.work-save": {
        readonly key: "dot-music.make.work-save";
        readonly label: "작업물 저장";
        readonly product: "dot-music";
        readonly surface: "만들기";
        readonly description: "만든 멜로디나 합주를 클라우드에 저장한다.";
        readonly status: "active";
    };
    readonly "dot-music.play.memory-game": {
        readonly key: "dot-music.play.memory-game";
        readonly label: "멜로디 기억 놀이";
        readonly product: "dot-music";
        readonly surface: "놀이";
        readonly description: "들려준 멜로디를 기억해 따라 누르는 놀이를 한다.";
        readonly status: "active";
    };
    readonly "dot-music.shell.accessibility-mode": {
        readonly key: "dot-music.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-music";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-music.shell.language-change": {
        readonly key: "dot-music.shell.language-change";
        readonly label: "언어 변경";
        readonly product: "dot-music";
        readonly surface: "셸";
        readonly description: "화면에 쓰는 언어를 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-music.device.dotpad-connection": {
        readonly key: "dot-music.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-music";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
    readonly "dot-quiz.play.single-round": {
        readonly key: "dot-quiz.play.single-round";
        readonly label: "혼자 풀기 한 판";
        readonly product: "dot-quiz";
        readonly surface: "플레이";
        readonly description: "혼자 퀴즈 한 판을 끝까지 진행한다.";
        readonly quantityLabel: "푼 문항";
        readonly status: "active";
    };
    readonly "dot-quiz.play.multi-round": {
        readonly key: "dot-quiz.play.multi-round";
        readonly label: "함께 풀기 한 판";
        readonly product: "dot-quiz";
        readonly surface: "플레이";
        readonly description: "여러 명이 같은 문제를 푸는 퀴즈 한 판을 진행한다.";
        readonly quantityLabel: "푼 문항";
        readonly status: "active";
    };
    readonly "dot-quiz.room.join": {
        readonly key: "dot-quiz.room.join";
        readonly label: "방 참여";
        readonly product: "dot-quiz";
        readonly surface: "방";
        readonly description: "PIN으로 함께하기 방에 들어간다.";
        readonly status: "active";
    };
    readonly "dot-quiz.room.invite": {
        readonly key: "dot-quiz.room.invite";
        readonly label: "친구 초대";
        readonly product: "dot-quiz";
        readonly surface: "방";
        readonly description: "친구를 함께하기 방으로 초대한다.";
        readonly status: "active";
    };
    readonly "dot-quiz.author.quiz-save": {
        readonly key: "dot-quiz.author.quiz-save";
        readonly label: "문제 저장";
        readonly product: "dot-quiz";
        readonly surface: "문제 만들기";
        readonly description: "만든 문제를 저장해 다시 쓸 수 있게 한다.";
        readonly quantityLabel: "저장 문항";
        readonly status: "active";
    };
    readonly "dot-quiz.author.shape-draw": {
        readonly key: "dot-quiz.author.shape-draw";
        readonly label: "도형 그리기";
        readonly product: "dot-quiz";
        readonly surface: "문제 만들기";
        readonly description: "문제에 넣을 촉각 도형을 그린다.";
        readonly status: "active";
    };
    readonly "dot-quiz.shell.accessibility-mode": {
        readonly key: "dot-quiz.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-quiz";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-quiz.shell.language-change": {
        readonly key: "dot-quiz.shell.language-change";
        readonly label: "언어 변경";
        readonly product: "dot-quiz";
        readonly surface: "셸";
        readonly description: "화면에 쓰는 언어를 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-quiz.device.dotpad-connection": {
        readonly key: "dot-quiz.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-quiz";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
    readonly "dot-space.explore.galaxy": {
        readonly key: "dot-space.explore.galaxy";
        readonly label: "은하 탐험";
        readonly product: "dot-space";
        readonly surface: "탐험";
        readonly description: "은하의 형태를 촉각으로 훑어 본다.";
        readonly status: "active";
    };
    readonly "dot-space.explore.star": {
        readonly key: "dot-space.explore.star";
        readonly label: "항성 탐험";
        readonly product: "dot-space";
        readonly surface: "탐험";
        readonly description: "개별 항성의 크기와 온도를 비교한다.";
        readonly status: "active";
    };
    readonly "dot-space.explore.constellation": {
        readonly key: "dot-space.explore.constellation";
        readonly label: "별자리 탐험";
        readonly product: "dot-space";
        readonly surface: "탐험";
        readonly description: "별을 잇는 선을 따라 별자리를 짚는다.";
        readonly status: "active";
    };
    readonly "dot-space.explore.planet-system": {
        readonly key: "dot-space.explore.planet-system";
        readonly label: "행성계 탐험";
        readonly product: "dot-space";
        readonly surface: "탐험";
        readonly description: "태양계와 외계 행성계를 위에서 본 배치로 살핀다.";
        readonly status: "active";
    };
    readonly "dot-space.explore.night-sky": {
        readonly key: "dot-space.explore.night-sky";
        readonly label: "지금 하늘 보기";
        readonly product: "dot-space";
        readonly surface: "탐험";
        readonly description: "지구에서 지금 보이는 하늘을 확인한다.";
        readonly status: "active";
    };
    readonly "dot-space.audio.space-sound": {
        readonly key: "dot-space.audio.space-sound";
        readonly label: "우주의 소리 듣기";
        readonly product: "dot-space";
        readonly surface: "오디오";
        readonly description: "펄서와 공명 사슬 같은 우주의 소리를 듣는다.";
        readonly status: "active";
    };
    readonly "dot-space.shell.accessibility-mode": {
        readonly key: "dot-space.shell.accessibility-mode";
        readonly label: "접근성 모드";
        readonly product: "dot-space";
        readonly surface: "셸";
        readonly description: "고대비 같은 화면 모드를 켜고 끈다.";
        readonly status: "active";
    };
    readonly "dot-space.shell.language-change": {
        readonly key: "dot-space.shell.language-change";
        readonly label: "언어 변경";
        readonly product: "dot-space";
        readonly surface: "셸";
        readonly description: "화면에 쓰는 언어를 바꾼다.";
        readonly status: "active";
    };
    readonly "dot-space.device.dotpad-connection": {
        readonly key: "dot-space.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-space";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
    readonly "dot-travel.map.place-explore": {
        readonly key: "dot-travel.map.place-explore";
        readonly label: "장소 탐험";
        readonly product: "dot-travel";
        readonly surface: "지도";
        readonly description: "관광지 한 곳을 촉각 지도로 탐험한다.";
        readonly status: "active";
    };
    readonly "dot-travel.map.world-explore": {
        readonly key: "dot-travel.map.world-explore";
        readonly label: "세계 지도 탐험";
        readonly product: "dot-travel";
        readonly surface: "지도";
        readonly description: "세계 지도 탐험 모드를 이용한다.";
        readonly status: "active";
    };
    readonly "dot-travel.play.treasure-quiz": {
        readonly key: "dot-travel.play.treasure-quiz";
        readonly label: "보물찾기 퀴즈";
        readonly product: "dot-travel";
        readonly surface: "플레이";
        readonly description: "관광지 보물찾기 퀴즈를 진행한다.";
        readonly quantityLabel: "탐색 장소";
        readonly status: "active";
    };
    readonly "dot-travel.audio.place-story": {
        readonly key: "dot-travel.audio.place-story";
        readonly label: "장소 이야기 듣기";
        readonly product: "dot-travel";
        readonly surface: "오디오";
        readonly description: "선택한 장소의 해설을 재생한다.";
        readonly status: "active";
    };
    readonly "dot-travel.device.dotpad-connection": {
        readonly key: "dot-travel.device.dotpad-connection";
        readonly label: "닷패드 연결";
        readonly product: "dot-travel";
        readonly surface: "장치";
        readonly description: "닷패드와 연결하거나 연결이 끊긴다.";
        readonly status: "active";
    };
};
export type FeatureKey = keyof typeof featureCatalog;
export declare function getFeatureDefinition(key: string): FeatureDefinition | undefined;
/**
 * A product's name, or the raw id when it is not registered.
 *
 * Falling back to the id keeps an unregistered product visible instead of
 * dropping it off the screen — an unknown product is a registration gap worth
 * seeing, not something to hide.
 */
export declare function productLabel(app: string): string;
//# sourceMappingURL=features.d.ts.map