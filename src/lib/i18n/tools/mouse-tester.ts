export const mouseTesterTranslations = {
    en: {
        name: "Mouse & CPS Tester",
        description: "Test mouse buttons (Left, Right, Middle, Back, Forward), scroll wheel, detect faulty switch double-clicks (chatter), and measure Clicks Per Second (CPS) speed.",
        category: "Multimedia",

        // Tabs / Modes
        modeButtonTest: "Mouse Button & Scroll Test",
        modeCpsTest: "CPS Speed Test",

        // Button test section
        leftClick: "Left Click",
        rightClick: "Right Click",
        middleClick: "Middle Click (Wheel)",
        backButton: "Back Button (Mouse 4)",
        forwardButton: "Forward Button (Mouse 5)",
        scrollWheel: "Scroll Wheel",
        scrollUp: "Scroll Up",
        scrollDown: "Scroll Down",
        scrollDelta: "Scroll Distance",
        totalClicks: "Total Clicks",
        resetTest: "Reset State",
        clickHereToTest: "Click or scroll anywhere in this test area",
        preventContextMenuNote: "Right click is captured without opening context menu inside the test zone.",

        // Double click & chatter detection
        chatterDetector: "Double Click & Switch Bounce Detector",
        chatterWarning: "Potential Double-Click / Switch Bounce Detected!",
        chatterNormal: "Switch response is normal and healthy.",
        lastInterval: "Interval between clicks",
        chatterThresholdNote: "Clicks faster than 80ms are flagged as potential hardware switch bouncing (double-click bug).",
        clickLog: "Recent Click Log",
        noClicksYet: "No clicks recorded yet. Start clicking inside the tester.",

        // CPS Test
        cpsTitle: "Clicks Per Second (CPS) Challenge",
        cpsSubtitle: "Test your clicking speed and reflexes over 5 or 10 seconds.",
        time5s: "5 Seconds",
        time10s: "10 Seconds",
        timeFree: "Free Practice",
        startCps: "Start CPS Test",
        clickFast: "CLICK AS FAST AS YOU CAN!",
        timeLeft: "Time Left",
        currentCps: "Current CPS",
        peakCps: "Peak CPS",
        cpsScore: "Final CPS Score",
        tryAgain: "Try Again",

        // CPS Ranks
        rankTurtle: "Slow Turtle 🐢 (< 5 CPS)",
        rankCasual: "Casual User 🖱️ (5 - 7 CPS)",
        rankGamer: "Fast Gamer ⚡ (8 - 10 CPS)",
        rankPro: "Godlike Pro 🚀 (11 - 14 CPS)",
        rankCheater: "Machine / Jitter Click 🤖 (> 14 CPS)",

        // Guide
        guideTitle: "Mouse Testing & Switch Troubleshooting Guide",
        guide1Title: "How to Detect Mouse Double-Click Issues?",
        guide1Desc: "Mechanical micro-switches (like Omron, Kailh) degrade over time due to oxidized contacts, causing a single tap to register as 2 or more clicks within under 50-80ms.",
        guide2Title: "What is a good CPS score?",
        guide2Desc: "Regular clicking yields 5-7 CPS. Experienced Minecraft PvP players and gamers using jitter click or butterfly click techniques can achieve 10-14+ CPS.",
        guide3Title: "Testing Side Buttons & Scroll Wheel",
        guide3Desc: "Standard browser security allows detecting standard Mouse 1-5 buttons. Some specialized MMO buttons (6-12) might map to keyboard keys via software.",
    },
    vi: {
        name: "Test Chuột & Đo Tốc Độ CPS Online",
        description: "Kiểm tra toàn diện nút chuột (Trái, Phải, Con lăn giữa, Nút phụ Back/Forward), độ nhạy con lăn, phát hiện lỗi click đúp (Double-click switch chattering) và đo tốc độ bấm chuột CPS.",
        category: "Đa phương tiện",

        // Tabs / Modes
        modeButtonTest: "Test Nút Chuột & Con Lăn",
        modeCpsTest: "Đo Tốc Độ Bấm CPS",

        // Button test section
        leftClick: "Chuột Trái",
        rightClick: "Chuột Phải",
        middleClick: "Con Lăn Giữa (Wheel)",
        backButton: "Nút Phụ Lùi (Mouse 4)",
        forwardButton: "Nút Phụ Tiến (Mouse 5)",
        scrollWheel: "Con Lăn Cuộn",
        scrollUp: "Cuộn Lên",
        scrollDown: "Cuộn Xuống",
        scrollDelta: "Khoảng cách cuộn",
        totalClicks: "Tổng số lần click",
        resetTest: "Đặt lại trạng thái",
        clickHereToTest: "Click hoặc cuộn chuột vào bất kỳ vị trí nào trong khu vực này",
        preventContextMenuNote: "Click chuột phải đã được chặn mở menu trình duyệt trong vùng test.",

        // Double click & chatter detection
        chatterDetector: "Bộ Phát Hiện Lỗi Double-Click (Switch Bouncing)",
        chatterWarning: "Cảnh báo: Có dấu hiệu click đúp bất thường do switch bị nảy (Chattering)!",
        chatterNormal: "Switch chuột phản hồi bình thường, không có lỗi nảy kép.",
        lastInterval: "Thời gian giữa 2 lần click",
        chatterThresholdNote: "Các lần click nhanh hơn 80ms thường là do switch cơ học bị lỗi tiếp xúc.",
        clickLog: "Nhật ký click gần đây",
        noClicksYet: "Chưa có lượt click nào. Hãy bấm chuột vào vùng kiểm tra.",

        // CPS Test
        cpsTitle: "Thử Thách Tốc Độ Click Chuột (CPS Test)",
        cpsSubtitle: "Kiểm tra tốc độ ngón tay và phản xạ của bạn trong 5 hoặc 10 giây.",
        time5s: "5 Giây",
        time10s: "10 Giây",
        timeFree: "Luyện Tập Tự Do",
        startCps: "Bắt Đầu Test CPS",
        clickFast: "CLICK THẬT NHANH VÀO ĐÂY!",
        timeLeft: "Thời gian còn lại",
        currentCps: "CPS Hiện Tại",
        peakCps: "CPS Cao Nhất",
        cpsScore: "Điểm CPS Cuối Cùng",
        tryAgain: "Thử Lại",

        // CPS Ranks
        rankTurtle: "Rùa Bò Chậm Rãi 🐢 (< 5 CPS)",
        rankCasual: "Người Dùng Tiêu Chuẩn 🖱️ (5 - 7 CPS)",
        rankGamer: "Game Thủ Nhanh Nhạy ⚡ (8 - 10 CPS)",
        rankPro: "Thần Tốc Đỉnh Cao 🚀 (11 - 14 CPS)",
        rankCheater: "Tốc Độ Máy / Jitter Click 🤖 (> 14 CPS)",

        // Guide
        guideTitle: "Hướng Dẫn Test Chuột & Khắc Phục Lỗi Phần Cứng",
        guide1Title: "Làm thế nào để phát hiện lỗi Double-click?",
        guide1Desc: "Switch cơ học của chuột (Omron, Kailh, Huano) sau thời gian dài sử dụng dễ bị oxy hóa lá đồng, khiến 1 lần bấm phát sinh 2 tín hiệu chỉ trong vòng dưới 50-80ms.",
        guide2Title: "Điểm CPS bao nhiêu là chuẩn?",
        guide2Desc: "Người bình thường đạt từ 5 - 7 CPS. Các game thủ PvP Minecraft dùng kỹ thuật Jitter Click hoặc Butterfly Click có thể đạt 10 - 15+ CPS.",
        guide3Title: "Kiểm tra nút phụ và con lăn",
        guide3Desc: "Trình duyệt hỗ trợ đầy đủ các phím chuột từ Mouse 1 đến Mouse 5. Với các chuột MMO có nhiều phím phụ, hãy dùng phần mềm hãng gán phím tương ứng.",
    },
};
