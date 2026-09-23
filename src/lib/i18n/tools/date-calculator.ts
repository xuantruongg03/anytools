export const dateCalculatorTranslations = {
    en: {
        name: "Date & Age Calculator (Days Between & Business Days)",
        description: "Calculate exact days between two dates, exclude weekends for working business days, add/subtract duration, and compute exact chronological age with fun life statistics.",
        category: "Math",

        // Tabs
        tabBetween: "Days Between Dates",
        tabAddSub: "Add / Subtract Days",
        tabAge: "Exact Age Calculator",

        // Days Between
        startDate: "Start Date",
        endDate: "End Date",
        includeEndDate: "Include end day in calculation (+1 day)",
        excludeWeekends: "Calculate Business / Working Days (exclude Sat & Sun)",
        totalDays: "Total Days",
        workingDays: "Working Days",
        weekendDays: "Weekend Days",
        weeksDays: "Weeks & Days",
        monthsDays: "Months & Days",
        timeUnits: "Detailed Time Units",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",

        // Add / Subtract
        baseDate: "Start Date",
        operation: "Operation",
        opAdd: "Add (+)",
        opSub: "Subtract (-)",
        years: "Years",
        months: "Months",
        weeks: "Weeks",
        days: "Days",
        resultingDate: "Resulting Target Date",
        dayOfWeek: "Day of the Week",

        // Age Calculator
        birthDate: "Date of Birth",
        asOfDate: "Age as of Date",
        currentAge: "Current Chronological Age",
        nextBirthday: "Next Birthday In",
        zodiacSign: "Astrological Zodiac",
        chineseZodiac: "Chinese Zodiac Animal",
        lifeStats: "Lifetime Milestones (Estimated)",
        totalDaysLived: "Days Lived",
        totalHoursSlept: "Hours Slept (~8h/day)",
        totalHeartbeats: "Estimated Heartbeats (~75 bpm)",

        // Actions
        today: "Today",
        reset: "Reset",

        // Guide
        guideTitle: "Date Arithmetic & Calendar Calculations",
        guide1Title: "Working Days vs. Calendar Days",
        guide1Desc: "Business deadlines, project sprints, and payroll periods typically rely on business days, which exclude non-working weekends (Saturdays and Sundays).",
        guide2Title: "Leap Years & Gregorian Calendar",
        guide2Desc: "Our algorithm accounts for 365/366-day leap years (e.g. 2024, 2028) and variable month lengths (28, 29, 30, or 31 days) for accurate day counts.",
        guide3Title: "Timezone Independence",
        guide3Desc: "Calculations run natively on your device in pure calendar day integers to avoid daylight saving and timezone drift anomalies.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "How does the working days calculation handle public holidays?",
        faq1A: "The current business day filter automatically excludes all Saturdays and Sundays. Because public holidays vary by country and province, adjust by subtracting your regional holiday count.",
        faq2Q: "How is chronological age computed accurately?",
        faq2A: "The calculator compares year, month, and day components, automatically handling month day rollover so someone born on Feb 29 or Aug 31 is counted correctly.",
        faq3Q: "Are leap years accounted for when adding months or years?",
        faq3A: "Yes! Javascript's Date arithmetic handles leap year boundaries and month end clamping automatically.",
    },
    vi: {
        name: "Tính Ngày & Tính Tuổi Chính Xác (Đếm Ngày Đi Làm)",
        description: "Tính khoảng cách giữa 2 ngày, đếm ngày làm việc trừ Thứ 7 và Chủ Nhật, cộng trừ ngày tháng năm và tính tuổi chính xác kèm cung hoàng đạo, con giáp.",
        category: "Toán học",

        // Tabs
        tabBetween: "Khoảng cách 2 ngày",
        tabAddSub: "Cộng / Trừ ngày tháng",
        tabAge: "Tính tuổi chính xác",

        // Days Between
        startDate: "Ngày bắt đầu",
        endDate: "Ngày kết thúc",
        includeEndDate: "Tính cả ngày kết thúc (+1 ngày)",
        excludeWeekends: "Chỉ tính ngày làm việc (trừ Thứ 7 & Chủ Nhật)",
        totalDays: "Tổng số ngày",
        workingDays: "Ngày làm việc",
        weekendDays: "Ngày nghỉ cuối tuần",
        weeksDays: "Tuần & Ngày lẻ",
        monthsDays: "Tháng & Ngày lẻ",
        timeUnits: "Quy đổi chi tiết",
        hours: "Giờ",
        minutes: "Phút",
        seconds: "Giây",

        // Add / Subtract
        baseDate: "Ngày gốc",
        operation: "Phép tính",
        opAdd: "Cộng thêm (+)",
        opSub: "Trừ bớt (-)",
        years: "Năm",
        months: "Tháng",
        weeks: "Tuần",
        days: "Ngày",
        resultingDate: "Ngày kết quả",
        dayOfWeek: "Thứ trong tuần",

        // Age Calculator
        birthDate: "Ngày sinh nhật của bạn",
        asOfDate: "Tính tuổi đến ngày",
        currentAge: "Tuổi chính xác của bạn",
        nextBirthday: "Sinh nhật tiếp theo còn",
        zodiacSign: "Cung hoàng đạo",
        chineseZodiac: "Con giáp (Tuổi)",
        lifeStats: "Thống kê cuộc đời thú vị",
        totalDaysLived: "Số ngày đã sống",
        totalHoursSlept: "Số giờ đã ngủ (~8h/ngày)",
        totalHeartbeats: "Nhịp tim đã đập (~75 lần/phút)",

        // Actions
        today: "Hôm nay",
        reset: "Đặt lại",

        // Guide
        guideTitle: "Kinh Nghiệm Tính Lịch & Thời Gian Chuẩn Xác",
        guide1Title: "Ngày làm việc và ngày dương lịch",
        guide1Desc: "Khi tính tiến độ dự án, thời gian giao hàng hay thời gian thử việc, việc loại bỏ ngày Thứ 7 và Chủ Nhật giúp kế hoạch làm việc sát với thực tế doanh nghiệp.",
        guide2Title: "Xử lý năm nhuận và tháng thiếu",
        guide2Desc: "Công cụ tính toán chuẩn xác theo lịch Gregory, tự động nhận biết năm nhuận tháng 2 có 29 ngày và các tháng 30 hay 31 ngày.",
        guide3Title: "Độc lập múi giờ",
        guide3Desc: "Toàn bộ phép toán xử lý theo giá trị ngày thực tế trên thiết bị của bạn, không bị lệch ngày do chênh lệch múi giờ UTC.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Công cụ có tính các ngày lễ quốc gia không?",
        faq1A: "Hiện tại tính năng lọc ngày làm việc tự động trừ Thứ 7 và Chủ Nhật. Vì ngày nghỉ lễ thay đổi theo từng quốc gia, bạn chỉ cần trừ thêm số ngày nghỉ lễ tương ứng.",
        faq2Q: "Tính tuổi như thế nào là chuẩn nhất?",
        faq2A: "Công cụ tính tuổi theo chuẩn khoa học: bao nhiêu năm, bao nhiêu tháng và bao nhiêu ngày, đồng thời đếm ngược ngày sinh nhật tiếp theo.",
        faq3Q: "Có tính được những ngày trong quá khứ xa không?",
        faq3A: "Có! Bạn có thể chọn bất kỳ ngày nào trong quá khứ hoặc tương lai để tính toán mốc thời gian sự kiện, kỷ niệm ngày cưới hay ngày ra mắt sản phẩm.",
    },
};
