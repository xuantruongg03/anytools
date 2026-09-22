export interface Tool {
    href: string;
    icon: string;
    key: string;
    updatedAt?: string; // Format: YYYY-MM-DD
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
            { href: "/tools/api-tester", icon: "🚀", key: "apiTester", updatedAt: "2026-08-01" },
            { href: "/tools/base64", icon: "64", key: "base64", updatedAt: "2026-07-25" },
            { href: "/tools/chmod-calculator", icon: "🛡️", key: "chmodCalculator", updatedAt: "2026-08-25" },
            { href: "/tools/code-formatter", icon: "✨", key: "codeFormatter", updatedAt: "2026-06-18" },
            { href: "/tools/code-minifier", icon: "🗜️", key: "codeMinifier", updatedAt: "2026-06-15" },
            { href: "/tools/cron-generator", icon: "⏰", key: "cronGenerator", updatedAt: "2026-09-06" },
            { href: "/tools/csv-converter", icon: "📊", key: "csvConverter", updatedAt: "2026-06-22" },
            { href: "/tools/curl-converter", icon: "🔄", key: "curlConverter", updatedAt: "2026-06-20" },
            { href: "/tools/fake-data-generator", icon: "🎲", key: "fakeDataGenerator", updatedAt: "2026-07-01" },
            { href: "/tools/favicon-generator", icon: "🖼️", key: "faviconGenerator", updatedAt: "2026-09-22" },
            { href: "/tools/hash-generator", icon: "#", key: "hashGenerator", updatedAt: "2026-06-28" },
            { href: "/tools/html-entity-encoder", icon: "🏷️", key: "htmlEntityEncoder", updatedAt: "2026-06-25" },
            { href: "/tools/html-to-jsx", icon: "⚛️", key: "htmlToJsx", updatedAt: "2026-09-22" },
            { href: "/tools/json-diff", icon: "🔍", key: "jsonDiff", updatedAt: "2026-09-21" },
            { href: "/tools/json-formatter", icon: "{ }", key: "jsonFormatter", updatedAt: "2026-07-28" },
            { href: "/tools/json-to-types", icon: "🏷️", key: "jsonToTypes", updatedAt: "2026-09-04" },
            { href: "/tools/jwt-decoder", icon: "🔓", key: "jwtDecoder", updatedAt: "2026-07-22" },
            { href: "/tools/meta-tags-preview", icon: "🏷️", key: "metaTagsPreview", updatedAt: "2026-09-21" },
            { href: "/tools/mock-api-generator", icon: "📡", key: "mockApiGenerator", updatedAt: "2026-09-12" },
            { href: "/tools/number-converter", icon: "🔢", key: "numberConverter", updatedAt: "2026-07-02" },
            { href: "/tools/regex-tester", icon: "🔍", key: "regexTester", updatedAt: "2026-07-18" },
            { href: "/tools/repo-tree", icon: "🌳", key: "repoTree", updatedAt: "2026-07-15" },
            { href: "/tools/sql-formatter", icon: "🗄️", key: "sqlFormatter", updatedAt: "2026-07-12" },
            { href: "/tools/sql-to-types", icon: "🏷️", key: "sqlToTypes", updatedAt: "2026-09-22" },
            { href: "/tools/stun-turn-test", icon: "🧪", key: "stunTurnTest", updatedAt: "2026-07-10" },
            { href: "/tools/timestamp-converter", icon: "⏰", key: "timestampConverter", updatedAt: "2026-07-20" },
            { href: "/tools/url-encoder", icon: "🔗", key: "urlEncoder", updatedAt: "2026-07-08" },
            { href: "/tools/uuid-generator", icon: "🆔", key: "uuidGenerator", updatedAt: "2026-07-05" },
        ],
    },
    {
        key: "design",
        icon: "🎨",
        tools: [
            { href: "/tools/box-shadow-generator", icon: "✨", key: "boxShadowGenerator", updatedAt: "2026-09-02" },
            { href: "/tools/color-converter", icon: "🎨", key: "colorConverter", updatedAt: "2026-09-22" },
            { href: "/tools/color-picker", icon: "🎨", key: "colorPicker", updatedAt: "2026-06-12" },
            { href: "/tools/css-unit-converter", icon: "📐", key: "cssUnitConverter", updatedAt: "2026-09-01" },
            { href: "/tools/gradient-generator", icon: "🎨", key: "gradientGenerator", updatedAt: "2026-09-21" },
            { href: "/tools/image-compressor", icon: "🗜️", key: "imageCompressor", updatedAt: "2026-06-10" },
            { href: "/tools/placeholder-image", icon: "🖼️", key: "placeholderImage", updatedAt: "2026-09-10" },
            { href: "/tools/png-to-svg", icon: "🔄", key: "pngToSvg", updatedAt: "2026-06-08" },
            { href: "/tools/promo-image-generator", icon: "🖼️", key: "promoImageGenerator", updatedAt: "2026-06-05" },
            { href: "/tools/svg-optimizer", icon: "⚡", key: "svgOptimizer", updatedAt: "2026-09-22" },
            { href: "/tools/svg-preview", icon: "🖼️", key: "svgPreview", updatedAt: "2026-06-02" },
            { href: "/tools/tailwind-css", icon: "⚡", key: "tailwindCss", updatedAt: "2026-06-01" },
        ],
    },
    {
        key: "text",
        icon: "📝",
        tools: [
            { href: "/tools/diff-checker", icon: "↔️", key: "diffChecker", updatedAt: "2026-05-28" },
            { href: "/tools/markdown-editor", icon: "📄", key: "markdownEditor", updatedAt: "2026-09-13" },
            { href: "/tools/markdown-to-pdf", icon: "📑", key: "markdownToPdf", updatedAt: "2026-09-22" },
            { href: "/tools/number-to-words", icon: "🔢", key: "numberToWords", updatedAt: "2026-09-22" },
            { href: "/tools/text-case", icon: "Aa", key: "textCase", updatedAt: "2026-05-25" },
            { href: "/tools/word-counter", icon: "📊", key: "wordCounter", updatedAt: "2026-08-28" },
        ],
    },
    {
        key: "security",
        icon: "🔒",
        tools: [
            { href: "/tools/dns-lookup", icon: "🌐", key: "dnsLookup", updatedAt: "2026-05-18" },
            { href: "/tools/ip-lookup", icon: "🔍", key: "ipLookup", updatedAt: "2026-09-08" },
            { href: "/tools/password-generator", icon: "🔑", key: "passwordGenerator", updatedAt: "2026-05-20" },
            { href: "/tools/text-encryption", icon: "🔐", key: "textEncryption", updatedAt: "2026-05-22" },
        ],
    },
    {
        key: "downloader",
        icon: "📥",
        tools: [
            { href: "/tools/issuu-downloader", icon: "📖", key: "issuuDownloader", updatedAt: "2026-09-22" },
            { href: "/tools/scribd-downloader", icon: "📑", key: "scribdDownloader", updatedAt: "2026-09-20" },
            { href: "/tools/slideshare-downloader", icon: "📊", key: "slideshareDownloader", updatedAt: "2026-09-19" },
            { href: "/tools/studocu-downloader", icon: "📚", key: "studocuDownloader", updatedAt: "2026-09-19" },
        ],
    },
    {
        key: "education",
        icon: "🎓",
        tools: [
            { href: "/tools/exam-shuffler", icon: "📝", key: "examShuffler", updatedAt: "2026-09-18" },
            { href: "/tools/gpa-calculator", icon: "🧩", key: "gpaCalculator", updatedAt: "2026-05-15" },
            { href: "/tools/latex-editor", icon: "∑", key: "latexEditor", updatedAt: "2026-09-14" },
            { href: "/tools/quizlet-exporter", icon: "🎴", key: "quizletExporter", updatedAt: "2026-09-22" },
            { href: "/tools/team-generator", icon: "👥", key: "teamGenerator", updatedAt: "2026-09-17" },
            { href: "/tools/typing-test", icon: "⌨️", key: "typingTest", updatedAt: "2026-09-21" },
        ],
    },
    {
        key: "productivity",
        icon: "⚡",
        tools: [
            { href: "/tools/auto-bing-search", icon: "🔍", key: "autoBingSearch", updatedAt: "2026-09-21" },
            { href: "/tools/countdown", icon: "⏱️", key: "countdown", updatedAt: "2026-08-20" },
            { href: "/tools/event-reminder", icon: "📅", key: "eventReminder", updatedAt: "2026-08-10" },
            { href: "/tools/loan-calculator", icon: "💰", key: "loanCalculator", updatedAt: "2026-09-21" },
            { href: "/tools/pdf-converter", icon: "📄", key: "pdfConverter", updatedAt: "2026-08-02" },
            { href: "/tools/pdf-split-merge", icon: "📑", key: "pdfSplitMerge", updatedAt: "2026-09-21" },
            { href: "/tools/pomodoro-timer", icon: "🍅", key: "pomodoroTimer", updatedAt: "2026-09-22" },
            { href: "/tools/qr-code-generator", icon: "📱", key: "qrCodeGenerator", updatedAt: "2026-08-08" },
            { href: "/tools/qr-scanner", icon: "📷", key: "qrScanner", updatedAt: "2026-09-22" },
            { href: "/tools/speed-test", icon: "⚡", key: "speedTest", updatedAt: "2026-09-21" },
            { href: "/tools/stopwatch", icon: "⏲️", key: "stopwatch", updatedAt: "2026-08-12" },
            { href: "/tools/url-shortener", icon: "🔗", key: "urlShortener", updatedAt: "2026-08-05" },
            { href: "/tools/world-clock", icon: "🌍", key: "worldClock", updatedAt: "2026-08-15" },
        ],
    },
    {
        key: "multimedia",
        icon: "🎬",
        tools: [
            { href: "/tools/audio-converter", icon: "🎧", key: "audioConverter", updatedAt: "2026-09-22" },
            { href: "/tools/audio-trimmer", icon: "🎵", key: "audioTrimmer", updatedAt: "2026-09-21" },
            { href: "/tools/exif-viewer", icon: "🔍", key: "exifViewer", updatedAt: "2026-09-22" },
            { href: "/tools/image-to-text", icon: "📝", key: "imageToText", updatedAt: "2026-05-12" },
            { href: "/tools/keyboard-tester", icon: "⌨️", key: "keyboardTester", updatedAt: "2026-09-21" },
            { href: "/tools/microphone-test", icon: "🎤", key: "microphoneTest", updatedAt: "2026-05-10" },
            { href: "/tools/mouse-tester", icon: "🖱️", key: "mouseTester", updatedAt: "2026-09-22" },
            { href: "/tools/remove-background", icon: "✂️", key: "removeBackground", updatedAt: "2026-09-15" },
            { href: "/tools/screen-recorder", icon: "📹", key: "screenRecorder", updatedAt: "2026-09-21" },
            { href: "/tools/speech-to-text", icon: "🎙️", key: "speechToText", updatedAt: "2026-09-16" },
            { href: "/tools/text-to-speech", icon: "🗣️", key: "textToSpeech", updatedAt: "2026-09-21" },
            { href: "/tools/video-to-gif", icon: "🎞️", key: "videoToGif", updatedAt: "2026-09-22" },
            { href: "/tools/webcam-test", icon: "📷", key: "webcamTest", updatedAt: "2026-09-22" },
        ],
    },
    {
        key: "fun",
        icon: "🎮",
        tools: [
            { href: "/tools/random-race", icon: "🏁", key: "randomRace", updatedAt: "2026-05-08" },
            { href: "/tools/random-wheel", icon: "🎡", key: "randomWheel", updatedAt: "2026-08-22" },
        ],
    },
    {
        key: "weather",
        icon: "🌤️",
        tools: [{ href: "/tools/weather", icon: "🌦️", key: "weather", updatedAt: "2026-08-18" }],
    },
];

// Flatten all tools for easy access
export const allTools: Tool[] = toolsConfig.flatMap((category) => category.tools);
