export interface Tool {
    href: string;
    icon: string;
    key: string;
}

export interface ToolCategory {
    key: string;
    icon: string;
    tools: Tool[];
}

export const toolsConfig: ToolCategory[] = [
    {
        key: "text",
        icon: "📝",
        tools: [
            { href: "/tools/text-case", icon: "Aa", key: "textCase" },
            { href: "/tools/base64", icon: "64", key: "base64" },
            { href: "/tools/url-encoder", icon: "🔗", key: "urlEncoder" },
            { href: "/tools/lorem-ipsum", icon: "📄", key: "loremIpsum" },
            { href: "/tools/diff-checker", icon: "↔️", key: "diffChecker" },
        ],
    },
    {
        key: "developer",
        icon: "💻",
        tools: [
            { href: "/tools/json-formatter", icon: "{ }", key: "jsonFormatter" },
            { href: "/tools/hash-generator", icon: "#", key: "hashGenerator" },
            { href: "/tools/tailwind-css", icon: "⚡", key: "tailwindCss" },
            { href: "/tools/stun-turn-test", icon: "🧪", key: "stunTurnTest" },
            { href: "/tools/uuid-generator", icon: "🆔", key: "uuidGenerator" },
            { href: "/tools/jwt-decoder", icon: "🔓", key: "jwtDecoder" },
            { href: "/tools/timestamp-converter", icon: "⏰", key: "timestampConverter" },
            { href: "/tools/regex-tester", icon: "🔍", key: "regexTester" },
            { href: "/tools/css-unit-converter", icon: "📐", key: "cssUnitConverter" },
            { href: "/tools/html-entity-encoder", icon: "🏷️", key: "htmlEntityEncoder" },
            { href: "/tools/number-converter", icon: "🔢", key: "numberConverter" },
        ],
    },
    {
        key: "design",
        icon: "🎨",
        tools: [{ href: "/tools/color-picker", icon: "🎨", key: "colorPicker" }],
    },
    {
        key: "security",
        icon: "🔒",
        tools: [{ href: "/tools/password-generator", icon: "🔑", key: "passwordGenerator" }],
    },
    {
        key: "utility",
        icon: "🛠️",
        tools: [
            { href: "/tools/qr-code-generator", icon: "📱", key: "qrCodeGenerator" },
            { href: "/tools/url-shortener", icon: "🔗", key: "urlShortener" },
            { href: "/tools/gpa-calculator", icon: "🎓", key: "gpaCalculator" },
            { href: "/tools/repo-tree", icon: "🌳", key: "repoTree" },
            { href: "/tools/world-clock", icon: "🌍", key: "worldClock" },
            { href: "/tools/countdown", icon: "⏱️", key: "countdown" },
            { href: "/tools/stopwatch", icon: "⏲️", key: "stopwatch" },
        ],
    },
];

// Flatten all tools for easy access
export const allTools: Tool[] = toolsConfig.flatMap((category) => category.tools);
