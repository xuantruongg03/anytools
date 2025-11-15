export const timestampConverterTranslations = {
    en: {
        timestampConverter: {
            page: {
                title: "Timestamp Converter",
                subtitle: "Convert between Unix timestamp and human-readable date",

                whatIs: "What is Unix Timestamp?",
                whatIsDesc: "Unix timestamp (also known as Epoch time or POSIX time) is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, which is 00:00:00 UTC on 1 January 1970, excluding leap seconds. This timestamp format is widely used in programming and computing because it represents time as a simple integer, making it easy to store, compare, and manipulate across different systems and time zones.",

                history: "History of Unix Timestamp",
                historyDesc:
                    "The Unix timestamp was introduced in the early versions of the Unix operating system in the 1970s. It was designed by Ken Thompson and Dennis Ritchie as a simple way to represent time in a computer system. The choice of January 1, 1970, as the epoch was somewhat arbitrary but became the standard. This system became widely adopted because of its simplicity and efficiency. The 32-bit signed integer implementation will reach its maximum value on January 19, 2038, at 03:14:07 UTC, known as the Year 2038 problem, which has led to the adoption of 64-bit timestamps in modern systems.",

                howWorks: "How Unix Timestamp Works",
                howWorksDesc:
                    "Unix timestamp counts the number of seconds from the epoch (January 1, 1970, 00:00:00 UTC). For example, the timestamp 1700000000 represents Wednesday, November 14, 2023, 22:13:20 UTC. The system is straightforward: to get the current timestamp, you simply count the seconds from the epoch to now. This makes calculations like determining the time difference between two events as simple as subtracting two numbers. The timestamp is always in UTC, which means it's independent of time zones and daylight saving time changes.",

                formats: "Common Timestamp Formats",
                formatsList: {
                    seconds: "Unix Timestamp (seconds): Standard format, 10 digits (e.g., 1700000000)",
                    milliseconds: "Unix Timestamp (milliseconds): JavaScript format, 13 digits (e.g., 1700000000000)",
                    microseconds: "Unix Timestamp (microseconds): High precision, 16 digits (e.g., 1700000000000000)",
                    iso8601: "ISO 8601: Human-readable format (e.g., 2023-11-14T22:13:20Z)",
                    rfc2822: "RFC 2822: Email format (e.g., Wed, 14 Nov 2023 22:13:20 +0000)",
                },

                useCases: "Common Use Cases",
                useCasesList: {
                    database: "Database Storage: Storing date/time in a compact, sortable format",
                    api: "API Communication: Exchanging timestamps between different systems and languages",
                    logging: "System Logging: Recording when events occur in server logs",
                    caching: "Cache Expiration: Setting expiration times for cached data",
                    scheduling: "Task Scheduling: Scheduling jobs and cron tasks",
                    authentication: "Token Expiration: Setting expiration times for authentication tokens and sessions",
                },

                advantages: "Advantages of Unix Timestamp",
                advantagesList: {
                    simple: "Simplicity: Represented as a single integer, easy to store and transmit",
                    universal: "Universal: Works across all time zones and operating systems",
                    sortable: "Sortable: Can be directly compared and sorted numerically",
                    compact: "Compact: Requires minimal storage space (4 or 8 bytes)",
                    calculation: "Easy Calculation: Simple arithmetic for time differences and comparisons",
                    language: "Language Agnostic: Supported by virtually all programming languages",
                },

                timezone: "Understanding Timezones",
                timezoneDesc:
                    "Unix timestamp is always stored in UTC (Coordinated Universal Time). When converting to a human-readable date, you need to consider the timezone where the date will be displayed. Different timezones have different offsets from UTC, ranging from UTC-12 to UTC+14. Additionally, many regions observe Daylight Saving Time (DST), which can shift the local time by one hour during certain periods of the year. When working with timestamps, it's important to always specify the timezone for display purposes, even though the underlying timestamp remains in UTC.",

                y2038Problem: "The Year 2038 Problem",
                y2038Desc:
                    "The Year 2038 problem, also known as Y2038 or the Unix Millennium Bug, occurs because 32-bit signed integers can only represent timestamps up to 2,147,483,647 seconds after the epoch. This corresponds to 03:14:07 UTC on January 19, 2038. After this point, the timestamp will overflow and wrap around to a negative number, causing systems to interpret dates as being in 1901. The solution is to use 64-bit timestamps, which can represent dates far into the future (approximately 292 billion years). Most modern systems have already migrated to 64-bit timestamps.",

                bestPractices: "Best Practices",
                bestPracticesList: {
                    utc: "Always Store in UTC: Store timestamps in UTC and convert to local time only for display",
                    precision: "Choose Appropriate Precision: Use seconds for most cases, milliseconds for high-precision needs",
                    validation: "Validate Input: Always validate timestamp values to ensure they're within reasonable ranges",
                    timezone: "Specify Timezone: When displaying dates, always specify the timezone being used",
                    libraries: "Use Standard Libraries: Rely on well-tested date/time libraries rather than custom implementations",
                    future: "Plan for the Future: Use 64-bit timestamps to avoid the Year 2038 problem",
                },

                features: {
                    free: "100% Free and unlimited conversions",
                    instant: "Instant conversion with real-time updates",
                    offline: "Works completely offline in your browser",
                    noServer: "No data sent to any server - complete privacy",
                    current: "Real-time current timestamp display",
                    bidirectional: "Convert in both directions: timestamp ↔ date",
                },

                howToUse: "How to Use",
                steps: {
                    current: "View Current Timestamp: See the current Unix timestamp in real-time",
                    toDate: "Timestamp to Date: Enter a Unix timestamp and click 'Convert to Date' to see the human-readable format",
                    toTimestamp: "Date to Timestamp: Select a date and time, then click 'Convert to Timestamp' to get the Unix timestamp",
                    formats: "Supported Formats: Automatically detects 10-digit (seconds) and 13-digit (milliseconds) timestamps",
                },

                faq: "Frequently Asked Questions",
                faqList: {
                    q1: "What is the difference between Unix timestamp in seconds and milliseconds?",
                    a1: "Unix timestamp in seconds (10 digits) is the standard format used in most Unix/Linux systems and many programming languages. Milliseconds format (13 digits) is commonly used in JavaScript and provides higher precision for timing events. To convert between them: multiply seconds by 1000 to get milliseconds, or divide milliseconds by 1000 to get seconds.",

                    q2: "How do I handle timezones when working with Unix timestamps?",
                    a2: "Unix timestamps are always in UTC (Universal Time Coordinated). When displaying a timestamp to users, you should convert it to the user's local timezone. Most programming languages provide built-in functions for this. Remember that the timestamp itself doesn't change - only the way it's displayed changes based on the timezone. Always store timestamps in UTC and convert to local time only for display purposes.",

                    q3: "What is the Year 2038 problem and how can I avoid it?",
                    a3: "The Year 2038 problem occurs because 32-bit signed integers can only store timestamps up to January 19, 2038, at 03:14:07 UTC. After this, the timestamp overflows and becomes negative. To avoid this, use 64-bit timestamps which can represent dates far into the future. Most modern programming languages and databases already support 64-bit timestamps by default.",

                    q4: "Can Unix timestamps represent dates before 1970?",
                    a4: "Yes! Dates before January 1, 1970 (the Unix epoch) are represented as negative timestamps. For example, December 31, 1969 would be -86400 (negative one day in seconds). However, some systems and languages may have limitations with negative timestamps, so always test your implementation if you need to work with historical dates.",

                    q5: "How accurate are Unix timestamps?",
                    a5: "Standard Unix timestamps in seconds provide accuracy to the nearest second, which is sufficient for most applications. For higher precision, you can use milliseconds (13 digits), microseconds (16 digits), or even nanoseconds (19 digits). The choice depends on your application's requirements. For example, logging might need only seconds, while financial trading might require microsecond precision.",

                    q6: "Do Unix timestamps account for leap seconds?",
                    a6: "No, Unix timestamps do not account for leap seconds. Leap seconds are occasionally added to UTC to account for irregularities in Earth's rotation, but Unix time treats every day as having exactly 86,400 seconds. This means Unix time is not a true representation of UTC, but rather a simplified timekeeping system that's easier to work with in computing.",

                    q7: "What's the maximum date that can be represented with a 64-bit timestamp?",
                    a7: "A 64-bit signed integer can represent timestamps up to 9,223,372,036,854,775,807 seconds after the epoch. This corresponds to approximately 292 billion years in the future, which is far beyond any practical need. This is why migrating to 64-bit timestamps effectively solves the Year 2038 problem.",

                    q8: "How do I convert between different timestamp formats in programming?",
                    a8: "Most programming languages provide built-in functions. In JavaScript: Date.now() gives milliseconds, Math.floor(Date.now()/1000) gives seconds. In Python: time.time() gives seconds with decimal precision. In Java: System.currentTimeMillis() gives milliseconds. Always check your language's documentation for the specific format returned by time functions and convert as needed.",
                },
            },
        },
    },
    vi: {
        timestampConverter: {
            page: {
                title: "Chuyển Đổi Timestamp",
                subtitle: "Chuyển đổi giữa Unix timestamp và ngày giờ dễ đọc",

                whatIs: "Unix Timestamp là gì?",
                whatIsDesc: "Unix timestamp (còn gọi là Epoch time hoặc POSIX time) là một hệ thống mô tả thời điểm. Đây là số giây đã trôi qua kể từ Unix epoch, tức là 00:00:00 UTC ngày 1 tháng 1 năm 1970, không tính giây nhuận. Định dạng timestamp này được sử dụng rộng rãi trong lập trình và máy tính vì nó biểu diễn thời gian dưới dạng một số nguyên đơn giản, giúp dễ dàng lưu trữ, so sánh và xử lý trên các hệ thống và múi giờ khác nhau.",

                history: "Lịch Sử Unix Timestamp",
                historyDesc:
                    "Unix timestamp được giới thiệu trong các phiên bản đầu tiên của hệ điều hành Unix vào những năm 1970. Nó được thiết kế bởi Ken Thompson và Dennis Ritchie như một cách đơn giản để biểu diễn thời gian trong hệ thống máy tính. Việc chọn ngày 1 tháng 1 năm 1970 làm epoch có phần tùy ý nhưng đã trở thành tiêu chuẩn. Hệ thống này được áp dụng rộng rãi vì tính đơn giản và hiệu quả. Triển khai số nguyên có dấu 32-bit sẽ đạt giá trị tối đa vào ngày 19 tháng 1 năm 2038 lúc 03:14:07 UTC, được gọi là vấn đề Năm 2038, dẫn đến việc áp dụng timestamp 64-bit trong các hệ thống hiện đại.",

                howWorks: "Unix Timestamp Hoạt Động Như Thế Nào",
                howWorksDesc: "Unix timestamp đếm số giây từ epoch (1 tháng 1 năm 1970, 00:00:00 UTC). Ví dụ, timestamp 1700000000 đại diện cho Thứ Tư, 14 tháng 11 năm 2023, 22:13:20 UTC. Hệ thống rất đơn giản: để lấy timestamp hiện tại, bạn chỉ cần đếm số giây từ epoch đến bây giờ. Điều này làm cho các phép tính như xác định khoảng thời gian giữa hai sự kiện đơn giản như trừ hai số. Timestamp luôn ở UTC, có nghĩa là nó độc lập với múi giờ và thay đổi giờ mùa hè.",

                formats: "Các Định Dạng Timestamp Phổ Biến",
                formatsList: {
                    seconds: "Unix Timestamp (giây): Định dạng tiêu chuẩn, 10 chữ số (ví dụ: 1700000000)",
                    milliseconds: "Unix Timestamp (mili giây): Định dạng JavaScript, 13 chữ số (ví dụ: 1700000000000)",
                    microseconds: "Unix Timestamp (micro giây): Độ chính xác cao, 16 chữ số (ví dụ: 1700000000000000)",
                    iso8601: "ISO 8601: Định dạng dễ đọc (ví dụ: 2023-11-14T22:13:20Z)",
                    rfc2822: "RFC 2822: Định dạng email (ví dụ: Wed, 14 Nov 2023 22:13:20 +0000)",
                },

                useCases: "Các Trường Hợp Sử Dụng Phổ Biến",
                useCasesList: {
                    database: "Lưu Trữ Database: Lưu ngày/giờ ở định dạng gọn, có thể sắp xếp",
                    api: "Giao Tiếp API: Trao đổi timestamp giữa các hệ thống và ngôn ngữ khác nhau",
                    logging: "Ghi Log Hệ Thống: Ghi lại thời điểm các sự kiện xảy ra trong log máy chủ",
                    caching: "Hết Hạn Cache: Đặt thời gian hết hạn cho dữ liệu được cache",
                    scheduling: "Lập Lịch Task: Lập lịch các job và cron task",
                    authentication: "Hết Hạn Token: Đặt thời gian hết hạn cho token xác thực và session",
                },

                advantages: "Ưu Điểm Của Unix Timestamp",
                advantagesList: {
                    simple: "Đơn Giản: Biểu diễn dưới dạng một số nguyên, dễ lưu trữ và truyền tải",
                    universal: "Phổ Quát: Hoạt động trên mọi múi giờ và hệ điều hành",
                    sortable: "Có Thể Sắp Xếp: Có thể so sánh và sắp xếp trực tiếp theo số",
                    compact: "Gọn Nhẹ: Yêu cầu không gian lưu trữ tối thiểu (4 hoặc 8 byte)",
                    calculation: "Tính Toán Dễ Dàng: Phép toán đơn giản cho chênh lệch và so sánh thời gian",
                    language: "Độc Lập Ngôn Ngữ: Được hỗ trợ bởi hầu hết mọi ngôn ngữ lập trình",
                },

                timezone: "Hiểu Về Múi Giờ",
                timezoneDesc: "Unix timestamp luôn được lưu trữ ở UTC (Giờ Phối Hợp Quốc Tế). Khi chuyển đổi sang ngày giờ dễ đọc, bạn cần xem xét múi giờ nơi ngày sẽ được hiển thị. Các múi giờ khác nhau có offset khác nhau từ UTC, từ UTC-12 đến UTC+14. Ngoài ra, nhiều khu vực áp dụng Giờ Mùa Hè (DST), có thể thay đổi giờ địa phương một giờ trong một số giai đoạn trong năm. Khi làm việc với timestamp, quan trọng là luôn chỉ định múi giờ cho mục đích hiển thị, mặc dù timestamp cơ bản vẫn ở UTC.",

                y2038Problem: "Vấn Đề Năm 2038",
                y2038Desc:
                    "Vấn đề Năm 2038, còn gọi là Y2038 hoặc Lỗi Thiên Niên Kỷ Unix, xảy ra vì số nguyên có dấu 32-bit chỉ có thể biểu diễn timestamp đến 2.147.483.647 giây sau epoch. Điều này tương ứng với 03:14:07 UTC ngày 19 tháng 1 năm 2038. Sau thời điểm này, timestamp sẽ tràn và quay về số âm, khiến hệ thống hiểu ngày là năm 1901. Giải pháp là sử dụng timestamp 64-bit, có thể biểu diễn ngày xa trong tương lai (khoảng 292 tỷ năm). Hầu hết các hệ thống hiện đại đã chuyển sang timestamp 64-bit.",

                bestPractices: "Thực Hành Tốt Nhất",
                bestPracticesList: {
                    utc: "Luôn Lưu Ở UTC: Lưu timestamp ở UTC và chỉ chuyển sang giờ địa phương khi hiển thị",
                    precision: "Chọn Độ Chính Xác Phù Hợp: Dùng giây cho hầu hết trường hợp, mili giây khi cần độ chính xác cao",
                    validation: "Xác Thực Đầu Vào: Luôn xác thực giá trị timestamp để đảm bảo trong phạm vi hợp lý",
                    timezone: "Chỉ Định Múi Giờ: Khi hiển thị ngày, luôn chỉ định múi giờ đang sử dụng",
                    libraries: "Dùng Thư Viện Chuẩn: Dựa vào thư viện ngày/giờ đã được kiểm tra kỹ thay vì tự triển khai",
                    future: "Lên Kế Hoạch Cho Tương Lai: Sử dụng timestamp 64-bit để tránh vấn đề Năm 2038",
                },

                features: {
                    free: "100% miễn phí và không giới hạn chuyển đổi",
                    instant: "Chuyển đổi tức thì với cập nhật thời gian thực",
                    offline: "Hoạt động hoàn toàn offline trong trình duyệt",
                    noServer: "Không gửi dữ liệu đến máy chủ - hoàn toàn riêng tư",
                    current: "Hiển thị timestamp hiện tại theo thời gian thực",
                    bidirectional: "Chuyển đổi hai chiều: timestamp ↔ ngày",
                },

                howToUse: "Cách Sử Dụng",
                steps: {
                    current: "Xem Timestamp Hiện Tại: Xem Unix timestamp hiện tại theo thời gian thực",
                    toDate: "Timestamp sang Ngày: Nhập Unix timestamp và nhấp 'Convert to Date' để xem định dạng dễ đọc",
                    toTimestamp: "Ngày sang Timestamp: Chọn ngày và giờ, sau đó nhấp 'Convert to Timestamp' để lấy Unix timestamp",
                    formats: "Định Dạng Hỗ Trợ: Tự động phát hiện timestamp 10 chữ số (giây) và 13 chữ số (mili giây)",
                },

                faq: "Câu Hỏi Thường Gặp",
                faqList: {
                    q1: "Sự khác biệt giữa Unix timestamp tính bằng giây và mili giây là gì?",
                    a1: "Unix timestamp tính bằng giây (10 chữ số) là định dạng tiêu chuẩn được sử dụng trong hầu hết các hệ thống Unix/Linux và nhiều ngôn ngữ lập trình. Định dạng mili giây (13 chữ số) thường được sử dụng trong JavaScript và cung cấp độ chính xác cao hơn cho các sự kiện thời gian. Để chuyển đổi: nhân giây với 1000 để có mili giây, hoặc chia mili giây cho 1000 để có giây.",

                    q2: "Làm thế nào để xử lý múi giờ khi làm việc với Unix timestamp?",
                    a2: "Unix timestamp luôn ở UTC (Giờ Phối Hợp Quốc Tế). Khi hiển thị timestamp cho người dùng, bạn nên chuyển đổi sang múi giờ địa phương của người dùng. Hầu hết các ngôn ngữ lập trình cung cấp hàm tích hợp cho việc này. Nhớ rằng chính timestamp không thay đổi - chỉ cách hiển thị thay đổi dựa trên múi giờ. Luôn lưu timestamp ở UTC và chỉ chuyển sang giờ địa phương khi hiển thị.",

                    q3: "Vấn đề Năm 2038 là gì và làm thế nào để tránh nó?",
                    a3: "Vấn đề Năm 2038 xảy ra vì số nguyên có dấu 32-bit chỉ có thể lưu timestamp đến ngày 19 tháng 1 năm 2038 lúc 03:14:07 UTC. Sau đó, timestamp sẽ tràn và trở thành số âm. Để tránh điều này, hãy sử dụng timestamp 64-bit có thể biểu diễn ngày xa trong tương lai. Hầu hết các ngôn ngữ lập trình và database hiện đại đã hỗ trợ timestamp 64-bit mặc định.",

                    q4: "Unix timestamp có thể biểu diễn ngày trước 1970 không?",
                    a4: "Có! Ngày trước ngày 1 tháng 1 năm 1970 (Unix epoch) được biểu diễn dưới dạng timestamp âm. Ví dụ, ngày 31 tháng 12 năm 1969 sẽ là -86400 (âm một ngày tính bằng giây). Tuy nhiên, một số hệ thống và ngôn ngữ có thể có hạn chế với timestamp âm, vì vậy hãy luôn kiểm tra triển khai của bạn nếu cần làm việc với ngày lịch sử.",

                    q5: "Unix timestamp chính xác đến mức nào?",
                    a5: "Unix timestamp tiêu chuẩn tính bằng giây cung cấp độ chính xác đến giây gần nhất, đủ cho hầu hết các ứng dụng. Để có độ chính xác cao hơn, bạn có thể sử dụng mili giây (13 chữ số), micro giây (16 chữ số), hoặc thậm chí nano giây (19 chữ số). Lựa chọn phụ thuộc vào yêu cầu ứng dụng. Ví dụ, logging có thể chỉ cần giây, trong khi giao dịch tài chính có thể yêu cầu độ chính xác micro giây.",

                    q6: "Unix timestamp có tính giây nhuận không?",
                    a6: "Không, Unix timestamp không tính giây nhuận. Giây nhuận thỉnh thoảng được thêm vào UTC để tính đến sự bất thường trong quay của Trái Đất, nhưng Unix time coi mọi ngày có chính xác 86.400 giây. Điều này có nghĩa Unix time không phải là biểu diễn thực sự của UTC, mà là hệ thống giữ thời gian đơn giản hóa dễ làm việc hơn trong máy tính.",

                    q7: "Ngày tối đa có thể biểu diễn với timestamp 64-bit là bao nhiêu?",
                    a7: "Số nguyên có dấu 64-bit có thể biểu diễn timestamp đến 9.223.372.036.854.775.807 giây sau epoch. Điều này tương ứng với khoảng 292 tỷ năm trong tương lai, vượt xa bất kỳ nhu cầu thực tế nào. Đây là lý do tại sao chuyển sang timestamp 64-bit giải quyết hiệu quả vấn đề Năm 2038.",

                    q8: "Làm thế nào để chuyển đổi giữa các định dạng timestamp khác nhau trong lập trình?",
                    a8: "Hầu hết các ngôn ngữ lập trình cung cấp hàm tích hợp. Trong JavaScript: Date.now() cho mili giây, Math.floor(Date.now()/1000) cho giây. Trong Python: time.time() cho giây với độ chính xác thập phân. Trong Java: System.currentTimeMillis() cho mili giây. Luôn kiểm tra tài liệu ngôn ngữ của bạn cho định dạng cụ thể được trả về bởi hàm thời gian và chuyển đổi khi cần.",
                },
            },
        },
    },
};
