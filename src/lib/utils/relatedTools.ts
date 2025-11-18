import { toolsConfig, allTools, type Tool } from "@/config/tools";

interface RelatedTool {
    href: string;
    icon: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
}

// Translation mappings for tool names and descriptions
const toolTranslations: Record<
    string,
    {
        nameVi: string;
        nameEn: string;
        descriptionVi: string;
        descriptionEn: string;
    }
> = {
    jsonFormatter: {
        nameVi: "JSON Formatter",
        nameEn: "JSON Formatter",
        descriptionVi: "Định dạng và xác thực dữ liệu JSON",
        descriptionEn: "Format and validate JSON data",
    },
    base64: {
        nameVi: "Base64 Encoder/Decoder",
        nameEn: "Base64 Encoder/Decoder",
        descriptionVi: "Mã hóa và giải mã chuỗi Base64",
        descriptionEn: "Encode and decode Base64 strings",
    },
    urlEncoder: {
        nameVi: "URL Encoder/Decoder",
        nameEn: "URL Encoder/Decoder",
        descriptionVi: "Mã hóa và giải mã URL",
        descriptionEn: "Encode and decode URLs",
    },
    hashGenerator: {
        nameVi: "Hash Generator",
        nameEn: "Hash Generator",
        descriptionVi: "Tạo hash MD5, SHA-1, SHA-256",
        descriptionEn: "Generate MD5, SHA-1, SHA-256 hashes",
    },
    jwtDecoder: {
        nameVi: "JWT Decoder",
        nameEn: "JWT Decoder",
        descriptionVi: "Giải mã và xác thực JWT token",
        descriptionEn: "Decode and validate JWT tokens",
    },
    uuidGenerator: {
        nameVi: "UUID Generator",
        nameEn: "UUID Generator",
        descriptionVi: "Tạo UUID/GUID ngẫu nhiên",
        descriptionEn: "Generate random UUIDs/GUIDs",
    },
    timestampConverter: {
        nameVi: "Timestamp Converter",
        nameEn: "Timestamp Converter",
        descriptionVi: "Chuyển đổi timestamp Unix sang ngày",
        descriptionEn: "Convert Unix timestamps to dates",
    },
    regexTester: {
        nameVi: "Regex Tester",
        nameEn: "Regex Tester",
        descriptionVi: "Kiểm tra và gỡ lỗi biểu thức chính quy",
        descriptionEn: "Test and debug regular expressions",
    },
    apiTester: {
        nameVi: "API Tester",
        nameEn: "API Tester",
        descriptionVi: "Kiểm tra API REST nhanh chóng",
        descriptionEn: "Test REST APIs quickly",
    },
    htmlEntityEncoder: {
        nameVi: "HTML Entity Encoder",
        nameEn: "HTML Entity Encoder",
        descriptionVi: "Mã hóa và giải mã HTML entities",
        descriptionEn: "Encode and decode HTML entities",
    },
    numberConverter: {
        nameVi: "Number Converter",
        nameEn: "Number Converter",
        descriptionVi: "Chuyển đổi giữa các hệ số",
        descriptionEn: "Convert between number systems",
    },
    colorPicker: {
        nameVi: "Color Picker",
        nameEn: "Color Picker",
        descriptionVi: "Chọn và chuyển đổi màu sắc",
        descriptionEn: "Pick and convert colors",
    },
    tailwindCss: {
        nameVi: "Tailwind CSS Cheatsheet",
        nameEn: "Tailwind CSS Cheatsheet",
        descriptionVi: "Tham khảo nhanh Tailwind CSS",
        descriptionEn: "Quick Tailwind CSS reference",
    },
    cssUnitConverter: {
        nameVi: "CSS Unit Converter",
        nameEn: "CSS Unit Converter",
        descriptionVi: "Chuyển đổi đơn vị CSS",
        descriptionEn: "Convert CSS units",
    },
    textCase: {
        nameVi: "Text Case Converter",
        nameEn: "Text Case Converter",
        descriptionVi: "Chuyển đổi chữ hoa/thường",
        descriptionEn: "Convert text case",
    },
    diffChecker: {
        nameVi: "Diff Checker",
        nameEn: "Diff Checker",
        descriptionVi: "So sánh sự khác biệt giữa văn bản",
        descriptionEn: "Compare text differences",
    },
    passwordGenerator: {
        nameVi: "Password Generator",
        nameEn: "Password Generator",
        descriptionVi: "Tạo mật khẩu mạnh ngẫu nhiên",
        descriptionEn: "Generate strong random passwords",
    },
    randomWheel: {
        nameVi: "Vòng Quay May Mắn",
        nameEn: "Random Wheel",
        descriptionVi: "Quay để chọn ngẫu nhiên",
        descriptionEn: "Spin to choose randomly",
    },
    randomRace: {
        nameVi: "Đua Thú Ngẫu Nhiên",
        nameEn: "Random Race",
        descriptionVi: "Đua thú vui nhộn để chọn người thắng",
        descriptionEn: "Fun animal race to pick winner",
    },
    qrCodeGenerator: {
        nameVi: "QR Code Generator",
        nameEn: "QR Code Generator",
        descriptionVi: "Tạo mã QR nhanh chóng",
        descriptionEn: "Generate QR codes quickly",
    },
    urlShortener: {
        nameVi: "URL Shortener",
        nameEn: "URL Shortener",
        descriptionVi: "Rút gọn URL dài",
        descriptionEn: "Shorten long URLs",
    },
    gpaCalculator: {
        nameVi: "GPA Calculator",
        nameEn: "GPA Calculator",
        descriptionVi: "Tính điểm trung bình GPA",
        descriptionEn: "Calculate GPA scores",
    },
    repoTree: {
        nameVi: "Repo Tree Viewer",
        nameEn: "Repo Tree Viewer",
        descriptionVi: "Xem cấu trúc thư mục GitHub",
        descriptionEn: "View GitHub directory structure",
    },
    worldClock: {
        nameVi: "World Clock",
        nameEn: "World Clock",
        descriptionVi: "Xem giờ các múi thời gian",
        descriptionEn: "View world time zones",
    },
    countdown: {
        nameVi: "Countdown Timer",
        nameEn: "Countdown Timer",
        descriptionVi: "Đếm ngược thời gian",
        descriptionEn: "Countdown timer",
    },
    stopwatch: {
        nameVi: "Stopwatch",
        nameEn: "Stopwatch",
        descriptionVi: "Bấm giờ chính xác",
        descriptionEn: "Precise stopwatch",
    },
    microphoneTest: {
        nameVi: "Microphone Test",
        nameEn: "Microphone Test",
        descriptionVi: "Kiểm tra micro của bạn",
        descriptionEn: "Test your microphone",
    },
    stunTurnTest: {
        nameVi: "STUN/TURN Test",
        nameEn: "STUN/TURN Test",
        descriptionVi: "Kiểm tra kết nối STUN/TURN",
        descriptionEn: "Test STUN/TURN connection",
    },
};

