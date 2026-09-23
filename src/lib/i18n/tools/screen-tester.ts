export const screenTesterTranslations = {
    en: {
        name: "Screen & Monitor Tester",
        description: "Diagnose your display for dead pixels, stuck subpixels, color uniformity, gradient banding, contrast dynamic range, and motion blur ghosting in full screen.",
        category: "Hardware & Device",

        // Test Modes
        tabDeadPixels: "Dead & Stuck Pixels",
        tabColorBanding: "Gradients & Banding",
        tabContrast: "Contrast & Black Level",
        tabGhosting: "Motion Blur & Ghosting",
        tabSharpness: "Sharpness & Convergence",

        // Controls
        fullscreenBtn: "Enter Fullscreen Test Mode (F11 / Esc)",
        exitFullscreen: "Exit Fullscreen",
        autoCycle: "Auto Cycle Colors",
        speedLabel: "Speed",
        stuckPixelFixer: "Stuck Pixel Exerciser (Rapid Flasher)",
        stuckPixelHint: "Position the flashing square directly over the stuck subpixel for 5-10 minutes to unstick the transistor.",

        // Descriptions
        deadPixelDesc: "Inspect your screen against solid pure colors to find dark dead pixels or bright stuck subpixels.",
        bandingDesc: "Check whether your monitor displays smooth color gradients without coarse steps or 8-bit banding artifacts.",
        contrastDesc: "Ensure you can distinguish all 20 subtle shades of dark and light squares without black crush or blown highlights.",
        ghostingDesc: "Observe moving objects across the screen to detect panel response time, motion blur, and inverse ghosting trails.",
        sharpnessDesc: "Check native 1:1 pixel mapping, text sharpness, and subpixel anti-aliasing without blur.",

        // Guide
        guideTitle: "How to Thoroughly Test Your Computer Monitor or TV",
        guide1Title: "Dead Pixel vs. Stuck Pixel",
        guide1Desc: "A dead pixel is completely dark (transistor permanently turned off). A stuck pixel is locked onto a single primary color (red, green, or blue). Stuck pixels can often be revived using high-frequency rapid flashing.",
        guide2Title: "Detecting Black Crush on OLED and VA Panels",
        guide2Desc: "Many displays suffer from 'black crush', where the darkest near-black dark gray squares blend invisibly into pure black. Calibrating your gamma curve helps reveal lost shadow detail in dark gaming scenes and movies.",
        guide3Title: "Motion Ghosting & Overdrive Settings",
        guide3Desc: "Fast-moving blocks reveal monitor pixel response time. If you see dark trailing streaks behind light objects, decrease your monitor's overdrive setting (e.g. from 'Extreme' to 'Fast') to eliminate inverse overshoot artifacts.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "How do I spot a dead or stuck pixel?",
        faq1A: "Enter full screen mode and cycle through black, white, red, green, and blue. A dead pixel will show as a tiny black speck on white/red/green/blue backgrounds. A stuck pixel will glow brightly on a black background.",
        faq2Q: "Can stuck pixels really be fixed by flashing?",
        faq2A: "Yes, rapid subpixel color cycling exercises the liquid crystal molecules and micro-transistors, often unsticking them after several minutes of continuous operation.",
        faq3Q: "Does this test support high refresh rate monitors (144Hz, 240Hz, 360Hz)?",
        faq3A: "Yes! The motion blur ghosting test syncs with your browser's `requestAnimationFrame`, rendering smoothly at your monitor's exact native refresh rate.",
    },
    vi: {
        name: "Bộ Kiểm Tra Màn Hình & Điểm Chết Monitor Tester",
        description: "Kiểm tra toàn diện màn hình: Phát hiện điểm chết (dead pixel), điểm kẹt màu (stuck pixel), độ đồng đều màu, dải màu gradient, tương phản và hiện tượng bóng mờ (ghosting).",
        category: "Phần Cứng & Thiết Bị",

        // Test Modes
        tabDeadPixels: "Điểm Chết & Kẹt Màu",
        tabColorBanding: "Dải Màu Gradient",
        tabContrast: "Tương Phản & Chi Tiết Vùng Tối",
        tabGhosting: "Bóng Mờ Chuyển Động (Ghosting)",
        tabSharpness: "Độ Nét & Khung Pixel",

        // Controls
        fullscreenBtn: "Bật Toàn Màn Hình Kiểm Tra (F11 / Esc)",
        exitFullscreen: "Thoát Toàn Màn Hình",
        autoCycle: "Tự động đổi màu",
        speedLabel: "Tốc độ",
        stuckPixelFixer: "Kích Hoạt Khối Sửa Điểm Kẹt Màu",
        stuckPixelHint: "Di chuyển ô vuông nhấp nháy tần số cao đè lên điểm kẹt màu trong khoảng 5-10 phút để kích hoạt lại tinh thể lỏng.",

        // Descriptions
        deadPixelDesc: "Quan sát bề mặt màn hình trên các màu đơn sắc thuần khiết để tìm các chấm đen chết hoặc chấm sáng kẹt màu.",
        bandingDesc: "Kiểm tra khả năng hiển thị chuyển tiếp màu mượt mà, không bị sọc dải phân tầng hay hiện tượng banding 8-bit.",
        contrastDesc: "Đảm bảo bạn có thể nhìn rõ và phân biệt đầy đủ 20 ô vuông từ đen sâu đến trắng sáng mà không bị chìm màu đen.",
        ghostingDesc: "Quan sát các khối chuyển động nhanh để đánh giá tốc độ phản hồi (response time) và hiện tượng vệt bóng ma của tấm nền.",
        sharpnessDesc: "Kiểm tra độ nét chuẩn pixel 1:1, độ mịn chữ và chống răng cưa không bị nhòe mờ do sai tỷ lệ thu phóng.",

        // Guide
        guideTitle: "Hướng Dẫn Kiểm Tra Màn Hình Máy Tính Khi Mua Mới",
        guide1Title: "Phân Biệt Điểm Chết (Dead Pixel) Và Điểm Kẹt Màu (Stuck Pixel)",
        guide1Desc: "Điểm chết là điểm đen hoàn toàn (bóng bán dẫn mất tín hiệu). Điểm kẹt màu thường sáng cố định ở màu Đỏ, Xanh lá hoặc Xanh dương. Điểm kẹt màu có thể cứu được bằng thuật toán nhấp nháy xung điện.",
        guide2Title: "Hiện Tượng Chìm Vùng Tối (Black Crush)",
        guide2Desc: "Nhiều màn hình bị lỗi 'black crush' khiến các chi tiết xám tối gần đen bị nuốt chửng thành đen kịt, làm mất chi tiết khi chơi game trong hang tối hoặc xem phim điện ảnh.",
        guide3Title: "Khắc Phục Hiện Tượng Bóng Ma (Ghosting) Màn Hình",
        guide3Desc: "Các khối chuyển động sẽ giúp bạn nhận diện độ trễ tấm nền. Nếu thấy bóng đuôi quá dài, hãy điều chỉnh tính năng Overdrive (hoặc Response Time) trong menu màn hình về mức Fast thay vì Extreme.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Làm thế nào để phát hiện điểm chết dễ nhất?",
        faq1A: "Bật chế độ toàn màn hình, lau sạch bụi màn hình và tuần tự chuyển qua các màu Đen, Trắng, Đỏ, Xanh lá, Xanh dương để rà soát kỹ lưỡng.",
        faq2Q: "Công cụ nhấp nháy có sửa được điểm kẹt màu thật không?",
        faq2A: "Rất hiệu quả với điểm kẹt màu (stuck pixel) do phân tử tinh thể lỏng bị kẹt vị trí. Quá trình nhấp nháy nhanh liên tục sẽ kích thích phân tử linh động trở lại.",
        faq3Q: "Công cụ có hỗ trợ màn hình tần số quét cao (144Hz, 240Hz, 360Hz) không?",
        faq3A: "Có, thuật toán kiểm tra bóng mờ sử dụng `requestAnimationFrame` đồng bộ trực tiếp với tần số quét thực tế của màn hình bạn đang dùng.",
    },
};
