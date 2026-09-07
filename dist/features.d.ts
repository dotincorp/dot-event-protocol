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