/**
 * Get related tools for a specific tool
 * @param currentToolPath - Current tool path (e.g., "/tools/json-formatter")
 * @param count - Number of related tools to return (default: 6)
 * @returns Array of related tools with translations
 */
export function getRelatedTools(currentToolPath: string, count: number = 6): RelatedTool[] {
    // Find the current tool's category
    const currentCategory = toolsConfig.find((category) => category.tools.some((tool) => tool.href === currentToolPath));

    let relatedTools: Tool[] = [];

    if (currentCategory) {
        // Get tools from the same category (excluding current tool)
        relatedTools = currentCategory.tools.filter((tool) => tool.href !== currentToolPath);

        // If we need more tools, add from other categories
        if (relatedTools.length < count) {
            const otherTools = allTools.filter((tool) => tool.href !== currentToolPath && !relatedTools.some((t) => t.href === tool.href));
            relatedTools = [...relatedTools, ...otherTools];
        }
    } else {
        // If current tool not found, return random tools
        relatedTools = allTools.filter((tool) => tool.href !== currentToolPath);
    }

    // Shuffle and pick the required count
    const shuffled = relatedTools.sort(() => Math.random() - 0.5).slice(0, count);

    // Map to RelatedTool format with translations
    return shuffled.map((tool) => {
        const translation = toolTranslations[tool.key] || {
            nameVi: tool.key,
            nameEn: tool.key,
            descriptionVi: "",
            descriptionEn: "",
        };

        return {
            href: tool.href,
            icon: tool.icon,
            nameVi: translation.nameVi,
            nameEn: translation.nameEn,
            descriptionVi: translation.descriptionVi,
            descriptionEn: translation.descriptionEn,
        };
    });
}
