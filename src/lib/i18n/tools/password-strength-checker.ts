export const passwordStrengthTranslations = {
    en: {
        name: "Password Strength & Entropy Analyzer",
        description: "Analyze password security and Shannon entropy bits with offline GPU crack time estimations, common pattern detection, and a cryptographically secure password generator.",
        category: "Security & Encryption",

        // Analyzer
        inputLabel: "Test Your Password",
        inputPlaceholder: "Type or generate a password to analyze...",
        showPassword: "Show",
        hidePassword: "Hide",
        privacyNotice: "🔒 100% Offline & Private: Your password is never transmitted across the network or saved anywhere.",

        // Scores & Badges
        scoreVeryWeak: "Very Weak",
        scoreWeak: "Weak",
        scoreFair: "Fair / Moderate",
        scoreStrong: "Strong",
        scoreVeryStrong: "Military Grade",

        // Entropy & Metrics
        entropyTitle: "Cryptographic Entropy & Metrics",
        entropyBits: "Entropy Score",
        poolSize: "Character Pool Size",
        lengthLabel: "Character Length",
        scoreLabel: "Security Score",

        // Crack Times
        crackTitle: "Estimated Time to Crack (Brute-Force)",
        crackOnlineSlow: "Online Throttled (100 attempts/sec)",
        crackOnlineFast: "Online Unthrottled (10k attempts/sec)",
        crackGpuCluster: "Offline Fast Hash (8x RTX 4090 GPU - 100B/s)",
        crackArgon2: "Offline Slow Hash (Argon2 / bcrypt - 10k/s)",

        // Checklist
        checklistTitle: "Security Checklist & Recommendations",
        checkLength: "At least 12 characters long",
        checkLower: "Contains lowercase letters (a-z)",
        checkUpper: "Contains uppercase letters (A-Z)",
        checkDigits: "Contains numbers (0-9)",
        checkSymbols: "Contains special symbols (!@#$%)",
        checkNoRepeats: "No excessive repeating characters",
        checkNoSequential: "No common sequential patterns (1234, qwerty)",

        // Generator
        genTitle: "Secure Password Generator",
        genLength: "Password Length",
        genIncludeUpper: "Uppercase (A-Z)",
        genIncludeLower: "Lowercase (a-z)",
        genIncludeNumbers: "Numbers (0-9)",
        genIncludeSymbols: "Special Symbols (!@#$)",
        genExcludeAmbiguous: "Exclude Ambiguous (0, O, 1, l, I)",
        generateBtn: "Generate New Password",
        copyBtn: "Copy",
        copied: "Copied password to clipboard!",

        // Guide
        guideTitle: "Understanding Password Entropy and NIST Guidelines",
        guide1Title: "What is Password Entropy?",
        guide1Desc: "Entropy measures the unpredictability of a password in bits. Each additional bit doubles the number of guesses an attacker must make. Passwords with 60+ bits resist common brute-force attacks, while 80+ bits resist nation-state supercomputers.",
        guide2Title: "Length Trumps Complexity",
        guide2Desc: "According to NIST SP 800-63B guidelines, a long passphrase of 4 random words (e.g. `correct-horse-battery-staple`) is far more secure and memorable than a short complex string like `P@$$w0rd`.",
        guide3Title: "The Danger of Common Dictionary Words",
        guide3Desc: "Attackers don't guess every letter from A to Z — they use leaked database wordlists and rule-based permutation engines (like Hashcat). Avoid names, birthdays, and keyboard sequences.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "Is it safe to type real passwords into this tool?",
        faq1A: "Yes. This tool is 100% client-side and performs all Shannon entropy calculations and checks inside your browser's local memory. You can even disconnect your internet and it will work identically.",
        faq2Q: "How many bits of entropy are considered secure?",
        faq2A: "Under 40 bits is very weak and crackable in seconds. 40-60 bits is fair for low-risk accounts. 60-80 bits is strong. 80+ bits provides military-grade resilience against offline GPU clusters.",
        faq3Q: "How are the brute-force crack times calculated?",
        faq3A: "Crack time is calculated by dividing total combinations (2^Entropy) by the attack speed. For offline cracking, we simulate modern hash cracking rates (100 billion guesses/sec on modern GPU rigs).",
    },
    vi: {
        name: "Bộ Đo Độ Mạnh Mật Khẩu & Phân Tích Entropy",
        description: "Kiểm tra độ an toàn mật khẩu và độ đo Shannon Entropy với dự đoán thời gian bẻ khóa bằng dàn GPU, phát hiện chuỗi quy luật và trình tạo mật khẩu an toàn chuẩn quân sự.",
        category: "Bảo Mật & Mã Hóa",

        // Analyzer
        inputLabel: "Nhập Mật Khẩu Cần Đánh Giá",
        inputPlaceholder: "Nhập hoặc tạo mật khẩu để phân tích...",
        showPassword: "Hiện",
        hidePassword: "Ẩn",
        privacyNotice: "🔒 Bảo Mật Tuyệt Đối 100%: Mật khẩu được xử lý hoàn toàn trên trình duyệt, không bao giờ gửi qua mạng hay lưu trữ ở bất kỳ đâu.",

        // Scores & Badges
        scoreVeryWeak: "Rất Yếu (Dễ Bị Hack)",
        scoreWeak: "Yếu",
        scoreFair: "Trung Bình",
        scoreStrong: "Mạnh An Toàn",
        scoreVeryStrong: "Chuẩn Quân Sự Siêu An Toàn",

        // Entropy & Metrics
        entropyTitle: "Chỉ Số Mã Hóa & Shannon Entropy",
        entropyBits: "Độ Hỗn Loạn Entropy",
        poolSize: "Độ Rộng Tập Ký Tự",
        lengthLabel: "Độ Dài Mật Khẩu",
        scoreLabel: "Điểm Đánh Giá Bảo Mật",

        // Crack Times
        crackTitle: "Thời Gian Bẻ Khóa Bằng Vét Cạn (Brute-Force)",
        crackOnlineSlow: "Đăng nhập trực tuyến có giới hạn (100 lần/giây)",
        crackOnlineFast: "Đăng nhập trực tuyến không giới hạn (10.000 lần/giây)",
        crackGpuCluster: "Bẻ khóa băm ngoại tuyến (Dàn 8x RTX 4090 - 100 tỷ lần/s)",
        crackArgon2: "Thuật toán băm an toàn (Argon2 / bcrypt - 10.000 lần/s)",

        // Checklist
        checklistTitle: "Bảng Kiểm Tra Tiêu Chuẩn Bảo Mật",
        checkLength: "Độ dài từ 12 ký tự trở lên",
        checkLower: "Có chứa chữ cái thường (a-z)",
        checkUpper: "Có chứa chữ cái in hoa (A-Z)",
        checkDigits: "Có chứa chữ số (0-9)",
        checkSymbols: "Có chứa ký tự đặc biệt (!@#$%)",
        checkNoRepeats: "Không lặp lại một ký tự liên tục",
        checkNoSequential: "Không dùng chuỗi liên tiếp dễ đoán (1234, qwerty)",

        // Generator
        genTitle: "Trình Tạo Mật Khẩu Chuẩn Mã Hóa (CSPRNG)",
        genLength: "Độ Dài Mật Khẩu",
        genIncludeUpper: "Chữ in hoa (A-Z)",
        genIncludeLower: "Chữ thường (a-z)",
        genIncludeNumbers: "Chữ số (0-9)",
        genIncludeSymbols: "Ký hiệu đặc biệt (!@#$)",
        genExcludeAmbiguous: "Loại trừ ký tự dễ nhầm lẫn (0, O, 1, l, I)",
        generateBtn: "Tạo Mật Khẩu Mới",
        copyBtn: "Sao Chép",
        copied: "Đã sao chép mật khẩu an toàn!",

        // Guide
        guideTitle: "Hiểu Đúng Về Độ Mạnh Mật Khẩu & Tiêu Chuẩn NIST",
        guide1Title: "Entropy Mật Khẩu Là Gì?",
        guide1Desc: "Entropy (đo bằng đơn vị bits) thể hiện độ khó đoán của mật khẩu theo lý thuyết thông tin. Mỗi bit entropy tăng thêm sẽ nhân đôi số lần đoán mà hacker phải thử.",
        guide2Title: "Độ Dài Quan Trọng Hơn Độ Phức Tạp",
        guide2Desc: "Theo khuyến nghị NIST SP 800-63B, cụm mật khẩu gồm 4 từ ngẫu nhiên (ví dụ `con-meo-vang-chay-nhanh`) an toàn và dễ nhớ hơn nhiều so với chuỗi ngắn phức tạp như `P@$$w0rd`.",
        guide3Title: "Cạm Bẫy Của Từ Điển Rò Rỉ",
        guide3Desc: "Hacker không đoán mò từng chữ cái mà dùng từ điển hàng tỷ mật khẩu đã lộ (như RockYou). Tránh dùng ngày sinh, tên người yêu, số điện thoại hay chuỗi bàn phím liên tiếp.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Nhập mật khẩu thật vào công cụ này có an toàn không?",
        faq1A: "Hoàn toàn an toàn 100%. Công cụ chạy thuần túy bằng Javascript cục bộ trên máy của bạn. Bạn thậm chí có thể ngắt kết nối mạng wifi mà công cụ vẫn hoạt động bình thường.",
        faq2Q: "Bao nhiêu bit entropy thì đạt chuẩn an toàn?",
        faq2A: "Dưới 40 bits là rất yếu. Từ 40-60 bits ở mức trung bình. Từ 60-80 bits là rất an toàn. Trên 80 bits có khả năng chống lại các siêu máy tính GPU mạnh nhất thế giới.",
        faq3Q: "Dự đoán thời gian bẻ khóa được tính như thế nào?",
        faq3A: "Thời gian bẻ khóa được tính bằng tổng số tổ hợp khả dĩ (2^Entropy) chia cho tốc độ thử nghiệm của dàn máy tính giải mã GPU hiện đại (100 tỷ phép thử/giây).",
    },
};
