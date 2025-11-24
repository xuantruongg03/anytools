export const speechToTextTranslations = {
    en: {
        name: "Speech to Text Converter",
        description: "Convert audio files to text instantly",
        urlLabel: "Audio File",

        // Modes
        fileMode: "Upload File",
        micMode: "Record Audio",

        // File Upload
        uploadButton: "Choose Audio File",
        uploadHint: "Supported formats: MP3, WAV, M4A, OGG (Max 25MB)",
        fileName: "File name",
        fileSize: "File size",
        duration: "Duration",

        // Recording
        startRecording: "Start Recording",
        stopRecording: "Stop Recording",
        pauseRecording: "Pause",
        resumeRecording: "Resume",
        recording: "Recording...",
        recordingTime: "Recording time",
        recordingHint: "Click the button to start recording from your microphone",

        // Service Provider
        serviceProvider: "Service Provider",
        serviceProviderHint: "Choose a service or let the system auto-select",
        auto: "Auto (Recommended)",
        fptAI: "FPT AI",
        microsoftAzure: "Microsoft Azure",

        // Actions
        convert: "Convert to Text",
        converting: "Converting...",
        clear: "Clear",
        copy: "Copy Text",
        copied: "Copied!",
        download: "Download Text",

        // Results
        transcription: "Transcription",
        noText: "No text available",
        transcribing: "Transcribing...",

        // Errors
        error: {
            noFile: "Please select an audio file",
            noRecording: "No recording available",
            invalidFile: "Invalid file format. Please upload an audio file.",
            fileTooLarge: "File is too large. Maximum size is 25MB.",
            micPermission: "Microphone access denied. Please allow microphone access.",
            micNotSupported: "Your browser doesn't support audio recording.",
            uploadFailed: "Failed to upload file",
            conversionFailed: "Failed to convert audio to text",
            genericError: "An error occurred. Please try again.",
        },

        // Info
        infoNote: "Your audio is processed securely and is not stored on our servers.",

        // Page Content
        page: {
            whatIs: "What is Speech to Text Converter?",
            whatIsDesc: "Speech to Text Converter is a powerful tool that converts spoken words from audio files into written text. Using advanced speech recognition technology, it accurately transcribes audio content, making it perfect for creating transcripts, notes, or documentation.",

            whyUse: "Why Use Our Speech to Text Tool?",
            whyUseDesc: "Save time and increase productivity by converting audio to text:",
            benefit1: "Fast and accurate transcription of audio files",
            benefit2: "Support for multiple audio formats (MP3, WAV, M4A, OGG)",
            benefit3: "Record audio from microphone for transcription",
            benefit4: "Easy-to-use interface with instant results",
            benefit5: "Copy or download transcribed text with one click",
            benefit6: "Secure processing - your audio is not stored on our servers",

            howItWorks: "How It Works",
            howItWorksSteps: "Our tool uses speech recognition to convert audio to text:",
            howStep1: "Choose between uploading an audio file or recording from your microphone",
            howStep2: "For files: Select an audio file (MP3, WAV, M4A, OGG) from your device",
            howStep3: "For recording: Grant microphone permission and start recording",
            howStep4: "Click 'Convert to Text' to start the transcription process",
            howStep5: "Wait for the conversion to complete",
            howStep6: "Copy the transcribed text or download it as a text file",

            useCases: "Use Cases",
            useCase1: "📝 Meeting Notes - Transcribe meeting recordings into searchable text",
            useCase2: "🎓 Lecture Transcripts - Convert educational lectures to written notes",
            useCase3: "🎙️ Podcast Transcription - Create text versions of podcast episodes",
            useCase4: "📞 Interview Documentation - Transcribe interviews for analysis",
            useCase5: "✍️ Content Creation - Convert voice memos into blog posts or articles",
            useCase6: "♿ Accessibility - Make audio content accessible to deaf or hard-of-hearing individuals",

            faq: "Frequently Asked Questions",
            faqQ1: "What audio formats are supported?",
            faqA1: "Our tool supports MP3, WAV, M4A, and OGG audio formats. The maximum file size is 25MB.",
            faqQ2: "How accurate is the transcription?",
            faqA2: "Transcription accuracy depends on audio quality, background noise, and speaker clarity. Clear audio with minimal background noise produces the best results.",
            faqQ3: "Can I transcribe audio in different languages?",
            faqA3: "Yes, our tool supports multiple languages. The language is automatically detected from the audio.",
            faqQ4: "Is my audio data saved on your servers?",
            faqA4: "No, your audio is processed securely and is not stored on our servers. All processing is temporary and data is immediately deleted after transcription.",
            faqQ5: "Can I use the microphone recording on mobile devices?",
            faqA5: "Yes, microphone recording works on most modern mobile browsers. Make sure to grant microphone permission when prompted.",
            faqQ6: "What happens if the audio quality is poor?",
            faqA6: "Poor audio quality may result in lower transcription accuracy. Try to use clear recordings with minimal background noise for best results.",

            tips: "Tips for Best Results",
            tip1: "Use high-quality audio recordings with clear speech and minimal background noise",
            tip2: "Speak clearly and at a moderate pace for better accuracy",
            tip3: "For microphone recording, use a good quality microphone or headset",
            tip4: "Keep recordings concise - shorter segments tend to transcribe more accurately",
            tip5: "Edit the transcribed text as needed for punctuation and formatting",
        },
    },
    vi: {
        name: "Chuyển Giọng Nói Thành Văn Bản",
        description: "Chuyển đổi file âm thanh thành văn bản ngay lập tức",
        urlLabel: "File Âm Thanh",

        // Modes
        fileMode: "Tải File Lên",
        micMode: "Ghi Âm",

        // File Upload
        uploadButton: "Chọn File Âm Thanh",
        uploadHint: "Định dạng hỗ trợ: MP3, WAV, M4A, OGG (Tối đa 25MB)",
        fileName: "Tên file",
        fileSize: "Kích thước",
        duration: "Thời lượng",

        // Recording
        startRecording: "Bắt Đầu Ghi Âm",
        stopRecording: "Dừng Ghi Âm",
        pauseRecording: "Tạm Dừng",
        resumeRecording: "Tiếp Tục",
        recording: "Đang ghi âm...",
        recordingTime: "Thời gian ghi",
        recordingHint: "Nhấn nút để bắt đầu ghi âm từ micro",

        // Service Provider
        serviceProvider: "Nhà Cung Cấp Dịch Vụ",
        serviceProviderHint: "Chọn dịch vụ hoặc để hệ thống tự động chọn",
        auto: "Tự Động (Khuyến nghị)",
        fptAI: "FPT AI",
        microsoftAzure: "Microsoft Azure",

        // Actions
        convert: "Chuyển Thành Văn Bản",
        converting: "Đang chuyển đổi...",
        clear: "Xóa",
        copy: "Sao Chép Văn Bản",
        copied: "Đã sao chép!",
        download: "Tải Văn Bản",

        // Results
        transcription: "Văn Bản Chuyển Đổi",
        noText: "Chưa có văn bản",
        transcribing: "Đang chuyển đổi...",

        // Errors
        error: {
            noFile: "Vui lòng chọn file âm thanh",
            noRecording: "Không có bản ghi âm",
            invalidFile: "Định dạng file không hợp lệ. Vui lòng tải lên file âm thanh.",
            fileTooLarge: "File quá lớn. Kích thước tối đa là 25MB.",
            micPermission: "Không có quyền truy cập micro. Vui lòng cho phép truy cập micro.",
            micNotSupported: "Trình duyệt của bạn không hỗ trợ ghi âm.",
            uploadFailed: "Tải file lên thất bại",
            conversionFailed: "Chuyển đổi âm thanh thành văn bản thất bại",
            genericError: "Đã xảy ra lỗi. Vui lòng thử lại.",
        },

        // Info
        infoNote: "Âm thanh của bạn được xử lý an toàn và không được lưu trữ trên máy chủ.",

        // Page Content
        page: {
            whatIs: "Công Cụ Chuyển Giọng Nói Thành Văn Bản Là Gì?",
            whatIsDesc: "Công cụ chuyển giọng nói thành văn bản là một công cụ mạnh mẽ giúp chuyển đổi lời nói từ file âm thanh thành văn bản. Sử dụng công nghệ nhận dạng giọng nói tiên tiến, công cụ có thể chuyển đổi nội dung âm thanh một cách chính xác, hoàn hảo cho việc tạo bản ghi, ghi chú hoặc tài liệu.",

            whyUse: "Tại Sao Nên Sử Dụng Công Cụ Của Chúng Tôi?",
            whyUseDesc: "Tiết kiệm thời gian và tăng năng suất bằng cách chuyển đổi âm thanh thành văn bản:",
            benefit1: "Chuyển đổi nhanh và chính xác file âm thanh",
            benefit2: "Hỗ trợ nhiều định dạng âm thanh (MP3, WAV, M4A, OGG)",
            benefit3: "Ghi âm từ micro để chuyển đổi",
            benefit4: "Giao diện dễ sử dụng với kết quả ngay lập tức",
            benefit5: "Sao chép hoặc tải xuống văn bản đã chuyển đổi chỉ với một cú nhấp chuột",
            benefit6: "Xử lý an toàn - âm thanh của bạn không được lưu trữ trên máy chủ",

            howItWorks: "Cách Hoạt Động",
            howItWorksSteps: "Công cụ sử dụng nhận dạng giọng nói để chuyển đổi âm thanh thành văn bản:",
            howStep1: "Chọn giữa tải lên file âm thanh hoặc ghi âm từ micro",
            howStep2: "Với file: Chọn file âm thanh (MP3, WAV, M4A, OGG) từ thiết bị",
            howStep3: "Với ghi âm: Cho phép truy cập micro và bắt đầu ghi âm",
            howStep4: "Nhấn 'Chuyển Thành Văn Bản' để bắt đầu quá trình chuyển đổi",
            howStep5: "Chờ quá trình chuyển đổi hoàn tất",
            howStep6: "Sao chép văn bản đã chuyển đổi hoặc tải xuống dưới dạng file text",

            useCases: "Trường Hợp Sử Dụng",
            useCase1: "📝 Ghi Chú Cuộc Họp - Chuyển đổi bản ghi cuộc họp thành văn bản có thể tìm kiếm",
            useCase2: "🎓 Bản Ghi Bài Giảng - Chuyển đổi bài giảng giáo dục thành ghi chú văn bản",
            useCase3: "🎙️ Chuyển Đổi Podcast - Tạo phiên bản văn bản của các tập podcast",
            useCase4: "📞 Ghi Chép Phỏng Vấn - Chuyển đổi phỏng vấn để phân tích",
            useCase5: "✍️ Tạo Nội Dung - Chuyển đổi ghi chú bằng giọng nói thành bài viết blog",
            useCase6: "♿ Khả Năng Tiếp Cận - Làm cho nội dung âm thanh có thể truy cập được cho người khiếm thính",

            faq: "Câu Hỏi Thường Gặp",
            faqQ1: "Công cụ hỗ trợ những định dạng âm thanh nào?",
            faqA1: "Công cụ của chúng tôi hỗ trợ các định dạng MP3, WAV, M4A và OGG. Kích thước file tối đa là 25MB.",
            faqQ2: "Độ chính xác của chuyển đổi như thế nào?",
            faqA2: "Độ chính xác phụ thuộc vào chất lượng âm thanh, tiếng ồn nền và độ rõ ràng của giọng nói. Âm thanh rõ ràng với ít tiếng ồn nền cho kết quả tốt nhất.",
            faqQ3: "Tôi có thể chuyển đổi âm thanh bằng các ngôn ngữ khác nhau không?",
            faqA3: "Có, công cụ của chúng tôi hỗ trợ nhiều ngôn ngữ. Ngôn ngữ được tự động phát hiện từ âm thanh.",
            faqQ4: "Dữ liệu âm thanh của tôi có được lưu trên máy chủ không?",
            faqA4: "Không, âm thanh của bạn được xử lý an toàn và không được lưu trữ trên máy chủ. Tất cả xử lý là tạm thời và dữ liệu được xóa ngay sau khi chuyển đổi.",
            faqQ5: "Tôi có thể sử dụng ghi âm micro trên thiết bị di động không?",
            faqA5: "Có, ghi âm micro hoạt động trên hầu hết các trình duyệt di động hiện đại. Hãy đảm bảo cho phép truy cập micro khi được yêu cầu.",
            faqQ6: "Điều gì xảy ra nếu chất lượng âm thanh kém?",
            faqA6: "Chất lượng âm thanh kém có thể dẫn đến độ chính xác chuyển đổi thấp hơn. Hãy cố gắng sử dụng bản ghi rõ ràng với ít tiếng ồn nền để có kết quả tốt nhất.",

            tips: "Mẹo Để Có Kết Quả Tốt Nhất",
            tip1: "Sử dụng bản ghi âm chất lượng cao với giọng nói rõ ràng và ít tiếng ồn nền",
            tip2: "Nói rõ ràng và với tốc độ vừa phải để có độ chính xác cao hơn",
            tip3: "Với ghi âm micro, sử dụng micro hoặc tai nghe chất lượng tốt",
            tip4: "Giữ bản ghi ngắn gọn - các đoạn ngắn hơn thường chuyển đổi chính xác hơn",
            tip5: "Chỉnh sửa văn bản đã chuyển đổi khi cần thiết cho dấu câu và định dạng",
        },
    },
};
