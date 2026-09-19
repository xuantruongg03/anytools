"use client";

import { useState, useMemo, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { regexTesterTranslations } from "@/lib/i18n/tools/regex-tester";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface CommonPattern {
    name: string;
    pattern: string;
    example: string;
    description: string;
    category: string;
}

interface MatchDetail {
    matchIndex: number;
    text: string;
    start: number;
    end: number;
    groups: { index: number; text: string }[];
}

interface CheatsheetItem {
    token: string;
    descEn: string;
    descVi: string;
    example: string;
}

export type SupportedLang =
    | "python"
    | "java"
    | "csharp"
    | "javascript"
    | "rust"
    | "go"
    | "kotlin"
    | "php"
    | "ruby"
    | "swift"
    | "dart";

export interface LanguageSpec {
    id: SupportedLang;
    name: string;
    icon: string;
    badge: string;
    tipVi: string;
    tipEn: string;
    getPatternLiteral: (p: string, f: string) => string;
    getDeclaration: (p: string, f: string) => string;
    getCodeSnippet: (p: string, f: string, text: string) => string;
}

export const SUPPORTED_LANGUAGES: LanguageSpec[] = [
    {
        id: "python",
        name: "Python",
        icon: "🐍",
        badge: "re module",
        tipVi: "Python dùng raw string r'...' nên giữ nguyên toàn bộ ký tự \\ (\\d, \\w) mà không cần escape.",
        tipEn: "Uses Python raw string r'...' preserving backslashes (\\d, \\w) without double escaping.",
        getPatternLiteral: (p) => {
            const pyNamed = p.replace(/\(\?<([a-zA-Z0-9_]+)>/g, "(?P<$1>");
            return `r"${pyNamed.replace(/"/g, '\\"')}"`;
        },
        getDeclaration: (p, f) => {
            const pyNamed = p.replace(/\(\?<([a-zA-Z0-9_]+)>/g, "(?P<$1>");
            const flagsList: string[] = [];
            if (f.includes("i")) flagsList.push("re.IGNORECASE");
            if (f.includes("m")) flagsList.push("re.MULTILINE");
            if (f.includes("s")) flagsList.push("re.DOTALL");
            const fStr = flagsList.length > 0 ? `, ${flagsList.join(" | ")}` : "";
            return `pattern = re.compile(r"${pyNamed.replace(/"/g, '\\"')}"${fStr})`;
        },
        getCodeSnippet: (p, f, text) => {
            const pyNamed = p.replace(/\(\?<([a-zA-Z0-9_]+)>/g, "(?P<$1>");
            const flagsList: string[] = [];
            if (f.includes("i")) flagsList.push("re.IGNORECASE");
            if (f.includes("m")) flagsList.push("re.MULTILINE");
            if (f.includes("s")) flagsList.push("re.DOTALL");
            const fStr = flagsList.length > 0 ? `, ${flagsList.join(" | ")}` : "";
            return `# Python 3 (re module)\nimport re\n\npattern = r"${pyNamed.replace(/"/g, '\\"')}"\ntext = """${text}"""\n\n# Tìm tất cả kết quả khớp (finditer)\nmatches = re.finditer(pattern, text${fStr})\nfor m in matches:\n    print(f"Match: {m.group()} (Span: {m.span()}), Groups: {m.groups()}")`;
        },
    },
    {
        id: "java",
        name: "Java",
        icon: "☕",
        badge: "java.util.regex",
        tipVi: "Trong chuỗi String Literal của Java, mọi dấu gạch chéo ngược bắt buộc phải nhân đôi (ví dụ: \\\\d, \\\\w, \\\\s).",
        tipEn: "In Java string literals, every backslash must be doubled (e.g. \\\\d, \\\\w instead of \\d).",
        getPatternLiteral: (p) => {
            const escaped = p.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            return `"${escaped}"`;
        },
        getDeclaration: (p, f) => {
            const escaped = p.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            const flagsList: string[] = [];
            if (f.includes("i")) flagsList.push("Pattern.CASE_INSENSITIVE");
            if (f.includes("m")) flagsList.push("Pattern.MULTILINE");
            if (f.includes("s")) flagsList.push("Pattern.DOTALL");
            const fStr = flagsList.length > 0 ? `, ${flagsList.join(" | ")}` : "";
            return `Pattern pattern = Pattern.compile("${escaped}"${fStr});`;
        },
        getCodeSnippet: (p, f, text) => {
            const escaped = p.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            const flagsList: string[] = [];
            if (f.includes("i")) flagsList.push("Pattern.CASE_INSENSITIVE");
            if (f.includes("m")) flagsList.push("Pattern.MULTILINE");
            if (f.includes("s")) flagsList.push("Pattern.DOTALL");
            const fStr = flagsList.length > 0 ? `, ${flagsList.join(" | ")}` : "";
            return `// Java (java.util.regex)\nimport java.util.regex.Pattern;\nimport java.util.regex.Matcher;\n\npublic class RegexDemo {\n    public static void main(String[] args) {\n        String text = ${JSON.stringify(text)};\n        Pattern pattern = Pattern.compile("${escaped}"${fStr});\n        Matcher matcher = pattern.matcher(text);\n\n        while (matcher.find()) {\n            System.out.println("Match: " + matcher.group() + " at [" + matcher.start() + ", " + matcher.end() + "]");\n        }\n    }\n}`;
        },
    },
    {
        id: "csharp",
        name: "C# (.NET)",
        icon: "🟣",
        badge: "System.Text.RegularExpressions",
        tipVi: "C# dùng Verbatim String @\"...\" nên giữ nguyên dấu \\, chỉ cần nhân đôi dấu ngoặc kép \"\".",
        tipEn: "C# uses verbatim string @\"...\" preserving backslashes naturally, only quotes are doubled.",
        getPatternLiteral: (p) => {
            return `@"` + p.replace(/"/g, '""') + `"`;
        },
        getDeclaration: (p, f) => {
            const csFlags: string[] = [];
            if (f.includes("i")) csFlags.push("RegexOptions.IgnoreCase");
            if (f.includes("m")) csFlags.push("RegexOptions.Multiline");
            if (f.includes("s")) csFlags.push("RegexOptions.Singleline");
            const fStr = csFlags.length > 0 ? `, ${csFlags.join(" | ")}` : "";
            return `Regex regex = new Regex(@"${p.replace(/"/g, '""')}"${fStr});`;
        },
        getCodeSnippet: (p, f, text) => {
            const csFlags: string[] = [];
            if (f.includes("i")) csFlags.push("RegexOptions.IgnoreCase");
            if (f.includes("m")) csFlags.push("RegexOptions.Multiline");
            if (f.includes("s")) csFlags.push("RegexOptions.Singleline");
            const fStr = csFlags.length > 0 ? `, ${csFlags.join(" | ")}` : "";
            return `// C# (.NET 8/9 / .NET Core)\nusing System;\nusing System.Text.RegularExpressions;\n\nclass Program {\n    static void Main() {\n        string text = ${JSON.stringify(text)};\n        Regex regex = new Regex(@"${p.replace(/"/g, '""')}"${fStr});\n\n        MatchCollection matches = regex.Matches(text);\n        foreach (Match match in matches) {\n            Console.WriteLine($"Match: {match.Value} at index {match.Index}");\n        }\n    }\n}`;
        },
    },
    {
        id: "javascript",
        name: "JavaScript / TS",
        icon: "🟨",
        badge: "ECMAScript RegExp",
        tipVi: "Cú pháp RegExp chuẩn /pattern/flags dùng phổ biến trong trình duyệt và Node.js/Bun.",
        tipEn: "Standard ECMAScript RegExp literal syntax for Web Browsers and Node.js.",
        getPatternLiteral: (p, f) => `/${p}/${f}`,
        getDeclaration: (p, f) => `const regex = /${p}/${f};`,
        getCodeSnippet: (p, f, text) =>
            `// JavaScript / TypeScript\nconst regex = /${p}/${f};\nconst text = ${JSON.stringify(text)};\n\n// 1. Kiểm tra khớp boolean\nconst isMatch = regex.test(text);\nconsole.log("Is Match:", isMatch);\n\n// 2. Trích xuất toàn bộ kết quả\nconst matches = [...text.matchAll(regex)];\nfor (const match of matches) {\n    console.log("Match:", match[0], "Index:", match.index);\n    console.log("Groups:", match.slice(1));\n}`,
    },
    {
        id: "rust",
        name: "Rust",
        icon: "🦀",
        badge: "regex crate",
        tipVi: "Rust dùng raw string r#\"...\"# của crate regex, bảo đảm an toàn bộ nhớ và không ReDoS.",
        tipEn: "Rust uses raw string r#\"...\"# with the official regex crate (linear-time matching).",
        getPatternLiteral: (p) => `r#"${p}"#`,
        getDeclaration: (p) => `let re = Regex::new(r#"${p}"#).unwrap();`,
        getCodeSnippet: (p, f, text) => {
            const caseInsensitive = f.includes("i");
            return `// Rust (Cargo dependency: regex = "1")\nuse regex::${caseInsensitive ? "RegexBuilder" : "Regex"};\n\nfn main() {\n    let text = ${JSON.stringify(text)};\n    ${
                caseInsensitive
                    ? `let re = RegexBuilder::new(r#"${p}"#).case_insensitive(true).build().unwrap();`
                    : `let re = Regex::new(r#"${p}"#).unwrap();`
            }\n\n    for cap in re.captures_iter(text) {\n        println!("Match: {} at [{}, {}]", &cap[0], cap.get(0).unwrap().start(), cap.get(0).unwrap().end());\n    }\n}`;
        },
    },
    {
        id: "go",
        name: "Go",
        icon: "🔷",
        badge: "regexp package",
        tipVi: "Go dùng raw string backticks `...` và thư viện regexp RE2 (không hỗ trợ Lookaround).",
        tipEn: "Go uses raw string backticks `...` with the safe RE2 engine (no lookaround).",
        getPatternLiteral: (p) => "`" + p.replace(/`/g, "` + \"`\" + `") + "`",
        getDeclaration: (p) => `var re = regexp.MustCompile(\`${p}\`)`,
        getCodeSnippet: (p, f, text) =>
            `// Go (regexp package)\npackage main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\tre := regexp.MustCompile(\`${p}\`)\n\ttext := \`${text}\`\n\n\tmatches := re.FindAllStringSubmatch(text, -1)\n\tfor i, m := range matches {\n\t\tfmt.Printf("Match #%d: %s, Groups: %v\\n", i+1, m[0], m[1:])\n\t}\n}`,
    },
    {
        id: "kotlin",
        name: "Kotlin",
        icon: "🎯",
        badge: "kotlin.text.Regex",
        tipVi: "Kotlin dùng chuỗi 3 nháy \"\"\"...\"\"\" (multiline raw string) không cần escape bất kỳ dấu \\ nào.",
        tipEn: "Kotlin uses triple-quoted raw string \"\"\"...\"\"\" so no backslashes need escaping.",
        getPatternLiteral: (p) => `"""${p}""".toRegex()`,
        getDeclaration: (p, f) => {
            const kOptions: string[] = [];
            if (f.includes("i")) kOptions.push("RegexOption.IGNORE_CASE");
            if (f.includes("m")) kOptions.push("RegexOption.MULTILINE");
            const optStr = kOptions.length > 0 ? `setOf(${kOptions.join(", ")})` : "";
            return optStr ? `val regex = """${p}""".toRegex(${optStr})` : `val regex = """${p}""".toRegex()`;
        },
        getCodeSnippet: (p, f, text) => {
            const kOptions: string[] = [];
            if (f.includes("i")) kOptions.push("RegexOption.IGNORE_CASE");
            if (f.includes("m")) kOptions.push("RegexOption.MULTILINE");
            const optStr = kOptions.length > 0 ? `setOf(${kOptions.join(", ")})` : "";
            return `// Kotlin\nfun main() {\n    val text = ${JSON.stringify(text)}\n    val regex = ${
                optStr ? `"""${p}""".toRegex(${optStr})` : `"""${p}""".toRegex()`
            }\n\n    regex.findAll(text).forEach { match ->\n        println("Match: \${match.value} at range \${match.range}")\n    }\n}`;
        },
    },
    {
        id: "php",
        name: "PHP",
        icon: "🐘",
        badge: "PCRE preg_*",
        tipVi: "Cú pháp delimiter '/' . $pattern . '/flags' dùng trực tiếp cho preg_match, preg_match_all.",
        tipEn: "PCRE delimiter syntax for preg_match and preg_match_all functions in PHP.",
        getPatternLiteral: (p, f) => `'/' . ${JSON.stringify(p)} . '/${f}'`,
        getDeclaration: (p, f) => `$pattern = '/${p.replace(/'/g, "\\'")}/${f}';`,
        getCodeSnippet: (p, f, text) =>
            `<?php\n// PHP PCRE preg_match_all\n$pattern = '/${p.replace(/'/g, "\\'")}/${f}';\n$text = <<<'TEXT'\n${text}\nTEXT;\n\n$matches = [];\n$count = preg_match_all($pattern, $text, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);\n\necho "Tổng số kết quả: " . $count . "\\n";\nforeach ($matches as $i => $m) {\n    echo "Match #" . ($i + 1) . ": " . $m[0][0] . " tại vị trí " . $m[0][1] . "\\n";\n}`,
    },
    {
        id: "ruby",
        name: "Ruby",
        icon: "💎",
        badge: "Oniguruma Engine",
        tipVi: "Ruby dùng cú pháp literal /pattern/flags hoặc Regexp.new với phương thức text.scan.",
        tipEn: "Ruby uses Oniguruma regex literal /.../ with text.scan and match methods.",
        getPatternLiteral: (p, f) => `/${p}/${f.replace(/[^imx]/g, "")}`,
        getDeclaration: (p, f) => `regex = /${p}/${f.replace(/[^imx]/g, "")}`,
        getCodeSnippet: (p, f, text) =>
            `# Ruby (Oniguruma)\ntext = ${JSON.stringify(text)}\nregex = /${p}/${f.replace(/[^imx]/g, "")}\n\ntext.scan(regex) do |match|\n  puts "Match: #{match}"\nend`,
    },
    {
        id: "swift",
        name: "Swift",
        icon: "🍏",
        badge: "NSRegularExpression",
        tipVi: "Swift dùng extended string delimiter #\"...\"# giúp viết regex sạch sẽ không cần escape.",
        tipEn: "Swift uses extended string delimiter #\"...\"# for clean unescaped regex strings.",
        getPatternLiteral: (p) => `#"${p}"#`,
        getDeclaration: (p) => `let regex = try! NSRegularExpression(pattern: #"${p}"#)`,
        getCodeSnippet: (p, f, text) =>
            `// Swift\nimport Foundation\n\nlet text = ${JSON.stringify(text)}\nlet regex = try! NSRegularExpression(pattern: #"${p}"#${
                f.includes("i") ? ", options: [.caseInsensitive]" : ""
            })\n\nlet matches = regex.matches(in: text, range: NSRange(text.startIndex..., in: text))\nfor match in matches {\n    if let range = Range(match.range, in: text) {\n        print("Match: \\(text[range])")\n    }\n}`,
    },
    {
        id: "dart",
        name: "Dart / Flutter",
        icon: "💙",
        badge: "dart:core RegExp",
        tipVi: "Dart dùng raw string r'...' với lớp RegExp trong Flutter và ứng dụng Dart.",
        tipEn: "Dart uses raw string r'...' with the standard RegExp class in Flutter.",
        getPatternLiteral: (p) => `r'${p.replace(/'/g, "\\'")}'`,
        getDeclaration: (p, f) =>
            `final regex = RegExp(r'${p.replace(/'/g, "\\'")}'${f.includes("i") ? ", caseSensitive: false" : ""}${
                f.includes("m") ? ", multiLine: true" : ""
            });`,
        getCodeSnippet: (p, f, text) =>
            `// Dart / Flutter\nvoid main() {\n  final text = ${JSON.stringify(text)};\n  final regex = RegExp(r'${p.replace(/'/g, "\\'")}'${
                f.includes("i") ? ", caseSensitive: false" : ""
            }${f.includes("m") ? ", multiLine: true" : ""});\n\n  final matches = regex.allMatches(text);\n  for (final match in matches) {\n    print("Match: \${match.group(0)} at [\${match.start}, \${match.end}]");\n  }\n}`,
    },
];

const CHEATSHEET: { categoryEn: string; categoryVi: string; items: CheatsheetItem[] }[] = [
    {
        categoryEn: "Character Classes",
        categoryVi: "Lớp Ký Tự",
        items: [
            { token: ".", descEn: "Any character (except newline)", descVi: "Bất kỳ ký tự nào (trừ xuống dòng)", example: "a.c matches abc" },
            { token: "\\d", descEn: "Any digit [0-9]", descVi: "Bất kỳ chữ số nào [0-9]", example: "\\d+ matches 123" },
            { token: "\\D", descEn: "Not a digit [^0-9]", descVi: "Không phải chữ số [^0-9]", example: "\\D+ matches abc" },
            { token: "\\w", descEn: "Word character [a-zA-Z0-9_]", descVi: "Ký tự từ [a-zA-Z0-9_]", example: "\\w+ matches user_1" },
            { token: "\\W", descEn: "Non-word character", descVi: "Không phải ký tự từ", example: "\\W matches @" },
            { token: "\\s", descEn: "Whitespace (space, tab, newline)", descVi: "Khoảng trắng, tab, xuống dòng", example: "\\s+ matches spaces" },
            { token: "\\S", descEn: "Non-whitespace", descVi: "Không phải khoảng trắng", example: "\\S+ matches text" },
        ],
    },
    {
        categoryEn: "Anchors & Boundaries",
        categoryVi: "Neo & Biên Giới Hạn",
        items: [
            { token: "^", descEn: "Start of string / line", descVi: "Bắt đầu chuỗi hoặc dòng", example: "^Hello" },
            { token: "$", descEn: "End of string / line", descVi: "Kết thúc chuỗi hoặc dòng", example: "World$" },
            { token: "\\b", descEn: "Word boundary", descVi: "Ranh giới từ", example: "\\bcat\\b" },
            { token: "\\B", descEn: "Non-word boundary", descVi: "Không phải ranh giới từ", example: "\\Bcat\\B" },
        ],
    },
    {
        categoryEn: "Quantifiers",
        categoryVi: "Bộ Lượng Hóa",
        items: [
            { token: "*", descEn: "0 or more times", descVi: "0 hoặc nhiều lần", example: "ab*c matches ac, abc, abbc" },
            { token: "+", descEn: "1 or more times", descVi: "1 hoặc nhiều lần", example: "ab+c matches abc, abbc" },
            { token: "?", descEn: "0 or 1 time (optional)", descVi: "0 hoặc 1 lần (tùy chọn)", example: "colou?r" },
            { token: "{n}", descEn: "Exactly n times", descVi: "Chính xác n lần", example: "\\d{4}" },
            { token: "{n,}", descEn: "At least n times", descVi: "Ít nhất n lần", example: "\\d{2,}" },
            { token: "{n,m}", descEn: "Between n and m times", descVi: "Từ n đến m lần", example: "\\d{2,4}" },
        ],
    },
    {
        categoryEn: "Groups & Lookaround",
        categoryVi: "Nhóm & Điều Kiện Nhìn",
        items: [
            { token: "(abc)", descEn: "Capturing group", descVi: "Nhóm bắt giữ (Capture)", example: "(ha)+" },
            { token: "(?:abc)", descEn: "Non-capturing group", descVi: "Nhóm không bắt giữ", example: "(?:abc)+" },
            { token: "(?=abc)", descEn: "Positive lookahead", descVi: "Nhìn trước khẳng định", example: "\\d(?=px)" },
            { token: "(?!abc)", descEn: "Negative lookahead", descVi: "Nhìn trước phủ định", example: "\\d(?!px)" },
            { token: "(?<=abc)", descEn: "Positive lookbehind", descVi: "Nhìn sau khẳng định", example: "(?<=\\$)\\d+" },
            { token: "(?<!abc)", descEn: "Negative lookbehind", descVi: "Nhìn sau phủ định", example: "(?<!\\$)\\d+" },
        ],
    },
];

export default function RegexTesterClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = regexTesterTranslations[locale];
    const ui = t.regexTester.ui;

    const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");
    const [flags, setFlags] = useState("g");
    const [testString, setTestString] = useState(
        "Welcome to AnyTools!\nContact our support at lexuantruong0981@gmail.com for inquiries.\nInvalid email: user@domain without tld or invalid#email.com"
    );
    const [viewMode, setViewMode] = useState<"highlight" | "matches" | "code" | "matrix" | "cheatsheet">("highlight");
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLang>("java");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [error, setError] = useState("");

    const patternInputRef = useRef<HTMLInputElement>(null);

    // Active language specification
    const currentLangSpec = useMemo(() => {
        return SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];
    }, [selectedLanguage]);

    // Common patterns
    const commonPatterns: CommonPattern[] = useMemo(() => {
        const patternKeys = [
            { key: "emailAddress", pattern: "([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})", example: "user@example.com, test.dev@domain.org", category: "Validation" },
            { key: "urlWebsite", pattern: "https?://([\\w\\-]+\\.)+[\\w\\-]+(/[\\w\\-\\./?%&=]*)?", example: "Visit https://anytools.online/tools/regex-tester today!", category: "Web" },
            { key: "phoneVN", pattern: "(0|\\+84)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}", example: "Call 0981234567 or +84912345678 now", category: "Validation" },
            { key: "phoneUS", pattern: "\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}", example: "Support: (123) 456-7890 or 800-555-0199", category: "Validation" },
            { key: "ipv4", pattern: "\\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", example: "Local IP 127.0.0.1 and Gateway 192.168.1.1", category: "Network" },
            { key: "hexColor", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", example: "Colors: #FF5733, #FFF, #2563EB", category: "Web" },
            { key: "dateYMD", pattern: "\\b\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\\b", example: "Release date: 2026-09-19 and deadline: 2026-12-31", category: "Date/Time" },
            { key: "uuidV4", pattern: "\\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b", example: "Session: 123e4567-e89b-42d3-a456-426614174000", category: "Development" },
            { key: "jwtToken", pattern: "eyJ[a-zA-Z0-9_-]+\\.eyJ[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotShareSignature", category: "Security" },
            { key: "slug", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", example: "best-developer-tools-online", category: "Web" },
        ];

        return patternKeys.map(({ key, pattern, example, category }) => {
            const translation = ui.patterns[key as keyof typeof ui.patterns] || { name: key, description: key };
            return {
                name: translation.name,
                pattern,
                example,
                description: translation.description,
                category,
            };
        });
    }, [ui.patterns]);

    const categories = ["All", ...Array.from(new Set(commonPatterns.map((p) => p.category)))];
    const filteredPatterns = selectedCategory === "All" ? commonPatterns : commonPatterns.filter((p) => p.category === selectedCategory);

    // Calculate match details and segments
    const { matchDetails, highlightedSegments, totalMatches, executionTime } = useMemo(() => {
        if (!pattern.trim()) {
            return {
                matchDetails: [],
                highlightedSegments: [{ text: testString, isMatch: false, matchIndex: -1 }],
                totalMatches: 0,
                executionTime: 0,
            };
        }

        const t0 = performance.now();
        try {
            setError("");
            const effectiveFlags = flags.includes("g") ? flags : flags + "g";
            const regex = new RegExp(pattern, effectiveFlags);

            const details: MatchDetail[] = [];
            const segments: { text: string; isMatch: boolean; matchIndex: number }[] = [];

            let lastIndex = 0;
            let match: RegExpExecArray | null;
            let counter = 0;

            while ((match = regex.exec(testString)) !== null && counter < 500) {
                counter++;
                const start = match.index;
                const matchText = match[0];
                const end = start + matchText.length;

                if (start > lastIndex) {
                    segments.push({
                        text: testString.slice(lastIndex, start),
                        isMatch: false,
                        matchIndex: -1,
                    });
                }

                if (matchText.length > 0) {
                    segments.push({
                        text: matchText,
                        isMatch: true,
                        matchIndex: counter,
                    });
                }

                const groups = match.slice(1).map((g, idx) => ({
                    index: idx + 1,
                    text: g !== undefined ? g : "",
                }));

                details.push({
                    matchIndex: counter,
                    text: matchText,
                    start,
                    end,
                    groups,
                });

                lastIndex = end;

                if (matchText.length === 0) {
                    regex.lastIndex++;
                    if (regex.lastIndex > testString.length) break;
                }
            }

            if (lastIndex < testString.length) {
                segments.push({
                    text: testString.slice(lastIndex),
                    isMatch: false,
                    matchIndex: -1,
                });
            }

            const t1 = performance.now();
            return {
                matchDetails: details,
                highlightedSegments: segments,
                totalMatches: details.length,
                executionTime: Math.round((t1 - t0) * 100) / 100,
            };
        } catch (err: any) {
            setError(err?.message || (isVi ? "Biểu thức Regular Expression không hợp lệ" : "Invalid Regular Expression"));
            return {
                matchDetails: [],
                highlightedSegments: [{ text: testString, isMatch: false, matchIndex: -1 }],
                totalMatches: 0,
                executionTime: 0,
            };
        }
    }, [pattern, flags, testString, isVi]);

    // Load common pattern
    const handleLoadPattern = (p: CommonPattern) => {
        setPattern(p.pattern);
        setTestString(p.example);
        setFlags("g");
        toast.info(isVi ? `Đã nạp mẫu: ${p.name}` : `Loaded pattern: ${p.name}`);
    };

    // Insert token from cheatsheet into pattern
    const handleInsertToken = (token: string) => {
        if (!patternInputRef.current) {
            setPattern((prev) => prev + token);
            return;
        }
        const input = patternInputRef.current;
        const start = input.selectionStart || pattern.length;
        const end = input.selectionEnd || pattern.length;
        const nextVal = pattern.substring(0, start) + token + pattern.substring(end);
        setPattern(nextVal);
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + token.length, start + token.length);
        }, 50);
        toast.success(isVi ? `Đã chèn ký tự "${token}"` : `Inserted token "${token}"`);
    };

    // Copy specific string
    const handleCopyText = async (text: string, label: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            toast.success(isVi ? `Đã sao chép ${label}!` : `Copied ${label}!`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    const activeCode = useMemo(() => {
        return currentLangSpec.getCodeSnippet(pattern, flags, testString);
    }, [currentLangSpec, pattern, flags, testString]);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left 2 Columns: Main Testing Studio */}
            <div className='lg:col-span-2 space-y-6'>
                {/* Pattern & Flags Studio Card */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span className='text-blue-600 dark:text-blue-400'>/</span> {ui.patternLabel} <span className='text-blue-600 dark:text-blue-400'>/{flags}</span>
                            </label>
                            {totalMatches > 0 && !error && (
                                <span className='text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 animate-pulse'>
                                    {totalMatches} {isVi ? "kết quả khớp" : "matches"} ({executionTime}ms)
                                </span>
                            )}
                        </div>
                        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all'>
                            <span className='font-mono font-bold text-gray-400 text-lg'>/</span>
                            <input
                                ref={patternInputRef}
                                type='text'
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                placeholder={ui.patternPlaceholder}
                                className='w-full bg-transparent border-0 text-gray-900 dark:text-gray-100 font-mono text-base focus:outline-none'
                            />
                            <span className='font-mono font-bold text-gray-400 text-lg'>/</span>
                            <span className='font-mono font-bold text-blue-600 dark:text-blue-400 text-base'>{flags}</span>
                        </div>
                    </div>

                    {/* Universal Multi-Language Syntax Adapter Bar (11 Languages) */}
                    <div className='p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-3'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                            <span className='text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5'>
                                <span>⚡</span> {isVi ? "Cú Pháp Theo Ngôn Ngữ (Chọn để lấy mã chuẩn):" : "Language Syntax Adapter:"}
                            </span>
                            <button
                                type='button'
                                onClick={() => setViewMode("matrix")}
                                className='text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold'
                            >
                                📊 {isVi ? "Xem bảng so sánh 11 ngôn ngữ" : "Compare all 11 languages"}
                            </button>
                        </div>

                        {/* Language Switcher Chips: All 11 languages */}
                        <div className='flex flex-wrap gap-1.5'>
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.id}
                                    type='button'
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        selectedLanguage === lang.id
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                                    }`}
                                >
                                    <span>{lang.icon}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Direct Syntax Display & 1-Click Copy */}
                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-blue-100 dark:border-gray-800'>
                            <div className='min-w-0 flex-1 space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <span className='font-bold text-xs text-blue-600 dark:text-blue-400'>
                                        {currentLangSpec.icon} {currentLangSpec.name} ({currentLangSpec.badge}):
                                    </span>
                                </div>
                                <div className='font-mono text-xs font-bold text-gray-900 dark:text-gray-100 break-all select-all bg-gray-50 dark:bg-gray-800/80 p-2 rounded-lg border border-gray-100 dark:border-gray-700'>
                                    {currentLangSpec.getDeclaration(pattern, flags)}
                                </div>
                                <div className='text-[11px] text-gray-500 dark:text-gray-400'>
                                    💡 {isVi ? currentLangSpec.tipVi : currentLangSpec.tipEn}
                                </div>
                            </div>

                            <div className='flex items-center gap-2 shrink-0 self-end sm:self-center'>
                                <button
                                    type='button'
                                    onClick={() => handleCopyText(currentLangSpec.getPatternLiteral(pattern, flags), `${currentLangSpec.name} Pattern`)}
                                    className='px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-mono text-xs font-semibold transition-colors cursor-pointer border border-blue-200 dark:border-blue-800'
                                    title={isVi ? "Sao chép chuỗi pattern đã escape đúng chuẩn" : "Copy escaped pattern string"}
                                >
                                    📋 {isVi ? "Copy Pattern" : "Copy Pattern"}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleCopyText(activeCode, `${currentLangSpec.name} Code`)}
                                    className='px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-gray-700'
                                    title={isVi ? "Sao chép mã code hoàn chỉnh" : "Copy full code snippet"}
                                >
                                    📄 {isVi ? "Code đầy đủ" : "Full Code"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Flags selector */}
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                            {ui.flagsLabel} ({isVi ? "Cờ định danh" : "Regex Modifiers"})
                        </label>
                        <div className='flex flex-wrap gap-2'>
                            {[
                                { flag: "g", titleEn: "Global - find all matches", titleVi: "Toàn cục - tìm tất cả kết quả" },
                                { flag: "i", titleEn: "Case insensitive - ignore letter casing", titleVi: "Không phân biệt hoa/thường" },
                                { flag: "m", titleEn: "Multiline - ^ and $ match start/end of line", titleVi: "Nhiều dòng - ^ và $ khớp theo dòng" },
                                { flag: "s", titleEn: "DotAll - . matches newline \\n", titleVi: "Dấu chấm khớp cả xuống dòng" },
                                { flag: "u", titleEn: "Unicode - full unicode support", titleVi: "Hỗ trợ đầy đủ Unicode" },
                            ].map(({ flag, titleEn, titleVi }) => {
                                const active = flags.includes(flag);
                                return (
                                    <button
                                        key={flag}
                                        type='button'
                                        onClick={() => {
                                            setFlags(active ? flags.replace(flag, "") : flags + flag);
                                        }}
                                        title={isVi ? titleVi : titleEn}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                                            active
                                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                                : "bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <span className='text-sm'>{active ? "✓" : "+"}</span>
                                        <span>{flag}</span>
                                        <span className='opacity-70 text-[11px] font-sans font-normal hidden sm:inline'>
                                            {flag === "g" ? "global" : flag === "i" ? "case-ins" : flag === "m" ? "multiline" : flag}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className='p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2'>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Test String Input & Live Highlight View */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                    {/* View Switcher Tabs */}
                    <div className='flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-3'>
                        <div className='flex flex-wrap gap-2'>
                            {[
                                { id: "highlight", labelEn: "Visual Highlight", labelVi: "Xem Trực Quan", icon: "🎨" },
                                { id: "matches", labelEn: `Matches (${totalMatches})`, labelVi: `Khớp (${totalMatches})`, icon: "🎯" },
                                { id: "code", labelEn: "Code Generator", labelVi: "Sinh Mã Code", icon: "💻" },
                                { id: "matrix", labelEn: "11 Languages Matrix", labelVi: "Bảng 11 Ngôn Ngữ", icon: "🌐" },
                                { id: "cheatsheet", labelEn: "Cheatsheet", labelVi: "Tra Cứu Nhanh", icon: "📖" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setViewMode(tab.id as any)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                        viewMode === tab.id
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{isVi ? tab.labelVi : tab.labelEn}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            type='button'
                            onClick={() => {
                                setTestString("");
                                setPattern("");
                            }}
                            className='text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer'
                        >
                            {isVi ? "Xóa hết" : "Clear all"}
                        </button>
                    </div>

                    {/* Tab 1: Visual Highlighting */}
                    {viewMode === "highlight" && (
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                    {isVi ? "Văn Bản Kiểm Thử (Nhập hoặc dán văn bản bên dưới)" : "Test String (Edit below)"}
                                </label>
                                <textarea
                                    value={testString}
                                    onChange={(e) => setTestString(e.target.value)}
                                    placeholder={ui.testStringsPlaceholder}
                                    rows={5}
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                />
                            </div>

                            {/* Render Highlighting Preview Box */}
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                    {isVi ? "Kết Quả Khớp Nổi Bật (Live Highlighting)" : "Visual Match Highlights"}
                                </label>
                                <div className='p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-sm whitespace-pre-wrap break-all min-h-[120px] max-h-[360px] overflow-y-auto border border-gray-800 leading-relaxed'>
                                    {highlightedSegments.length > 0 ? (
                                        highlightedSegments.map((seg, idx) =>
                                            seg.isMatch ? (
                                                <mark
                                                    key={idx}
                                                    title={`Match #${seg.matchIndex}`}
                                                    className='bg-amber-400/30 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded mx-0.5 font-bold cursor-help hover:bg-amber-400/50 transition-colors'
                                                >
                                                    {seg.text}
                                                </mark>
                                            ) : (
                                                <span key={idx} className='text-gray-300'>
                                                    {seg.text}
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className='text-gray-500 italic'>
                                            {isVi ? "Chưa có văn bản để kiểm thử..." : "No test text provided..."}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Detailed Matches List */}
                    {viewMode === "matches" && (
                        <div className='space-y-3'>
                            {matchDetails.length === 0 ? (
                                <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
                                    <span className='text-4xl block mb-2'>🔍</span>
                                    <p className='font-medium'>{isVi ? "Không tìm thấy kết quả khớp nào" : "No matches found"}</p>
                                    <p className='text-xs mt-1'>{isVi ? "Hãy kiểm tra lại biểu thức Regex hoặc cờ tìm kiếm." : "Check your regex pattern or flags."}</p>
                                </div>
                            ) : (
                                <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
                                    {matchDetails.map((m) => (
                                        <div
                                            key={m.matchIndex}
                                            className='p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2'
                                        >
                                            <div className='flex items-center justify-between text-xs'>
                                                <span className='font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'>
                                                    Match #{m.matchIndex}
                                                </span>
                                                <span className='text-gray-500 dark:text-gray-400 font-mono'>
                                                    {isVi ? `Vị trí: ${m.start} - ${m.end} (Độ dài: ${m.text.length})` : `Range: ${m.start} - ${m.end} (Length: ${m.text.length})`}
                                                </span>
                                            </div>
                                            <div className='font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 break-all'>
                                                {m.text}
                                            </div>
                                            {m.groups.length > 0 && (
                                                <div className='pt-2 border-t border-gray-200 dark:border-gray-800 space-y-1.5'>
                                                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                                                        {isVi ? "Các nhóm bắt giữ (Capture Groups):" : "Capture Groups:"}
                                                    </span>
                                                    {m.groups.map((g) => (
                                                        <div key={g.index} className='flex items-center gap-2 text-xs font-mono pl-2'>
                                                            <span className='text-purple-600 dark:text-purple-400 font-bold'>Group {g.index}:</span>
                                                            <span className='text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded'>
                                                                {g.text || <em className='text-gray-400'>{isVi ? "(rỗng)" : "(empty)"}</em>}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Code Generator (All 11 Languages) */}
                    {viewMode === "code" && (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap items-center justify-between gap-3'>
                                <div className='flex flex-wrap gap-1.5'>
                                    {SUPPORTED_LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                selectedLanguage === lang.id
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                        >
                                            <span>{lang.icon}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <Button onClick={() => handleCopyText(activeCode, "Code")} variant='secondary' size='sm'>
                                    📋 {isVi ? "Sao chép code" : "Copy code"}
                                </Button>
                            </div>

                            <div className='relative'>
                                <pre className='p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-[380px]'>
                                    <code>{activeCode}</code>
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: 11 Languages Matrix View */}
                    {viewMode === "matrix" && (
                        <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                ⚡ {isVi ? "Bảng tra cứu và sao chép cú pháp Regex cho toàn bộ 11 ngôn ngữ lập trình:" : "Quick copy regex pattern and declaration across 11 programming languages:"}
                            </p>
                            <div className='space-y-2.5'>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <div
                                        key={lang.id}
                                        className='p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/60 space-y-2'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-base'>{lang.icon}</span>
                                                <span className='font-bold text-xs text-gray-900 dark:text-gray-100'>{lang.name}</span>
                                                <span className='text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'>
                                                    {lang.badge}
                                                </span>
                                            </div>
                                            <div className='flex gap-1.5'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleCopyText(lang.getPatternLiteral(pattern, flags), `${lang.name} Pattern`)}
                                                    className='px-2 py-1 rounded bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold border border-gray-200 dark:border-gray-700 cursor-pointer'
                                                >
                                                    📋 Pattern
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => handleCopyText(lang.getCodeSnippet(pattern, flags, testString), `${lang.name} Snippet`)}
                                                    className='px-2 py-1 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold border border-gray-200 dark:border-gray-700 cursor-pointer'
                                                >
                                                    📄 Code
                                                </button>
                                            </div>
                                        </div>
                                        <code className='block p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs rounded-lg border border-gray-200 dark:border-gray-700 break-all select-all'>
                                            {lang.getDeclaration(pattern, flags)}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 5: Cheatsheet Inserter */}
                    {viewMode === "cheatsheet" && (
                        <div className='space-y-4 max-h-[460px] overflow-y-auto pr-1'>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                💡 {isVi ? "Bấm vào bất kỳ ký tự nào để chèn trực tiếp vào ô Regular Expression ở trên." : "Click any token to instantly insert it into the regex input above."}
                            </p>
                            {CHEATSHEET.map((sec, i) => (
                                <div key={i} className='space-y-2'>
                                    <h4 className='text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
                                        {isVi ? sec.categoryVi : sec.categoryEn}
                                    </h4>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                        {sec.items.map((item, j) => (
                                            <button
                                                key={j}
                                                type='button'
                                                onClick={() => handleInsertToken(item.token)}
                                                className='flex items-center justify-between p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/60 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group cursor-pointer'
                                            >
                                                <div className='min-w-0 pr-2'>
                                                    <div className='text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                                                        {isVi ? item.descVi : item.descEn}
                                                    </div>
                                                    <div className='text-[11px] text-gray-400 font-mono truncate'>
                                                        {item.example}
                                                    </div>
                                                </div>
                                                <code className='px-2 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold font-mono border border-gray-200 dark:border-gray-700 shrink-0'>
                                                    {item.token}
                                                </code>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Pattern Presets Library */}
            <div className='lg:col-span-1 space-y-6'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-20 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>📚</span> {ui.commonPatternsTitle}
                        </h3>
                        <span className='text-xs text-gray-500'>{filteredPatterns.length} {isVi ? "mẫu" : "patterns"}</span>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "All" ? (isVi ? "Tất cả danh mục" : "All Categories") : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Patterns list */}
                    <div className='space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1'>
                        {filteredPatterns.map((p, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleLoadPattern(p)}
                                className='p-3 bg-gray-50 dark:bg-gray-900/60 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-700/80 transition-all group'
                            >
                                <div className='flex items-center justify-between mb-1'>
                                    <span className='font-semibold text-xs text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                                        {p.name}
                                    </span>
                                    <span className='text-[10px] px-1.5 py-0.5 rounded bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                                        {p.category}
                                    </span>
                                </div>
                                <p className='text-[11px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-2'>
                                    {p.description}
                                </p>
                                <code className='text-[11px] bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-blue-600 dark:text-blue-400 break-all block border border-gray-100 dark:border-gray-700 font-mono'>
                                    {p.pattern.length > 38 ? p.pattern.substring(0, 38) + "..." : p.pattern}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
