"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { textFancyFontTranslations } from "@/lib/i18n/tools/text-fancy-font";

const CopyIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
);
const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const SearchIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const ChevronUpIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);
const SparklesIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const BookOpenIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const HelpCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- Unicode Character Mappings ---
const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const fontMaps: Record<string, string> = {
    boldSans: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
    italicSans: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789",
    boldItalicSans: "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯0123456789",
    boldSerif: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    italicSerif: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789",
    script: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789",
    frakturGothic: "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789",
    monospace: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
    doubleStruck: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
    circledWhite: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨",
    squaredWhite: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
    fullwidth: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９",
};

// Small caps map
const smallCapsMap: Record<string, string> = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
    j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
    s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

// Upside down flip map
const flipMap: Record<string, string> = {
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
    j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
    s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I",
    J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ò", R: "ᴚ",
    S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
    "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
    "?": "¿", "!": "¡", ".": "˙", ",": "'", "(": ")", ")": "(", "[": "]", "]": "["
};

// Transform with direct mapping array
function transformWithMap(text: string, mapString: string): string {
    const chars = Array.from(mapString);
    let result = "";
    for (const char of text) {
        const idx = normalChars.indexOf(char);
        if (idx !== -1 && chars[idx]) {
            result += chars[idx];
        } else {
            result += char;
        }
    }
    return result;
}

// Combining diacritical marks
function applyDiacritic(text: string, code: string): string {
    return Array.from(text).map(c => c === " " ? c : c + code).join("");
}

// Zalgo marks
const zalgoUp = [
    "\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306", "\u0310",
    "\u0352", "\u0357", "\u0351", "\u0307", "\u0308", "\u030a", "\u0342", "\u0343",
    "\u0344", "\u034a", "\u034b", "\u034c", "\u0303", "\u0302", "\u030c", "\u0350"
];
const zalgoMid = [
    "\u0315", "\u031b", "\u0340", "\u0341", "\u0358", "\u0321", "\u0322", "\u0327",
    "\u0328", "\u0334", "\u0335", "\u0336", "\u034f", "\u035c", "\u035d", "\u035e"
];
const zalgoDown = [
    "\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u031d", "\u031e", "\u031f",
    "\u0320", "\u0324", "\u0325", "\u0326", "\u0329", "\u032a", "\u032b", "\u032c",
    "\u032d", "\u032e", "\u032f", "\u0330", "\u0331", "\u0332", "\u0333", "\u033a"
];

function generateZalgo(text: string, intensity: number, up = true, mid = true, down = true): string {
    let result = "";
    for (const char of text) {
        if (char === " " || char === "\n") {
            result += char;
            continue;
        }
        result += char;
        const count = Math.max(1, Math.floor(intensity * 1.5));
        if (up) {
            for (let i = 0; i < count; i++) {
                result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
            }
        }
        if (mid) {
            for (let i = 0; i < Math.floor(count / 2); i++) {
                result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
            }
        }
        if (down) {
            for (let i = 0; i < count; i++) {
                result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
            }
        }
    }
    return result;
}

// Mini ASCII Font (3x5 banner generator)
const asciiBannerMap: Record<string, string[]> = {
    A: [" █▀█ ", " █▀█ ", " ▀ ▀ "],
    B: [" █▀▄ ", " █▀▄ ", " ▀▀  "],
    C: [" █▀▀ ", " █   ", " ▀▀▀ "],
    D: [" █▀▄ ", " █ █ ", " ▀▀  "],
    E: [" █▀▀ ", " █▀▀ ", " ▀▀▀ "],
    F: [" █▀▀ ", " █▀▀ ", " ▀   "],
    G: [" █▀▀ ", " █ █ ", " ▀▀▀ "],
    H: [" █ █ ", " █▀█ ", " ▀ ▀ "],
    I: ["  █  ", "  █  ", "  ▀  "],
    J: ["   █ ", " █ █ ", " ▀▀  "],
    K: [" █▄▀ ", " █ █ ", " ▀ ▀ "],
    L: [" █   ", " █   ", " ▀▀▀ "],
    M: [" █▀▄▀█ ", " █ █ █ ", " ▀   ▀ "],
    N: [" █▀█ ", " █ █ ", " ▀ ▀ "],
    O: [" █▀█ ", " █▄█ ", " ▀▀▀ "],
    P: [" █▀█ ", " █▀▀ ", " ▀   "],
    Q: [" █▀█ ", " █▄█ ", " ▀▀▀▀"],
    R: [" █▀█ ", " █▀▄ ", " ▀ ▀ "],
    S: [" █▀▀ ", " ▀▀█ ", " ▀▀▀ "],
    T: [" ▀█▀ ", "  █  ", "  ▀  "],
    U: [" █ █ ", " █ █ ", " ▀▀▀ "],
    V: [" █ █ ", " ▀▄▀ ", "  ▀  "],
    W: [" █ █ █ ", " █ █ █ ", "  ▀▀▀  "],
    X: [" ▀▄▀ ", "  █  ", " ▀ ▀ "],
    Y: [" █ █ ", "  █  ", "  ▀  "],
    Z: [" ▀▀█ ", " ▄▀  ", " ▀▀▀ "],
    " ": ["     ", "     ", "     "],
    "0": [" █▀█ ", " █▄█ ", " ▀▀▀ "],
    "1": ["  █  ", "  █  ", "  ▀  "],
    "2": [" ▀▀█ ", " █▀▀ ", " ▀▀▀ "],
    "3": [" ▀▀█ ", "  ▀█ ", " ▀▀▀ "],
    "4": [" █ █ ", " ▀▀█ ", "   ▀ "],
    "5": [" █▀▀ ", " ▀▀█ ", " ▀▀▀ "],
    "6": [" █▀▀ ", " █▀█ ", " ▀▀▀ "],
    "7": [" ▀▀█ ", "   █ ", "   ▀ "],
    "8": [" █▀█ ", " █▀█ ", " ▀▀▀ "],
    "9": [" █▀█ ", " ▀▀█ ", " ▀▀▀ "],
};

