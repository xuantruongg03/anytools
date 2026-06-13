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
        key: "developer",
        icon: "💻",
        tools: [
            { href: "/tools/api-tester", icon: "🚀", key: "apiTester" },
            { href: "/tools/base64", icon: "64", key: "base64" },
            { href: "/tools/code-formatter", icon: "✨", key: "codeFormatter" },
            { href: "/tools/code-minifier", icon: "🗜️", key: "codeMinifier" },
            { href: "/tools/csv-converter", icon: "📊", key: "csvConverter" },
            { href: "/tools/fake-data-generator", icon: "🎲", key: "fakeDataGenerator" },
            { href: "/tools/hash-generator", icon: "#", key: "hashGenerator" },
            { href: "/tools/html-entity-encoder", icon: "🏷️", key: "htmlEntityEncoder" },
            { href: "/tools/json-formatter", icon: "{ }", key: "jsonFormatter" },
            { href: "/tools/jwt-decoder", icon: "🔓", key: "jwtDecoder" },
            { href: "/tools/mock-api-generator", icon: "📡", key: "mockApiGenerator" },
            { href: "/tools/number-converter", icon: "🔢", key: "numberConverter" },
            { href: "/tools/regex-tester", icon: "🔍", key: "regexTester" },
            { href: "/tools/repo-tree", icon: "🌳", key: "repoTree" },
            { href: "/tools/stun-turn-test", icon: "🧪", key: "stunTurnTest" },
            { href: "/tools/timestamp-converter", icon: "⏰", key: "timestampConverter" },
            { href: "/tools/url-encoder", icon: "🔗", key: "urlEncoder" },
            { href: "/tools/uuid-generator", icon: "🆔", key: "uuidGenerator" },
        ],
    },
    {
        key: "design",
        icon: "🎨",
        tools: [
            { href: "/tools/color-picker", icon: "🎨", key: "colorPicker" },
            { href: "/tools/image-compressor", icon: "🗜️", key: "imageCompressor" },
            { href: "/tools/placeholder-image", icon: "🖼️", key: "placeholderImage" },
            { href: "/tools/png-to-svg", icon: "🔄", key: "pngToSvg" },
            { href: "/tools/promo-image-generator", icon: "🖼️", key: "promoImageGenerator" },
            { href: "/tools/svg-preview", icon: "🖼️", key: "svgPreview" },
            { href: "/tools/tailwind-css", icon: "⚡", key: "tailwindCss" },
        ],
    },
    {
        key: "text",
        icon: "📝",
        tools: [
            { href: "/tools/diff-checker", icon: "↔️", key: "diffChecker" },
            { href: "/tools/markdown-editor", icon: "📄", key: "markdownEditor" },
            { href: "/tools/text-case", icon: "Aa", key: "textCase" },
        ],
    },
    {
        key: "security",
        icon: "🔒",
        tools: [
            { href: "/tools/dns-lookup", icon: "🌐", key: "dnsLookup" },
            { href: "/tools/ip-lookup", icon: "🔍", key: "ipLookup" },
            { href: "/tools/password-generator", icon: "🔑", key: "passwordGenerator" },
            { href: "/tools/text-encryption", icon: "🔐", key: "textEncryption" },
        ],
    },
    {
        key: "downloader",
        icon: "📥",
        tools: [
            { href: "/tools/slideshare-downloader", icon: "📊", key: "slideshareDownloader" },
            { href: "/tools/studocu-downloader", icon: "📚", key: "studocuDownloader" },
        ],
    },
    {
        key: "education",
        icon: "🎓",
        tools: [
            { href: "/tools/gpa-calculator", icon: "🧩", key: "gpaCalculator" },
            { href: "/tools/latex-editor", icon: "∑", key: "latexEditor" },
        ],
    },
    {
        key: "productivity",
        icon: "⚡",
        tools: [
            { href: "/tools/countdown", icon: "⏱️", key: "countdown" },
            { href: "/tools/event-reminder", icon: "📅", key: "eventReminder" },
            { href: "/tools/pdf-converter", icon: "📄", key: "pdfConverter" },
            { href: "/tools/qr-code-generator", icon: "📱", key: "qrCodeGenerator" },
            { href: "/tools/stopwatch", icon: "⏲️", key: "stopwatch" },
            { href: "/tools/url-shortener", icon: "🔗", key: "urlShortener" },
            { href: "/tools/world-clock", icon: "🌍", key: "worldClock" },
            { href: "/tools/auto-bing-search", icon: "🔍", key: "autoBingSearch" },
        ],
    },
    {
        key: "multimedia",
        icon: "🎬",
        tools: [
            { href: "/tools/image-to-text", icon: "📝", key: "imageToText" },
            { href: "/tools/microphone-test", icon: "🎤", key: "microphoneTest" },
            { href: "/tools/speech-to-text", icon: "🎙️", key: "speechToText" },
            { href: "/tools/remove-background", icon: "✂️", key: "removeBackground" },
        ],
    },
    {
        key: "fun",
        icon: "🎮",
        tools: [
            { href: "/tools/random-race", icon: "🏁", key: "randomRace" },
            { href: "/tools/random-wheel", icon: "🎡", key: "randomWheel" },
        ],
    },
    {
        key: "weather",
        icon: "🌤️",
        tools: [{ href: "/tools/weather", icon: "🌦️", key: "weather" }],
    },
];

// Flatten all tools for easy access
export const allTools: Tool[] = toolsConfig.flatMap((category) => category.tools);
