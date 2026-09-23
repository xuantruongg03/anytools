export const glassmorphismGeneratorTranslations = {
    en: {
        name: "Glassmorphism & Neumorphism Generator",
        description: "Design modern frosted glass UI elements with real-time preview. Copy pure CSS, Tailwind CSS v4 classes, or React inline styles.",
        category: "Design",

        // Controls
        blur: "Background Blur",
        opacity: "Glass Opacity",
        saturation: "Color Saturation",
        borderRadius: "Border Radius",
        borderWidth: "Border Width",
        borderOpacity: "Border Highlight Opacity",
        shadow: "Shadow Depth",
        glassColor: "Glass Base Color",
        colorWhite: "White (Bright Frosted)",
        colorBlack: "Black (Smoked Dark Glass)",
        colorCustom: "Custom Color",

        // Backgrounds
        previewBg: "Preview Background",
        bgMesh: "Vibrant Mesh",
        bgSunset: "Sunset Glow",
        bgCyber: "Cyberpunk Neon",
        bgDark: "Dark Minimal",

        // Code Output
        copyCss: "Copy CSS",
        copyTailwind: "Copy Tailwind CSS",
        copyReact: "Copy React Style",
        copied: "Copied to clipboard!",

        // Presets
        presets: "Style Presets",
        presetFrosted: "Frosted Glass",
        presetSmoked: "Smoked Dark",
        presetGlossy: "Glossy Crystal",
        presetNeon: "Neon Tint",

        // Guide
        guideTitle: "The Art of Glassmorphism Design",
        guide1Title: "What is Glassmorphism?",
        guide1Desc: "A modern UI design trend characterized by translucent frosted-glass surfaces, multi-layered depth, subtle light outlines, and vibrant background illumination.",
        guide2Title: "Key CSS Property: backdrop-filter",
        guide2Desc: "The core effect relies on CSS backdrop-filter: blur(). Unlike standard opacity, it blurs whatever content or imagery sits directly behind the element.",
        guide3Title: "The Crucial 1px Light Border",
        guide3Desc: "A semi-transparent 1px white border simulates specular light refraction along the physical glass edge, making the surface pop from the background.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "Do all modern browsers support backdrop-filter?",
        faq1A: "Yes! Modern Chrome, Safari, Edge, and Firefox support backdrop-filter. For Safari compatibility, the generator automatically includes -webkit-backdrop-filter.",
        faq2Q: "How do I use this with Tailwind CSS?",
        faq2A: "Simply switch to the Tailwind CSS tab and copy the classes like bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl.",
        faq3Q: "Can I use Glassmorphism inside mobile apps?",
        faq3A: "Yes, you can apply these styles in React Native (with BlurView), Flutter, or web views.",
    },
    vi: {
        name: "Tạo Hiệu Ứng Kính Mờ (Glassmorphism CSS)",
        description: "Thiết kế giao diện kính mờ frosted-glass hiện đại với bộ tùy biến trực quan. Xuất mã CSS thuần, class Tailwind CSS và React JSX tức thì.",
        category: "Thiết kế",

        // Controls
        blur: "Độ mờ hậu cảnh (Blur)",
        opacity: "Độ trong suốt (Opacity)",
        saturation: "Độ bão hòa màu",
        borderRadius: "Bo tròn góc (Radius)",
        borderWidth: "Độ dày viền",
        borderOpacity: "Độ sáng viền phản xạ",
        shadow: "Độ sâu bóng đổ (Shadow)",
        glassColor: "Tông màu kính",
        colorWhite: "Kính trắng trong (Frosted)",
        colorBlack: "Kính đen khói (Smoked Dark)",
        colorCustom: "Màu tùy chọn",

        // Backgrounds
        previewBg: "Hình nền xem trước",
        bgMesh: "Gradient Mesh",
        bgSunset: "Hoàng hôn Sunset",
        bgCyber: "Cyberpunk Neon",
        bgDark: "Tối giản Dark",

        // Code Output
        copyCss: "Sao chép CSS",
        copyTailwind: "Sao chép Tailwind CSS",
        copyReact: "Sao chép React Style",
        copied: "Đã sao chép vào bộ nhớ tạm!",

        // Presets
        presets: "Mẫu kính có sẵn",
        presetFrosted: "Kính sương mờ",
        presetSmoked: "Kính khói đen",
        presetGlossy: "Pha lê trong suốt",
        presetNeon: "Phản quang Neon",

        // Guide
        guideTitle: "Bí Quyết Thiết Kế Giao Diện Kính Mờ Đỉnh Cao",
        guide1Title: "Hiệu ứng Glassmorphism là gì?",
        guide1Desc: "Là xu hướng thiết kế giao diện mô phỏng bề mặt kính mờ, tạo cảm giác phân lớp không gian sâu, viền phản quang tinh tế và hiệu ứng làm mờ nền rực rỡ.",
        guide2Title: "Thuộc tính cốt lõi backdrop-filter",
        guide2Desc: "Khác với độ mờ thông thường (opacity), backdrop-filter: blur() chỉ làm nhòe những vật thể và ảnh nền nằm ngay bên dưới lớp kính, giữ nội dung bên trên luôn sắc nét.",
        guide3Title: "Viền sáng 1px phản chiếu ánh sáng",
        guide3Desc: "Đường viền 1px mờ nhẹ (border: 1px solid rgba(255,255,255,0.2)) đóng vai trò như mép kính khúc xạ ánh sáng, giúp tấm kính tách biệt tuyệt đối khỏi nền.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Trình duyệt nào hỗ trợ backdrop-filter?",
        faq1A: "Hầu hết các trình duyệt hiện đại như Chrome, Safari, Edge, Firefox đều hỗ trợ hoàn hảo. Trình tạo đã tự động kèm tiền tố -webkit-backdrop-filter cho Safari/iOS.",
        faq2Q: "Làm sao áp dụng mã này vào Tailwind CSS?",
        faq2A: "Bạn chỉ cần chọn tab Tailwind CSS và dán trực tiếp chuỗi class như bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl vào thẻ div của bạn.",
        faq3Q: "Dùng kính mờ có làm chậm trang web không?",
        faq3A: "Trình duyệt hiện đại xử lý backdrop-filter bằng card đồ họa GPU nên hiệu năng rất mượt mà. Tuy nhiên, tránh lồng quá nhiều lớp kính đè lên nhau.",
    },
};
