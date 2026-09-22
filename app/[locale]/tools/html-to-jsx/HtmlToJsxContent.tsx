"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { htmlToJsxTranslations } from "@/lib/i18n/tools/html-to-jsx";
import { toast } from "@/components/ui/Toast";

// Helper: Convert CSS style string to React style object string
function convertStyleStringToObject(styleStr: string): string {
    const rules = styleStr.split(";").map((r) => r.trim()).filter(Boolean);
    const obj: { [key: string]: string } = {};

    rules.forEach((rule) => {
        const colonIdx = rule.indexOf(":");
        if (colonIdx === -1) return;
        const prop = rule.slice(0, colonIdx).trim();
        const val = rule.slice(colonIdx + 1).trim();

        // Convert CSS kebab-case to camelCase
        let camelProp = prop.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
        if (camelProp.startsWith("ms")) {
            camelProp = camelProp.charAt(0).toLowerCase() + camelProp.slice(1);
        } else if (camelProp.startsWith("Webkit") || camelProp.startsWith("Moz")) {
            // Keep capital for vendor prefixes
        }

        obj[camelProp] = val;
    });

    const entries = Object.entries(obj).map(([k, v]) => `${k}: "${v.replace(/"/g, '\\"')}"`);
    return `{{ ${entries.join(", ")} }}`;
}

