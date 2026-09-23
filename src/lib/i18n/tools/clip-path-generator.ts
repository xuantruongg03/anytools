export const clipPathTranslations = {
    en: {
        name: "CSS Clip-Path & Shape Generator",
        description: "Create custom geometric shapes, polygon cutouts, and responsive CSS clip-paths with an interactive draggable vertex canvas, rich presets, and instant Tailwind / SVG export.",
        category: "Design & CSS",

        // Presets
        presetsTitle: "Geometric Shape Presets",
        triangle: "Triangle",
        trapezoid: "Trapezoid",
        parallelogram: "Parallelogram",
        rhombus: "Diamond (Rhombus)",
        pentagon: "Pentagon",
        hexagon: "Hexagon",
        octagon: "Octagon",
        star: "5-Point Star",
        cross: "Plus / Cross",
        arrowRight: "Arrow (Right)",
        chevron: "Chevron",
        speechBubble: "Speech Bubble",
        badge: "Ribbon Badge",

        // Canvas & Editor
        canvasTitle: "Interactive Vertex Editor",
        canvasHint: "Click and drag any point to reshape. Double-click or click an edge to add points.",
        addPoint: "Add Point",
        resetPoints: "Reset Shape",
        snapToGrid: "Snap to 5% Grid",
        bgPreview: "Background Type",
        bgGradient: "Vibrant Gradient",
        bgImage: "Sample Photography",
        bgSolid: "Solid Color",

        // Coordinates & Points
        pointsListTitle: "Point Coordinates (%)",
        xCoord: "X (%)",
        yCoord: "Y (%)",
        deletePoint: "Delete Point",

        // Code Output
        codeTitle: "Generated Clip-Path Code",
        tabCss: "CSS (clip-path)",
        tabTailwind: "Tailwind CSS",
        tabSvg: "SVG <clipPath>",
        copyCode: "Copy Code",
        copied: "Code copied to clipboard!",

        // Guide
        guideTitle: "Mastering CSS Clip-Path for Modern Web Design",
        guide1Title: "What is CSS clip-path?",
        guide1Desc: "The CSS clip-path property creates a clipping region that sets what part of an element should be shown. Parts inside the region are visible, while parts outside are hidden.",
        guide2Title: "Polygon Syntax & Percentages",
        guide2Desc: "Polygon coordinates are written in pairs of X Y percentages: `polygon(x1 y1, x2 y2, ...)`. Using percentage units ensures the shape scales seamlessly across responsive viewports.",
        guide3Title: "Performance & GPU Acceleration",
        guide3Desc: "Because clipping is calculated by the GPU compositor, animating clip-paths creates silky-smooth 60fps morphing effects without triggering costly layout reflows.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "Can I use clip-path on images and videos?",
        faq1A: "Yes! Clip-path works on any HTML element, including <img>, <video>, <div> containers, buttons, and hero banners.",
        faq2Q: "Is CSS clip-path supported by all modern browsers?",
        faq2A: "Yes, modern Chromium (Chrome, Edge, Brave), Firefox, and Safari support standard `clip-path: polygon()` and `clip-path: circle()`. For older Safari versions, `-webkit-clip-path` is also included.",
        faq3Q: "How do I animate or morph between two shapes?",
        faq3A: "To animate between shapes using CSS transitions or keyframes, both shapes must have the exact same number of vertices (points).",
    },
    vi: {
        name: "Bộ Tạo Hình & Cắt Khối CSS Clip-Path",
        description: "Tạo các hình khối đa giác polygon tùy chỉnh và đường cắt CSS clip-path với khung kéo thả điểm đỉnh trực quan, kho hình khối phong phú và xuất mã Tailwind / SVG nhanh chóng.",
        category: "Thiết Kế & CSS",

        // Presets
        presetsTitle: "Kho Mẫu Hình Khối Đa Giác",
        triangle: "Tam Giác",
        trapezoid: "Hình Thang",
        parallelogram: "Hình Bình Hành",
        rhombus: "Hình Thoi (Kim Cương)",
        pentagon: "Ngũ Giác",
        hexagon: "Lục Giác",
        octagon: "Bát Giác",
        star: "Ngôi Sao 5 Cánh",
        cross: "Dấu Cộng (Chữ Thập)",
        arrowRight: "Mũi Tên (Phải)",
        chevron: "Mũi Nhọn Chevron",
        speechBubble: "Bong Bóng Thoại",
        badge: "Huy Hiệu Ruy Băng",

        // Canvas & Editor
        canvasTitle: "Khung Chỉnh Sửa Điểm Đỉnh Trực Quan",
        canvasHint: "Kéo thả các điểm tròn để định hình. Nhấp vào cạnh để chèn thêm điểm mới.",
        addPoint: "Thêm Điểm Mới",
        resetPoints: "Đặt Lại Ban Đầu",
        snapToGrid: "Hút Vào Lưới 5%",
        bgPreview: "Nền Hiển Thị Khối",
        bgGradient: "Gradient Rực Rỡ",
        bgImage: "Ảnh Mẫu Thực Tế",
        bgSolid: "Màu Đơn Sắc",

        // Coordinates & Points
        pointsListTitle: "Bảng Tọa Độ Từng Điểm (%)",
        xCoord: "Tọa độ X (%)",
        yCoord: "Tọa độ Y (%)",
        deletePoint: "Xóa điểm này",

        // Code Output
        codeTitle: "Mã Cắt Khối Clip-Path",
        tabCss: "CSS Thuần (clip-path)",
        tabTailwind: "Lớp Tailwind CSS",
        tabSvg: "Thẻ SVG <clipPath>",
        copyCode: "Sao Chép Mã",
        copied: "Đã sao chép mã vào bộ nhớ tạm!",

        // Guide
        guideTitle: "Kỹ Thuật Cắt Khối CSS Clip-Path Trong Thiết Kế Web",
        guide1Title: "CSS clip-path Hoạt Động Như Thế Nào?",
        guide1Desc: "Thuộc tính clip-path định nghĩa một vùng mặt nạ hình học. Toàn bộ phần tử nằm bên trong vùng này sẽ hiển thị, còn phần nằm ngoài sẽ bị ẩn đi mà không làm biến dạng cấu trúc DOM.",
        guide2Title: "Cú Pháp Polygon Và Tọa Độ Phần Trăm",
        guide2Desc: "Tọa độ polygon được khai báo theo từng cặp X Y dạng phần trăm: `polygon(x1 y1, x2 y2, ...)`. Đơn vị % giúp khối hình co giãn tự nhiên theo giao diện responsive.",
        guide3Title: "Tối Ưu Hiệu Năng & Animation",
        guide3Desc: "Clip-path được xử lý trực tiếp bởi GPU (Compositor thread), giúp hiệu ứng chuyển hình (morphing) đạt 60fps mượt mà mà không gây giật lag trình duyệt.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Tôi có thể áp dụng clip-path cho hình ảnh và video không?",
        faq1A: "Hoàn toàn được! Bạn có thể áp dụng cho thẻ <img>, <video>, thẻ <div>, nút bấm, banner trang chủ hoặc avatar người dùng.",
        faq2Q: "Các trình duyệt hiện đại có hỗ trợ tốt không?",
        faq2A: "Có, 100% các trình duyệt hiện nay (Chrome, Safari, Edge, Firefox) đều hỗ trợ chuẩn `clip-path: polygon()`. Bộ tạo mã cũng bổ sung sẵn `-webkit-clip-path` để tương thích tối đa.",
        faq3Q: "Làm sao để làm hiệu ứng biến hình (shape morphing)?",
        faq3A: "Để tạo animation mượt từ hình A sang hình B, cả 2 hình bắt buộc phải có số lượng điểm đỉnh (vertices) bằng nhau.",
    },
};
