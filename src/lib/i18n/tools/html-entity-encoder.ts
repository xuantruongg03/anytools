export const htmlEntityEncoderTranslations = {
    en: {
        htmlEntityEncoder: {
            ui: {
                inputLabel: "Input Text",
                inputPlaceholder: "Enter text or HTML entities...",
                outputLabel: "Output",
                encodeButton: "Encode",
                decodeButton: "Decode",
                clearButton: "Clear",
                copyButton: "Copy",
                copiedButton: "Copied!",
                commonEntities: "Common HTML Entities",
                entityName: "Entity",
                character: "Character",
                description: "Description",
            },
            page: {
                title: "HTML Entity Encoder/Decoder",
                subtitle: "Convert special characters to HTML entities and vice versa instantly",

                whatIs: "What is HTML Entity Encoder/Decoder?",
                whatIsDesc:
                    "An HTML Entity Encoder/Decoder is a tool that converts special characters into their corresponding HTML entity representations and vice versa. HTML entities are used to display reserved characters in HTML that otherwise might be interpreted as code, or to display characters that aren't readily available on your keyboard. For example, the less-than symbol (<) is encoded as &lt; to prevent browsers from interpreting it as the start of an HTML tag. This tool is essential for web developers, content creators, and anyone working with HTML to ensure proper character display and prevent security vulnerabilities.",

                whyImportant: "Why HTML Entity Encoding Matters",
                whyImportantDesc:
                    "HTML entity encoding is crucial for web security and proper content display. Without proper encoding, special characters in user input can lead to Cross-Site Scripting (XSS) attacks, where malicious code is injected into web pages. Encoding ensures that characters like <, >, &, and quotes are displayed as text rather than being executed as HTML or JavaScript. Additionally, HTML entities allow you to display characters that aren't on standard keyboards, support multiple languages, and ensure consistent character rendering across different browsers and platforms. Proper encoding is a fundamental practice in web development and content management.",

                commonEntities: "Common HTML Entities",
                ampersand: "& → &amp; (Ampersand)",
                lessThan: "< → &lt; (Less than)",
                greaterThan: "> → &gt; (Greater than)",
                quote: '" → &quot; (Double quote)',
                apostrophe: "' → &#39; or &apos; (Apostrophe/Single quote)",
                nbsp: "  → &nbsp; (Non-breaking space)",
                copyright: "© → &copy; (Copyright)",
                registered: "® → &reg; (Registered trademark)",
                trademark: "™ → &trade; (Trademark)",
                euro: "€ → &euro; (Euro sign)",
                pound: "£ → &pound; (Pound sign)",
                yen: "¥ → &yen; (Yen sign)",

                types: "Types of HTML Entities",
                namedEntities: "Named Entities: Human-readable names like &amp;, &lt;, &copy;. Easy to remember and widely supported. Example: &euro; for €",
                numericEntities: "Numeric Entities (Decimal): Use character code numbers like &#169; for ©. Universal support for all Unicode characters.",
                hexEntities: "Hexadecimal Entities: Use hex codes like &#x00A9; for ©. Alternative to decimal, often used in Unicode references.",

                whenToUse: "When to Use HTML Entities",
                use1: "User Input: Always encode user-submitted content before displaying it to prevent XSS attacks.",
                use2: "Special Characters: Display reserved HTML characters (<, >, &, quotes) as text instead of code.",
                use3: "Unicode Characters: Show symbols, emojis, or characters from different languages that might not be in standard character sets.",
                use4: "Email Content: Ensure special characters display correctly across different email clients.",
                use5: "XML/XHTML: Required for proper XML parsing and validation.",
                use6: "Meta Tags: Encode special characters in meta descriptions and titles for SEO.",

                security: "Security Considerations",
                securityDesc:
                    "HTML entity encoding is a critical security measure against XSS (Cross-Site Scripting) attacks. When you don't encode user input, attackers can inject malicious scripts into your web pages. For example, if a user submits '<script>alert(\"hacked\")</script>' and you display it without encoding, the script will execute. Proper encoding converts this to '&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;' which displays as harmless text. Always encode user input on the server side, not just client side. Use built-in functions in your programming language (like htmlspecialchars() in PHP, escape() in JavaScript, or html.escape() in Python) rather than writing your own encoding functions. Remember: never trust user input, always validate and encode.",

                bestPractices: "Best Practices",
                practice1: "Server-Side Encoding: Always encode on the server to prevent client-side bypass.",
                practice2: "Context-Aware Encoding: Different contexts (HTML, JavaScript, CSS, URL) require different encoding.",
                practice3: "Use Built-in Functions: Don't write your own encoders; use language-specific functions.",
                practice4: "Double Encoding: Avoid encoding already-encoded text; it creates display issues.",
                practice5: "Validate Input: Encoding is not a substitute for input validation; use both.",
                practice6: "Content Security Policy: Combine encoding with CSP headers for defense in depth.",
                practice7: "Database Storage: Store data in original form; encode only when displaying.",
                practice8: "Test Thoroughly: Test with malicious inputs to verify encoding effectiveness.",

                encoding: "Encoding Special Characters",
                encodingDesc:
                    "HTML encoding replaces special characters with entity codes. The five essential characters to encode are: & (ampersand) becomes &amp;, < (less than) becomes &lt;, > (greater than) becomes &gt;, \" (double quote) becomes &quot;, and ' (apostrophe) becomes &#39; or &apos;. These are the minimum characters you must encode to prevent HTML injection. However, for comprehensive security and internationalization, you should also encode characters outside the ASCII range (128+), control characters, and context-specific characters. Many programming languages provide functions that automatically encode all necessary characters.",

                decoding: "Decoding HTML Entities",
                decodingDesc:
                    "HTML entity decoding converts entity codes back into their original characters. This is useful when you need to process or display encoded text, or when migrating content between systems. However, be cautious when decoding user input - only decode trusted content, as decoding malicious encoded scripts can create security vulnerabilities. The decoding process recognizes both named entities (&copy;) and numeric entities (&#169; or &#x00A9;), converting them to their character equivalents. Modern browsers automatically decode entities in HTML content, but you might need manual decoding when processing data in JavaScript or backend code.",

                specialCases: "Special Cases & Edge Cases",
                case1: "Nested Encoding: Some systems double-encode, creating entities like &amp;lt; which displays as &lt;",
                case2: "Invalid Entities: Browsers may render invalid entities differently; always use correct syntax.",
                case3: "Whitespace: Non-breaking spaces (&nbsp;) prevent line breaks, regular spaces collapse.",
                case4: "Case Sensitivity: Named entities are case-sensitive; &Copy; is different from &copy;",
                case5: "Numeric Ranges: Not all numeric codes are valid; some create unpredictable results.",
                case6: "Browser Quirks: Old browsers may not support all named entities; numeric is safer for compatibility.",

                tools: "Tools & Libraries",
                tool1: "JavaScript: Use textContent (auto-encodes) or libraries like DOMPurify for sanitization.",
                tool2: "PHP: htmlspecialchars() for encoding, html_entity_decode() for decoding.",
                tool3: "Python: html.escape() for encoding, html.unescape() for decoding.",
                tool4: "Java: StringEscapeUtils from Apache Commons Lang library.",
                tool5: "C#: HttpUtility.HtmlEncode() and HttpUtility.HtmlDecode().",
                tool6: "Ruby: CGI.escapeHTML() and CGI.unescapeHTML().",

                examples: "Practical Examples",
                example1: "User Comment Display:\nInput: I love <script>alert('test')</script> this!\nEncoded: I love &lt;script&gt;alert('test')&lt;/script&gt; this!",
                example2: "Copyright Notice:\nInput: © 2025 Company Name\nEncoded: &copy; 2025 Company Name",
                example3: "Math Expression:\nInput: 5 < 10 && 10 > 5\nEncoded: 5 &lt; 10 &amp;&amp; 10 &gt; 5",
                example4: 'Quote in Attribute:\nInput: <div title="John\'s book">\nEncoded: <div title="John&#39;s book">',

                faq: "Frequently Asked Questions",
                q1: "What's the difference between encoding and escaping?",
                a1: "Encoding and escaping are often used interchangeably, but technically, encoding converts characters to a different representation (like HTML entities), while escaping adds a special character (like backslash) to neutralize special meaning. In HTML context, we use 'encoding' to convert characters to entities. Both serve the same purpose: making special characters safe for their context.",

                q2: "Do I need to encode all special characters?",
                a2: "At minimum, encode the five critical characters: &, <, >, \", and '. However, for comprehensive security and internationalization, it's best to encode all characters outside the safe ASCII range (letters, numbers, common punctuation). Many modern encoding functions do this automatically. When in doubt, encode more rather than less.",

                q3: "Should I encode data before storing in a database?",
                a3: "No! Store data in its original, unencoded form in the database. Encode only when displaying the data in HTML. This allows you to use the data in different contexts (JSON API, email, etc.) without needing to decode and re-encode. It also prevents double-encoding issues and keeps your data clean and flexible.",

                q4: "Can I use encoding to prevent SQL injection?",
                a4: "No! HTML entity encoding does NOT protect against SQL injection. For database queries, use parameterized queries (prepared statements), which is the correct defense against SQL injection. HTML encoding is specifically for preventing XSS in HTML contexts. Different attack vectors require different defenses.",

                q5: "Why does my encoded text look garbled?",
                a5: "This usually happens due to double-encoding (encoding already-encoded text) or incorrect character set declarations. Make sure you're encoding only once, and that your HTML page declares the correct charset (usually UTF-8) in the <meta charset> tag. Also verify that your database and server are using the same character encoding.",

                q6: "Are named entities better than numeric entities?",
                a6: "Named entities (&copy;) are more readable and memorable, but numeric entities (&#169;) have universal support for all Unicode characters. Use named entities for common characters where they exist, and numeric entities for less common characters or when you need guaranteed compatibility with older browsers.",

                q7: "How do I handle encoding in JavaScript frameworks?",
                a7: "Modern frameworks like React, Vue, and Angular automatically encode text content to prevent XSS. However, be careful with dangerouslySetInnerHTML (React) or v-html (Vue) - these bypass encoding and can create vulnerabilities. Only use them with trusted content or content you've sanitized with a library like DOMPurify.",

                q8: "What about encoding in JSON APIs?",
                a8: "JSON has its own escaping rules (backslash escaping for quotes and special characters). Don't HTML-encode data in JSON APIs - send raw data and let the client encode it when displaying in HTML. Mixing HTML encoding in JSON creates unnecessary complexity and can cause double-encoding when the client also encodes.",
            },
        },
    },
    vi: {
        htmlEntityEncoder: {
            ui: {
                inputLabel: "Văn Bản Đầu Vào",
                inputPlaceholder: "Nhập văn bản hoặc HTML entities...",
                outputLabel: "Kết Quả",
                encodeButton: "Mã Hóa",
                decodeButton: "Giải Mã",
                clearButton: "Xóa",
                copyButton: "Sao Chép",
                copiedButton: "Đã Sao Chép!",
                commonEntities: "HTML Entities Phổ Biến",
                entityName: "Entity",
                character: "Ký Tự",
                description: "Mô Tả",
            },
            page: {
                title: "Mã Hóa/Giải Mã HTML Entity",
                subtitle: "Chuyển đổi ký tự đặc biệt sang HTML entities và ngược lại ngay lập tức",

                whatIs: "Công Cụ Mã Hóa/Giải Mã HTML Entity Là Gì?",
                whatIsDesc:
                    "Công cụ mã hóa/giải mã HTML Entity chuyển đổi ký tự đặc biệt thành HTML entity representations tương ứng và ngược lại. HTML entities được dùng để hiển thị ký tự dành riêng trong HTML mà nếu không sẽ bị hiểu là code, hoặc hiển thị ký tự không có sẵn trên bàn phím. Ví dụ, ký hiệu nhỏ hơn (<) được mã hóa thành &lt; để ngăn browsers hiểu là đầu HTML tag. Công cụ này thiết yếu cho web developers, content creators và ai làm việc với HTML để đảm bảo hiển thị ký tự đúng và ngăn lỗ hổng bảo mật.",

                whyImportant: "Tại Sao Mã Hóa HTML Entity Quan Trọng",
                whyImportantDesc:
                    "Mã hóa HTML entity rất quan trọng cho web security và hiển thị content đúng. Không mã hóa đúng, ký tự đặc biệt trong user input có thể dẫn đến Cross-Site Scripting (XSS) attacks, nơi malicious code được inject vào web pages. Mã hóa đảm bảo ký tự như <, >, &, và quotes được hiển thị như text thay vì execute như HTML hoặc JavaScript. Thêm vào đó, HTML entities cho phép hiển thị ký tự không có trên bàn phím chuẩn, hỗ trợ nhiều ngôn ngữ và đảm bảo character rendering nhất quán trên browsers và platforms khác nhau. Mã hóa đúng là thực hành cơ bản trong web development và content management.",

                commonEntities: "HTML Entities Phổ Biến",
                ampersand: "& → &amp; (Dấu và)",
                lessThan: "< → &lt; (Nhỏ hơn)",
                greaterThan: "> → &gt; (Lớn hơn)",
                quote: '" → &quot; (Nháy kép)',
                apostrophe: "' → &#39; hoặc &apos; (Nháy đơn)",
                nbsp: "  → &nbsp; (Khoảng trắng không ngắt)",
                copyright: "© → &copy; (Bản quyền)",
                registered: "® → &reg; (Nhãn hiệu đã đăng ký)",
                trademark: "™ → &trade; (Nhãn hiệu)",
                euro: "€ → &euro; (Ký hiệu Euro)",
                pound: "£ → &pound; (Ký hiệu Bảng)",
                yen: "¥ → &yen; (Ký hiệu Yên)",

                types: "Loại HTML Entities",
                namedEntities: "Named Entities: Tên dễ đọc như &amp;, &lt;, &copy;. Dễ nhớ và hỗ trợ rộng rãi. Ví dụ: &euro; cho €",
                numericEntities: "Numeric Entities (Thập phân): Dùng mã số ký tự như &#169; cho ©. Hỗ trợ toàn cục cho mọi Unicode characters.",
                hexEntities: "Hexadecimal Entities: Dùng mã hex như &#x00A9; cho ©. Thay thế cho thập phân, thường dùng trong Unicode references.",

                whenToUse: "Khi Nào Dùng HTML Entities",
                use1: "User Input: Luôn mã hóa user-submitted content trước khi hiển thị để ngăn XSS attacks.",
                use2: "Ký Tự Đặc Biệt: Hiển thị ký tự HTML dành riêng (<, >, &, quotes) như text thay vì code.",
                use3: "Unicode Characters: Hiển thị symbols, emojis hoặc ký tự từ ngôn ngữ khác không có trong character sets chuẩn.",
                use4: "Email Content: Đảm bảo ký tự đặc biệt hiển thị đúng trên email clients khác nhau.",
                use5: "XML/XHTML: Bắt buộc cho XML parsing và validation đúng.",
                use6: "Meta Tags: Mã hóa ký tự đặc biệt trong meta descriptions và titles cho SEO.",

                security: "Cân Nhắc Bảo Mật",
                securityDesc:
                    "Mã hóa HTML entity là biện pháp bảo mật quan trọng chống XSS (Cross-Site Scripting) attacks. Khi không mã hóa user input, attackers có thể inject malicious scripts vào web pages. Ví dụ, nếu user submit '<script>alert(\"hacked\")</script>' và bạn hiển thị không mã hóa, script sẽ execute. Mã hóa đúng chuyển thành '&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;' hiển thị như harmless text. Luôn mã hóa user input ở server side, không chỉ client side. Dùng built-in functions trong programming language (như htmlspecialchars() trong PHP, escape() trong JavaScript, hoặc html.escape() trong Python) thay vì viết encoding functions riêng. Nhớ: không bao giờ tin user input, luôn validate và encode.",

                bestPractices: "Thực Hành Tốt Nhất",
                practice1: "Server-Side Encoding: Luôn mã hóa ở server để ngăn client-side bypass.",
                practice2: "Context-Aware Encoding: Contexts khác nhau (HTML, JavaScript, CSS, URL) yêu cầu encoding khác nhau.",
                practice3: "Dùng Built-in Functions: Đừng viết encoders riêng; dùng functions của ngôn ngữ.",
                practice4: "Double Encoding: Tránh mã hóa text đã mã hóa; tạo vấn đề hiển thị.",
                practice5: "Validate Input: Encoding không thay thế input validation; dùng cả hai.",
                practice6: "Content Security Policy: Kết hợp encoding với CSP headers cho defense in depth.",
                practice7: "Database Storage: Lưu data ở dạng gốc; mã hóa chỉ khi hiển thị.",
                practice8: "Test Kỹ Lưỡng: Test với malicious inputs để verify encoding effectiveness.",

                encoding: "Mã Hóa Ký Tự Đặc Biệt",
                encodingDesc:
                    "Mã hóa HTML thay thế ký tự đặc biệt bằng entity codes. Năm ký tự thiết yếu cần mã hóa là: & (ampersand) thành &amp;, < (nhỏ hơn) thành &lt;, > (lớn hơn) thành &gt;, \" (nháy kép) thành &quot;, và ' (nháy đơn) thành &#39; hoặc &apos;. Đây là ký tự tối thiểu phải mã hóa để ngăn HTML injection. Tuy nhiên, cho security và internationalization toàn diện, bạn nên mã hóa ký tự ngoài ASCII range (128+), control characters và context-specific characters. Nhiều programming languages cung cấp functions tự động mã hóa mọi ký tự cần thiết.",

                decoding: "Giải Mã HTML Entities",
                decodingDesc:
                    "Giải mã HTML entity chuyển entity codes về ký tự gốc. Điều này hữu ích khi cần xử lý hoặc hiển thị encoded text, hoặc khi migrate content giữa systems. Tuy nhiên, cẩn thận khi decode user input - chỉ decode trusted content, vì decode malicious encoded scripts có thể tạo lỗ hổng bảo mật. Quá trình decoding nhận cả named entities (&copy;) và numeric entities (&#169; hoặc &#x00A9;), chuyển về character equivalents. Modern browsers tự động decode entities trong HTML content, nhưng bạn có thể cần manual decoding khi xử lý data trong JavaScript hoặc backend code.",

                specialCases: "Trường Hợp Đặc Biệt & Edge Cases",
                case1: "Nested Encoding: Một số systems double-encode, tạo entities như &amp;lt; hiển thị như &lt;",
                case2: "Invalid Entities: Browsers có thể render invalid entities khác nhau; luôn dùng syntax đúng.",
                case3: "Whitespace: Non-breaking spaces (&nbsp;) ngăn line breaks, regular spaces collapse.",
                case4: "Case Sensitivity: Named entities phân biệt hoa thường; &Copy; khác &copy;",
                case5: "Numeric Ranges: Không phải mọi numeric codes hợp lệ; một số tạo kết quả unpredictable.",
                case6: "Browser Quirks: Old browsers có thể không hỗ trợ mọi named entities; numeric an toàn hơn cho compatibility.",

                tools: "Công Cụ & Thư Viện",
                tool1: "JavaScript: Dùng textContent (auto-encodes) hoặc libraries như DOMPurify cho sanitization.",
                tool2: "PHP: htmlspecialchars() cho encoding, html_entity_decode() cho decoding.",
                tool3: "Python: html.escape() cho encoding, html.unescape() cho decoding.",
                tool4: "Java: StringEscapeUtils từ Apache Commons Lang library.",
                tool5: "C#: HttpUtility.HtmlEncode() và HttpUtility.HtmlDecode().",
                tool6: "Ruby: CGI.escapeHTML() và CGI.unescapeHTML().",

                examples: "Ví Dụ Thực Tế",
                example1: "Hiển Thị Comment Người Dùng:\nInput: I love <script>alert('test')</script> this!\nEncoded: I love &lt;script&gt;alert('test')&lt;/script&gt; this!",
                example2: "Thông Báo Bản Quyền:\nInput: © 2025 Company Name\nEncoded: &copy; 2025 Company Name",
                example3: "Biểu Thức Toán:\nInput: 5 < 10 && 10 > 5\nEncoded: 5 &lt; 10 &amp;&amp; 10 &gt; 5",
                example4: 'Quote trong Attribute:\nInput: <div title="John\'s book">\nEncoded: <div title="John&#39;s book">',

                faq: "Câu Hỏi Thường Gặp",
                q1: "Khác biệt giữa encoding và escaping là gì?",
                a1: "Encoding và escaping thường dùng thay thế cho nhau, nhưng technically, encoding chuyển ký tự sang representation khác (như HTML entities), trong khi escaping thêm ký tự đặc biệt (như backslash) để vô hiệu hóa ý nghĩa đặc biệt. Trong HTML context, chúng ta dùng 'encoding' để chuyển ký tự sang entities. Cả hai phục vụ cùng mục đích: làm ký tự đặc biệt an toàn cho context của chúng.",

                q2: "Tôi có cần mã hóa mọi ký tự đặc biệt không?",
                a2: "Tối thiểu, mã hóa năm ký tự quan trọng: &, <, >, \", và '. Tuy nhiên, cho security và internationalization toàn diện, tốt nhất mã hóa mọi ký tự ngoài safe ASCII range (letters, numbers, common punctuation). Nhiều modern encoding functions làm điều này tự động. Khi nghi ngờ, mã hóa nhiều hơn là ít.",

                q3: "Tôi nên mã hóa data trước khi lưu database không?",
                a3: "Không! Lưu data ở dạng gốc, không mã hóa trong database. Mã hóa chỉ khi hiển thị data trong HTML. Điều này cho phép dùng data trong contexts khác (JSON API, email, etc.) mà không cần decode và re-encode. Nó cũng ngăn double-encoding issues và giữ data clean và flexible.",

                q4: "Tôi có thể dùng encoding để ngăn SQL injection không?",
                a4: "Không! HTML entity encoding KHÔNG bảo vệ chống SQL injection. Cho database queries, dùng parameterized queries (prepared statements), đó là defense đúng chống SQL injection. HTML encoding cụ thể cho ngăn XSS trong HTML contexts. Attack vectors khác nhau yêu cầu defenses khác nhau.",

                q5: "Tại sao encoded text của tôi nhìn lộn xộn?",
                a5: "Điều này thường xảy ra do double-encoding (mã hóa text đã mã hóa) hoặc character set declarations không đúng. Đảm bảo bạn mã hóa chỉ một lần, và HTML page khai báo charset đúng (thường UTF-8) trong <meta charset> tag. Cũng verify database và server dùng cùng character encoding.",

                q6: "Named entities tốt hơn numeric entities?",
                a6: "Named entities (&copy;) dễ đọc và nhớ hơn, nhưng numeric entities (&#169;) có universal support cho mọi Unicode characters. Dùng named entities cho ký tự phổ biến nơi chúng tồn tại, và numeric entities cho ký tự ít phổ biến hoặc khi cần guaranteed compatibility với old browsers.",

                q7: "Làm sao xử lý encoding trong JavaScript frameworks?",
                a7: "Modern frameworks như React, Vue và Angular tự động encode text content để ngăn XSS. Tuy nhiên, cẩn thận với dangerouslySetInnerHTML (React) hoặc v-html (Vue) - chúng bypass encoding và có thể tạo vulnerabilities. Chỉ dùng với trusted content hoặc content đã sanitized với library như DOMPurify.",

                q8: "Còn encoding trong JSON APIs thì sao?",
                a8: "JSON có escaping rules riêng (backslash escaping cho quotes và special characters). Đừng HTML-encode data trong JSON APIs - gửi raw data và để client encode khi hiển thị trong HTML. Mix HTML encoding trong JSON tạo unnecessary complexity và có thể gây double-encoding khi client cũng encodes.",
            },
        },
    },
};