function generateAsciiBanner(text: string): string {
    const clean = text.toUpperCase().slice(0, 16);
    const lines = ["", "", ""];
    for (const char of clean) {
        const glyph = asciiBannerMap[char] || ["   ", " " + char + " ", "   "];
        lines[0] += glyph[0];
        lines[1] += glyph[1];
        lines[2] += glyph[2];
    }
    return lines.join("\n");
}

function textToMorse(text: string): string {
    const morse: Record<string, string> = {
        A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
        I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
        Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
        Y: "-.--", Z: "--..", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
        "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
        " ": "/"
    };
    return text.toUpperCase().split("").map(c => morse[c] || c).join(" ");
}

export default function TextFancyFontContent() {
    const { locale } = useLanguage();
    const t = textFancyFontTranslations[locale as "en" | "vi"] || textFancyFontTranslations.en;

    const [input, setInput] = useState("AnyTools Online");
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<"all" | "unicode" | "decorative" | "ascii" | "zalgo">("all");
    const [zalgoIntensity, setZalgoIntensity] = useState(4);
    const [zalgoSettings, setZalgoSettings] = useState({ up: true, mid: true, down: true });
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Copy to clipboard
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Calculate dynamic styles
    const styles = useMemo(() => {
        const currentText = input || "AnyTools";

        const list = [
            // UNICODE FONTS
            {
                id: "bold-sans",
                name: "Bold (Sans-Serif)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.boldSans),
            },
            {
                id: "italic-sans",
                name: "Italic (Sans-Serif)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.italicSans),
            },
            {
                id: "bold-italic-sans",
                name: "Bold Italic",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.boldItalicSans),
            },
            {
                id: "bold-serif",
                name: "Bold (Serif / Formal)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.boldSerif),
            },
            {
                id: "italic-serif",
                name: "Italic (Serif)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.italicSerif),
            },
            {
                id: "script",
                name: "Cursive / Script (𝓒𝓾𝓻𝓼𝓲𝓿𝓮)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.script),
            },
            {
                id: "fraktur",
                name: "Gothic / Fraktur (𝕲𝖔𝖙𝖍𝖎𝖈)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.frakturGothic),
            },
            {
                id: "monospace",
                name: "Monospace / Code (𝚃𝚎𝚡𝚝)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.monospace),
            },
            {
                id: "double-struck",
                name: "Double-Struck / Blackboard",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.doubleStruck),
            },
            {
                id: "small-caps",
                name: "Small Caps (ꜱᴍᴀʟʟ)",
                category: "unicode",
                value: Array.from(currentText).map(c => smallCapsMap[c.toLowerCase()] || c).join(""),
            },
            {
                id: "fullwidth",
                name: "Vaporwave / Fullwidth (Ａｅｓｔｈｅｔｉｃ)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.fullwidth),
            },
            {
                id: "bubble-white",
                name: "Circled / Bubbles (ⒶⒷⒸ)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.circledWhite),
            },
            {
                id: "squared-white",
                name: "Boxed / Squares (🄰🄱🄲)",
                category: "unicode",
                value: transformWithMap(currentText, fontMaps.squaredWhite),
            },
            {
                id: "flip-upside-down",
                name: "Upside Down / Inverted",
                category: "unicode",
                value: Array.from(currentText).reverse().map(c => flipMap[c] || c).join(""),
            },

            // DECORATIVE & SYMBOLS
            {
                id: "strikethrough",
                name: "Strikethrough (S̶t̶r̶i̶k̶e̶)",
                category: "decorative",
                value: applyDiacritic(currentText, "\u0336"),
            },
            {
                id: "underline",
                name: "Underline (U̲n̲d̲e̲r̲l̲i̲n̲e̲)",
                category: "decorative",
                value: applyDiacritic(currentText, "\u0332"),
            },
            {
                id: "double-underline",
                name: "Double Underline (U̳n̳d̳e̳r̳)",
                category: "decorative",
                value: applyDiacritic(currentText, "\u0333"),
            },
            {
                id: "slash",
                name: "Slash Through (S̷l̷a̷s̷h̷)",
                category: "decorative",
                value: applyDiacritic(currentText, "\u0337"),
            },
            {
                id: "sparkles",
                name: "Sparkles Aesthetic (✨)",
                category: "decorative",
                value: `✨ ${currentText.split("").join(" ")} ✨`,
            },
            {
                id: "hearts",
                name: "Heart Lovers (♡)",
                category: "decorative",
                value: `♥ ${currentText} ♥`,
            },
            {
                id: "wings",
                name: "Angel Wings (꧁ ꧂)",
                category: "decorative",
                value: `꧁༺ ${currentText} ༻꧂`,
            },
            {
                id: "swords",
                name: "Gamer Swords (⚔️)",
                category: "decorative",
                value: `⚔️ ${currentText} ⚔️`,
            },
            {
                id: "stars",
                name: "Galaxy Stars (★)",
                category: "decorative",
                value: `★彡 ${currentText} 彡★`,
            },
            {
                id: "japanese-brackets",
                name: "Japanese Brackets (【 】)",
                category: "decorative",
                value: `【 ${currentText} 】`,
            },
            {
                id: "music-notes",
                name: "Musical Notes (🎵)",
                category: "decorative",
                value: `🎵 ${currentText} 🎶`,
            },

            // ASCII ART
            {
                id: "ascii-block",
                name: "ASCII Block Banner",
                category: "ascii",
                value: generateAsciiBanner(currentText),
                isPreformatted: true,
            },
            {
                id: "ascii-morse",
                name: "Morse Code",
                category: "ascii",
                value: textToMorse(currentText),
            },
            {
                id: "ascii-binary",
                name: "Binary 8-Bit",
                category: "ascii",
                value: Array.from(currentText).map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "),
            },
            {
                id: "ascii-hex",
                name: "Hexadecimal (0x)",
                category: "ascii",
                value: Array.from(currentText).map(c => c.charCodeAt(0).toString(16).toUpperCase()).join(" "),
            },

            // ZALGO GLITCH
            {
                id: "zalgo-glitch",
                name: "Zalgo Glitch / Cursed Text",
                category: "zalgo",
                value: generateZalgo(currentText, zalgoIntensity, zalgoSettings.up, zalgoSettings.mid, zalgoSettings.down),
            },
        ];

        return list;
    }, [input, zalgoIntensity, zalgoSettings]);

    // Filter styles by search and category
    const filteredStyles = useMemo(() => {
        return styles.filter(s => {
            const matchesCategory = activeCategory === "all" || s.category === activeCategory;
            const matchesSearch = !search ||
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.value.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [styles, activeCategory, search]);

    return (
        <div className='space-y-8'>
            {/* Input & Quick presets */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7'>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-3'>
                    <label className='text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                        <SparklesIcon className='h-4 w-4 text-indigo-500' />
                        {t.previewText}
                    </label>
                    <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
                        <span>{input.length} {t.charCount}</span>
                        <span>•</span>
                        <span>{input.trim() ? input.trim().split(/\s+/).length : 0} {t.wordCount}</span>
                    </div>
                </div>

                <div className='relative'>
                    <textarea
                        rows={3}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-base font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-indigo-400'
                    />
                </div>

                {/* Quick Presets */}
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1'>
                        ⚡ Quick:
                    </span>
                    {[
                        "AnyTools Aesthetic ✨",
                        "꧁༺ VIP GAMER ༻꧂",
                        "Love & Peace ♡",
                        "Cyberpunk 2077",
                        "Gothic Queen 𝕲"
                    ].map(preset => (
                        <button
                            key={preset}
                            onClick={() => setInput(preset)}
                            className='rounded-xl border border-slate-200/90 bg-slate-100/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls: Search, Tabs & Zalgo sliders */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {/* Search */}
                <div className='relative flex-1 max-w-md'>
                    <SearchIcon className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className='w-full rounded-2xl border border-slate-200/90 bg-white/90 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100'
                    />
                </div>

                {/* Category Filter Pills */}
                <div className='flex flex-wrap gap-1.5 p-1 rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/60'>
                    {[
                        { key: "all", label: t.categoryAll, symbol: "#" },
                        { key: "unicode", label: t.categoryUnicode, symbol: "✨" },
                        { key: "decorative", label: t.categoryDecorative, symbol: "🔥" },
                        { key: "ascii", label: t.categoryAscii, symbol: "💻" },
                        { key: "zalgo", label: t.categoryZalgo, symbol: "💀" },
                    ].map(tab => {
                        const active = activeCategory === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveCategory(tab.key as any)}
                                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                    active
                                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                            >
                                <span className='text-xs'>{tab.symbol}</span>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Zalgo glitch controls (visible when Zalgo tab is active or all) */}
            {(activeCategory === "zalgo" || activeCategory === "all") && (
                <div className='rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50/50 to-orange-50/50 p-4 dark:border-rose-900/40 dark:from-rose-950/20 dark:to-orange-950/20'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <span className='text-xl'>💀</span>
                            <div>
                                <h4 className='text-xs font-bold text-slate-800 dark:text-slate-200'>{t.zalgoIntensity}: {zalgoIntensity}</h4>
                                <p className='text-[11px] text-slate-500 dark:text-slate-400'>Adjust glitch distortion level</p>
                            </div>
                        </div>

                        <div className='flex flex-wrap items-center gap-4'>
                            <input
                                type='range'
                                min='1'
                                max='12'
                                value={zalgoIntensity}
                                onChange={(e) => setZalgoIntensity(Number(e.target.value))}
                                className='w-32 sm:w-44 accent-rose-500 cursor-pointer'
                            />

                            <div className='flex items-center gap-3 text-xs'>
                                <label className='flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300'>
                                    <input
                                        type='checkbox'
                                        checked={zalgoSettings.up}
                                        onChange={(e) => setZalgoSettings(s => ({ ...s, up: e.target.checked }))}
                                        className='rounded text-rose-600 focus:ring-rose-500'
                                    />
                                    <span>{t.zalgoUp}</span>
                                </label>
                                <label className='flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300'>
                                    <input
                                        type='checkbox'
                                        checked={zalgoSettings.mid}
                                        onChange={(e) => setZalgoSettings(s => ({ ...s, mid: e.target.checked }))}
                                        className='rounded text-rose-600 focus:ring-rose-500'
                                    />
                                    <span>{t.zalgoMiddle}</span>
                                </label>
                                <label className='flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300'>
                                    <input
                                        type='checkbox'
                                        checked={zalgoSettings.down}
                                        onChange={(e) => setZalgoSettings(s => ({ ...s, down: e.target.checked }))}
                                        className='rounded text-rose-600 focus:ring-rose-500'
                                    />
                                    <span>{t.zalgoDown}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generated Font Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {filteredStyles.map((item) => {
                    const isCopied = copiedIndex === item.id;

                    return (
                        <div
                            key={item.id}
                            className='group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-indigo-500'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                                    {item.name}
                                </span>
                                <button
                                    onClick={() => handleCopy(item.value, item.id)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                        isCopied
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500 dark:hover:text-white"
                                    }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <CheckIcon className='h-3.5 w-3.5' />
                                            <span>{t.copied}</span>
                                        </>
                                    ) : (
                                        <>
                                            <CopyIcon className='h-3.5 w-3.5' />
                                            <span>{t.copy}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Text Output Preview */}
                            <div className='mt-1 overflow-x-auto select-all'>
                                {item.isPreformatted ? (
                                    <pre className='font-mono text-xs text-indigo-600 dark:text-indigo-400 whitespace-pre leading-tight py-2 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800'>
                                        {item.value}
                                    </pre>
                                ) : (
                                    <div className='text-lg font-medium text-slate-900 dark:text-slate-100 break-words py-1.5 leading-relaxed'>
                                        {item.value}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Guide & Tips */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <BookOpenIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.guideTitle}
                    </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide1Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide2Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide3Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQs Accordion */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <HelpCircleIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.faqTitle}
                    </h3>
                </div>

                <div className='space-y-3'>
                    {[
                        { q: t.faq1Q, a: t.faq1A },
                        { q: t.faq2Q, a: t.faq2A },
                        { q: t.faq3Q, a: t.faq3A },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className='overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/60 transition-all dark:border-slate-800/70 dark:bg-slate-800/30'
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className='flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white'
                            >
                                <span>{item.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUpIcon className='h-4 w-4 shrink-0 text-indigo-500' />
                                ) : (
                                    <ChevronDownIcon className='h-4 w-4 shrink-0 text-slate-400' />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className='px-4 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
