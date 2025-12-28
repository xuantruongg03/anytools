"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./markdown-styles.css";

// Default markdown content
const DEFAULT_MARKDOWN = `# Welcome to Markdown Editor

This is a **free online Markdown editor** with real-time preview.

## Features

- ✅ Real-time preview
- ✅ Export to **PDF** and **Word**
- ✅ GitHub Flavored Markdown support
- ✅ Auto-save to browser

## Code Example

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example

| Feature | Supported |
|---------|-----------|
| Bold | ✅ |
| Italic | ✅ |
| Tables | ✅ |
| Code | ✅ |

## Task List

- [x] Create editor
- [x] Add preview
- [ ] Export to PDF
- [ ] Export to Word

> 💡 **Tip:** Use the toolbar above to quickly format your text!

---

*Start editing to see the magic happen!* ✨
`;

// Toolbar items
const TOOLBAR_ITEMS = [
    { key: "bold", icon: "𝐁", syntax: "**", wrap: true, title: "Bold" },
    { key: "italic", icon: "𝐼", syntax: "*", wrap: true, title: "Italic" },
    { key: "strikethrough", icon: "S̶", syntax: "~~", wrap: true, title: "Strikethrough" },
    { key: "divider1", divider: true },
    { key: "heading1", icon: "H1", syntax: "# ", prefix: true, title: "Heading 1" },
    { key: "heading2", icon: "H2", syntax: "## ", prefix: true, title: "Heading 2" },
    { key: "heading3", icon: "H3", syntax: "### ", prefix: true, title: "Heading 3" },
    { key: "divider2", divider: true },
    { key: "quote", icon: "❝", syntax: "> ", prefix: true, title: "Quote" },
    { key: "code", icon: "`", syntax: "`", wrap: true, title: "Inline Code" },
    { key: "codeBlock", icon: "⌨", syntax: "```\n", suffix: "\n```", wrap: true, title: "Code Block" },
    { key: "divider3", divider: true },
    { key: "link", icon: "🔗", template: "[text](url)", title: "Link" },
    { key: "image", icon: "🖼", template: "![alt](url)", title: "Image" },
    { key: "divider4", divider: true },
    { key: "unorderedList", icon: "•", syntax: "- ", prefix: true, title: "Bullet List" },
    { key: "orderedList", icon: "1.", syntax: "1. ", prefix: true, title: "Numbered List" },
    { key: "taskList", icon: "☑", syntax: "- [ ] ", prefix: true, title: "Task List" },
    { key: "divider5", divider: true },
    { key: "table", icon: "▦", template: "| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |", title: "Table" },
    { key: "horizontalRule", icon: "―", template: "\n---\n", title: "Horizontal Rule" },
];

