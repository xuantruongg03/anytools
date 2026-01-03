"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import FAQSection from "@/components/ui/FAQSection";

export default function EventReminderContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const content = {
        whatIs: isVi ? "Nhắc Nhở Sự Kiện là gì?" : "What is Event Reminder?",
        whatIsDesc: isVi
            ? "Nhắc Nhở Sự Kiện là công cụ giúp bạn đếm ngược và nhận thông báo cho các sự kiện quan trọng. Khác với đồng hồ đếm ngược thông thường, công cụ này cho phép bạn đặt ngày giờ cụ thể, nhận thông báo qua email và trình duyệt, tùy chỉnh tần suất nhắc nhở và được cảnh báo khi sự kiện sắp đến."
            : "Event Reminder is a tool that helps you countdown and receive notifications for important events. Unlike regular countdown timers, this tool allows you to set specific dates and times, receive notifications via email and browser, customize reminder frequency, and get alerts when events are approaching.",
        howToUse: isVi ? "Cách sử dụng" : "How to Use",
        howToUseDesc: isVi
            ? "1. Nhập tên sự kiện và chọn ngày giờ đích\n2. Thêm email nếu muốn nhận thông báo qua email\n3. Chọn tần suất nhắc nhở (một lần, mỗi giờ, mỗi ngày, hoặc tùy chỉnh)\n4. Chọn các mốc thời gian nhắc trước sự kiện\n5. Bật thông báo trình duyệt để nhận cảnh báo ngay trên màn hình\n6. Nhấn 'Thêm Nhắc Nhở' để tạo sự kiện"
            : "1. Enter event name and select target date/time\n2. Add email if you want to receive email notifications\n3. Choose reminder frequency (once, hourly, daily, or custom)\n4. Select reminder times before the event\n5. Enable browser notifications to receive on-screen alerts\n6. Click 'Add Reminder' to create the event",
        features: isVi ? "Tính năng chính" : "Key Features",
        featuresList: isVi
            ? ["Đếm ngược đến ngày giờ cụ thể (không chỉ số giây)", "Thông báo trình duyệt khi sắp đến giờ", "Gửi email nhắc nhở (cần cấu hình)", "Tùy chọn nhiều mốc nhắc trước sự kiện", "Tần suất nhắc nhở linh hoạt", "Lưu trữ sự kiện trong localStorage", "Đánh dấu sự kiện đã hoàn thành", "Giao diện trực quan với hiệu ứng đẹp", "Hỗ trợ chế độ tối", "Sự kiện nhanh (1 giờ, ngày mai, 1 tuần, 1 tháng)"]
            : ["Countdown to specific date/time (not just seconds)", "Browser notifications when event is approaching", "Email reminders (requires configuration)", "Multiple reminder times before event", "Flexible reminder frequency", "Store events in localStorage", "Mark events as completed", "Intuitive interface with beautiful effects", "Dark mode support", "Quick events (1 hour, tomorrow, 1 week, 1 month)"],
        useCases: isVi ? "Ứng dụng thực tế" : "Use Cases",
        useCasesList: isVi
            ? ["Nhắc nhở deadline công việc và học tập", "Đếm ngược sinh nhật, kỷ niệm", "Lịch họp và cuộc hẹn quan trọng", "Ra mắt sản phẩm và sự kiện kinh doanh", "Hạn nộp thuế, hóa đơn", "Lịch tiêm chủng, khám sức khỏe", "Ngày lễ và kỳ nghỉ", "Countdown đến sự kiện đặc biệt"]
            : ["Work and study deadline reminders", "Birthday and anniversary countdowns", "Important meetings and appointments", "Product launches and business events", "Tax deadlines and bill payments", "Vaccination and health check schedules", "Holidays and vacations", "Countdown to special events"],
        faqTitle: isVi ? "Câu hỏi thường gặp" : "Frequently Asked Questions",
        faqList: isVi
            ? [
                  {
                      question: "Sự kiện có được lưu lại không?",
                      answer: "Có! Tất cả sự kiện được lưu trong localStorage của trình duyệt. Chúng sẽ được giữ nguyên ngay cả khi bạn đóng trình duyệt hoặc tải lại trang.",
                  },
                  {
                      question: "Làm sao để nhận thông báo trình duyệt?",
                      answer: "Nhấn nút 'Bật thông báo trình duyệt' ở đầu trang. Trình duyệt sẽ hỏi bạn cho phép gửi thông báo. Sau khi cho phép, bạn sẽ nhận được cảnh báo trên màn hình khi sự kiện sắp đến.",
                  },
                  {
                      question: "Tính năng gửi email hoạt động như thế nào?",
                      answer: "Để gửi email, bạn cần cấu hình dịch vụ email (như SendGrid, Resend) ở backend. Sau khi cấu hình, hệ thống sẽ tự động gửi email nhắc nhở theo lịch bạn đã đặt.",
                  },
                  {
                      question: "Tôi có thể đặt bao nhiêu mốc nhắc nhở?",
                      answer: "Bạn có thể chọn nhiều mốc nhắc nhở trước sự kiện: 5 phút, 15 phút, 30 phút, 1 giờ, 2 giờ, 6 giờ, 12 giờ, 1 ngày, 2 ngày, hoặc 1 tuần.",
                  },
                  {
                      question: "Điều gì xảy ra khi sự kiện hết hạn?",
                      answer: "Khi sự kiện đến giờ, bạn sẽ nhận thông báo (nếu đã bật). Sự kiện sẽ hiển thị 'Đã hết hạn'. Bạn có thể đánh dấu hoàn thành hoặc xóa nó.",
                  },
              ]
            : [
                  {
                      question: "Are events saved?",
                      answer: "Yes! All events are saved in your browser's localStorage. They will persist even after closing the browser or refreshing the page.",
                  },
                  {
                      question: "How do I receive browser notifications?",
                      answer: "Click the 'Enable browser notifications' button at the top of the page. Your browser will ask for permission to send notifications. Once granted, you'll receive on-screen alerts when events are approaching.",
                  },
                  {
                      question: "How does email functionality work?",
                      answer: "To send emails, you need to configure an email service (like SendGrid, Resend) in the backend. Once configured, the system will automatically send reminder emails according to your schedule.",
                  },
                  {
                      question: "How many reminder times can I set?",
                      answer: "You can choose multiple reminder times before the event: 5 min, 15 min, 30 min, 1 hour, 2 hours, 6 hours, 12 hours, 1 day, 2 days, or 1 week.",
                  },
                  {
                      question: "What happens when an event expires?",
                      answer: "When an event's time arrives, you'll receive a notification (if enabled). The event will display 'Event has passed'. You can mark it as complete or delete it.",
                  },
              ],
    };

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mt-12 prose prose-lg max-w-none dark:prose-invert'>
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{content.whatIsDesc}</p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.howToUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line'>{content.howToUseDesc}</p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.features}</h2>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        {content.featuresList.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.useCases}</h2>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        {content.useCasesList.map((useCase, index) => (
                            <li key={index}>{useCase}</li>
                        ))}
                    </ul>
                </section>

                <FAQSection faqs={content.faqList} locale={locale} />
            </div>
        </div>
    );
}
