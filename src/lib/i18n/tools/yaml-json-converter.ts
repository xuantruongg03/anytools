export const yamlJsonConverterTranslations = {
    en: {
        name: "YAML to JSON & JSON to YAML Converter",
        description: "Convert seamlessly between YAML and JSON with real-time bidirectional parsing, syntax validation, customizable indent spacing, and file export.",
        category: "Developer",

        // Modes
        modeYamlToJson: "YAML to JSON",
        modeJsonToYaml: "JSON to YAML",

        // Actions & Controls
        inputLabel: "Source Input",
        outputLabel: "Converted Output",
        indent: "Indentation",
        indent2: "2 Spaces (Standard)",
        indent4: "4 Spaces",
        minifyJson: "Minify JSON",
        copyOutput: "Copy Result",
        downloadFile: "Download File",
        clearAll: "Clear",
        copied: "Copied to clipboard!",

        // Samples
        loadSample: "Load Sample",
        sampleDocker: "Docker Compose",
        sampleK8s: "Kubernetes Pod",
        samplePackage: "Package Config",

        // Status
        validOutput: "Valid conversion completed",
        syntaxError: "Syntax Error",

        // Guide
        guideTitle: "YAML vs. JSON Comparison Guide",
        guide1Title: "What is YAML?",
        guide1Desc: "YAML (YAML Ain't Markup Language) is a human-readable data serialization standard commonly used for configuration files (Docker, Kubernetes, GitHub Actions).",
        guide2Title: "Why Convert Between YAML and JSON?",
        guide2Desc: "JSON is ideal for network transmission and API payloads, while YAML provides better human readability with comments and clean indentation.",
        guide3Title: "Safe & 100% Client-Side",
        guide3Desc: "All conversions run directly in your browser memory via js-yaml. No configuration secrets or API tokens ever touch an external server.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "Does YAML support comments?",
        faq1A: "Yes, YAML supports lines starting with # for comments. Note that when converting from YAML to JSON, comments are stripped because JSON standard does not allow comments.",
        faq2Q: "Can I convert large Kubernetes manifests?",
        faq2A: "Yes! The parser effortlessly handles multi-kilobyte manifests, complex nested lists, and multi-document YAML strings.",
        faq3Q: "How are booleans and null values handled?",
        faq3A: "Standard YAML types (true, false, yes, no, null, ~) are accurately mapped to native JSON booleans and null values.",
    },
    vi: {
        name: "Chuyển Đổi YAML Sang JSON & Ngược Lại Online",
        description: "Chuyển đổi 2 chiều siêu tốc giữa YAML và JSON, kiểm tra lỗi cú pháp chi tiết, tùy chỉnh thụt lề 2 hoặc 4 spaces và tải file trực tiếp.",
        category: "Lập trình",

        // Modes
        modeYamlToJson: "YAML sang JSON",
        modeJsonToYaml: "JSON sang YAML",

        // Actions & Controls
        inputLabel: "Dữ liệu nguồn",
        outputLabel: "Kết quả chuyển đổi",
        indent: "Khoảng thụt dòng",
        indent2: "2 Dấu cách (Chuẩn)",
        indent4: "4 Dấu cách",
        minifyJson: "Nén JSON 1 dòng (Minify)",
        copyOutput: "Sao chép kết quả",
        downloadFile: "Tải file về máy",
        clearAll: "Xóa hết",
        copied: "Đã chép vào clipboard!",

        // Samples
        loadSample: "Dữ liệu mẫu",
        sampleDocker: "Docker Compose",
        sampleK8s: "Kubernetes Pod",
        samplePackage: "Config Package",

        // Status
        validOutput: "Chuyển đổi cú pháp thành công",
        syntaxError: "Lỗi cú pháp",

        // Guide
        guideTitle: "Tìm Hiểu Về Cấu Trúc YAML Và JSON",
        guide1Title: "Định dạng YAML là gì?",
        guide1Desc: "YAML là định dạng cấu hình thân thiện với con người, dùng thụt đầu dòng (indentation) để phân cấp, rất phổ biến trong Docker, Kubernetes, CI/CD.",
        guide2Title: "Sự khác biệt cốt lõi giữa YAML và JSON",
        guide2Desc: "JSON có cấu trúc ngoặc nhọn nghiêm ngặt và phổ biến trong giao tiếp API, còn YAML loại bỏ hầu hết dấu ngoặc và hỗ trợ chú thích dòng (#).",
        guide3Title: "Bảo mật & xử lý an toàn 100%",
        guide3Desc: "Toàn bộ quá trình parse dữ liệu diễn ra hoàn toàn bằng Javascript trên máy của bạn, không gửi thông tin cấu hình nhạy cảm lên máy chủ.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Có bị mất chú thích (comments) khi chuyển từ YAML sang JSON không?",
        faq1A: "Có, vì chuẩn JSON của W3C không hỗ trợ ghi chú thích (# hoặc //), nên khi chuyển sang JSON các dòng comment sẽ tự động bị bỏ qua.",
        faq2Q: "Có hỗ trợ file cấu hình Docker Compose hay Kubernetes không?",
        faq2A: "Có! Công cụ hỗ trợ đầy đủ các cú pháp mảng, object, multiline text (| và >) của chuẩn YAML 1.2.",
        faq3Q: "Tại sao công cụ báo lỗi Indentation Error?",
        faq3A: "YAML nghiêm cấm sử dụng phím Tab (\\t) để thụt đầu dòng. Bạn chỉ được phép dùng dấu cách (Space) để căn lề.",
    },
};
