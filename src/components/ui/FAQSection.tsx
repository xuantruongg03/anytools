interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    locale: string;
    faqs: FAQItem[] | Record<string, string>;
}

export default function FAQSection({ locale, faqs }: FAQSectionProps) {
    // Convert object format {q1, a1, q2, a2, ...} to array format
    const faqArray: FAQItem[] = Array.isArray(faqs)
        ? faqs
        : Object.entries(faqs)
              .filter(([key]) => key.startsWith("q"))
              .map((_, index) => ({
                  question: (faqs as Record<string, string>)[`q${index + 1}`],
                  answer: (faqs as Record<string, string>)[`a${index + 1}`],
              }));

    return (
        <section>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}</h2>
            <div className='space-y-4'>
                {faqArray.map((faq, index) => (
                    <div key={index} className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:text-gray-100'>
                        <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{faq.question}</h3>
                        <p className='leading-relaxed'>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
