"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";

export default function DonatePage() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <div className='min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black'>
            <div className='container mx-auto px-4 py-16'>
                <div className='max-w-5xl mx-auto text-center'>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.donate.title}</h1>
                    <p className='text-xl text-gray-600 dark:text-gray-400 mb-12'>{t.donate.subtitle}</p>

                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 mb-8'>
                        <div className='text-6xl mb-6'>❤️</div>
                        <p className='text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto'>{t.donate.description}</p>

                        {/* Donation Options */}
                        <div className='space-y-10'>
                            <h2 className='text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Support Us" : "Ủng Hộ Chúng Tôi"}</h2>

                            <div className='grid md:grid-cols-2 gap-10'>
                                {/* Bank QR Code */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-center gap-2 mb-4'>
                                        <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M3.5 6.5h17v11h-17v-11zm0-2C2.67 4.5 2 5.17 2 6v12c0 .83.67 1.5 1.5 1.5h17c.83 0 1.5-.67 1.5-1.5V6c0-.83-.67-1.5-1.5-1.5h-17z' />
                                            <path d='M7 9h10v2H7V9zm0 3h7v2H7v-2z' />
                                        </svg>
                                        <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{locale === "en" ? "Bank Transfer (Vietnam)" : "Chuyển Khoản Ngân Hàng"}</h3>
                                    </div>

                                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-8 space-y-4'>
                                        <div className='flex justify-center mb-4'>
                                            {/* QR Code Image */}
                                            <Image src='/qr-bank.png' alt='QR Code for bank transfer' width={256} height={256} className='rounded-lg shadow-md border-2 border-gray-200' priority />
                                        </div>

                                        <div className='text-left space-y-2'>
                                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                                <strong>{locale === "en" ? "Bank:" : "Ngân hàng:"}</strong> Vietcombank (VCB)
                                            </p>
                                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                                <strong>{locale === "en" ? "Account number:" : "Số tài khoản:"}</strong> 1019940324
                                            </p>
                                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                                <strong>{locale === "en" ? "Account holder:" : "Chủ tài khoản:"}</strong> LE XUAN TRUONG
                                            </p>
                                            <p className='text-sm text-gray-700 dark:text-gray-300'>
                                                <strong>{locale === "en" ? "Message (Optional):" : "Nội dung (Tuỳ chọn):"}</strong> Ung ho AnyTools
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* PayPal */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-center gap-2 mb-4'>
                                        <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L8.926 12.7a.975.975 0 01.963-.823h2.024c4.061 0 6.832-1.652 7.706-6.43a5.361 5.361 0 00.072-.886c.213.012.43.035.64.076.81.17 1.495.521 1.988 1.102.398.47.681 1.07.748 1.74z' />
                                        </svg>
                                        <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{locale === "en" ? "PayPal (International)" : "PayPal (Quốc Tế)"}</h3>
                                    </div>

                                    <a href='https://paypal.me/lexuantruong098' target='_blank' rel='noopener noreferrer' className='flex items-center justify-center gap-3 p-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md'>
                                        <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L8.926 12.7a.975.975 0 01.963-.823h2.024c4.061 0 6.832-1.652 7.706-6.43a5.361 5.361 0 00.072-.886c.213.012.43.035.64.076.81.17 1.495.521 1.988 1.102.398.47.681 1.07.748 1.74z' />
                                            <path d='M18.278 6.505C17.384 2.62 14.638 1 10.763 1H4.937a.975.975 0 00-.963.824L1.024 20.577a.583.583 0 00.577.68h4.2l1.054-6.68-.033.208a.975.975 0 01.963-.825h2.006c3.94 0 7.03-1.6 7.93-6.237.028-.147.05-.295.067-.442-.15-.065-.302-.124-.457-.175a7.352 7.352 0 00-1.053-.163z' />
                                        </svg>
                                        <span className='text-xl font-semibold'>{locale === "en" ? "Donate with PayPal" : "Ủng Hộ qua PayPal"}</span>
                                    </a>

                                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-8'>
                                        <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>{locale === "en" ? "Click the button above to donate securely via PayPal. You can donate any amount you wish." : "Nhấn vào nút trên để ủng hộ an toàn qua PayPal. Bạn có thể ủng hộ bất kỳ số tiền nào."}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            PayPal Link:{" "}
                                            <a href='https://paypal.me/lexuantruong098' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                                                paypal.me/lexuantruong098
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className='text-sm text-gray-500 dark:text-gray-500 mt-8 text-center'>{locale === "en" ? "Your donation helps us maintain and improve AnyTools. Thank you for your support! 🙏" : "Sự đóng góp của bạn giúp chúng tôi duy trì và cải thiện AnyTools. Cảm ơn sự ủng hộ của bạn! 🙏"}</p>
                        </div>
                    </div>

                    {/* Why Donate Section */}
                    <div className='grid md:grid-cols-3 gap-6 mt-12'>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <div className='text-4xl mb-3'>🚀</div>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Keep It Free" : "Giữ Miễn Phí"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{locale === "en" ? "Help us keep all tools free for everyone" : "Giúp chúng tôi giữ tất cả công cụ miễn phí cho mọi người"}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <div className='text-4xl mb-3'>🛠️</div>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "New Features" : "Tính Năng Mới"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{locale === "en" ? "Support development of new tools and features" : "Hỗ trợ phát triển công cụ và tính năng mới"}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <div className='text-4xl mb-3'>⚡</div>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Faster Updates" : "Cập Nhật Nhanh"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{locale === "en" ? "Enable us to improve and update tools faster" : "Giúp chúng tôi cải thiện và cập nhật công cụ nhanh hơn"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
