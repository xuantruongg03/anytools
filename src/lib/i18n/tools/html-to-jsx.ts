export const htmlToJsxTranslations = {
    en: {
        name: "HTML to JSX Converter",
        description: "Convert raw HTML code into clean, valid React JSX or TSX. Automatically handles className, htmlFor, inline styles, SVG camelCase attributes, and self-closing tags.",
        category: "Developer",

        // UI
        inputLabel: "Raw HTML Code",
        inputPlaceholder: "Paste your HTML code here...",
        outputLabel: "React JSX / TSX Output",
        wrapOption: "Component Wrapper",
        wrapNone: "Pure JSX Element",
        wrapFunction: "React Function Component",
        wrapTsx: "TypeScript FC Component",
        copyJsx: "Copy JSX",
        copied: "Copied JSX to clipboard!",
        downloadFile: "Download .jsx",
        clear: "Clear",
        presets: "Sample Snippets",
        presetCard: "Bootstrap Card",
        presetSvg: "SVG Icon",
        presetForm: "Form with Inline Styles",

        // Guide
        guideTitle: "HTML to React JSX Conversion Guide",
        guide1Title: "Why Doesn't Raw HTML Work in React?",
        guide1Desc: "JSX is a syntax extension for JavaScript. Reserved words like 'class' and 'for' conflict with JavaScript syntax, requiring 'className' and 'htmlFor'.",
        guide2Title: "Handling Inline Styles",
        guide2Desc: "In standard HTML, styles are strings (style='color: red; font-size: 16px'). In React JSX, styles must be JavaScript objects with camelCased properties (style={{ color: 'red', fontSize: '16px' }}).",
        guide3Title: "Self-closing Tags in JSX",
        guide3Desc: "Tags like <img>, <input>, <br>, and <hr> are void elements in HTML, but JSX strictly requires them to be explicitly closed (<img />, <input />).",
    },
    vi: {
        name: "Chuyển Đổi HTML Sang React JSX",
        description: "Công cụ chuyển đổi mã HTML thành React JSX / TSX chuẩn xác. Tự động đổi class thành className, chuyển đổi inline styles sang React object, sửa thẻ tự đóng và thuộc tính SVG.",
        category: "Lập trình",

        // UI
        inputLabel: "Mã nguồn HTML gốc",
        inputPlaceholder: "Dán mã HTML của bạn vào đây...",
        outputLabel: "Mã React JSX / TSX kết quả",
        wrapOption: "Bao bọc Component",
        wrapNone: "Chỉ lấy mã JSX (Pure JSX)",
        wrapFunction: "Function Component chuẩn",
        wrapTsx: "TypeScript React.FC Component",
        copyJsx: "Sao chép JSX",
        copied: "Đã sao chép mã JSX vào clipboard!",
        downloadFile: "Tải file .jsx",
        clear: "Xóa",
        presets: "Mẫu HTML thử nghiệm",
        presetCard: "Thẻ Card Bootstrap",
        presetSvg: "Icon SVG phức tạp",
        presetForm: "Form có style nội dòng",

        // Guide
        guideTitle: "Hướng Dẫn Chuyển Đổi HTML Sang React JSX Chuẩn Xác",
        guide1Title: "Tại sao HTML không chạy trực tiếp trong React?",
        guide1Desc: "JSX là phần mở rộng cú pháp của JavaScript. Do các từ khóa 'class' và 'for' trùng với từ khóa của JS, React bắt buộc phải dùng 'className' và 'htmlFor'.",
        guide2Title: "Xử lý style nội dòng (Inline Styles)",
        guide2Desc: "Trong HTML thông thường, style là một chuỗi văn bản. Trong React JSX, style phải là một đối tượng JavaScript với các thuộc tính viết theo kiểu camelCase.",
        guide3Title: "Yêu cầu thẻ tự đóng trong JSX",
        guide3Desc: "Các thẻ như <img>, <input>, <br>, <hr> trong HTML có thể không cần đóng, nhưng cú pháp JSX yêu cầu nghiêm ngặt phải tự đóng (<img />, <input />).",
    },
};
