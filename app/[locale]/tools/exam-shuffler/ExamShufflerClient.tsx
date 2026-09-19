"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { toast } from "@/components/ui/Toast";

interface QuestionChoice {
    originalLetter: string;
    text: string;
    isCorrect: boolean;
}

interface ParsedQuestion {
    id: number;
    originalNumber: number;
    content: string;
    choices: QuestionChoice[];
}

interface GeneratedChoice {
    letter: string;
    text: string;
    isCorrect: boolean;
}

interface GeneratedQuestion {
    newNumber: number;
    originalNumber: number;
    content: string;
    choices: GeneratedChoice[];
    correctLetter: string | null;
}

interface ExamVariant {
    code: string;
    questions: GeneratedQuestion[];
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const SAMPLE_EXAM_VI = `Câu 1: Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?
*A. Hà Nội
B. TP. Hồ Chí Minh
C. Đà Nẵng
D. Hải Phòng

Câu 2: Số nguyên tố chẵn duy nhất trong tập hợp số tự nhiên là số nào?
A. 0
*B. 2
C. 4
D. 6

Câu 3: Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?
A. 1945
B. 1950
*C. 1954
D. 1975

Câu 4: Trong mặt phẳng tọa độ Oxy, phương trình đường tròn tâm O(0; 0) bán kính R = 3 là:
A. x² + y² = 3
*B. x² + y² = 9
C. x² + y² = 6
D. (x - 3)² + (y - 3)² = 9

Câu 5: Khí nào sau đây chiếm tỉ lệ thể tích lớn nhất trong không khí của Trái Đất?
A. Oxy (O₂)
B. Carbon dioxide (CO₂)
*C. Nitơ (N₂)
D. Argon (Ar)`;

const SAMPLE_EXAM_EN = `Question 1: What is the capital city of France?
*A. Paris
B. Rome
C. Berlin
D. Madrid

Question 2: What is the smallest prime number?
A. 0
B. 1
*C. 2
D. 3

Question 3: Water boils at what temperature at standard atmospheric pressure?
A. 90°C
*B. 100°C
C. 120°C
D. 80°C

Question 4: Which planet in our solar system is known as the Red Planet?
A. Venus
*B. Mars
C. Jupiter
D. Saturn

Question 5: Which element has the chemical symbol 'O'?
A. Gold
*B. Oxygen
C. Osmium
D. Silver`;

export default function ExamShufflerClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale).tools.examShuffler;

    const [rawInput, setRawInput] = useState<string>(isVi ? SAMPLE_EXAM_VI : SAMPLE_EXAM_EN);
    const [variantCount, setVariantCount] = useState<number>(4);
    const [startingCode, setStartingCode] = useState<number>(101);
    const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
    const [shuffleChoices, setShuffleChoices] = useState<boolean>(true);

    const [variants, setVariants] = useState<ExamVariant[]>([]);
    const [activeTab, setActiveTab] = useState<string>("matrix"); // "matrix" or code e.g. "101"

    // Smart regex parser for questions and options
    const parsedQuestions = useMemo(() => {
        if (!rawInput.trim()) return [];
        const questions: ParsedQuestion[] = [];
        const text = rawInput.replace(/\r\n/g, "\n");

        // Split by question boundaries (e.g. Câu 1:, Question 1:, 1.)
        const qRegex = /(?:^|\n)(?:(?:Câu|Question)\s*(\d+)[:.]|(\d+)[:.)/])\s*([\s\S]*?)(?=(?:\n(?:(?:Câu|Question)\s*\d+[:.]|\d+[:.)/])\s*|$))/gi;
        let match;
        let fallbackIndex = 1;

        while ((match = qRegex.exec(text)) !== null) {
            const num = parseInt(match[1] || match[2] || String(fallbackIndex));
            const fullBlock = match[3].trim();
            if (!fullBlock) continue;

            // Find where choices begin
            const firstChoiceIdx = fullBlock.search(/(?:^|\n)\s*\*?\s*[A-Fa-f]\s*[:.)]/);
            const content = firstChoiceIdx !== -1 ? fullBlock.slice(0, firstChoiceIdx).trim() : fullBlock;

            // Match choices
            const choiceRegex = /(?:^|\n)\s*(\*?)\s*([A-Fa-f])\s*[:.)]\s*([\s\S]*?)(?=(?:\n\s*\*?\s*[A-Fa-f]\s*[:.)]|$))/g;
            const choices: QuestionChoice[] = [];
            let cMatch;

            while ((cMatch = choiceRegex.exec(fullBlock)) !== null) {
                choices.push({
                    originalLetter: cMatch[2].toUpperCase(),
                    text: cMatch[3].trim(),
                    isCorrect: cMatch[1] === "*",
                });
            }

            if (content) {
                questions.push({
                    id: fallbackIndex++,
                    originalNumber: num,
                    content,
                    choices,
                });
            }
        }

        return questions;
    }, [rawInput]);

    // Shuffle and generate variants
    const handleGenerate = useCallback(() => {
        if (parsedQuestions.length === 0) {
            toast.error(t.errorNoQuestions);
            return;
        }

        const count = Math.max(1, Math.min(10, variantCount));
        const newVariants: ExamVariant[] = [];

        for (let k = 0; k < count; k++) {
            const code = String(startingCode + k);

            // Clone questions
            let workingQuestions = parsedQuestions.map((q) => ({
                ...q,
                choices: [...q.choices],
            }));

            // Shuffle question order if enabled
            if (shuffleQuestions) {
                for (let i = workingQuestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [workingQuestions[i], workingQuestions[j]] = [workingQuestions[j], workingQuestions[i]];
                }
            }

            // Shuffle choices if enabled and assign new letters A, B, C, D
            const finalQuestions: GeneratedQuestion[] = workingQuestions.map((q, qIdx) => {
                let choicesToUse = [...q.choices];
                if (shuffleChoices && choicesToUse.length > 1) {
                    for (let i = choicesToUse.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [choicesToUse[i], choicesToUse[j]] = [choicesToUse[j], choicesToUse[i]];
                    }
                }

                let correctLetter: string | null = null;
                const mappedChoices: GeneratedChoice[] = choicesToUse.map((c, cIdx) => {
                    const letter = LETTERS[cIdx % LETTERS.length];
                    if (c.isCorrect) {
                        correctLetter = letter;
                    }
                    return {
                        letter,
                        text: c.text,
                        isCorrect: c.isCorrect,
                    };
                });

                return {
                    newNumber: qIdx + 1,
                    originalNumber: q.originalNumber,
                    content: q.content,
                    choices: mappedChoices,
                    correctLetter,
                };
            });

            newVariants.push({
                code,
                questions: finalQuestions,
            });
        }

        setVariants(newVariants);
        setActiveTab("matrix");
        toast.success(isVi ? `Đã tạo thành công ${count} mã đề thi!` : `Successfully generated ${count} exam codes!`);
    }, [parsedQuestions, variantCount, startingCode, shuffleQuestions, shuffleChoices, t.errorNoQuestions, isVi]);

    // Presets
    const handleLoadSample = () => {
        setRawInput(isVi ? SAMPLE_EXAM_VI : SAMPLE_EXAM_EN);
        toast.info(isVi ? "Đã nạp đề thi trắc nghiệm mẫu!" : "Loaded sample exam questions!");
    };

    const handleClear = () => {
        setRawInput("");
        setVariants([]);
    };

    // Copy single exam variant text
    const handleCopyVariant = async (variant: ExamVariant) => {
        let text = `=== ${isVi ? "ĐỀ THI TRẮC NGHIỆM" : "EXAM PAPER"} - ${t.examCodePrefix}: ${variant.code} ===\n`;
        text += `${isVi ? "Họ và tên: ....................................... Lớp: ............" : "Student Name: .................................... Class: ............"}\n\n`;

        variant.questions.forEach((q) => {
            text += `${t.questionPrefix} ${q.newNumber}: ${q.content}\n`;
            q.choices.forEach((c) => {
                text += `${c.letter}. ${c.text}\n`;
            });
            text += "\n";
        });

        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copiedToast);
        } catch {
            toast.error(isVi ? "Lỗi sao chép" : "Copy failed");
        }
    };

    // Copy Answer Key Matrix
    const handleCopyMatrix = async () => {
        if (variants.length === 0) return;
        let text = `=== ${t.answerKeyTab.toUpperCase()} ===\n`;
        text += `${t.questionPrefix}\t` + variants.map((v) => `${t.examCodePrefix} ${v.code}`).join("\t") + "\n";

        const totalQ = variants[0].questions.length;
        for (let i = 0; i < totalQ; i++) {
            const rowLetters = variants.map((v) => v.questions[i]?.correctLetter || "-").join("\t");
            text += `${t.questionPrefix} ${i + 1}\t${rowLetters}\n`;
        }

        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copiedToast);
        } catch {
            toast.error(isVi ? "Lỗi sao chép" : "Copy failed");
        }
    };

    // HTML Escaping Helper
    const escapeHtml = (str: string) => {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Isolated print engine: prints ONLY the formatted exam paper/matrix without any website UI
    const printHtmlDocument = (contentHtml: string, documentTitle: string) => {
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            window.print();
            return;
        }

        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="utf-8">
                <title>${escapeHtml(documentTitle)}</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 15mm 15mm 18mm 15mm;
                    }
                    * {
                        box-sizing: border-box;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    body {
                        font-family: "Times New Roman", Times, "Liberation Serif", serif;
                        font-size: 11.5pt;
                        color: #000;
                        background: #fff;
                        margin: 0;
                        padding: 0;
                        line-height: 1.45;
                    }
                    .exam-page {
                        page-break-after: always;
                        padding-bottom: 20pt;
                    }
                    .exam-page:last-child {
                        page-break-after: auto;
                    }
                    .exam-header {
                        border-bottom: 1.5pt solid #000;
                        padding-bottom: 6pt;
                        margin-bottom: 12pt;
                    }
                    .header-flex {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    .school-title {
                        font-size: 10.5pt;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .exam-main-title {
                        font-size: 13pt;
                        font-weight: bold;
                        text-transform: uppercase;
                        margin-top: 2pt;
                    }
                    .exam-time {
                        font-size: 10pt;
                        font-style: italic;
                        margin-top: 2pt;
                    }
                    .code-badge {
                        border: 1.5pt solid #000;
                        padding: 4pt 10pt;
                        font-weight: bold;
                        font-size: 12pt;
                        border-radius: 4pt;
                        text-align: center;
                    }
                    .student-details {
                        display: flex;
                        justify-content: space-between;
                        font-size: 10.5pt;
                        margin-top: 8pt;
                        padding-top: 6pt;
                        border-top: 1pt dashed #555;
                    }
                    .question-block {
                        margin-bottom: 9pt;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .question-heading {
                        font-weight: bold;
                        margin-bottom: 3pt;
                    }
                    .options-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 3pt 15pt;
                        padding-left: 10pt;
                    }
                    .option-text {
                        font-size: 11pt;
                    }
                    .opt-letter {
                        font-weight: bold;
                    }
                    .exam-footer {
                        text-align: center;
                        margin-top: 20pt;
                        padding-top: 10pt;
                        border-top: 1pt solid #ccc;
                        font-size: 10pt;
                        font-style: italic;
                    }
                    /* Matrix styling */
                    .matrix-container {
                        padding: 10pt 0;
                    }
                    .matrix-title {
                        text-align: center;
                        font-size: 14pt;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .matrix-sub {
                        text-align: center;
                        font-size: 10.5pt;
                        font-style: italic;
                        margin-top: 4pt;
                        margin-bottom: 14pt;
                    }
                    table {
                        width: 100%;
                        max-width: 650px;
                        margin: 0 auto;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1pt solid #000;
                        padding: 4pt 6pt;
                        text-align: center;
                        font-size: 10.5pt;
                    }
                    th {
                        background-color: #f2f2f2 !important;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                ${contentHtml}
            </body>
            </html>
        `);
        doc.close();

        iframe.contentWindow?.focus();
        setTimeout(() => {
            iframe.contentWindow?.print();
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 2000);
        }, 300);
    };

    // Helper to build HTML for single exam variant
    const buildExamVariantHtml = (variant: ExamVariant) => {
        return `
            <div class="exam-page">
                <div class="exam-header">
                    <div class="header-flex">
                        <div>
                            <div class="school-title">${isVi ? "KỲ THI TRẮC NGHIỆM" : "MULTIPLE CHOICE EXAMINATION"}</div>
                            <div class="exam-main-title">${isVi ? "BÀI THI / KIỂM TRA ĐÁNH GIÁ" : "EXAMINATION PAPER"}</div>
                            <div class="exam-time">${isVi ? `Thời gian làm bài: 45 phút (${variant.questions.length} câu trắc nghiệm)` : `Duration: 45 minutes (${variant.questions.length} questions)`}</div>
                        </div>
                        <div class="code-badge">
                            ${t.examCodePrefix}: ${escapeHtml(variant.code)}
                        </div>
                    </div>
                    <div class="student-details">
                        <span>${isVi ? "Họ và tên thí sinh: ........................................................" : "Student Name: ........................................................"}</span>
                        <span>${isVi ? "Số báo danh: ..................... Lớp: ................." : "Student ID: .......................... Class: ................."}</span>
                    </div>
                </div>
                <div class="questions-list">
                    ${variant.questions.map((q) => `
                        <div class="question-block">
                            <div class="question-heading">${t.questionPrefix} ${q.newNumber}: ${escapeHtml(q.content)}</div>
                            <div class="options-grid">
                                ${q.choices.map((c) => `
                                    <div class="option-text">
                                        <span class="opt-letter">${c.letter}.</span> ${escapeHtml(c.text)}
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
                <div class="exam-footer">
                    ${isVi ? "-------------------------- HẾT --------------------------<br>Cán bộ coi thi không giải thích gì thêm." : "-------------------------- END --------------------------"}
                </div>
            </div>
        `;
    };

    // Helper to build HTML for Matrix
    const buildMatrixHtml = () => {
        if (variants.length === 0) return "";
        const totalQ = variants[0].questions.length;
        let rows = "";
        for (let i = 0; i < totalQ; i++) {
            rows += `
                <tr>
                    <td style="font-weight: bold;">${i + 1}</td>
                    ${variants.map((v) => {
                        const letter = v.questions[i]?.correctLetter || "-";
                        return `<td style="font-weight: bold;">${escapeHtml(letter)}</td>`;
                    }).join("")}
                </tr>
            `;
        }

        return `
            <div class="matrix-container">
                <div class="matrix-title">${isVi ? "BẢNG MA TRẬN ĐÁP ÁN CHẤM THI" : "EXAM ANSWER KEY MATRIX"}</div>
                <div class="matrix-sub">${isVi ? "Áp dụng cho các mã đề:" : "Grading matrix for codes:"} ${variants.map((v) => v.code).join(", ")}</div>
                <table>
                    <thead>
                        <tr>
                            <th>${t.questionPrefix}</th>
                            ${variants.map((v) => `<th>${t.examCodePrefix} ${escapeHtml(v.code)}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    };

    // Print active view (single exam variant or matrix)
    const handlePrint = () => {
        if (activeTab === "matrix") {
            printHtmlDocument(buildMatrixHtml(), `${isVi ? "Ma trận đáp án" : "Answer Key Matrix"}`);
        } else {
            const variant = variants.find((v) => v.code === activeTab);
            if (variant) {
                printHtmlDocument(buildExamVariantHtml(variant), `${t.examCodePrefix} ${variant.code}`);
            }
        }
    };

    // Print ALL exam variants into one print job
    const handlePrintAll = () => {
        if (variants.length === 0) return;
        const allHtml = variants.map((v) => buildExamVariantHtml(v)).join("");
        printHtmlDocument(
            allHtml,
            `${isVi ? "Tất cả đề thi" : "All Exam Codes"} (${variants.map((v) => v.code).join(", ")})`
        );
    };

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Input & Settings Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors print:hidden'>
                {/* Header */}
                <div className='flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <span className='text-3xl'>📝</span>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                {t.name}
                            </h2>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {t.description}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={handleLoadSample}
                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 cursor-pointer'
                        >
                            📚 {t.loadSample}
                        </button>
                        <button
                            type='button'
                            onClick={handleClear}
                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer'
                        >
                            🗑️ {t.clear}
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Left: Input Textarea (7 Cols) */}
                    <div className='lg:col-span-7 flex flex-col'>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>📄</span>
                                <span>{t.inputTitle}</span>
                            </label>
                            <span className='px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'>
                                {t.detectedStats}: {parsedQuestions.length} {t.questionsDetected}
                            </span>
                        </div>
                        <textarea
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            placeholder={t.inputPlaceholder}
                            rows={12}
                            className='w-full p-3.5 text-xs sm:text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed'
                        />
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-2 italic'>
                            {t.answerMarkerNotice}
                        </p>
                    </div>

                    {/* Right: Settings & Action (5 Cols) */}
                    <div className='lg:col-span-5 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-4'>
                        <div className='space-y-4'>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                                <span>⚙️</span> {t.optionsConfig}
                            </h3>

                            {/* Variant count & Starting code */}
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <label className='text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5'>
                                        {t.variantCountLabel}
                                    </label>
                                    <select
                                        value={variantCount}
                                        onChange={(e) => setVariantCount(parseInt(e.target.value) || 2)}
                                        className='w-full px-2.5 py-1.5 text-xs font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                                    >
                                        <option value={2}>2 {isVi ? "đề (101, 102)" : "codes"}</option>
                                        <option value={4}>4 {isVi ? "đề (101 - 104)" : "codes"}</option>
                                        <option value={6}>6 {isVi ? "đề (101 - 106)" : "codes"}</option>
                                        <option value={8}>8 {isVi ? "đề (101 - 108)" : "codes"}</option>
                                    </select>
                                </div>

                                <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <label className='text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5'>
                                        {t.startingCodeLabel}
                                    </label>
                                    <input
                                        type='number'
                                        min='1'
                                        value={startingCode}
                                        onChange={(e) => setStartingCode(parseInt(e.target.value) || 101)}
                                        className='w-full px-2.5 py-1.5 text-xs font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center'
                                    />
                                </div>
                            </div>

                            {/* Shuffle Toggles */}
                            <div className='space-y-2.5 bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700'>
                                <label className='flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 dark:text-gray-200'>
                                    <input
                                        type='checkbox'
                                        checked={shuffleQuestions}
                                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                                        className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer'
                                    />
                                    <span>🔀 {t.shuffleQuestions}</span>
                                </label>
                                <label className='flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 dark:text-gray-200'>
                                    <input
                                        type='checkbox'
                                        checked={shuffleChoices}
                                        onChange={(e) => setShuffleChoices(e.target.checked)}
                                        className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer'
                                    />
                                    <span>🔤 {t.shuffleChoices}</span>
                                </label>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            type='button'
                            onClick={handleGenerate}
                            disabled={parsedQuestions.length === 0}
                            className='w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer transition-transform transform active:scale-95 flex items-center justify-center gap-2'
                        >
                            <span>⚡</span>
                            <span>{t.generateBtn}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {variants.length > 0 ? (
                <div className='space-y-4'>
                    {/* Navigation Tabs Bar */}
                    <div className='flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden'>
                        {/* Tabs */}
                        <div className='flex flex-wrap items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => setActiveTab("matrix")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                                    activeTab === "matrix"
                                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {t.answerKeyTab}
                            </button>

                            {variants.map((variant) => (
                                <button
                                    key={variant.code}
                                    type='button'
                                    onClick={() => setActiveTab(variant.code)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                                        activeTab === variant.code
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    📄 {t.examCodePrefix} {variant.code}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className='flex items-center gap-2'>
                            {activeTab === "matrix" ? (
                                <button
                                    type='button'
                                    onClick={handleCopyMatrix}
                                    className='px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5'
                                >
                                    <span>📋</span> {t.copyKeyBtn}
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    onClick={() => {
                                        const v = variants.find((item) => item.code === activeTab);
                                        if (v) handleCopyVariant(v);
                                    }}
                                    className='px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5'
                                >
                                    <span>📋</span> {t.copyExamBtn}
                                </button>
                            )}
                            {activeTab !== "matrix" && variants.length > 1 && (
                                <button
                                    type='button'
                                    onClick={handlePrintAll}
                                    className='px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 cursor-pointer flex items-center gap-1.5 shadow-2xs'
                                    title={isVi ? "In toàn bộ các mã đề cùng lúc" : "Print all exam variants"}
                                >
                                    <span>📚</span> {isVi ? `In tất cả (${variants.length} mã)` : `Print all (${variants.length} codes)`}
                                </button>
                            )}
                            <button
                                type='button'
                                onClick={handlePrint}
                                className='px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center gap-1.5 shadow-sm'
                                title={activeTab === "matrix" ? (isVi ? "In bảng ma trận đáp án chuẩn A4" : "Print grading answer key") : (isVi ? `In đề thi mã ${activeTab} chuẩn A4` : `Print code ${activeTab}`)}
                            >
                                <span>🖨️</span> {activeTab === "matrix" ? (isVi ? "In Bảng Đáp Án" : "Print Answer Matrix") : t.printBtn}
                            </button>
                        </div>
                    </div>

                    {/* TAB CONTENT: MATRIX */}
                    {activeTab === "matrix" && (
                        <div id='printable-exam-area' className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-x-auto'>
                            <div className='text-center mb-6'>
                                <h3 className='text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider'>
                                    {isVi ? "BẢNG MA TRẬN ĐÁP ÁN CHẤM THI" : "EXAM ANSWER KEY MATRIX"}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    {isVi ? "Áp dụng cho các mã đề:" : "Grading matrix for codes:"}{" "}
                                    {variants.map((v) => v.code).join(", ")}
                                </p>
                            </div>

                            <table className='w-full border-collapse text-center text-xs sm:text-sm font-mono max-w-2xl mx-auto'>
                                <thead>
                                    <tr className='bg-gray-100 dark:bg-gray-700/80 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'>
                                        <th className='py-2.5 px-3 border border-gray-300 dark:border-gray-600 font-bold'>
                                            {t.questionPrefix}
                                        </th>
                                        {variants.map((v) => (
                                            <th
                                                key={v.code}
                                                className='py-2.5 px-3 border border-gray-300 dark:border-gray-600 font-bold text-blue-600 dark:text-blue-400'
                                            >
                                                {t.examCodePrefix} {v.code}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants[0].questions.map((_, qIdx) => (
                                        <tr
                                            key={qIdx}
                                            className='hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-gray-200 dark:border-gray-700'
                                        >
                                            <td className='py-2 px-3 font-bold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'>
                                                {qIdx + 1}
                                            </td>
                                            {variants.map((v) => {
                                                const correct = v.questions[qIdx]?.correctLetter;
                                                return (
                                                    <td
                                                        key={v.code}
                                                        className={`py-2 px-3 font-black border border-gray-200 dark:border-gray-700 ${
                                                            correct
                                                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {correct || "-"}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB CONTENT: SPECIFIC EXAM CODE */}
                    {activeTab !== "matrix" && (
                        (() => {
                            const variant = variants.find((v) => v.code === activeTab);
                            if (!variant) return null;

                            return (
                                <div id='printable-exam-area' className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 shadow-sm print:p-0 print:border-none print:shadow-none'>
                                    {/* Test Paper Header */}
                                    <div className='border-b-2 border-gray-300 dark:border-gray-600 pb-4 mb-6'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <div className='font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100'>
                                                    {isVi ? "BÀI KIỂM TRA TRẮC NGHIỆM" : "MULTIPLE CHOICE EXAMINATION"}
                                                </div>
                                                <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium'>
                                                    {isVi ? "Thời gian làm bài: 45 phút" : "Duration: 45 minutes"}
                                                </div>
                                            </div>
                                            <div className='text-right'>
                                                <div className='inline-block px-3 py-1 bg-blue-600 dark:bg-blue-600 text-white font-mono font-black text-sm rounded-lg shadow-sm'>
                                                    {t.examCodePrefix}: {variant.code}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Student Info Box */}
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-800 dark:text-gray-200'>
                                            <div>{isVi ? "Họ và tên thí sinh: ........................................................" : "Student Full Name: ........................................................"}</div>
                                            <div>{isVi ? "Số báo danh: ..................... Lớp: ................." : "Student ID: .......................... Class: ................."}</div>
                                        </div>
                                    </div>

                                    {/* Questions */}
                                    <div className='space-y-6'>
                                        {variant.questions.map((q) => (
                                            <div key={q.newNumber} className='text-sm space-y-2.5'>
                                                <div className='font-bold text-gray-900 dark:text-gray-100 leading-snug'>
                                                    {t.questionPrefix} {q.newNumber}: {q.content}
                                                </div>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-3'>
                                                    {q.choices.map((c) => (
                                                        <div
                                                            key={c.letter}
                                                            className='flex items-start gap-1.5 text-gray-800 dark:text-gray-200 leading-normal'
                                                        >
                                                            <span className='font-bold text-blue-600 dark:text-blue-400 shrink-0'>{c.letter}.</span>
                                                            <span>{c.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()
                    )}
                </div>
            ) : (
                <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden'>
                    <div className='text-5xl mb-3'>📝</div>
                    <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-1'>
                        {t.resultsTitle}
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                        {t.noExamsYet}
                    </p>
                </div>
            )}

            {/* Fallback CSS for browser print dialog (Ctrl+P) */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    header, footer, nav, aside, [id*="tools"], #tools, .suggest-tool-banner, [class*="ToolsSidebar"], [class*="ToolPageLayout"] > header, [class*="ToolsDropdown"], [class*="MobileNavDrawer"], [class*="Breadcrumbs"], .print\\:hidden, #input-settings-card {
                        display: none !important;
                    }
                    body, html, main {
                        background: #fff !important;
                        color: #000 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    #printable-exam-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        color: #000 !important;
                        background: #fff !important;
                    }
                    #printable-exam-area * {
                        color: #000 !important;
                    }
                }
            `}} />
        </div>
    );
}
