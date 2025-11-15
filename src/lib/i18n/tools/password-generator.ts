export const passwordGeneratorTranslations = {
    en: {
        passwordGenerator: {
            name: "Password Generator",
            description: "Generate strong random passwords or strengthen existing ones",
            category: "Security",
            ui: {
                // Generator Tab
                generatorTab: "Generator",
                strengthenTab: "Strengthen",

                // Password Display
                generatedPassword: "Generated Password",
                yourPassword: "Your Password",
                strength: "Strength",
                weak: "Weak",
                medium: "Medium",
                strong: "Strong",
                veryStrong: "Very Strong",

                // Generator Options
                length: "Length",
                includeOptions: "Include:",
                uppercase: "Uppercase (A-Z)",
                lowercase: "Lowercase (a-z)",
                numbers: "Numbers (0-9)",
                symbols: "Symbols (!@#$...)",
                excludeSimilar: "Exclude similar characters (i, l, 1, L, o, 0, O)",
                easyToSay: "Easy to say (avoid ambiguous)",
                easyToRead: "Easy to read (no symbols)",

                // Memorable Password
                memorablePassword: "Memorable Password",
                wordCount: "Word Count",
                separator: "Separator",
                separatorNone: "None",
                separatorHyphen: "Hyphen (-)",
                separatorUnderscore: "Underscore (_)",
                separatorDot: "Dot (.)",
                separatorSpace: "Space",
                separatorCustom: "Custom",
                capitalizeWords: "Capitalize Each Word",
                addNumbers: "Add Numbers",
                addSymbols: "Add Symbols at End",

                // Buttons
                generate: "Generate Password",
                generateMemor: "Generate Memorable",
                copy: "Copy",
                copied: "Copied!",

                // Strengthen Password
                yourPasswordLabel: "Your Password",
                enterPassword: "Enter your password to strengthen...",
                strengthenOptions: "Strengthening Options",
                capitalizeFirst: "Capitalize first letter",
                addNumberEnd: "Add number at the end",
                addSymbolEnd: "Add symbol at the end",
                replaceLetters: "Replace letters with similar characters",
                replaceA: "a → @",
                replaceE: "e → 3",
                replaceI: "i → !",
                replaceO: "o → 0",
                replaceS: "s → $",
                insertSymbols: "Insert random symbols",
                doubleVowels: "Double vowels (a→aa)",
                reverseWords: "Reverse word order",

                strengthen: "Strengthen Password",
                strengthened: "Strengthened Password",
                improvementTips: "Improvement Tips",

                // Stats
                entropy: "Entropy",
                bits: "bits",
                timeToCrack: "Time to Crack",
                instant: "Instant",
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                months: "months",
                years: "years",
                centuries: "centuries",
            },
            page: {
                title: "Password Generator & Strengthener",
                subtitle: "Generate strong random passwords or strengthen existing ones for maximum security",

                whatIs: "What is a Password Generator?",
                whatIsDesc: "A password generator is a tool that creates strong, random passwords with customizable criteria including length, character types, and complexity. It uses cryptographically secure random number generation to produce passwords that are virtually impossible to guess or crack through brute force attacks. Strong passwords are essential for protecting online accounts, sensitive data, and digital identities from unauthorized access.",

                whyStrong: "Why Strong Passwords Matter",
                whyStrongDesc: "Weak passwords are the primary cause of data breaches and account compromises. A strong password should be at least 12-16 characters long, contain a mix of uppercase and lowercase letters, numbers, and symbols, and avoid common words or patterns. Cybercriminals use sophisticated tools that can try billions of password combinations per second, making weak passwords vulnerable to brute force attacks, dictionary attacks, and rainbow table attacks.",

                features: "Key Features",
                randomGen: "Random Password Generation",
                randomGenDesc: "Generate cryptographically secure random passwords up to 64 characters with full customization of character types.",

                memorableGen: "Memorable Passwords",
                memorableGenDesc: "Create easy-to-remember passwords using random words with customizable separators and enhancements.",

                strengthen: "Password Strengthening",
                strengthenDesc: "Transform weak or memorable passwords into strong ones by applying various enhancement techniques automatically.",

                strengthAnalysis: "Strength Analysis",
                strengthAnalysisDesc: "Real-time password strength evaluation with entropy calculation and estimated crack time.",

                customizable: "Fully Customizable",
                customizableDesc: "Control every aspect: length, character types, similar character exclusion, and memorable word options.",

                secure: "Client-Side Security",
                secureDesc: "All password generation happens in your browser. No passwords are sent to servers or stored anywhere.",

                howToUse: "How to Use",
                step1: "Choose Generation Method",
                step1Desc: "Select 'Generator' for random passwords or 'Strengthen' to improve existing passwords.",

                step2: "Customize Options",
                step2Desc: "Set length, character types, and additional options based on your security requirements.",

                step3: "Generate or Strengthen",
                step3Desc: "Click the button to create your password. Review the strength indicator and entropy.",

                step4: "Copy and Use",
                step4Desc: "Copy the password to clipboard and use it for your account. Never reuse passwords!",

                passwordTypes: "Types of Passwords",
                randomPassword: "Random Passwords",
                randomPasswordDesc: "Completely random characters for maximum security. Example: X7#mK9@pL2$qR5",

                memorablePassword: "Memorable Passwords",
                memorablePasswordDesc: "Multiple random words combined. Example: Correct-Horse-Battery-Staple",

                strengthenedPassword: "Strengthened Passwords",
                strengthenedPasswordDesc: "Your familiar passwords enhanced with security modifications.",

                passphrasePassword: "Passphrases",
                passphrasePasswordDesc: "Long phrases that are both secure and memorable. Longer is stronger!",

                bestPractices: "Password Best Practices",
                practice1: "Use at least 12-16 characters for important accounts",
                practice2: "Never reuse passwords across different accounts",
                practice3: "Use a password manager to store unique passwords",
                practice4: "Enable two-factor authentication (2FA) whenever possible",
                practice5: "Change passwords immediately if a breach is detected",
                practice6: "Avoid personal information (names, birthdays, etc.)",
                practice7: "Don't share passwords via email, text, or unsecured channels",
                practice8: "Update passwords regularly for critical accounts",

                securityTips: "Security Tips",
                tip1: "Longer passwords are exponentially stronger than complex short ones",
                tip2: "Passphrases (4+ random words) are both strong and memorable",
                tip3: "Adding just one special character increases crack time dramatically",
                tip4: "Never use keyboard patterns (qwerty, 12345, asdf)",
                tip5: "Test existing passwords for breaches at haveibeenpwned.com",
                tip6: "Use different passwords for email, banking, and social media",

                commonMistakes: "Common Mistakes to Avoid",
                mistake1: "Using dictionary words without modifications",
                mistake2: "Simple substitutions (Password → P@ssw0rd) are easily cracked",
                mistake3: "Reusing passwords, even with slight variations",
                mistake4: "Writing passwords down in plain text or sticky notes",
                mistake5: "Using personal information (pet names, birthdays, addresses)",
                mistake6: "Sharing passwords with colleagues or family members",

                entropyExplained: "Understanding Password Entropy",
                entropyDesc: "Entropy measures password randomness in bits. Higher entropy means more possible combinations and longer crack time. A truly random 12-character password with all character types has ~78 bits of entropy, requiring trillions of years to crack with current technology.",
                entropyLow: "< 40 bits: Weak - Can be cracked quickly",
                entropyMedium: "40-60 bits: Medium - Resistant to basic attacks",
                entropyHigh: "60-80 bits: Strong - Very difficult to crack",
                entropyVeryHigh: "> 80 bits: Very Strong - Virtually uncrackable",

                timeToCrackExplained: "How Time to Crack is Calculated",
                timeToCrackDesc:
                    "Time to crack assumes a powerful attacker making 1 billion guesses per second (modern GPU capability). For a password with character set size C and length L, there are C^L possible combinations. Time = (C^L) / (1,000,000,000 attempts/sec). For example, a 12-character password with 94 possible characters (all types) has 94^12 = 4.75 × 10^23 combinations, taking 15 million years to crack at 1 billion guesses/second. Real-world times may vary based on attack method, hardware, and password storage (hashing slows attacks).",

                tools: "Related Tools",
                hashGenerator: "Hash Generator - Hash passwords for storage",
                base64: "Base64 Encoder - Encode credentials safely",
                encryption: "Text Encryption - Secure sensitive information",

                faq: "Frequently Asked Questions",
                q1: "How long should my password be?",
                a1: "For most accounts, 12-16 characters is sufficient. For critical accounts (email, banking), use 16+ characters. The longer the password, the exponentially harder it is to crack. A 16-character password is quadrillions of times stronger than an 8-character one.",

                q2: "Are memorable passwords secure?",
                a2: "Yes! Passphrases like 'Correct-Horse-Battery-Staple' are highly secure when using truly random words. 4-5 random words with separators and numbers provide excellent security while being much easier to remember than random characters. The key is using random words, not meaningful phrases.",

                q3: "Should I use symbols in my password?",
                a3: "Symbols increase password strength, but length is more important. A 16-character password with just letters and numbers is stronger than a 10-character password with all character types. However, symbols do add entropy and are recommended when possible.",

                q4: "How often should I change my passwords?",
                a4: "Only change passwords if: (1) There's been a data breach, (2) You suspect compromise, or (3) You shared it. Frequent arbitrary changes can lead to weaker passwords as people use predictable patterns. Focus on using strong, unique passwords with 2FA instead.",

                q5: "Is it safe to use a password manager?",
                a5: "Yes! Password managers are essential for modern security. They generate and store unique passwords for every account, encrypted with a master password. Reputable managers use military-grade encryption and are far more secure than reusing passwords or writing them down.",

                q6: "What if I can't remember complex passwords?",
                a6: "Use memorable passphrases (random words), or let a password manager remember them for you. For passwords you must remember (like the master password), use the strengthening feature to enhance a familiar phrase while keeping it memorable.",

                q7: "Can hackers crack any password?",
                a7: "Given unlimited time and computing power, yes. However, a truly random 16+ character password would take current supercomputers trillions of years to crack. The goal is making passwords computationally infeasible to crack, not theoretically impossible.",

                q8: "What's the difference between random and strengthened passwords?",
                a8: "Random passwords are generated from scratch with maximum entropy. Strengthened passwords start with your familiar input and apply transformations to increase security while maintaining some memorability. Use random for maximum security, strengthened for passwords you need to type frequently.",
            },
        },
    },
    vi: {
        passwordGenerator: {
            name: "Trình Tạo Mật Khẩu",
            description: "Tạo mật khẩu ngẫu nhiên mạnh mẽ hoặc tăng cường mật khẩu hiện có",
            category: "Bảo Mật",
            ui: {
                // Generator Tab
                generatorTab: "Tạo mật khẩu",
                strengthenTab: "Tăng cường",

                // Password Display
                generatedPassword: "Mật khẩu đã tạo",
                yourPassword: "Mật khẩu của bạn",
                strength: "Độ mạnh",
                weak: "Yếu",
                medium: "Trung bình",
                strong: "Mạnh",
                veryStrong: "Rất mạnh",

                // Generator Options
                length: "Độ dài",
                includeOptions: "Bao gồm:",
                uppercase: "Chữ hoa (A-Z)",
                lowercase: "Chữ thường (a-z)",
                numbers: "Số (0-9)",
                symbols: "Ký tự đặc biệt (!@#$...)",
                excludeSimilar: "Loại trừ ký tự tương tự (i, l, 1, L, o, 0, O)",
                easyToSay: "Dễ đọc (tránh nhập nhằng)",
                easyToRead: "Dễ nhìn (không ký tự đặc biệt)",

                // Memorable Password
                memorablePassword: "Mật khẩu dễ nhớ",
                wordCount: "Số từ",
                separator: "Ký tự ngăn cách",
                separatorNone: "Không có",
                separatorHyphen: "Gạch ngang (-)",
                separatorUnderscore: "Gạch dưới (_)",
                separatorDot: "Dấu chấm (.)",
                separatorSpace: "Khoảng trắng",
                separatorCustom: "Tùy chỉnh",
                addNumbers: "Thêm số",
                addSymbols: "Thêm ký tự đặc biệt ở cuối",

                // Buttons
                generate: "Tạo mật khẩu ngẫu nhiên",
                generateMemor: "Tạo mật khẩu dễ nhớ",
                copy: "Sao chép",
                copied: "Đã sao chép!",

                // Strengthen Password
                yourPasswordLabel: "Mật khẩu của bạn",
                enterPassword: "Nhập mật khẩu để tăng cường...",
                strengthenOptions: "Tùy chọn tăng cường",
                capitalizeFirst: "Viết hoa chữ cái đầu",
                capitalizeWords: "Viết hoa mỗi từ",
                addNumberEnd: "Thêm số ở cuối",
                addSymbolEnd: "Thêm ký tự đặc biệt ở cuối",
                replaceLetters: "Thay thế chữ cái bằng ký tự tương tự",
                replaceA: "a → @",
                replaceE: "e → 3",
                replaceI: "i → !",
                replaceO: "o → 0",
                replaceS: "s → $",
                insertSymbols: "Chèn ký tự đặc biệt ngẫu nhiên",
                doubleVowels: "Nhân đôi nguyên âm (a→aa)",
                reverseWords: "Đảo ngược thứ tự từ",

                strengthen: "Tăng cường mật khẩu",
                strengthened: "Mật khẩu đã tăng cường",
                improvementTips: "Gợi ý cải thiện",

                // Stats
                entropy: "Độ hỗn loạn (Entropy)",
                bits: "bit",
                timeToCrack: "Thời gian bẻ khóa",
                instant: "Ngay lập tức",
                seconds: "giây",
                minutes: "phút",
                hours: "giờ",
                days: "ngày",
                months: "tháng",
                years: "năm",
                centuries: "thế kỷ",
            },
            page: {
                title: "Tạo & Tăng cường Mật khẩu",
                subtitle: "Tạo mật khẩu ngẫu nhiên mạnh mẽ hoặc tăng cường mật khẩu hiện có để bảo mật tối đa",

                whatIs: "Trình tạo mật khẩu là gì?",
                whatIsDesc: "Trình tạo mật khẩu là công cụ tạo mật khẩu ngẫu nhiên mạnh với các tiêu chí tùy chỉnh bao gồm độ dài, loại ký tự và độ phức tạp. Nó sử dụng tạo số ngẫu nhiên an toàn mật mã để tạo mật khẩu hầu như không thể đoán hoặc bẻ khóa bằng tấn công brute force. Mật khẩu mạnh là yếu tố thiết yếu để bảo vệ tài khoản trực tuyến, dữ liệu nhạy cảm và danh tính số khỏi truy cập trái phép.",

                whyStrong: "Tại sao mật khẩu mạnh quan trọng",
                whyStrongDesc: "Mật khẩu yếu là nguyên nhân chính của vi phạm dữ liệu và xâm nhập tài khoản. Mật khẩu mạnh nên dài ít nhất 12-16 ký tự, chứa hỗn hợp chữ hoa, chữ thường, số và ký tự đặc biệt, tránh từ hoặc mẫu phổ biến. Tội phạm mạng sử dụng công cụ tinh vi có thể thử hàng tỷ kết hợp mật khẩu mỗi giây, khiến mật khẩu yếu dễ bị tấn công brute force, tấn công từ điển và tấn công rainbow table.",

                features: "Tính năng chính",
                randomGen: "Tạo mật khẩu ngẫu nhiên",
                randomGenDesc: "Tạo mật khẩu ngẫu nhiên an toàn mật mã lên đến 64 ký tự với tùy chỉnh đầy đủ loại ký tự.",

                memorableGen: "Mật khẩu dễ nhớ",
                memorableGenDesc: "Tạo mật khẩu dễ nhớ sử dụng các từ ngẫu nhiên với ký tự ngăn cách và cải tiến tùy chỉnh.",

                strengthen: "Tăng cường mật khẩu",
                strengthenDesc: "Biến đổi mật khẩu yếu hoặc dễ nhớ thành mật khẩu mạnh bằng cách áp dụng các kỹ thuật cải tiến tự động.",

                strengthAnalysis: "Phân tích độ mạnh",
                strengthAnalysisDesc: "Đánh giá độ mạnh mật khẩu thời gian thực với tính toán entropy và ước tính thời gian bẻ khóa.",

                customizable: "Tùy chỉnh đầy đủ",
                customizableDesc: "Kiểm soát mọi khía cạnh: độ dài, loại ký tự, loại trừ ký tự tương tự và tùy chọn từ dễ nhớ.",

                secure: "Bảo mật phía client",
                secureDesc: "Tất cả tạo mật khẩu diễn ra trong trình duyệt. Không có mật khẩu nào được gửi đến máy chủ hoặc lưu trữ.",

                howToUse: "Cách sử dụng",
                step1: "Chọn phương thức tạo",
                step1Desc: "Chọn 'Tạo mật khẩu' cho mật khẩu ngẫu nhiên hoặc 'Tăng cường' để cải thiện mật khẩu hiện có.",

                step2: "Tùy chỉnh tùy chọn",
                step2Desc: "Đặt độ dài, loại ký tự và tùy chọn bổ sung dựa trên yêu cầu bảo mật của bạn.",

                step3: "Tạo hoặc tăng cường",
                step3Desc: "Nhấp nút để tạo mật khẩu. Xem chỉ báo độ mạnh và entropy.",

                step4: "Sao chép và sử dụng",
                step4Desc: "Sao chép mật khẩu vào clipboard và sử dụng cho tài khoản. Không bao giờ dùng lại mật khẩu!",

                passwordTypes: "Các loại mật khẩu",
                randomPassword: "Mật khẩu ngẫu nhiên",
                randomPasswordDesc: "Ký tự hoàn toàn ngẫu nhiên để bảo mật tối đa. Ví dụ: X7#mK9@pL2$qR5",

                memorablePassword: "Mật khẩu dễ nhớ",
                memorablePasswordDesc: "Nhiều từ ngẫu nhiên kết hợp. Ví dụ: Dung-Ma-Pin-Sach",

                strengthenedPassword: "Mật khẩu tăng cường",
                strengthenedPasswordDesc: "Mật khẩu quen thuộc được cải thiện với các sửa đổi bảo mật.",

                passphrasePassword: "Cụm mật khẩu",
                passphrasePasswordDesc: "Cụm từ dài vừa an toàn vừa dễ nhớ. Dài hơn là mạnh hơn!",

                bestPractices: "Thực hành tốt nhất",
                practice1: "Sử dụng ít nhất 12-16 ký tự cho tài khoản quan trọng",
                practice2: "Không bao giờ dùng lại mật khẩu trên các tài khoản khác nhau",
                practice3: "Sử dụng trình quản lý mật khẩu để lưu mật khẩu độc nhất",
                practice4: "Bật xác thực hai yếu tố (2FA) khi có thể",
                practice5: "Thay đổi mật khẩu ngay lập tức nếu phát hiện vi phạm",
                practice6: "Tránh thông tin cá nhân (tên, ngày sinh, v.v.)",
                practice7: "Không chia sẻ mật khẩu qua email, tin nhắn hoặc kênh không bảo mật",
                practice8: "Cập nhật mật khẩu định kỳ cho tài khoản quan trọng",

                securityTips: "Mẹo bảo mật",
                tip1: "Mật khẩu dài mạnh hơn theo cấp số nhân so với mật khẩu ngắn phức tạp",
                tip2: "Cụm mật khẩu (4+ từ ngẫu nhiên) vừa mạnh vừa dễ nhớ",
                tip3: "Thêm chỉ một ký tự đặc biệt tăng thời gian bẻ khóa đáng kể",
                tip4: "Không bao giờ dùng mẫu bàn phím (qwerty, 12345, asdf)",
                tip5: "Kiểm tra mật khẩu hiện có cho vi phạm tại haveibeenpwned.com",
                tip6: "Sử dụng mật khẩu khác nhau cho email, ngân hàng và mạng xã hội",

                commonMistakes: "Lỗi phổ biến cần tránh",
                mistake1: "Sử dụng từ trong từ điển không sửa đổi",
                mistake2: "Thay thế đơn giản (Password → P@ssw0rd) dễ bị bẻ khóa",
                mistake3: "Dùng lại mật khẩu, ngay cả với biến thể nhỏ",
                mistake4: "Viết mật khẩu dưới dạng văn bản thuần hoặc giấy nhớ",
                mistake5: "Sử dụng thông tin cá nhân (tên thú cưng, ngày sinh, địa chỉ)",
                mistake6: "Chia sẻ mật khẩu với đồng nghiệp hoặc thành viên gia đình",

                entropyExplained: "Hiểu về Entropy mật khẩu",
                entropyDesc: "Entropy đo độ ngẫu nhiên mật khẩu theo bit. Entropy cao nghĩa là nhiều kết hợp có thể và thời gian bẻ khóa lâu hơn. Mật khẩu ngẫu nhiên thực sự 12 ký tự với tất cả loại ký tự có ~78 bit entropy, yêu cầu hàng nghìn tỷ năm để bẻ khóa với công nghệ hiện tại.",
                entropyLow: "< 40 bit: Yếu - Có thể bị bẻ khóa nhanh",
                entropyMedium: "40-60 bit: Trung bình - Chống lại tấn công cơ bản",
                entropyHigh: "60-80 bit: Mạnh - Rất khó bẻ khóa",
                entropyVeryHigh: "> 80 bit: Rất mạnh - Hầu như không thể bẻ khóa",

                timeToCrackExplained: "Cách tính thời gian bẻ khóa",
                timeToCrackDesc:
                    "Thời gian bẻ khóa giả định kẻ tấn công mạnh thực hiện 1 tỷ lần thử mỗi giây (khả năng GPU hiện đại). Với mật khẩu có kích thước bộ ký tự C và độ dài L, có C^L tổ hợp có thể. Thời gian = (C^L) / (1.000.000.000 lần thử/giây). Ví dụ, mật khẩu 12 ký tự với 94 ký tự có thể (tất cả loại) có 94^12 = 4,75 × 10^23 tổ hợp, mất 15 triệu năm để bẻ khóa với tốc độ 1 tỷ lần thử/giây. Thời gian thực tế có thể khác nhau dựa trên phương pháp tấn công, phần cứng và cách lưu trữ mật khẩu (hashing làm chậm tấn công).",

                tools: "Công cụ liên quan",
                hashGenerator: "Hash Generator - Hash mật khẩu để lưu trữ",
                base64: "Base64 Encoder - Mã hóa thông tin đăng nhập an toàn",
                encryption: "Mã hóa văn bản - Bảo mật thông tin nhạy cảm",

                faq: "Câu hỏi thường gặp",
                q1: "Mật khẩu của tôi nên dài bao nhiêu?",
                a1: "Đối với hầu hết tài khoản, 12-16 ký tự là đủ. Đối với tài khoản quan trọng (email, ngân hàng), sử dụng 16+ ký tự. Mật khẩu càng dài, càng khó bẻ khóa theo cấp số nhân. Mật khẩu 16 ký tự mạnh hơn hàng triệu tỷ lần so với mật khẩu 8 ký tự.",

                q2: "Mật khẩu dễ nhớ có an toàn không?",
                a2: "Có! Cụm mật khẩu như 'Dung-Ma-Pin-Sach' rất an toàn khi sử dụng từ ngẫu nhiên thực sự. 4-5 từ ngẫu nhiên với ký tự ngăn cách và số cung cấp bảo mật tuyệt vời trong khi dễ nhớ hơn nhiều so với ký tự ngẫu nhiên. Điều quan trọng là sử dụng từ ngẫu nhiên, không phải cụm từ có ý nghĩa.",

                q3: "Tôi có nên sử dụng ký tự đặc biệt trong mật khẩu không?",
                a3: "Ký tự đặc biệt tăng độ mạnh mật khẩu, nhưng độ dài quan trọng hơn. Mật khẩu 16 ký tự chỉ có chữ cái và số mạnh hơn mật khẩu 10 ký tự với tất cả loại ký tự. Tuy nhiên, ký tự đặc biệt thêm entropy và được khuyến nghị khi có thể.",

                q4: "Tôi nên thay đổi mật khẩu bao lâu một lần?",
                a4: "Chỉ thay đổi mật khẩu nếu: (1) Có vi phạm dữ liệu, (2) Bạn nghi ngờ bị xâm nhập, hoặc (3) Bạn đã chia sẻ nó. Thay đổi tùy ý thường xuyên có thể dẫn đến mật khẩu yếu hơn vì mọi người sử dụng mẫu có thể dự đoán. Tập trung vào sử dụng mật khẩu mạnh, độc nhất với 2FA thay vào đó.",

                q5: "Sử dụng trình quản lý mật khẩu có an toàn không?",
                a5: "Có! Trình quản lý mật khẩu là thiết yếu cho bảo mật hiện đại. Chúng tạo và lưu trữ mật khẩu độc nhất cho mỗi tài khoản, được mã hóa bằng mật khẩu chính. Trình quản lý uy tín sử dụng mã hóa cấp quân sự và an toàn hơn nhiều so với dùng lại mật khẩu hoặc viết ra.",

                q6: "Nếu tôi không thể nhớ mật khẩu phức tạp thì sao?",
                a6: "Sử dụng cụm mật khẩu dễ nhớ (từ ngẫu nhiên), hoặc để trình quản lý mật khẩu nhớ chúng cho bạn. Đối với mật khẩu bạn phải nhớ (như mật khẩu chính), sử dụng tính năng tăng cường để cải thiện cụm từ quen thuộc trong khi vẫn giữ tính dễ nhớ.",

                q7: "Hacker có thể bẻ khóa bất kỳ mật khẩu nào không?",
                a7: "Với thời gian và sức mạnh tính toán không giới hạn, có. Tuy nhiên, mật khẩu ngẫu nhiên thực sự 16+ ký tự sẽ mất siêu máy tính hiện tại hàng nghìn tỷ năm để bẻ khóa. Mục tiêu là làm cho mật khẩu không khả thi về mặt tính toán để bẻ khóa, không phải không thể về mặt lý thuyết.",

                q8: "Sự khác biệt giữa mật khẩu ngẫu nhiên và tăng cường là gì?",
                a8: "Mật khẩu ngẫu nhiên được tạo từ đầu với entropy tối đa. Mật khẩu tăng cường bắt đầu với đầu vào quen thuộc của bạn và áp dụng biến đổi để tăng bảo mật trong khi duy trì một số tính dễ nhớ. Sử dụng ngẫu nhiên cho bảo mật tối đa, tăng cường cho mật khẩu bạn cần gõ thường xuyên.",
            },
        },
    },
};
