"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import ColorPickerClient from "./ColorPickerClient";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function ColorPickerContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <div className='max-w-6xl mx-auto'>
            <header className='mb-8'>
                <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>{t.tools.colorPicker.page.subtitle}</p>
            </header>

            <ColorPickerClient />

            {/* What is Color Picker */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.whatIsColorPicker}</h2>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.tools.colorPicker.page.whatIsColorPickerDesc}</p>
            </section>

            {/* Why Use */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.whyUse}</h2>
                <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.free.split(":")[0] || t.tools.colorPicker.page.features.free.split("-")[0]}:</strong> {t.tools.colorPicker.page.features.free.split(":")[1] || t.tools.colorPicker.page.features.free.substring(t.tools.colorPicker.page.features.free.indexOf("-") + 1)}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.instant.split(":")[0] || t.tools.colorPicker.page.features.instant.split(" ")[0]}:</strong> {t.tools.colorPicker.page.features.instant.split(":")[1] || t.tools.colorPicker.page.features.instant.substring(t.tools.colorPicker.page.features.instant.indexOf(" "))}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.imagePicker.split(":")[0] || t.tools.colorPicker.page.features.imagePicker.split("-")[0]}:</strong> {t.tools.colorPicker.page.features.imagePicker.split(":")[1] || t.tools.colorPicker.page.features.imagePicker.substring(t.tools.colorPicker.page.features.imagePicker.indexOf("-") + 1)}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.copy.split(":")[0] || t.tools.colorPicker.page.features.copy.split(" ")[0]}:</strong> {t.tools.colorPicker.page.features.copy.split(":")[1] || t.tools.colorPicker.page.features.copy.substring(t.tools.colorPicker.page.features.copy.indexOf(" "))}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.accurate.split(":")[0] || t.tools.colorPicker.page.features.accurate.split(" ")[0]}:</strong> {t.tools.colorPicker.page.features.accurate.split(":")[1] || t.tools.colorPicker.page.features.accurate.substring(t.tools.colorPicker.page.features.accurate.indexOf(" "))}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>✓</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.features.responsive.split(":")[0] || t.tools.colorPicker.page.features.responsive.split(" ")[0]}:</strong> {t.tools.colorPicker.page.features.responsive.split(":")[1] || t.tools.colorPicker.page.features.responsive.substring(t.tools.colorPicker.page.features.responsive.indexOf(" "))}
                        </span>
                    </li>
                </ul>
            </section>

            {/* How to Use */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.howToUse}</h2>
                <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                        <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.colorWheelSteps.title}</h3>
                        <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
                            <li>{t.tools.colorPicker.page.colorWheelSteps.step1}</li>
                            <li>{t.tools.colorPicker.page.colorWheelSteps.step2}</li>
                            <li>{t.tools.colorPicker.page.colorWheelSteps.step3}</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.imagePickerSteps.title}</h3>
                        <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
                            <li>{t.tools.colorPicker.page.imagePickerSteps.step1}</li>
                            <li>{t.tools.colorPicker.page.imagePickerSteps.step2}</li>
                            <li>{t.tools.colorPicker.page.imagePickerSteps.step3}</li>
                            <li>{t.tools.colorPicker.page.imagePickerSteps.step4}</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCases}</h2>
                <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.webDesign.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.webDesign.split(":").slice(1).join(":")}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.uiDesign.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.uiDesign.split(":").slice(1).join(":")}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.branding.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.branding.split(":").slice(1).join(":")}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.development.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.development.split(":").slice(1).join(":")}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.imageEditing.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.imageEditing.split(":").slice(1).join(":")}
                        </span>
                    </li>
                    <li className='flex items-start'>
                        <span className='mr-2'>•</span>
                        <span>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.useCasesList.accessibility.split(":")[0]}:</strong> {t.tools.colorPicker.page.useCasesList.accessibility.split(":").slice(1).join(":")}
                        </span>
                    </li>
                </ul>
            </section>

            {/* Color Formats */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.page.colorFormats}</h2>
                <div className='space-y-4'>
                    <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>HEX (Hexadecimal)</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.colorPicker.page.colorFormatsList.hex}</p>
                    </div>
                    <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>RGB (Red, Green, Blue)</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.colorPicker.page.colorFormatsList.rgb}</p>
                    </div>
                    <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>HSL (Hue, Saturation, Lightness)</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.colorPicker.page.colorFormatsList.hsl}</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQSection
                title={t.tools.colorPicker.page.faq}
                faqs={[
                    { question: t.tools.colorPicker.page.faqList.q1, answer: t.tools.colorPicker.page.faqList.a1 },
                    { question: t.tools.colorPicker.page.faqList.q2, answer: t.tools.colorPicker.page.faqList.a2 },
                    { question: t.tools.colorPicker.page.faqList.q3, answer: t.tools.colorPicker.page.faqList.a3 },
                    { question: t.tools.colorPicker.page.faqList.q4, answer: t.tools.colorPicker.page.faqList.a4 },
                    { question: t.tools.colorPicker.page.faqList.q5, answer: t.tools.colorPicker.page.faqList.a5 },
                ]}
            />
        </div>
    );
}
