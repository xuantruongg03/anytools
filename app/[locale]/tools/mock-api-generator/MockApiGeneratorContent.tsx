"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function MockApiGeneratorContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.mockApiGenerator.page;
    const isVi = locale === "vi";

    const faqs = [
        { question: t.faq1Q, answer: t.faq1A },
        { question: t.faq2Q, answer: t.faq2A },
        { question: t.faq3Q, answer: t.faq3A },
        { question: t.faq4Q, answer: t.faq4A },
        { question: t.faq5Q, answer: t.faq5A },
    ];

    return (
        <section className='mt-12 max-w-none space-y-8'>
            {/* What is Mock API Generator */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{t.whatIsDesc1}</p>
                <p className='text-gray-600 dark:text-gray-400'>{t.whatIsDesc2}</p>
            </div>

            {/* Key Features */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.features}</h2>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                    <li>{t.feature1}</li>
                    <li>{t.feature2}</li>
                    <li>{t.feature3}</li>
                    <li>{t.feature4}</li>
                    <li>{t.feature5}</li>
                    <li>{t.feature6}</li>
                    <li>{t.feature7}</li>
                    <li>{t.feature8}</li>
                </ul>
            </div>

            {/* How to Use */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                    <li>{t.step1}</li>
                    <li>{t.step2}</li>
                    <li>{t.step3}</li>
                    <li>{t.step4}</li>
                    <li>{t.step5}</li>
                    <li>{t.step6}</li>
                    <li>{t.step7}</li>
                </ol>
            </div>

            {/* Use Cases */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🎨 Frontend Development</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase1}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🧪 API Testing</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase2}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>📊 Prototyping</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase3}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>❌ Error Handling</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase4}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>⚡ Performance Testing</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase5}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🔔 Webhooks</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.useCase6}</p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Tại Sao Chọn Mock API Generator?" : "Why Choose Mock API Generator?"}</h2>
                <div className='grid md:grid-cols-3 gap-6'>
                    <div className='text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <div className='text-4xl mb-2'>🚀</div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{isVi ? "Nhanh Chóng" : "Lightning Fast"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Tạo mock API trong vài giây, không cần setup phức tạp" : "Create mock APIs in seconds, no complex setup required"}</p>
                    </div>
                    <div className='text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <div className='text-4xl mb-2'>💰</div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{isVi ? "Hoàn Toàn Miễn Phí" : "100% Free"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Không giới hạn số lượng mock APIs, không cần đăng ký" : "Unlimited mock APIs, no signup required"}</p>
                    </div>
                    <div className='text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <div className='text-4xl mb-2'>🔗</div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{isVi ? "Dễ Dàng Chia Sẻ" : "Easy Sharing"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Chia sẻ mock APIs với đồng đội chỉ bằng một link" : "Share mock APIs with teammates via a single link"}</p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <FAQSection locale={locale} faqs={faqs} />
        </section>
    );
}
