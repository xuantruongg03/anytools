export const barcodeGeneratorTranslations = {
    en: {
        name: "Barcode Generator & Scanner",
        description: "Create custom barcodes in Code 128, EAN-13, UPC, Code 39, and more. Download high-res PNG/SVG or scan existing barcodes instantly.",
        category: "Productivity",

        // Tabs
        tabGenerate: "Generate Barcode",
        tabScan: "Scan Barcode",

        // Generator Controls
        barcodeText: "Barcode Content / Value",
        barcodeTextPlaceholder: "Enter numbers or text (e.g., 123456789012)",
        format: "Barcode Symbology / Format",
        lineColor: "Bar Color",
        bgColor: "Background Color",
        widthScale: "Bar Width",
        heightScale: "Bar Height",
        displayText: "Show Text Under Barcode",
        fontSize: "Font Size",
        margin: "Quiet Zone (Margin)",
        textPosition: "Text Position",
        posBottom: "Bottom",
        posTop: "Top",

        // Actions
        downloadPng: "Download PNG",
        downloadSvg: "Download SVG",
        printBarcode: "Print Barcode",
        copyImage: "Copy Image",
        copied: "Copied!",

        // Presets
        presets: "Common Presets",
        presetProduct: "EAN-13 Product",
        presetUpc: "UPC-A Retail",
        presetShipping: "Code 128 Shipping",
        presetInventory: "Code 39 Inventory",

        // Scanner
        scannerTitle: "Scan or Upload Barcode Image",
        scannerDesc: "Upload an image containing a barcode or use your camera to decode it instantly.",
        uploadImage: "Upload Image",
        dragDrop: "Drag & drop barcode image here, or click to browse",
        startCamera: "Start Camera Scan",
        stopCamera: "Stop Camera",
        scanResult: "Scan Result",
        scanFormat: "Format Detected",
        copyResult: "Copy Value",
        noBarcodeFound: "No recognizable barcode found in image. Please ensure good lighting and contrast.",
        cameraNotFound: "Camera not available or access denied.",

        // Guide
        guideTitle: "Barcode Standards Guide",
        guide1Title: "Code 128 - Versatile Industrial Standard",
        guide1Desc: "High-density symbology supporting all 128 ASCII characters. Widely used in shipping labels, logistics, packaging, and supply chain tracking.",
        guide2Title: "EAN-13 & UPC-A - Global Retail Standards",
        guide2Desc: "Standard barcodes found on supermarket and retail goods worldwide. EAN-13 requires 12 or 13 digits, while UPC-A uses 12 digits.",
        guide3Title: "Code 39 & ITF-14 - Inventory & Warehousing",
        guide3Desc: "Code 39 supports alphanumeric characters for internal asset tagging. ITF-14 is specifically designed for corrugated shipping cardboard.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "Can I print these barcodes on standard label printers?",
        faq1A: "Yes! Downloading as SVG provides infinite vector resolution without pixelation, perfect for Zebra, Dymo, Brother, and standard desktop printers.",
        faq2Q: "Are barcodes generated here free for commercial use?",
        faq2A: "Absolutely. All barcodes generated on AnyTools are 100% free and run completely in your browser with zero licensing restrictions.",
        faq3Q: "Why does my EAN-13 or UPC barcode show an error?",
        faq3A: "EAN-13 requires exactly 12 or 13 numeric digits with a valid Modulo-10 checksum digit. If you type letters or an invalid length, the generator will show a checksum warning.",
    },
    vi: {
        name: "Tạo & Quét Mã Vạch Barcode Online",
        description: "Tạo mã vạch chuyên nghiệp chuẩn Code 128, EAN-13, UPC, Code 39 miễn phí. Xuất file vector SVG, PNG sắc nét và quét mã vạch trực tiếp.",
        category: "Năng suất",

        // Tabs
        tabGenerate: "Tạo Mã Vạch",
        tabScan: "Quét Mã Vạch",

        // Generator Controls
        barcodeText: "Nội dung mã vạch (Giá trị)",
        barcodeTextPlaceholder: "Nhập dãy số hoặc ký tự (VD: 893500180012)",
        format: "Loại mã vạch (Chuẩn Barcode)",
        lineColor: "Màu vạch",
        bgColor: "Màu nền",
        widthScale: "Độ dày vạch",
        heightScale: "Chiều cao vạch",
        displayText: "Hiển thị chữ số",
        fontSize: "Cỡ chữ",
        margin: "Khoảng lề",
        textPosition: "Vị trí chữ",
        posBottom: "Dưới vạch",
        posTop: "Trên vạch",

        // Actions
        downloadPng: "Tải ảnh PNG",
        downloadSvg: "Tải vector SVG",
        printBarcode: "In Mã Vạch",
        copyImage: "Sao chép ảnh",
        copied: "Đã chép!",

        // Presets
        presets: "Mẫu thông dụng",
        presetProduct: "EAN-13 Hàng hóa VN",
        presetUpc: "UPC-A Bán lẻ Mỹ",
        presetShipping: "Code 128 Vận chuyển",
        presetInventory: "Code 39 Kho vận",

        // Scanner
        scannerTitle: "Quét hoặc Tải Lên Ảnh Mã Vạch",
        scannerDesc: "Tải ảnh chứa mã vạch hoặc dùng camera điện thoại/laptop để đọc nội dung tức thì.",
        uploadImage: "Tải ảnh lên",
        dragDrop: "Kéo thả ảnh mã vạch vào đây, hoặc click để chọn file",
        startCamera: "Mở Camera Quét",
        stopCamera: "Tắt Camera",
        scanResult: "Kết quả quét",
        scanFormat: "Định dạng nhận diện",
        copyResult: "Sao chép giá trị",
        noBarcodeFound: "Không tìm thấy mã vạch trong ảnh. Vui lòng đảm bảo ảnh rõ nét và đủ sáng.",
        cameraNotFound: "Không tìm thấy máy ảnh hoặc quyền truy cập bị từ chối.",

        // Guide
        guideTitle: "Kiến Thức Về Các Chuẩn Mã Vạch Phổ Biến",
        guide1Title: "Code 128 - Đa năng cho vận chuyển & kho bãi",
        guide1Desc: "Hỗ trợ toàn bộ ký tự ASCII, mật độ lưu trữ cao. Thường dùng in vận đơn Shopee, TikTok Shop, bưu cục chuyển phát nhanh.",
        guide2Title: "EAN-13 - Chuẩn hàng hóa siêu thị Việt Nam",
        guide2Desc: "Mã vạch 13 chữ số in trên bao bì sản phẩm bán lẻ. Mã quốc gia Việt Nam thường bắt đầu bằng đầu số 893.",
        guide3Title: "Code 39 & ITF-14 - Quản lý tài sản nội bộ",
        guide3Desc: "Code 39 cho phép chứa cả chữ in hoa và số, lý tưởng để dán nhãn linh kiện máy tính, mã số định danh thẻ nhân viên.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Mã vạch xuất ra có in được trên máy in nhiệt không?",
        faq1A: "Có! File SVG vector sắc nét đến từng micromet, in cực kỳ rõ trên mọi loại máy in mã vạch như Xprinter, Zebra, HPRT, Brother.",
        faq2Q: "Dùng AnyTools tạo mã vạch có mất phí không?",
        faq2A: "Hoàn toàn miễn phí 100%, không giới hạn số lượng và chạy trực tiếp trên trình duyệt của bạn mà không lưu dữ liệu lên server.",
        faq3Q: "Tại sao nhập số cho EAN-13 lại báo lỗi?",
        faq3A: "Mã EAN-13 bắt buộc phải đúng 12 hoặc 13 chữ số kèm số kiểm tra hợp lệ theo thuật toán Modulo 10. Hãy nhập đúng dãy 12-13 số nhé.",
    },
};
