"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import RegexTesterClient from "./RegexTesterClient";
import FAQSection from "@/components/ui/FAQSection";

export default function RegexTesterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.regexTester.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <RegexTesterClient />

            <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300 wrap-break-word'>
                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                    <p className='leading-relaxed mb-4'>{t.whatIsDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.history}</h2>
                    <p className='leading-relaxed'>{t.historyDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.syntax}</h2>
                    <p className='leading-relaxed'>{t.syntaxDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.metacharacters}</h2>
                    <ul className='space-y-2'>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.dot}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.caret}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.dollar}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.star}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.plus}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.question}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.brackets}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.pipe}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.parens}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.braces}</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.characterClasses}</h2>
                    <ul className='space-y-2'>
                        <li className='font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500'>{t.characterClassesList.digit}</li>
                        <li className='font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500'>{t.characterClassesList.notDigit}</li>
                        <li className='font-mono text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-500'>{t.characterClassesList.word}</li>
                        <li className='font-mono text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-500'>{t.characterClassesList.notWord}</li>
                        <li className='font-mono text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-4 border-purple-500'>{t.characterClassesList.whitespace}</li>
                        <li className='font-mono text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-4 border-purple-500'>{t.characterClassesList.notWhitespace}</li>
                        <li className='font-mono text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-4 border-orange-500'>{t.characterClassesList.boundary}</li>
                        <li className='font-mono text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-4 border-orange-500'>{t.characterClassesList.notBoundary}</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.flags}</h2>
                    <ul className='space-y-2'>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.g.split(":")[0]}:</strong> {t.flagsList.g.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.i.split(":")[0]}:</strong> {t.flagsList.i.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.m.split(":")[0]}:</strong> {t.flagsList.m.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.s.split(":")[0]}:</strong> {t.flagsList.s.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.u.split(":")[0]}:</strong> {t.flagsList.u.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.y.split(":")[0]}:</strong> {t.flagsList.y.split(":").slice(1).join(":")}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.commonPatterns}</h2>
                    <div className='space-y-3'>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.email.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.email.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.url.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.url.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.phone.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.phone.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.ipv4.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.ipv4.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.date.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.date.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.hexColor.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.hexColor.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.username.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.username.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.password.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.password.split(":").slice(1).join(":")}</code>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.validation.split(":")[0]}:</strong> {t.useCasesList.validation.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.extraction.split(":")[0]}:</strong> {t.useCasesList.extraction.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.searchReplace.split(":")[0]}:</strong> {t.useCasesList.searchReplace.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.parsing.split(":")[0]}:</strong> {t.useCasesList.parsing.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.routing.split(":")[0]}:</strong> {t.useCasesList.routing.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.filtering.split(":")[0]}:</strong> {t.useCasesList.filtering.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bestPractices}</h2>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.simple.split(":")[0]}:</strong> {t.bestPracticesList.simple.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.specific.split(":")[0]}:</strong> {t.bestPracticesList.specific.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.anchor.split(":")[0]}:</strong> {t.bestPracticesList.anchor.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.escape.split(":")[0]}:</strong> {t.bestPracticesList.escape.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.test.split(":")[0]}:</strong> {t.bestPracticesList.test.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.comment.split(":")[0]}:</strong> {t.bestPracticesList.comment.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.performance.split(":")[0]}:</strong> {t.bestPracticesList.performance.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.alternative.split(":")[0]}:</strong> {t.bestPracticesList.alternative.split(":")[1]}
                            </span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.performance}</h2>
                    <p className='leading-relaxed'>{t.performanceDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                    <ol className='space-y-2 list-decimal list-inside'>
                        <li>{t.steps.pattern}</li>
                        <li>{t.steps.flags}</li>
                        <li>{t.steps.text}</li>
                        <li>{t.steps.test}</li>
                        <li>{t.steps.iterate}</li>
                    </ol>
                </section>

                <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                        {locale === "vi"
                            ? "Cú Pháp Biểu Thức Chính Quy (Regex) Cho Các Ngôn Ngữ Lập Trình"
                            : "Regular Expression (Regex) Syntax Across Programming Languages"}
                    </h2>
                    <p className='leading-relaxed text-sm text-gray-600 dark:text-gray-400'>
                        {locale === "vi"
                            ? "Mặc dù hầu hết các ngôn ngữ đều tuân theo chuẩn PCRE (Perl Compatible Regular Expressions), cách khai báo chuỗi, cú pháp escape dấu gạch chéo ngược (\\) và cú pháp Named Groups lại khác biệt đáng kể giữa Java, Python, C#, JavaScript, Rust, Go, Kotlin, PHP, Ruby, Swift và Dart. Bảng so sánh dưới đây giúp bạn nhanh chóng chuyển đổi biểu thức chính quy mà không lo lỗi cú pháp:"
                            : "While most programming languages follow PCRE standards, string literal escaping, raw string syntax, and named groups vary significantly across Java, Python, C#, JavaScript, Rust, Go, Kotlin, PHP, Ruby, Swift, and Dart. Use this comprehensive reference table for seamless cross-language regex development:"}
                    </p>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-left text-xs border-collapse font-sans'>
                            <thead>
                                <tr className='border-b border-gray-200 dark:border-gray-700 text-gray-500 uppercase tracking-wider'>
                                    <th className='p-3'>{locale === "vi" ? "Ngôn Ngữ" : "Language"}</th>
                                    <th className='p-3'>{locale === "vi" ? "Cú Pháp Khai Báo" : "Declaration Syntax"}</th>
                                    <th className='p-3'>{locale === "vi" ? "Quy Tắc Escape Dấu Gạch Chéo" : "Backslash Escaping"}</th>
                                    <th className='p-3'>{locale === "vi" ? "Cú Pháp Named Group" : "Named Group"}</th>
                                    <th className='p-3'>{locale === "vi" ? "Đặc Trưng & Cú Pháp Chuẩn" : "Language Features"}</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                                <tr>
                                    <td className='p-3 font-bold text-amber-600'>Java</td>
                                    <td className='p-3 font-mono'>Pattern.compile(&quot;\\\\d+&quot;)</td>
                                    <td className='p-3 text-rose-600 font-semibold'>Bắt buộc nhân đôi <code>\\</code> (ví dụ: <code>\\\\d</code>, <code>\\\\w</code>)</td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Gói <code>java.util.regex</code> với Matcher &amp; Pattern, hỗ trợ full Lookaround</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-blue-600'>Python</td>
                                    <td className='p-3 font-mono'>re.compile(r&quot;pattern&quot;)</td>
                                    <td className='p-3'>Dùng raw string <code>r&quot;...&quot;</code>, giữ nguyên <code>\</code></td>
                                    <td className='p-3 font-mono'>(?P&lt;name&gt;...)</td>
                                    <td className='p-3'>re module hỗ trợ Lookahead &amp; Lookbehind đầy đủ</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-purple-600'>C# (.NET)</td>
                                    <td className='p-3 font-mono'>new Regex(@&quot;pattern&quot;)</td>
                                    <td className='p-3'>Dùng verbatim <code>@&quot;...&quot;</code>, dấu <code>&quot;</code> đổi thành <code>&quot;&quot;</code></td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Hiệu năng cao với compiled regex hoặc Regex Source Generator (.NET 7+)</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-yellow-600'>JavaScript / TS</td>
                                    <td className='p-3 font-mono'>/pattern/flags</td>
                                    <td className='p-3'>Dùng literal <code>/.../</code>, không cần nhân đôi <code>\</code></td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Hỗ trợ regex lookbehind từ ES2018+, cờ u cho Unicode, matchAll trích xuất</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-orange-600'>Rust</td>
                                    <td className='p-3 font-mono'>Regex::new(r#&quot;pattern&quot;#)</td>
                                    <td className='p-3'>Dùng raw string <code>r#&quot;...&quot;#</code>, an toàn tuyệt đối</td>
                                    <td className='p-3 font-mono'>(?P&lt;name&gt;...)</td>
                                    <td className='p-3'>Crate regex chính thức, bảo đảm thời gian tuyến tính O(N), chống ReDoS</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-cyan-600'>Go</td>
                                    <td className='p-3 font-mono'>regexp.MustCompile(`pattern`)</td>
                                    <td className='p-3'>Dùng raw string backticks <code>`...`</code></td>
                                    <td className='p-3 font-mono'>(?P&lt;name&gt;...)</td>
                                    <td className='p-3'>RE2 engine (Thời gian tuyến tính, không dùng Lookaround)</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-violet-600'>Kotlin</td>
                                    <td className='p-3 font-mono'>&quot;&quot;&quot;pattern&quot;&quot;&quot;.toRegex()</td>
                                    <td className='p-3'>Dùng chuỗi 3 nháy <code>&quot;&quot;&quot;...&quot;&quot;&quot;</code> không cần escape <code>\</code></td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Thừa hưởng sức mạnh của JVM regex kèm cú pháp extension hiện đại</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-indigo-600'>PHP</td>
                                    <td className='p-3 font-mono'>preg_match(&apos;/pattern/i&apos;, $text)</td>
                                    <td className='p-3'>Dùng chuỗi nháy đơn <code>&apos;...&apos;</code> kèm ký tự phân cách <code>/</code></td>
                                    <td className='p-3 font-mono'>(?P&lt;name&gt;...) hoặc (?&lt;name&gt;...)</td>
                                    <td className='p-3'>Thư viện PCRE siêu nhanh, hỗ trợ đệ quy (?R) và cờ tìm kiếm phong phú</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-red-600'>Ruby</td>
                                    <td className='p-3 font-mono'>/pattern/flags</td>
                                    <td className='p-3'>Dùng literal <code>/.../</code> hoặc <code>%r&#123;...&#125;</code></td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Oniguruma engine mạnh mẽ, hỗ trợ toán tử vắng mặt (?~pattern)</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-emerald-600'>Swift</td>
                                    <td className='p-3 font-mono'>NSRegularExpression(pattern: #&quot;pattern&quot;#)</td>
                                    <td className='p-3'>Dùng extended delimiter <code>#&quot;...&quot;#</code> giữ nguyên <code>\</code></td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Foundation NSRegularExpression hoặc cú pháp Regex literal mới của Swift 5.7+</td>
                                </tr>
                                <tr>
                                    <td className='p-3 font-bold text-sky-600'>Dart / Flutter</td>
                                    <td className='p-3 font-mono'>RegExp(r&apos;pattern&apos;)</td>
                                    <td className='p-3'>Dùng raw string <code>r&apos;...&apos;</code> với dấu nháy đơn</td>
                                    <td className='p-3 font-mono'>(?&lt;name&gt;...)</td>
                                    <td className='p-3'>Thư viện dart:core tiêu chuẩn dùng cho Flutter app và backend Dart</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <FAQSection locale={locale} faqs={t.faqList} />
            </div>
        </div>
    );
}
