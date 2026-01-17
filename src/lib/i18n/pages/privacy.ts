export interface PrivacyPolicyData {
    extensionId: string;
    extensionName: string;
    lastUpdated: string;
    permissions: {
        name: string;
        description: {
            en: string;
            vi: string;
        };
    }[];
    additionalInfo?: {
        en: string;
        vi: string;
    };
}

export const privacyTranslations = {
    en: {
        privacy: {
            meta: {
                title: "Privacy Policy - {extensionName} | AnyTools",
                description: "Privacy policy for {extensionName} browser extension. Learn how we protect your data and privacy.",
                keywords: ["privacy policy", "browser extension", "data protection", "user privacy", "chrome extension privacy"],
            },
            page: {
                title: "Privacy Policy",
                lastUpdated: "Last updated",
                sections: {
                    informationCollect: {
                        title: "1. INFORMATION WE COLLECT",
                        content: "{extensionName} does NOT collect, store, or transmit any personal data or browsing information. All operations are performed locally within your browser.",
                    },
                    dataUsage: {
                        title: "2. DATA USAGE",
                        items: ["No user data is collected", "No browsing history is tracked", "No data is sent to external servers", "All processed data remains on your device"],
                    },
                    storage: {
                        title: "3. STORAGE",
                        content: "The extension uses Chrome's local storage API solely to save your preferences (such as preferred output format). This data is stored locally on your device and is never transmitted externally.",
                    },
                    thirdParty: {
                        title: "4. THIRD-PARTY SERVICES",
                        content: "{extensionName} does not use any third-party analytics, advertising, or tracking services.",
                    },
                    permissions: {
                        title: "5. PERMISSIONS USAGE",
                        description: "The following permissions are required for the extension to function:",
                    },
                    contact: {
                        title: "6. CONTACT",
                        content: "For questions about this privacy policy, contact:",
                        email: "lexuantruong098@gmail.com",
                        website: "https://anytools.online",
                    },
                    changes: {
                        title: "7. CHANGES",
                        content: "We may update this policy. Changes will be posted on this page with an updated date.",
                    },
                },
                backToExtensions: "← Back to Extensions",
                viewOnStore: "View on Chrome Web Store",
                viewSourceCode: "View Source Code",
            },
        },
    },
    vi: {
        privacy: {
            meta: {
                title: "Chính Sách Quyền Riêng Tư - {extensionName} | AnyTools",
                description: "Chính sách quyền riêng tư cho extension {extensionName}. Tìm hiểu cách chúng tôi bảo vệ dữ liệu và quyền riêng tư của bạn.",
                keywords: ["chính sách quyền riêng tư", "extension trình duyệt", "bảo vệ dữ liệu", "quyền riêng tư người dùng", "chrome extension"],
            },
            page: {
                title: "Chính Sách Quyền Riêng Tư",
                lastUpdated: "Cập nhật lần cuối",
                sections: {
                    informationCollect: {
                        title: "1. THÔNG TIN CHÚNG TÔI THU THẬP",
                        content: "{extensionName} KHÔNG thu thập, lưu trữ hoặc truyền tải bất kỳ dữ liệu cá nhân hoặc thông tin duyệt web nào. Tất cả các hoạt động được thực hiện cục bộ trong trình duyệt của bạn.",
                    },
                    dataUsage: {
                        title: "2. SỬ DỤNG DỮ LIỆU",
                        items: ["Không thu thập dữ liệu người dùng", "Không theo dõi lịch sử duyệt web", "Không gửi dữ liệu đến máy chủ bên ngoài", "Tất cả dữ liệu được xử lý vẫn ở trên thiết bị của bạn"],
                    },
                    storage: {
                        title: "3. LƯU TRỮ",
                        content: "Extension sử dụng API lưu trữ cục bộ của Chrome chỉ để lưu các tùy chọn của bạn (như định dạng đầu ra ưa thích). Dữ liệu này được lưu trữ cục bộ trên thiết bị của bạn và không bao giờ được truyền ra bên ngoài.",
                    },
                    thirdParty: {
                        title: "4. DỊCH VỤ BÊN THỨ BA",
                        content: "{extensionName} không sử dụng bất kỳ dịch vụ phân tích, quảng cáo hoặc theo dõi của bên thứ ba nào.",
                    },
                    permissions: {
                        title: "5. SỬ DỤNG QUYỀN",
                        description: "Các quyền sau đây được yêu cầu để extension hoạt động:",
                    },
                    contact: {
                        title: "6. LIÊN HỆ",
                        content: "Nếu có câu hỏi về chính sách quyền riêng tư này, liên hệ:",
                        email: "lexuantruong098@gmail.com",
                        website: "https://anytools.online",
                    },
                    changes: {
                        title: "7. THAY ĐỔI",
                        content: "Chúng tôi có thể cập nhật chính sách này. Các thay đổi sẽ được đăng trên trang này với ngày cập nhật mới.",
                    },
                },
                backToExtensions: "← Quay lại Extensions",
                viewOnStore: "Xem trên Chrome Web Store",
                viewSourceCode: "Xem Mã Nguồn",
            },
        },
    },
};

