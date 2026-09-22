export const exifViewerTranslations = {
    en: {
        name: "EXIF Viewer & Metadata Cleaner",
        description: "Inspect detailed EXIF metadata in photos (Camera model, lens, exposure, ISO, GPS coordinates) and strip sensitive metadata to protect privacy before sharing.",
        category: "Multimedia",

        // UI
        dropImage: "Drag and drop a photo here, or click to browse",
        uploadHint: "Supports JPEG, PNG, WebP, TIFF. 100% processed in your browser - no photos are uploaded to any server.",
        changeImage: "Change Photo",
        cleanExif: "Strip EXIF & Clean Photo",
        cleanedSuccess: "Metadata stripped! Clean photo downloaded.",
        exportJson: "Export JSON",
        copiedJson: "EXIF data copied as JSON!",
        noExifFound: "No EXIF metadata found in this image (it may have already been stripped).",

        // Sections
        sectionCamera: "Camera & Lens",
        sectionExposure: "Exposure & Settings",
        sectionGps: "GPS & Location Privacy",
        sectionImage: "Image & File Info",

        // Fields
        make: "Camera Make",
        model: "Camera Model",
        lens: "Lens Model",
        software: "Software / Firmware",
        dateTime: "Date & Time Taken",
        focalLength: "Focal Length",
        aperture: "Aperture (F-Stop)",
        shutterSpeed: "Shutter Speed",
        iso: "ISO Sensitivity",
        exposureBias: "Exposure Bias",
        flash: "Flash",
        resolution: "Dimensions",
        fileSize: "File Size",
        gpsLatitude: "Latitude",
        gpsLongitude: "Longitude",
        gpsAltitude: "Altitude",
        viewOnMap: "View on Google Maps",
        gpsWarning: "Privacy Alert: This photo contains exact GPS coordinates of where it was taken.",

        // Guide
        guideTitle: "Understanding EXIF Data & Privacy Protection",
        guide1Title: "What is EXIF Metadata?",
        guide1Desc: "Exchangeable Image File Format (EXIF) is data embedded into photos by cameras and smartphones, recording hardware details, timestamps, and camera settings.",
        guide2Title: "Why You Should Strip Geolocation (GPS) Data",
        guide2Desc: "Photos taken on smartphones often embed exact GPS coordinates of your home, workplace, or children's school. Stripping metadata protects your physical privacy before posting online.",
        guide3Title: "Zero-Server Privacy Guarantee",
        guide3Desc: "Our tool parses binary EXIF tags entirely in client-side JavaScript. Your photos are never uploaded or transmitted to any server.",
    },
    vi: {
        name: "Xem & Xóa Thông Tin EXIF Ảnh",
        description: "Xem chi tiết thông số chụp ảnh EXIF (Hãng máy, ống kính, khẩu độ, ISO, tốc độ màn trập, tọa độ GPS) và xóa thông tin vị trí nhạy cảm để bảo vệ quyền riêng tư.",
        category: "Đa phương tiện",

        // UI
        dropImage: "Kéo thả ảnh vào đây, hoặc click để chọn ảnh",
        uploadHint: "Hỗ trợ JPEG, PNG, WebP, TIFF. 100% xử lý trên trình duyệt - ảnh không bao giờ bị tải lên máy chủ.",
        changeImage: "Chọn ảnh khác",
        cleanExif: "Xóa Metadata & Tải Ảnh Sạch",
        cleanedSuccess: "Đã xóa toàn bộ metadata và tải ảnh sạch về máy!",
        exportJson: "Xuất JSON",
        copiedJson: "Đã sao chép dữ liệu EXIF dưới dạng JSON!",
        noExifFound: "Không tìm thấy thông tin EXIF trong ảnh này (có thể ảnh đã được xóa thông tin trước đó).",

        // Sections
        sectionCamera: "Máy ảnh & Ống kính",
        sectionExposure: "Thông số phơi sáng & Cài đặt",
        sectionGps: "Tọa độ GPS & Quyền riêng tư",
        sectionImage: "Thông tin tệp ảnh",

        // Fields
        make: "Hãng sản xuất",
        model: "Mẫu máy ảnh",
        lens: "Ống kính (Lens)",
        software: "Phần mềm / Firmware",
        dateTime: "Ngày giờ chụp",
        focalLength: "Tiêu cự",
        aperture: "Khẩu độ (F-Number)",
        shutterSpeed: "Tốc độ màn trập",
        iso: "Độ nhạy sáng ISO",
        exposureBias: "Bù trừ sáng (EV)",
        flash: "Đèn Flash",
        resolution: "Kích thước ảnh",
        fileSize: "Dung lượng tệp",
        gpsLatitude: "Vĩ độ (Latitude)",
        gpsLongitude: "Kinh độ (Longitude)",
        gpsAltitude: "Độ cao (Altitude)",
        viewOnMap: "Xem trên Google Maps",
        gpsWarning: "Cảnh báo bảo mật: Ảnh này chứa tọa độ GPS chính xác vị trí bạn đã chụp.",

        // Guide
        guideTitle: "Tìm Hiểu Về Dữ Liệu EXIF & Bảo Vệ Quyền Riêng Tư",
        guide1Title: "Dữ liệu EXIF là gì?",
        guide1Desc: "EXIF (Exchangeable Image File Format) là thông tin kỹ thuật được máy ảnh và điện thoại tự động ghi vào tệp ảnh, bao gồm thiết bị chụp, thời gian và thông số phơi sáng.",
        guide2Title: "Tại sao nên xóa tọa độ GPS trước khi chia sẻ?",
        guide2Desc: "Ảnh chụp bằng smartphone thường lưu chính xác vị trí nhà riêng hoặc nơi làm việc của bạn. Xóa bỏ EXIF giúp ngăn chặn việc theo dõi vị trí đời thực.",
        guide3Title: "Bảo mật tuyệt đối trên trình duyệt",
        guide3Desc: "Công cụ phân tích cấu trúc nhị phân của ảnh hoàn toàn bằng JavaScript ở client. Ảnh của bạn không bao giờ được gửi lên bất kỳ máy chủ nào.",
    },
};