export default function MarkdownClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.markdownEditor;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
    const [renderedHtml, setRenderedHtml] = useState("");
    const [copied, setCopied] = useState<string | null>(null);
    const [exporting, setExporting] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Configure marked
    useEffect(() => {
        marked.setOptions({
            gfm: true,
            breaks: true,
        });
    }, []);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("markdown-editor-content");
        if (saved) {
            setMarkdown(saved);
        }
        const savedHistory = localStorage.getItem("markdown-editor-history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch {
                setHistory([]);
            }
        }
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("markdown-editor-content", markdown);
        }, 500);
        return () => clearTimeout(timeout);
    }, [markdown]);

    // Render markdown
    useEffect(() => {
        const render = async () => {
            try {
                const html = await marked(markdown);
                const sanitized = DOMPurify.sanitize(html);
                setRenderedHtml(sanitized);
            } catch (error) {
                console.error("Markdown parsing error:", error);
            }
        };
        render();
    }, [markdown]);

    // Add to history
    const addToHistory = useCallback(() => {
        if (markdown.trim() && markdown !== DEFAULT_MARKDOWN) {
            setHistory((prev) => {
                const filtered = prev.filter((h) => h !== markdown);
                const newHistory = [markdown, ...filtered].slice(0, 10);
                localStorage.setItem("markdown-editor-history", JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, [markdown]);

    // Clear history
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("markdown-editor-history");
    };

    // Insert text at cursor
    const insertAtCursor = useCallback(
        (text: string, wrap = false, prefix = false, suffix = "") => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = markdown.slice(start, end);

            let newText = "";
            let newCursorPos = start;

            if (wrap && selectedText) {
                // Wrap selected text
                newText = markdown.slice(0, start) + text + selectedText + (suffix || text) + markdown.slice(end);
                newCursorPos = start + text.length + selectedText.length + (suffix || text).length;
            } else if (prefix) {
                // Add prefix to line
                const lineStart = markdown.lastIndexOf("\n", start - 1) + 1;
                newText = markdown.slice(0, lineStart) + text + markdown.slice(lineStart);
                newCursorPos = start + text.length;
            } else {
                // Insert at cursor
                newText = markdown.slice(0, start) + text + suffix + markdown.slice(end);
                newCursorPos = start + text.length;
            }

            setMarkdown(newText);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        },
        [markdown]
    );

    // Handle toolbar click
    const handleToolbarClick = (item: (typeof TOOLBAR_ITEMS)[0]) => {
        if (item.divider) return;
        if (item.template) {
            insertAtCursor(item.template);
        } else if (item.syntax) {
            insertAtCursor(item.syntax, item.wrap, item.prefix, item.suffix);
        }
    };

    // Copy to clipboard
    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Export to PDF
    const exportToPdf = async () => {
        setExporting("pdf");
        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = document.createElement("div");
            element.innerHTML = renderedHtml;
            element.className = "markdown-export";
            element.style.padding = "40px";
            element.style.fontFamily = "system-ui, -apple-system, sans-serif";

            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: "document.pdf",
                image: { type: "jpeg" as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF export error:", error);
        } finally {
            setExporting(null);
        }
    };

    // Export to Word
    const exportToWord = async () => {
        setExporting("word");
        try {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; padding: 20px; }
                        h1, h2, h3 { color: #333; }
                        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
                        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 15px; color: #666; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background: #f4f4f4; }
                    </style>
                </head>
                <body>${renderedHtml}</body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: "application/msword" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "document.doc";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Word export error:", error);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className='space-y-4'>
            {/* Main Editor Card */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                {/* Toolbar */}
                <div className='flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                    {TOOLBAR_ITEMS.map((item, i) =>
                        item.divider ? (
                            <div key={item.key} className='w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1' />
                        ) : (
                            <button key={item.key} onClick={() => handleToolbarClick(item)} title={tool_t.toolbar[item.key as keyof typeof tool_t.toolbar] || item.title} className='px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors'>
                                {item.icon}
                            </button>
                        )
                    )}
                    <div className='flex-1' />
                    {/* Action buttons */}
                    <button onClick={() => copyToClipboard(markdown, "md")} className='px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors'>
                        {copied === "md" ? `✅ ${tool_t.copied}` : `📋 ${tool_t.copy}`}
                    </button>
                    <button onClick={() => copyToClipboard(renderedHtml, "html")} className='px-3 py-1.5 text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors'>
                        {copied === "html" ? `✅ ${tool_t.copied}` : `📄 ${tool_t.copyHtml}`}
                    </button>
                    <button onClick={exportToPdf} disabled={exporting === "pdf"} className='px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium transition-colors disabled:opacity-50'>
                        {exporting === "pdf" ? `⏳ ${tool_t.exporting}` : `📕 ${tool_t.exportPdf}`}
                    </button>
                    <button onClick={exportToWord} disabled={exporting === "word"} className='px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors disabled:opacity-50'>
                        {exporting === "word" ? `⏳ ${tool_t.exporting}` : `📘 ${tool_t.exportWord}`}
                    </button>
                </div>

                {/* Editor and Preview */}
                <div className='grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700'>
                    {/* Editor */}
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.inputLabel}</label>
                            <button
                                onClick={() => {
                                    addToHistory();
                                    setMarkdown("");
                                }}
                                className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            >
                                🗑️ {tool_t.clear}
                            </button>
                        </div>
                        <textarea ref={textareaRef} value={markdown} onChange={(e) => setMarkdown(e.target.value)} onBlur={addToHistory} placeholder={tool_t.inputPlaceholder} className='flex-1 min-h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none' spellCheck={false} />
                    </div>

                    {/* Preview */}
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.preview}</label>
                            <button onClick={() => setShowHistory(!showHistory)} className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'>
                                📜 {tool_t.history} ({history.length})
                            </button>
                        </div>
                        {showHistory ? (
                            <div className='flex-1 min-h-[500px] p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
                                {history.length > 0 ? (
                                    <>
                                        <div className='flex justify-end mb-2'>
                                            <button onClick={clearHistory} className='text-xs text-red-500 hover:text-red-600'>
                                                {tool_t.clearHistory}
                                            </button>
                                        </div>
                                        <div className='space-y-2'>
                                            {history.map((h, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setMarkdown(h);
                                                        setShowHistory(false);
                                                    }}
                                                    className='w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors'
                                                >
                                                    <div className='text-sm text-gray-900 dark:text-gray-100 font-mono line-clamp-3'>
                                                        {h.substring(0, 200)}
                                                        {h.length > 200 ? "..." : ""}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className='text-sm text-gray-500'>{tool_t.noHistory}</p>
                                )}
                            </div>
                        ) : (
                            <div className='flex-1 min-h-[500px] p-4 bg-white dark:bg-gray-800 overflow-y-auto markdown-preview prose prose-sm dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Reference */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>{locale === "vi" ? "📖 Cú pháp nhanh" : "📖 Quick Syntax"}</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs'>
                    {[
                        { syntax: "**bold**", result: "bold" },
                        { syntax: "*italic*", result: "italic" },
                        { syntax: "~~strike~~", result: "strike" },
                        { syntax: "`code`", result: "code" },
                        { syntax: "[link](url)", result: "link" },
                        { syntax: "# Heading", result: "Heading" },
                        { syntax: "> quote", result: "quote" },
                        { syntax: "- list", result: "list" },
                        { syntax: "1. numbered", result: "numbered" },
                        { syntax: "- [ ] task", result: "task" },
                        { syntax: "---", result: "line" },
                        { syntax: "```code```", result: "block" },
                    ].map((item, i) => (
                        <button key={i} onClick={() => insertAtCursor(item.syntax + " ")} className='p-2 bg-gray-50 dark:bg-gray-700 rounded text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'>
                            <div className='font-mono text-blue-600 dark:text-blue-400'>{item.syntax}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
