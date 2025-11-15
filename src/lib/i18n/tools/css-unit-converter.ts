export const cssUnitConverterTranslations = {
    en: {
        cssUnitConverter: {
            ui: {
                pixelLabel: "Pixel Value (px)",
                pixelPlaceholder: "Enter pixel value",
                baseLabel: "Base Font Size (px)",
                basePlaceholder: "Default: 16px",
                remLabel: "REM",
                emLabel: "EM",
                ptLabel: "PT (Points)",
                percentLabel: "Percent",
                vwLabel: "VW (Viewport Width)",
                vhLabel: "VH (Viewport Height)",
                convertButton: "Convert Units",
                copyButton: "Copy",
                copiedButton: "Copied!",
                quickReference: "Quick Reference",
                commonValues: "Common Values",
            },
            page: {
                title: "CSS Unit Converter",
                subtitle: "Convert between px, rem, em, pt, %, and viewport units instantly",

                whatIs: "What is CSS Unit Converter?",
                whatIsDesc:
                    "A CSS Unit Converter is a tool that helps web developers and designers convert between different CSS length units such as pixels (px), relative units (rem, em), points (pt), percentages (%), and viewport units (vw, vh). Understanding and using the right units is crucial for creating responsive, accessible, and maintainable websites. This tool makes it easy to convert between these units accurately, helping you make informed decisions about which units to use in your CSS code.",

                whyImportant: "Why Unit Conversion Matters",
                whyImportantDesc:
                    "Using the right CSS units can make or break your website's responsiveness and accessibility. Pixels (px) are absolute units that don't scale with user preferences, while relative units like rem and em scale based on font sizes, making them ideal for responsive design. Understanding the conversion between these units helps you build websites that work across all devices and respect user accessibility settings. For example, using rem units allows users with visual impairments to increase text size in their browser settings, improving accessibility.",

                units: "CSS Units Explained",
                pixelUnit: "Pixel (px): Absolute unit representing a single pixel on the screen. Fixed size regardless of parent or root font size. Best for borders, small gaps, and precise layouts.",
                remUnit: "REM (Root EM): Relative to the root element's font size (usually <html>). 1rem = root font size (typically 16px). Best for font sizes, spacing, and responsive layouts. Respects user browser settings.",
                emUnit: "EM: Relative to the parent element's font size. Can compound when nested. 1em = parent's font size. Best for components that should scale with their context.",
                ptUnit: "Point (pt): Absolute unit traditionally used in print (1pt = 1/72 inch). 1px ≈ 0.75pt. Mainly used for print stylesheets, not recommended for screen.",
                percentUnit: "Percent (%): Relative to the parent element's dimension. 100% = parent's full size. Best for widths, heights, and flexible layouts.",
                vwUnit: "Viewport Width (vw): Relative to viewport width. 1vw = 1% of viewport width. Best for full-width sections and responsive typography.",
                vhUnit: "Viewport Height (vh): Relative to viewport height. 1vh = 1% of viewport height. Best for full-height sections and hero banners.",

                conversions: "Conversion Formulas",
                pxToRem: "px to rem: rem = px / base font size (usually 16)",
                pxToEm: "px to em: em = px / parent font size",
                pxToPt: "px to pt: pt = px × 0.75",
                pxToPercent: "px to %: % = (px / parent size) × 100",
                remToPx: "rem to px: px = rem × base font size",
                emToPx: "em to px: px = em × parent font size",

                bestPractices: "Best Practices",
                practice1: "Use rem for font sizes: Respects user browser settings and improves accessibility. Easier to maintain consistent sizing.",
                practice2: "Use em for component-based spacing: Scales naturally with component font size. Great for buttons, cards, and modular components.",
                practice3: "Use px for borders and shadows: Precise control for decorative elements. Borders look consistent across all screen sizes.",
                practice4: "Use % for responsive widths: Fluid layouts that adapt to container size. Essential for responsive grid systems.",
                practice5: "Use vw/vh for viewport-based sizing: Full-screen sections and responsive typography. Creates immersive experiences.",
                practice6: "Avoid px for font sizes: Doesn't respect user preferences. Can cause accessibility issues for users who need larger text.",
                practice7: "Set root font size in %: Allows users to adjust text size. Common practice: html { font-size: 100% } or 62.5% for easier math.",
                practice8: "Test with different base sizes: Ensure your layout works when users change browser font size. Accessibility requirement.",

                commonSizes: "Common Font Sizes",
                size12: "12px = 0.75rem - Small text, captions",
                size14: "14px = 0.875rem - Secondary text",
                size16: "16px = 1rem - Base body text (default)",
                size18: "18px = 1.125rem - Large body text",
                size20: "20px = 1.25rem - Subheadings",
                size24: "24px = 1.5rem - Headings (h3)",
                size32: "32px = 2rem - Headings (h2)",
                size48: "48px = 3rem - Large headings (h1)",

                accessibility: "Accessibility Considerations",
                accessibilityDesc:
                    "Using relative units (rem, em) instead of pixels is crucial for web accessibility. Users with visual impairments often increase their browser's default font size to make text more readable. When you use rem units, your text automatically scales with the user's preferences. If you use pixels, the text size remains fixed regardless of user settings, creating accessibility barriers. The Web Content Accessibility Guidelines (WCAG) recommend using relative units for this reason. A website built with rem units can scale from 200% to 400% while maintaining its layout, essential for WCAG AA and AAA compliance.",

                responsive: "Responsive Design Tips",
                responsive1: "Use rem for breakpoints: Makes your media queries respect user font size preferences. Example: @media (min-width: 48rem) instead of (min-width: 768px).",
                responsive2: "Combine vw with rem: Fluid typography that scales with viewport but has minimum/maximum sizes using clamp(). Example: font-size: clamp(1rem, 2vw, 2rem).",
                responsive3: "Use em for component spacing: Padding and margins that scale with the component's font size. Makes components truly modular.",
                responsive4: "Avoid mixing unit types unnecessarily: Stick to a system (mostly rem) for consistency. Makes maintenance easier.",

                browserSupport: "Browser Support",
                browserSupportDesc: "All modern CSS units (px, rem, em, %, vw, vh) are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and mobile browsers. REM units have been supported since IE9+. Viewport units (vw, vh) are supported in all browsers since 2013. There are no compatibility concerns when using these units in modern web development. For legacy browser support (IE8 and below), you can provide pixel fallbacks before rem values.",

                tools: "Related Tools & Resources",
                tool1: "Browser DevTools: Inspect computed styles to see actual pixel values. Most browsers show both the declared value and computed value.",
                tool2: "CSS Variables: Combine with rem for a flexible design system. Example: --spacing-unit: 1rem; margin: calc(var(--spacing-unit) * 2);",
                tool3: "Sass/Less: Use variables and functions for unit conversions. Automate rem conversions with mixins.",
                tool4: "PostCSS: Automatically convert px to rem in your build process. Plugins like postcss-pxtorem handle this automatically.",

                examples: "Practical Examples",
                example1: "Setting base font size: html { font-size: 100%; } /* Respects user settings */ body { font-size: 1rem; } /* 16px by default */",
                example2: "Button with em spacing: .button { padding: 0.5em 1em; } /* Scales with button font size */",
                example3: "Full-height hero section: .hero { height: 100vh; min-height: 500px; } /* Responsive with minimum */",
                example4: "Fluid typography: h1 { font-size: clamp(2rem, 5vw, 4rem); } /* Responsive between 2rem and 4rem */",

                faq: "Frequently Asked Questions",
                q1: "Should I use rem or em?",
                a1: "Use rem for font sizes and spacing that should scale with the root font size. Use em for spacing that should scale with the component's font size (like button padding). Rem is generally easier to maintain because it always references the root, while em can compound when elements are nested.",

                q2: "What's the default base font size?",
                a2: "Most browsers use 16px as the default font size for the <html> element. However, users can change this in their browser settings. This is why using rem is important - it respects the user's preference. Always assume 16px for calculations, but remember it can vary.",

                q3: "Can I mix px and rem in my CSS?",
                a3: "Yes, but be strategic about it. Use rem for typography and spacing to maintain scalability. Use px for things like borders (border: 1px solid), box-shadows, and very small gaps where you need pixel-perfect control. The key is consistency - document your unit usage conventions.",

                q4: "How do I convert my existing px-based site to rem?",
                a4: "Start by setting html { font-size: 100%; } or 62.5% (for easier math). Then systematically convert font-sizes and spacing to rem. You can use build tools like PostCSS with postcss-pxtorem to automate this. Test thoroughly at different zoom levels. Consider converting progressively, starting with typography.",

                q5: "What about vh units for mobile?",
                a5: "Viewport units on mobile can be tricky because the viewport height changes when the address bar shows/hides. Use min-height with vh for better results, or consider using dvh (dynamic viewport height) in modern browsers. Always test on actual mobile devices, not just browser dev tools.",

                q6: "Why is my em spacing doubling?",
                a6: "Em units compound - they're relative to the parent font size. If a parent has font-size: 2em and a child has padding: 1em, that padding is actually 2em relative to the root. This is why rem is often preferred for spacing - it doesn't compound and always references the root.",

                q7: "Should I use rem for media queries?",
                a7: "Yes! Using rem in media queries (e.g., @media (min-width: 48rem)) means your breakpoints respect user font size settings. This improves accessibility and creates a better responsive experience. A user who increases their font size will trigger breakpoints earlier, preventing text overflow.",

                q8: "What's the difference between vw and %?",
                a8: "vw is relative to the viewport width (1vw = 1% of viewport width), while % is relative to the parent element's width. Use vw for viewport-based sizing (like full-width sections), and % for parent-relative sizing (like a 50% wide column inside a container). vw is always relative to the viewport, regardless of parent.",
            },
        },
    },
    vi: {
        cssUnitConverter: {
            ui: {
                pixelLabel: "Giá Trị Pixel (px)",
                pixelPlaceholder: "Nhập giá trị pixel",
                baseLabel: "Cỡ Chữ Gốc (px)",
                basePlaceholder: "Mặc định: 16px",
                remLabel: "REM",
                emLabel: "EM",
                ptLabel: "PT (Điểm)",
                percentLabel: "Phần Trăm",
                vwLabel: "VW (Độ Rộng Viewport)",
                vhLabel: "VH (Độ Cao Viewport)",
                convertButton: "Chuyển Đổi",
                copyButton: "Sao Chép",
                copiedButton: "Đã Sao Chép!",
                quickReference: "Tham Khảo Nhanh",
                commonValues: "Giá Trị Phổ Biến",
            },
            page: {
                title: "Chuyển Đổi Đơn Vị CSS",
                subtitle: "Chuyển đổi giữa px, rem, em, pt, % và đơn vị viewport ngay lập tức",

                whatIs: "Công Cụ Chuyển Đổi Đơn Vị CSS Là Gì?",
                whatIsDesc: "Công cụ chuyển đổi đơn vị CSS giúp web developers và designers chuyển đổi giữa các đơn vị độ dài CSS khác nhau như pixels (px), đơn vị tương đối (rem, em), points (pt), phần trăm (%), và đơn vị viewport (vw, vh). Hiểu và sử dụng đúng đơn vị là rất quan trọng để tạo ra websites responsive, accessible và dễ maintain. Công cụ này giúp bạn chuyển đổi chính xác giữa các đơn vị, hỗ trợ quyết định đơn vị nào nên dùng trong CSS code của bạn.",

                whyImportant: "Tại Sao Chuyển Đổi Đơn Vị Quan Trọng",
                whyImportantDesc:
                    "Sử dụng đúng đơn vị CSS có thể quyết định responsive và accessibility của website. Pixels (px) là đơn vị tuyệt đối không scale theo tùy chọn người dùng, trong khi đơn vị tương đối như rem và em scale dựa trên font size, lý tưởng cho responsive design. Hiểu chuyển đổi giữa các đơn vị giúp bạn xây dựng websites hoạt động tốt trên mọi thiết bị và tôn trọng cài đặt accessibility của người dùng. Ví dụ, dùng rem units cho phép người khiếm thị tăng cỡ chữ trong trình duyệt, cải thiện accessibility.",

                units: "Giải Thích Đơn Vị CSS",
                pixelUnit: "Pixel (px): Đơn vị tuyệt đối đại diện cho một pixel trên màn hình. Kích thước cố định bất kể font size của parent hoặc root. Tốt nhất cho borders, khoảng cách nhỏ và layouts chính xác.",
                remUnit: "REM (Root EM): Tương đối với font size của root element (thường là <html>). 1rem = root font size (thường 16px). Tốt nhất cho font sizes, spacing và responsive layouts. Tôn trọng cài đặt trình duyệt người dùng.",
                emUnit: "EM: Tương đối với font size của parent element. Có thể nhân lên khi lồng nhau. 1em = font size của parent. Tốt nhất cho components cần scale theo context.",
                ptUnit: "Point (pt): Đơn vị tuyệt đối truyền thống dùng cho in ấn (1pt = 1/72 inch). 1px ≈ 0.75pt. Chủ yếu dùng cho print stylesheets, không khuyến nghị cho màn hình.",
                percentUnit: "Phần Trăm (%): Tương đối với kích thước của parent element. 100% = kích thước đầy đủ của parent. Tốt nhất cho widths, heights và flexible layouts.",
                vwUnit: "Viewport Width (vw): Tương đối với độ rộng viewport. 1vw = 1% độ rộng viewport. Tốt nhất cho sections toàn màn hình và responsive typography.",
                vhUnit: "Viewport Height (vh): Tương đối với độ cao viewport. 1vh = 1% độ cao viewport. Tốt nhất cho sections toàn chiều cao và hero banners.",

                conversions: "Công Thức Chuyển Đổi",
                pxToRem: "px sang rem: rem = px / cỡ chữ gốc (thường 16)",
                pxToEm: "px sang em: em = px / cỡ chữ parent",
                pxToPt: "px sang pt: pt = px × 0.75",
                pxToPercent: "px sang %: % = (px / kích thước parent) × 100",
                remToPx: "rem sang px: px = rem × cỡ chữ gốc",
                emToPx: "em sang px: px = em × cỡ chữ parent",

                bestPractices: "Thực Hành Tốt Nhất",
                practice1: "Dùng rem cho font sizes: Tôn trọng cài đặt trình duyệt và cải thiện accessibility. Dễ dàng maintain sizing nhất quán.",
                practice2: "Dùng em cho spacing theo component: Scale tự nhiên với component font size. Tuyệt vời cho buttons, cards và modular components.",
                practice3: "Dùng px cho borders và shadows: Kiểm soát chính xác cho decorative elements. Borders nhìn nhất quán trên mọi kích thước màn hình.",
                practice4: "Dùng % cho responsive widths: Fluid layouts thích ứng với kích thước container. Thiết yếu cho responsive grid systems.",
                practice5: "Dùng vw/vh cho viewport-based sizing: Sections toàn màn hình và responsive typography. Tạo trải nghiệm immersive.",
                practice6: "Tránh px cho font sizes: Không tôn trọng tùy chọn người dùng. Có thể gây vấn đề accessibility cho người cần chữ lớn hơn.",
                practice7: "Đặt root font size bằng %: Cho phép người dùng điều chỉnh cỡ chữ. Thực hành phổ biến: html { font-size: 100% } hoặc 62.5% để tính toán dễ hơn.",
                practice8: "Test với base sizes khác nhau: Đảm bảo layout hoạt động khi người dùng thay đổi cỡ chữ trình duyệt. Yêu cầu accessibility.",

                commonSizes: "Cỡ Chữ Phổ Biến",
                size12: "12px = 0.75rem - Chữ nhỏ, captions",
                size14: "14px = 0.875rem - Chữ phụ",
                size16: "16px = 1rem - Chữ body cơ bản (mặc định)",
                size18: "18px = 1.125rem - Chữ body lớn",
                size20: "20px = 1.25rem - Subheadings",
                size24: "24px = 1.5rem - Headings (h3)",
                size32: "32px = 2rem - Headings (h2)",
                size48: "48px = 3rem - Large headings (h1)",

                accessibility: "Cân Nhắc Accessibility",
                accessibilityDesc:
                    "Sử dụng đơn vị tương đối (rem, em) thay vì pixels rất quan trọng cho web accessibility. Người khiếm thị thường tăng cỡ chữ mặc định của trình duyệt để chữ dễ đọc hơn. Khi bạn dùng rem units, chữ tự động scale theo tùy chọn người dùng. Nếu dùng pixels, cỡ chữ cố định bất kể cài đặt người dùng, tạo rào cản accessibility. Web Content Accessibility Guidelines (WCAG) khuyến nghị dùng đơn vị tương đối vì lý do này. Website xây bằng rem units có thể scale từ 200% đến 400% vẫn giữ nguyên layout, thiết yếu cho WCAG AA và AAA compliance.",

                responsive: "Mẹo Responsive Design",
                responsive1: "Dùng rem cho breakpoints: Media queries tôn trọng tùy chọn font size người dùng. Ví dụ: @media (min-width: 48rem) thay vì (min-width: 768px).",
                responsive2: "Kết hợp vw với rem: Fluid typography scale với viewport nhưng có min/max sizes dùng clamp(). Ví dụ: font-size: clamp(1rem, 2vw, 2rem).",
                responsive3: "Dùng em cho component spacing: Padding và margins scale với component font size. Làm components thực sự modular.",
                responsive4: "Tránh mix unit types không cần thiết: Stick với một hệ thống (chủ yếu rem) cho consistency. Dễ maintain hơn.",

                browserSupport: "Hỗ Trợ Trình Duyệt",
                browserSupportDesc: "Tất cả đơn vị CSS hiện đại (px, rem, em, %, vw, vh) được hỗ trợ trong mọi trình duyệt hiện đại bao gồm Chrome, Firefox, Safari, Edge và mobile browsers. REM units đã được hỗ trợ từ IE9+. Viewport units (vw, vh) được hỗ trợ trong mọi trình duyệt từ 2013. Không có vấn đề tương thích khi dùng các đơn vị này trong web development hiện đại. Cho legacy browser support (IE8 trở xuống), bạn có thể cung cấp pixel fallbacks trước rem values.",

                tools: "Công Cụ & Tài Nguyên Liên Quan",
                tool1: "Browser DevTools: Inspect computed styles để xem giá trị pixel thực tế. Hầu hết browsers hiển thị cả declared value và computed value.",
                tool2: "CSS Variables: Kết hợp với rem cho flexible design system. Ví dụ: --spacing-unit: 1rem; margin: calc(var(--spacing-unit) * 2);",
                tool3: "Sass/Less: Dùng variables và functions cho unit conversions. Tự động hóa rem conversions với mixins.",
                tool4: "PostCSS: Tự động convert px sang rem trong build process. Plugins như postcss-pxtorem xử lý tự động.",

                examples: "Ví Dụ Thực Tế",
                example1: "Đặt base font size: html { font-size: 100%; } /* Tôn trọng cài đặt người dùng */ body { font-size: 1rem; } /* 16px mặc định */",
                example2: "Button với em spacing: .button { padding: 0.5em 1em; } /* Scale với button font size */",
                example3: "Hero section toàn chiều cao: .hero { height: 100vh; min-height: 500px; } /* Responsive với minimum */",
                example4: "Fluid typography: h1 { font-size: clamp(2rem, 5vw, 4rem); } /* Responsive giữa 2rem và 4rem */",

                faq: "Câu Hỏi Thường Gặp",
                q1: "Nên dùng rem hay em?",
                a1: "Dùng rem cho font sizes và spacing cần scale với root font size. Dùng em cho spacing cần scale với component font size (như button padding). Rem thường dễ maintain hơn vì luôn reference root, trong khi em có thể nhân lên khi elements lồng nhau.",

                q2: "Base font size mặc định là bao nhiêu?",
                a2: "Hầu hết browsers dùng 16px làm font size mặc định cho <html> element. Tuy nhiên, người dùng có thể thay đổi trong browser settings. Đây là lý do dùng rem quan trọng - nó tôn trọng tùy chọn người dùng. Luôn giả định 16px cho tính toán, nhưng nhớ nó có thể thay đổi.",

                q3: "Tôi có thể mix px và rem trong CSS không?",
                a3: "Có, nhưng hãy strategic. Dùng rem cho typography và spacing để maintain scalability. Dùng px cho borders (border: 1px solid), box-shadows và khoảng cách rất nhỏ cần kiểm soát pixel-perfect. Điểm quan trọng là consistency - ghi chép conventions sử dụng đơn vị.",

                q4: "Làm sao convert site px-based sang rem?",
                a4: "Bắt đầu bằng đặt html { font-size: 100%; } hoặc 62.5% (để tính toán dễ hơn). Sau đó systematically convert font-sizes và spacing sang rem. Bạn có thể dùng build tools như PostCSS với postcss-pxtorem để tự động hóa. Test kỹ ở các zoom levels khác nhau. Xem xét convert progressively, bắt đầu với typography.",

                q5: "Còn vh units cho mobile thì sao?",
                a5: "Viewport units trên mobile có thể khó vì viewport height thay đổi khi address bar hiện/ẩn. Dùng min-height với vh cho kết quả tốt hơn, hoặc xem xét dùng dvh (dynamic viewport height) trong modern browsers. Luôn test trên mobile devices thực tế, không chỉ browser dev tools.",

                q6: "Tại sao em spacing của tôi nhân đôi?",
                a6: "Em units compound - chúng tương đối với parent font size. Nếu parent có font-size: 2em và child có padding: 1em, padding đó thực tế là 2em relative to root. Đây là lý do rem thường được ưa thích cho spacing - nó không compound và luôn reference root.",

                q7: "Tôi nên dùng rem cho media queries không?",
                a7: "Có! Dùng rem trong media queries (vd: @media (min-width: 48rem)) nghĩa là breakpoints tôn trọng user font size settings. Điều này cải thiện accessibility và tạo responsive experience tốt hơn. Người dùng tăng font size sẽ trigger breakpoints sớm hơn, ngăn text overflow.",

                q8: "Khác biệt giữa vw và % là gì?",
                a8: "vw tương đối với viewport width (1vw = 1% viewport width), trong khi % tương đối với parent element width. Dùng vw cho viewport-based sizing (như full-width sections), và % cho parent-relative sizing (như column 50% width trong container). vw luôn relative to viewport, bất kể parent.",
            },
        },
    },
};
