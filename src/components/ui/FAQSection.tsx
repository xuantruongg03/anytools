interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    title: string;
    faqs: FAQItem[];
}

export default function FAQSection({ title, faqs }: FAQSectionProps) {
    return (
        <section className='mb-12'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{title}</h2>
            <div className='space-y-6'>
                {faqs.map((faq, index) => (
                    <div key={index} className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{faq.question}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
