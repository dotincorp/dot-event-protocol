/**
 * Demo-market subdivisions.
 *
 * This is configured account geography, never an IP or device-location lookup.
 * Codes are deliberately shared by the seed, metrics and the admin-1 map join.
 */
export const regionsByCountry = {
    KR: [
        { code: "KR-11", label: "서울특별시" },
        { code: "KR-41", label: "경기도" },
        { code: "KR-26", label: "부산광역시" },
        { code: "KR-28", label: "인천광역시" },
        { code: "KR-27", label: "대구광역시" },
    ],
    US: [
        { code: "US-CA", label: "캘리포니아" },
        { code: "US-NY", label: "뉴욕" },
        { code: "US-TX", label: "텍사스" },
        { code: "US-WA", label: "워싱턴" },
        { code: "US-FL", label: "플로리다" },
    ],
    JP: [
        { code: "JP-13", label: "도쿄도" },
        { code: "JP-27", label: "오사카부" },
        { code: "JP-23", label: "아이치현" },
        { code: "JP-40", label: "후쿠오카현" },
        { code: "JP-01", label: "홋카이도" },
    ],
    GB: [
        { code: "GB-LND", label: "시티오브런던" },
        { code: "GB-MAN", label: "맨체스터" },
        { code: "GB-EDH", label: "에든버러" },
        { code: "GB-CRF", label: "카디프" },
        { code: "GB-BFS", label: "벨파스트" },
    ],
    DE: [
        { code: "DE-BE", label: "베를린" },
        { code: "DE-BY", label: "바이에른" },
        { code: "DE-NW", label: "노르트라인베스트팔렌" },
        { code: "DE-HH", label: "함부르크" },
        { code: "DE-HE", label: "헤센" },
    ],
    FR: [
        { code: "FR-75", label: "파리" },
        { code: "FR-69", label: "론" },
        { code: "FR-13", label: "부슈뒤론" },
        { code: "FR-33", label: "지롱드" },
        { code: "FR-59", label: "노르" },
    ],
    CA: [
        { code: "CA-ON", label: "온타리오" },
        { code: "CA-QC", label: "퀘벡" },
        { code: "CA-BC", label: "브리티시컬럼비아" },
        { code: "CA-AB", label: "앨버타" },
    ],
    AU: [
        { code: "AU-NSW", label: "뉴사우스웨일스" },
        { code: "AU-VIC", label: "빅토리아" },
        { code: "AU-QLD", label: "퀸즐랜드" },
        { code: "AU-WA", label: "웨스턴오스트레일리아" },
    ],
    SG: [
        { code: "SG-01", label: "중앙싱가포르" },
        { code: "SG-02", label: "북동부" },
        { code: "SG-03", label: "북서부" },
        { code: "SG-05", label: "남서부" },
    ],
    IN: [
        { code: "IN-DL", label: "델리" },
        { code: "IN-MH", label: "마하라슈트라" },
        { code: "IN-KA", label: "카르나타카" },
        { code: "IN-TN", label: "타밀나두" },
    ],
    ID: [
        { code: "ID-JK", label: "자카르타" },
        { code: "ID-JB", label: "서자바" },
        { code: "ID-JI", label: "동자바" },
    ],
    TH: [
        { code: "TH-10", label: "방콕" },
        { code: "TH-50", label: "치앙마이" },
        { code: "TH-20", label: "촌부리" },
    ],
    VN: [
        { code: "VN-28", label: "꼰뚬성" },
        { code: "VN-72", label: "닥농성" },
        { code: "VN-33", label: "닥락성" },
    ],
    PH: [
        { code: "PH-DAV", label: "북다바오" },
        { code: "PH-ZSI", label: "삼보앙가시부가이" },
        { code: "PH-SLU", label: "술루" },
    ],
    MY: [
        { code: "MY-14", label: "쿠알라룸푸르" },
        { code: "MY-10", label: "슬랑오르" },
    ],
    TW: [
        { code: "TW-TAO", label: "타오위안시" },
        { code: "TW-HSQ", label: "신주현" },
    ],
    HK: [
        { code: "HK-X16~", label: "노스" },
        { code: "HK-X18~", label: "아일랜즈" },
    ],
    NL: [
        { code: "NL-NH", label: "노르트홀란트" },
        { code: "NL-ZH", label: "자위트홀란트" },
    ],
    ES: [
        { code: "ES-M", label: "마드리드" },
        { code: "ES-B", label: "바르셀로나" },
    ],
    IT: [
        { code: "IT-RM", label: "로마" },
        { code: "IT-MI", label: "밀라노" },
    ],
    PL: [
        { code: "PL-MZ", label: "마조프셰" },
        { code: "PL-MA", label: "마워폴스카" },
    ],
    BR: [
        { code: "BR-SP", label: "상파울루" },
        { code: "BR-RJ", label: "리우데자네이루" },
    ],
    MX: [
        { code: "MX-SON", label: "소노라" },
        { code: "MX-BCN", label: "바하칼리포르니아" },
    ],
    SE: [{ code: "SE-BD", label: "노르보텐" }],
    NO: [{ code: "NO-19", label: "트롬스" }],
    DK: [{ code: "DK-83", label: "남덴마크" }],
    FI: [{ code: "FI-10", label: "라피" }],
    CH: [{ code: "CH-VS", label: "발레" }],
    AT: [{ code: "AT-3", label: "니더외스터라이히" }],
    BE: [{ code: "BE-VWV", label: "베스트플란데런" }],
    CZ: [{ code: "CZ-US", label: "우스티" }],
    RO: [{ code: "RO-SM", label: "사투마레" }],
    AE: [{ code: "AE-FU", label: "푸자이라" }],
    SA: [{ code: "SA-04", label: "동부" }],
    ZA: [{ code: "ZA-NC", label: "노던케이프" }],
    NZ: [{ code: "NZ-AUK", label: "오클랜드" }],
};
const labels = new Map(Object.values(regionsByCountry).flatMap((regions) => regions.map((region) => [region.code, region.label])));
export function regionLabel(regionCode) {
    return labels.get(regionCode) ?? regionCode;
}
//# sourceMappingURL=regions.js.map