// Privacy policy data for each extension
export const extensionPrivacyPolicies: Record<string, PrivacyPolicyData> = {
    "css-inspector": {
        extensionId: "css-inspector",
        extensionName: "CSS Inspector",
        lastUpdated: "January 1, 2026",
        permissions: [
            {
                name: "activeTab",
                description: {
                    en: "Access current tab only when you activate the extension",
                    vi: "Chỉ truy cập tab hiện tại khi bạn kích hoạt extension",
                },
            },
            {
                name: "scripting",
                description: {
                    en: "Inject CSS inspection functionality into webpages",
                    vi: "Chèn chức năng kiểm tra CSS vào các trang web",
                },
            },
            {
                name: "storage",
                description: {
                    en: "Save your local preferences",
                    vi: "Lưu các tùy chọn cục bộ của bạn",
                },
            },
            {
                name: "contextMenus",
                description: {
                    en: "Provide right-click menu options",
                    vi: "Cung cấp các tùy chọn menu chuột phải",
                },
            },
        ],
        additionalInfo: {
            en: "All inspected CSS properties remain on your device and are never transmitted to external servers.",
            vi: "Tất cả các thuộc tính CSS được kiểm tra vẫn ở trên thiết bị của bạn và không bao giờ được truyền đến máy chủ bên ngoài.",
        },
    },
    "studocu-downloader": {
        extensionId: "studocu-downloader",
        extensionName: "StudoCu Downloader Pro",
        lastUpdated: "January 2026",
        permissions: [
            {
                name: "activeTab",
                description: {
                    en: "Only to read StudoCu page content for PDF creation",
                    vi: "Chỉ để đọc nội dung trang StudoCu để tạo PDF",
                },
            },
            {
                name: "scripting",
                description: {
                    en: "Only to enhance page functionality for downloading",
                    vi: "Chỉ để nâng cao chức năng trang để tải xuống",
                },
            },
            {
                name: "cookies",
                description: {
                    en: "Only to remove StudoCu access restrictions when needed",
                    vi: "Chỉ để xóa các hạn chế truy cập StudoCu khi cần thiết",
                },
            },
            {
                name: "storage",
                description: {
                    en: "Only to save your progress and settings locally",
                    vi: "Chỉ để lưu tiến trình và cài đặt của bạn cục bộ",
                },
            },
        ],
        additionalInfo: {
            en: "All document processing happens locally in your browser. No content is sent to external servers. The extension stores only download progress and settings locally. No data is shared with third parties - the extension works entirely offline after installation.",
            vi: "Tất cả việc xử lý tài liệu diễn ra cục bộ trong trình duyệt của bạn. Không có nội dung nào được gửi đến máy chủ bên ngoài. Extension chỉ lưu trữ tiến trình tải xuống và cài đặt cục bộ. Không có dữ liệu nào được chia sẻ với bên thứ ba - extension hoạt động hoàn toàn ngoại tuyến sau khi cài đặt.",
        },
    },
};

// Helper function to get privacy policy by extension ID
export const getExtensionPrivacyPolicy = (extensionId: string): PrivacyPolicyData | null => {
    return extensionPrivacyPolicies[extensionId] || null;
};
