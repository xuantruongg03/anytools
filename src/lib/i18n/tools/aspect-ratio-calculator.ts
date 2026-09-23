export const aspectRatioTranslations = {
    en: {
        name: "Aspect Ratio & Screen PPI Calculator",
        description: "Calculate, simplify, and resize aspect ratios for videos, photos, and displays. Includes a screen PPI (Pixels Per Inch) density and dot pitch calculator.",
        category: "Multimedia",

        // Tabs
        tabRatio: "Aspect Ratio Calculator",
        tabPpi: "Screen PPI & Density Calculator",

        // Aspect Ratio
        originalDimensions: "Original Dimensions",
        width: "Width (px)",
        height: "Height (px)",
        simplifiedRatio: "Simplified Ratio",
        decimalRatio: "Decimal Ratio",
        commonPresets: "Popular Standard Presets",
        ratio16_9: "16:9 (YouTube & FHD TV)",
        ratio4_3: "4:3 (Standard Video / iPad)",
        ratio1_1: "1:1 (Square / Instagram)",
        ratio9_16: "9:16 (TikTok / Reels / Shorts)",
        ratio21_9: "21:9 (Ultrawide Cinema)",
        ratio3_2: "3:2 (DSLR Photography)",

        // Resize calculator
        resizeSolverTitle: "Calculate New Proportional Dimensions",
        lockRatio: "Maintain Aspect Ratio",
        newWidth: "New Width (px)",
        newHeight: "New Height (px)",
        visualPreview: "Proportional Visual Preview",

        // PPI Calculator
        screenResolution: "Display Pixel Resolution",
        horizontalPixels: "Horizontal Pixels (px)",
        verticalPixels: "Vertical Pixels (px)",
        diagonalInches: "Screen Diagonal Size (inches)",
        ppiResult: "Pixel Density (PPI)",
        totalPixels: "Total Pixels",
        dotPitch: "Dot Pitch (Pixel Size)",
        displayCategory: "Display Sharpness Rating",
        retinaClass: "Ultra-Sharp / Retina Class (200+ PPI)",
        desktopClass: "Standard Desktop Monitor (90 - 140 PPI)",
        tvClass: "Living Room TV / Large Display (< 90 PPI)",

        // Guide
        guideTitle: "Display Ratios & Pixel Densities Explained",
        guide1Title: "What is an Aspect Ratio?",
        guide1Desc: "An aspect ratio is the proportional relationship between an image's width and height. Standard 16:9 is universal for high-definition streaming, while 9:16 dominates mobile short-form video.",
        guide2Title: "Why does PPI (Pixels Per Inch) Matter?",
        guide2Desc: "PPI measures how tightly packed pixels are on a screen. Higher PPI produces sharper text and crisper images at close viewing distances, eliminating visible pixelation.",
        guide3Title: "Responsive Scaling & Resizing",
        guide3Desc: "When designing responsive websites or cropping banners, locking aspect ratios prevents awkward stretching, squishing, and letterboxing artifacts.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "How do you calculate the aspect ratio from dimensions?",
        faq1A: "Find the Greatest Common Divisor (GCD) of the width and height, then divide both numbers by the GCD. For example, 1920/120 = 16 and 1080/120 = 9, yielding 16:9.",
        faq2Q: "What PPI is considered 'Retina' quality?",
        faq2A: "For typical viewing distances: phones around 300+ PPI, tablets 260+ PPI, laptops 220+ PPI, and desktop monitors 160-220 PPI (e.g. Apple Studio Display 218 PPI).",
        faq3Q: "Can I use this for print and photo resolutions?",
        faq3A: "Yes! 3:2 is the classic 35mm film and DSLR sensor ratio (e.g., 4x6 inch prints), while 4:3 is popular for Micro Four Thirds cameras and tablets.",
    },
    vi: {
        name: "Tính Tỉ Lệ Khung Hình & Mật Độ Điểm Ảnh (Aspect Ratio & PPI)",
        description: "Tính tỉ lệ màn hình, quy đổi kích thước ảnh/video chuẩn không bị méo và tính mật độ điểm ảnh PPI (Pixels Per Inch) cho màn hình máy tính, điện thoại.",
        category: "Đa phương tiện",

        // Tabs
        tabRatio: "Tính tỉ lệ khung hình (Aspect Ratio)",
        tabPpi: "Tính mật độ điểm ảnh PPI & Độ nét",

        // Aspect Ratio
        originalDimensions: "Kích thước gốc ban đầu",
        width: "Chiều rộng (Width px)",
        height: "Chiều cao (Height px)",
        simplifiedRatio: "Tỉ lệ rút gọn chuẩn",
        decimalRatio: "Tỉ lệ thập phân",
        commonPresets: "Tỉ lệ tiêu chuẩn phổ biến",
        ratio16_9: "16:9 (YouTube & Màn hình FHD/4K)",
        ratio4_3: "4:3 (Tivi truyền thống / iPad)",
        ratio1_1: "1:1 (Hình vuông / Instagram)",
        ratio9_16: "9:16 (TikTok / Reels / Shorts)",
        ratio21_9: "21:9 (Màn hình cong Ultrawide)",
        ratio3_2: "3:2 (Ảnh máy cơ DSLR / Surface)",

        // Resize calculator
        resizeSolverTitle: "Quy đổi kích thước mới (Giữ nguyên tỉ lệ)",
        lockRatio: "Khóa tỉ lệ khung hình",
        newWidth: "Chiều rộng mới (px)",
        newHeight: "Chiều cao mới (px)",
        visualPreview: "Mô phỏng hình học trực quan",

        // PPI Calculator
        screenResolution: "Độ phân giải màn hình",
        horizontalPixels: "Điểm ảnh ngang (px)",
        verticalPixels: "Điểm ảnh dọc (px)",
        diagonalInches: "Kích thước đường chéo (Inch)",
        ppiResult: "Mật độ điểm ảnh (PPI)",
        totalPixels: "Tổng số điểm ảnh",
        dotPitch: "Khoảng cách điểm ảnh (Dot Pitch)",
        displayCategory: "Đánh giá độ sắc nét màn hình",
        retinaClass: "Siêu nét chuẩn Retina (> 200 PPI)",
        desktopClass: "Màn hình vi tính tiêu chuẩn (90 - 140 PPI)",
        tvClass: "Màn hình TV phòng khách (< 90 PPI)",

        // Guide
        guideTitle: "Cẩm Nang Tỉ Lệ Màn Hình & Độ Nét PPI",
        guide1Title: "Tỉ lệ khung hình (Aspect Ratio) là gì?",
        guide1Desc: "Là tỉ số tương quan giữa chiều ngang và chiều cao của khung hình. Tỉ lệ 16:9 là chuẩn quốc tế cho phim và YouTube, còn 9:16 là chuẩn video dọc trên TikTok và Instagram Reels.",
        guide2Title: "Tại sao chỉ số PPI lại quan trọng?",
        guide2Desc: "PPI đo lường độ đậm đặc của pixel trên mỗi inch màn hình. Màn hình có chỉ số PPI càng cao thì chữ viết càng mịn, không bị vỡ hạt hay răng cưa khi nhìn gần.",
        guide3Title: "Quy đổi tỉ lệ không lo bị méo hình",
        guide3Desc: "Khi thiết kế banner, resize ảnh cho website hoặc dựng video, việc khóa tỉ lệ giúp ảnh không bị kéo giãn hay dẹp méo ngoài ý muốn.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Cách tính tỉ lệ khung hình từ kích thước pixel?",
        faq1A: "Tìm ước chung lớn nhất (UCLN - GCD) của chiều rộng và chiều cao rồi chia cả hai số cho UCLN. Ví dụ: 1920 và 1080 có UCLN là 120, chia ra được tỉ lệ 16:9.",
        faq2Q: "Màn hình bao nhiêu PPI thì được gọi là Retina?",
        faq2A: "Với khoảng cách ngồi làm việc thông thường, màn hình laptop hoặc desktop đạt từ 200 PPI trở lên (như màn hình Retina MacBook hay iMac 4.5K) cho độ nét cực cao không thấy điểm ảnh bằng mắt thường.",
        faq3Q: "Màn hình 2K 27 inch có đạt chuẩn nét không?",
        faq3A: "Màn hình 27 inch độ phân giải 2560x1440 (2K) đạt khoảng 108.8 PPI, là mức tiêu chuẩn rất thoải mái cho làm việc văn phòng và chơi game phổ thông.",
    },
};
