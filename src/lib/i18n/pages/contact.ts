export const contactTranslations = {
    en: {
        contact: {
            meta: {
                title: "Contact Us - AnyTools",
                description: "Get in touch with us. Send suggestions, feedback, or report issues about AnyTools.",
                keywords: ["contact", "feedback", "support", "suggestions", "anytools contact"],
            },
            page: {
                title: "Contact Us",
                subtitle: "Have a question, suggestion, or feedback? We'd love to hear from you!",
                form: {
                    name: "Your Name",
                    namePlaceholder: "Enter your name",
                    email: "Email Address",
                    emailPlaceholder: "your@email.com",
                    subject: "Subject",
                    subjectPlaceholder: "What is this about?",
                    subjectOptions: {
                        general: "General Inquiry",
                        suggestion: "Tool/Extension Suggestion",
                        bug: "Bug Report",
                        feedback: "Feedback",
                        other: "Other",
                    },
                    message: "Message",
                    messagePlaceholder: "Write your message here...",
                    send: "Send Message",
                    sending: "Sending...",
                    required: "Required",
                },
                success: {
                    title: "Message Sent!",
                    description: "Thank you for reaching out. I'll get back to you as soon as possible.",
                    sendAnother: "Send Another Message",
                },
                error: {
                    title: "Oops! Something went wrong",
                    description: "Failed to send your message. Please try again.",
                    retry: "Try Again",
                },
                info: {
                    title: "Other Ways to Reach Me",
                    github: "Open an issue on GitHub",
                    githubDesc: "For bug reports and feature requests",
                    email: "Email directly",
                    emailDesc: "For private inquiries",
                },
            },
        },
    },
    vi: {
        contact: {
            meta: {
                title: "Liên Hệ - AnyTools",
                description: "Liên hệ với chúng tôi. Gửi đề xuất, phản hồi hoặc báo cáo lỗi về AnyTools.",
                keywords: ["liên hệ", "phản hồi", "hỗ trợ", "đề xuất", "anytools liên hệ"],
            },
            page: {
                title: "Liên Hệ",
                subtitle: "Có câu hỏi, đề xuất hoặc phản hồi? Chúng tôi rất muốn nghe từ bạn!",
                form: {
                    name: "Tên của bạn",
                    namePlaceholder: "Nhập tên của bạn",
                    email: "Địa chỉ Email",
                    emailPlaceholder: "email@example.com",
                    subject: "Tiêu đề",
                    subjectPlaceholder: "Nội dung liên hệ?",
                    subjectOptions: {
                        general: "Câu hỏi chung",
                        suggestion: "Đề xuất Tool/Extension",
                        bug: "Báo cáo lỗi",
                        feedback: "Góp ý",
                        other: "Khác",
                    },
                    message: "Nội dung",
                    messagePlaceholder: "Viết tin nhắn của bạn ở đây...",
                    send: "Gửi Tin Nhắn",
                    sending: "Đang gửi...",
                    required: "Bắt buộc",
                },
                success: {
                    title: "Đã Gửi Thành Công!",
                    description: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
                    sendAnother: "Gửi Tin Nhắn Khác",
                },
                error: {
                    title: "Ôi! Có lỗi xảy ra",
                    description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
                    retry: "Thử Lại",
                },
                info: {
                    title: "Cách Khác Để Liên Hệ",
                    github: "Mở issue trên GitHub",
                    githubDesc: "Cho báo cáo lỗi và yêu cầu tính năng",
                    email: "Gửi email trực tiếp",
                    emailDesc: "Cho các vấn đề riêng tư",
                },
            },
        },
    },
};

export type ContactTranslations = typeof contactTranslations;
