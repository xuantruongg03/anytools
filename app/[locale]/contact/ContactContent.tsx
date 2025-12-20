"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { contactTranslations } from "@/lib/i18n/pages/contact";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactContent() {
    const { locale } = useLanguage();
    const t = contactTranslations[locale].contact.page;

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "general",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subject: t.form.subjectOptions[formData.subject as keyof typeof t.form.subjectOptions] || formData.subject,
                }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "general", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Success state
    if (status === "success") {
        return (
            <div className='max-w-2xl mx-auto text-center py-16'>
                <div className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <svg className='w-10 h-10 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                </div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>{t.success.title}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-8'>{t.success.description}</p>
                <button onClick={() => setStatus("idle")} className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors'>
                    {t.success.sendAnother}
                </button>
            </div>
        );
    }

    // Error state
    if (status === "error") {
        return (
            <div className='max-w-2xl mx-auto text-center py-16'>
                <div className='w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <svg className='w-10 h-10 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>{t.error.title}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-8'>{t.error.description}</p>
                <button onClick={() => setStatus("idle")} className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors'>
                    {t.error.retry}
                </button>
            </div>
        );
    }

    return (
        <div className='max-w-5xl mx-auto'>
            {/* Hero Section */}
            <div className='text-center mb-12'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>{t.title}</h1>
                <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>{t.subtitle}</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Contact Form */}
                <div className='lg:col-span-2'>
                    <form onSubmit={handleSubmit} className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8'>
                        <div className='space-y-6'>
                            {/* Name */}
                            <div>
                                <label htmlFor='name' className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>
                                    {t.form.name} <span className='text-red-500'>*</span>
                                </label>
                                <input type='text' id='name' name='name' required value={formData.name} onChange={handleChange} placeholder={t.form.namePlaceholder} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>
                                    {t.form.email} <span className='text-red-500'>*</span>
                                </label>
                                <input type='email' id='email' name='email' required value={formData.email} onChange={handleChange} placeholder={t.form.emailPlaceholder} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' />
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor='subject' className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>
                                    {t.form.subject} <span className='text-red-500'>*</span>
                                </label>
                                <select id='subject' name='subject' required value={formData.subject} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'>
                                    <option value='general'>{t.form.subjectOptions.general}</option>
                                    <option value='suggestion'>{t.form.subjectOptions.suggestion}</option>
                                    <option value='bug'>{t.form.subjectOptions.bug}</option>
                                    <option value='feedback'>{t.form.subjectOptions.feedback}</option>
                                    <option value='other'>{t.form.subjectOptions.other}</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor='message' className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>
                                    {t.form.message} <span className='text-red-500'>*</span>
                                </label>
                                <textarea id='message' name='message' required rows={6} value={formData.message} onChange={handleChange} placeholder={t.form.messagePlaceholder} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none' />
                            </div>

                            {/* Submit Button */}
                            <button type='submit' disabled={status === "sending"} className='w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2'>
                                {status === "sending" ? (
                                    <>
                                        <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        {t.form.sending}
                                    </>
                                ) : (
                                    <>
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                        </svg>
                                        {t.form.send}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Sidebar */}
                <div className='space-y-6'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{t.info.title}</h3>

                        <div className='space-y-4'>
                            {/* GitHub */}
                            <a href='https://github.com/xuantruongg03/anytools/issues' target='_blank' rel='noopener noreferrer' className='flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group'>
                                <div className='w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors'>
                                    <svg className='w-5 h-5 text-gray-700 dark:text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className='font-medium text-gray-900 dark:text-white'>{t.info.github}</h4>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{t.info.githubDesc}</p>
                                </div>
                            </a>

                            {/* Email */}
                            <a href='mailto:lexuantruong098@gmail.com' className='flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group'>
                                <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors'>
                                    <svg className='w-5 h-5 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className='font-medium text-gray-900 dark:text-white'>{t.info.email}</h4>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{t.info.emailDesc}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className='bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-center'>
                        <div className='text-4xl mb-3'>💬</div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{locale === "vi" ? "Mọi phản hồi đều được đọc và trả lời!" : "Every message is read and replied to!"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