// Main HTML to JSX converter function
function convertHtmlToJsx(html: string): string {
    if (!html.trim()) return "";

    let jsx = html;

    // 1. Convert HTML comments <!-- ... --> to {/* ... */}
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

    // 2. Convert inline style="..." to style={{ ... }}
    jsx = jsx.replace(/style=(["'])(.*?)\1/gi, (_, __, styleContent) => {
        return `style=${convertStyleStringToObject(styleContent)}`;
    });

    // 3. Convert HTML standard attributes to JSX camelCase
    const attrMap: { [key: string]: string } = {
        class: "className",
        for: "htmlFor",
        tabindex: "tabIndex",
        autocomplete: "autoComplete",
        autofocus: "autoFocus",
        readonly: "readOnly",
        maxlength: "maxLength",
        minlength: "minLength",
        novalidate: "noValidate",
        enctype: "encType",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable",
        crossorigin: "crossOrigin",
        datetime: "dateTime",
        accesskey: "accessKey",

        // SVG attributes
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "stroke-miterlimit": "strokeMiterlimit",
        "stroke-dasharray": "strokeDasharray",
        "stroke-dashoffset": "strokeDashoffset",
        "stroke-opacity": "strokeOpacity",
        "fill-rule": "fillRule",
        "fill-opacity": "fillOpacity",
        "clip-rule": "clipRule",
        "clip-path": "clipPath",
        "stop-color": "stopColor",
        "stop-opacity": "stopOpacity",
        viewbox: "viewBox",
        "xlink:href": "xlinkHref",
        "xmlns:xlink": "xmlnsXlink",
    };

    for (const [htmlAttr, jsxAttr] of Object.entries(attrMap)) {
        const regex = new RegExp(`\\b${htmlAttr}=`, "gi");
        jsx = jsx.replace(regex, `${jsxAttr}=`);
    }

    // 4. Ensure void tags are self-closing in JSX: <img ... >, <input ... >, <br>, <hr>
    const voidTags = [
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"
    ];

    voidTags.forEach((tag) => {
        // Match <tag attr1="val"> without closing /
        const regex = new RegExp(`<(${tag})(\\s+[^>]*?)?(?<!/)>`, "gi");
        jsx = jsx.replace(regex, (_, t, attrs) => `<${t}${attrs ? attrs : ""} />`);
    });

    return jsx.trim();
}

// Sample presets
const PRESETS = {
    card: `<div class="card shadow-sm border-0" style="max-width: 400px; margin: 20px auto; border-radius: 12px;">
    <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675" class="card-img-top" alt="Card Header">
    <div class="card-body" style="padding: 24px; text-align: left;">
        <h5 class="card-title" style="font-weight: 700; color: #1e293b;">Modern Card Title</h5>
        <p class="card-text" style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Convert any HTML snippet with inline styles, bootstrap classes, or attributes directly to React.
        </p>
        <a href="#" class="btn btn-primary" style="background-color: #2563eb; padding: 8px 16px; border-radius: 8px;">Explore More</a>
    </div>
</div>`,
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    form: `<form action="/submit" method="POST" style="max-width: 500px; padding: 20px; background: #f8fafc; border-radius: 16px;">
    <div class="form-group" style="margin-bottom: 16px;">
        <label for="user-email" style="display: block; font-weight: 600; margin-bottom: 6px;">Email address</label>
        <input type="email" class="form-control" id="user-email" placeholder="name@example.com" autocomplete="email" required autofocus>
    </div>
    <div class="form-group" style="margin-bottom: 16px;">
        <label for="user-bio" style="display: block; font-weight: 600; margin-bottom: 6px;">Bio</label>
        <textarea class="form-control" id="user-bio" rows="3" maxlength="200"></textarea>
    </div>
    <button type="submit" class="btn btn-success" style="cursor: pointer;">Submit Form</button>
</form>`,
};

export default function HtmlToJsxContent() {
    const { locale } = useLanguage();
    const t = htmlToJsxTranslations[locale as "en" | "vi"] || htmlToJsxTranslations.en;

    const [inputHtml, setInputHtml] = useState<string>(PRESETS.card);
    const [wrapOption, setWrapOption] = useState<"none" | "function" | "tsx">("none");

    const convertedJsx = useMemo(() => {
        const rawJsx = convertHtmlToJsx(inputHtml);
        if (!rawJsx) return "";

        if (wrapOption === "function") {
            const indented = rawJsx
                .split("\n")
                .map((line) => `        ${line}`)
                .join("\n");
            return `export default function MyComponent() {\n    return (\n${indented}\n    );\n}`;
        }

        if (wrapOption === "tsx") {
            const indented = rawJsx
                .split("\n")
                .map((line) => `        ${line}`)
                .join("\n");
            return `import React from 'react';\n\nexport const MyComponent: React.FC = () => {\n    return (\n${indented}\n    );\n};\n\nexport default MyComponent;`;
        }

        return rawJsx;
    }, [inputHtml, wrapOption]);

    const handleCopy = () => {
        if (!convertedJsx) return;
        navigator.clipboard.writeText(convertedJsx);
        toast.success(t.copied);
    };

    const handleDownload = () => {
        if (!convertedJsx) return;
        const ext = wrapOption === "tsx" ? "tsx" : "jsx";
        const blob = new Blob([convertedJsx], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Component.${ext}`;
        link.click();
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar: Presets & Component Wrapping */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                {/* Presets */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1'>
                        ⚡ {t.presets}:
                    </span>
                    <button
                        onClick={() => setInputHtml(PRESETS.card)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetCard}
                    </button>
                    <button
                        onClick={() => setInputHtml(PRESETS.svg)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetSvg}
                    </button>
                    <button
                        onClick={() => setInputHtml(PRESETS.form)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetForm}
                    </button>
                </div>

                {/* Wrapper Option */}
                <div className='flex items-center gap-2 text-xs'>
                    <span className='font-bold text-gray-700 dark:text-gray-300'>📦 {t.wrapOption}:</span>
                    <select
                        value={wrapOption}
                        onChange={(e) => setWrapOption(e.target.value as any)}
                        className='px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                    >
                        <option value='none'>{t.wrapNone}</option>
                        <option value='function'>{t.wrapFunction}</option>
                        <option value='tsx'>{t.wrapTsx}</option>
                    </select>
                </div>
            </div>

            {/* Dual Split Editor */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Left: Input HTML */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <span>📄</span> {t.inputLabel}
                        </span>
                        {inputHtml && (
                            <button
                                onClick={() => setInputHtml("")}
                                className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                            >
                                ✕ {t.clear}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={inputHtml}
                        onChange={(e) => setInputHtml(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        rows={18}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed'
                    />
                </div>

                {/* Right: Output JSX */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2'>
                            <span>✨</span> {t.outputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={handleCopy}
                                disabled={!convertedJsx}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📋 {t.copyJsx}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={!convertedJsx}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                💾 {t.downloadFile}
                            </Button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={convertedJsx}
                        rows={18}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-900 text-emerald-400 font-mono text-xs sm:text-sm focus:outline-hidden resize-none leading-relaxed'
                    />
                </div>
            </div>

            {/* SEO & Developer Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
