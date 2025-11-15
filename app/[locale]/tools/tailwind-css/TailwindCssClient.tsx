"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";

// Tailwind to CSS mapping (common classes)
const tailwindToCSS: Record<string, string> = {
    // Display
    block: "display: block;",
    "inline-block": "display: inline-block;",
    inline: "display: inline;",
    flex: "display: flex;",
    "inline-flex": "display: inline-flex;",
    grid: "display: grid;",
    "inline-grid": "display: inline-grid;",
    hidden: "display: none;",

    // Flex Direction
    "flex-row": "flex-direction: row;",
    "flex-col": "flex-direction: column;",
    "flex-row-reverse": "flex-direction: row-reverse;",
    "flex-col-reverse": "flex-direction: column-reverse;",

    // Flex Wrap
    "flex-wrap": "flex-wrap: wrap;",
    "flex-nowrap": "flex-wrap: nowrap;",

    // Justify Content
    "justify-start": "justify-content: flex-start;",
    "justify-end": "justify-content: flex-end;",
    "justify-center": "justify-content: center;",
    "justify-between": "justify-content: space-between;",
    "justify-around": "justify-content: space-around;",
    "justify-evenly": "justify-content: space-evenly;",

    // Align Items
    "items-start": "align-items: flex-start;",
    "items-end": "align-items: flex-end;",
    "items-center": "align-items: center;",
    "items-baseline": "align-items: baseline;",
    "items-stretch": "align-items: stretch;",

    // Gap
    "gap-0": "gap: 0;",
    "gap-1": "gap: 0.25rem;",
    "gap-2": "gap: 0.5rem;",
    "gap-3": "gap: 0.75rem;",
    "gap-4": "gap: 1rem;",
    "gap-5": "gap: 1.25rem;",
    "gap-6": "gap: 1.5rem;",
    "gap-8": "gap: 2rem;",
    "gap-10": "gap: 2.5rem;",

    // Width
    "w-0": "width: 0;",
    "w-full": "width: 100%;",
    "w-screen": "width: 100vw;",
    "w-auto": "width: auto;",
    "w-1/2": "width: 50%;",
    "w-1/3": "width: 33.333333%;",
    "w-2/3": "width: 66.666667%;",
    "w-1/4": "width: 25%;",
    "w-3/4": "width: 75%;",

    // Height
    "h-0": "height: 0;",
    "h-full": "height: 100%;",
    "h-screen": "height: 100vh;",
    "h-auto": "height: auto;",

    // Padding
    "p-0": "padding: 0;",
    "p-1": "padding: 0.25rem;",
    "p-2": "padding: 0.5rem;",
    "p-3": "padding: 0.75rem;",
    "p-4": "padding: 1rem;",
    "p-5": "padding: 1.25rem;",
    "p-6": "padding: 1.5rem;",
    "p-8": "padding: 2rem;",
    "p-10": "padding: 2.5rem;",
    "p-12": "padding: 3rem;",

    "px-0": "padding-left: 0; padding-right: 0;",
    "px-1": "padding-left: 0.25rem; padding-right: 0.25rem;",
    "px-2": "padding-left: 0.5rem; padding-right: 0.5rem;",
    "px-3": "padding-left: 0.75rem; padding-right: 0.75rem;",
    "px-4": "padding-left: 1rem; padding-right: 1rem;",
    "px-6": "padding-left: 1.5rem; padding-right: 1.5rem;",
    "px-8": "padding-left: 2rem; padding-right: 2rem;",

    "py-0": "padding-top: 0; padding-bottom: 0;",
    "py-1": "padding-top: 0.25rem; padding-bottom: 0.25rem;",
    "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem;",
    "py-3": "padding-top: 0.75rem; padding-bottom: 0.75rem;",
    "py-4": "padding-top: 1rem; padding-bottom: 1rem;",
    "py-6": "padding-top: 1.5rem; padding-bottom: 1.5rem;",
    "py-8": "padding-top: 2rem; padding-bottom: 2rem;",

    // Margin
    "m-0": "margin: 0;",
    "m-auto": "margin: auto;",
    "m-1": "margin: 0.25rem;",
    "m-2": "margin: 0.5rem;",
    "m-3": "margin: 0.75rem;",
    "m-4": "margin: 1rem;",
    "m-6": "margin: 1.5rem;",
    "m-8": "margin: 2rem;",

    "mx-auto": "margin-left: auto; margin-right: auto;",
    "mx-2": "margin-left: 0.5rem; margin-right: 0.5rem;",
    "mx-4": "margin-left: 1rem; margin-right: 1rem;",

    "my-2": "margin-top: 0.5rem; margin-bottom: 0.5rem;",
    "my-4": "margin-top: 1rem; margin-bottom: 1rem;",
    "my-6": "margin-top: 1.5rem; margin-bottom: 1.5rem;",

    // Text Color
    "text-white": "color: #ffffff;",
    "text-black": "color: #000000;",
    "text-gray-100": "color: #f3f4f6;",
    "text-gray-200": "color: #e5e7eb;",
    "text-gray-300": "color: #d1d5db;",
    "text-gray-400": "color: #9ca3af;",
    "text-gray-500": "color: #6b7280;",
    "text-gray-600": "color: #4b5563;",
    "text-gray-700": "color: #374151;",
    "text-gray-800": "color: #1f2937;",
    "text-gray-900": "color: #111827;",
    "text-blue-500": "color: #3b82f6;",
    "text-blue-600": "color: #2563eb;",
    "text-red-500": "color: #ef4444;",
    "text-green-500": "color: #10b981;",

    // Background Color
    "bg-white": "background-color: #ffffff;",
    "bg-black": "background-color: #000000;",
    "bg-transparent": "background-color: transparent;",
    "bg-gray-50": "background-color: #f9fafb;",
    "bg-gray-100": "background-color: #f3f4f6;",
    "bg-gray-200": "background-color: #e5e7eb;",
    "bg-gray-300": "background-color: #d1d5db;",
    "bg-gray-500": "background-color: #6b7280;",
    "bg-gray-700": "background-color: #374151;",
    "bg-gray-800": "background-color: #1f2937;",
    "bg-gray-900": "background-color: #111827;",
    "bg-blue-500": "background-color: #3b82f6;",
    "bg-blue-600": "background-color: #2563eb;",
    "bg-red-500": "background-color: #ef4444;",
    "bg-green-500": "background-color: #10b981;",

    // Border
    border: "border-width: 1px;",
    "border-0": "border-width: 0;",
    "border-2": "border-width: 2px;",
    "border-4": "border-width: 4px;",
    "border-gray-200": "border-color: #e5e7eb;",
    "border-gray-300": "border-color: #d1d5db;",
    "border-gray-700": "border-color: #374151;",

    // Border Radius
    rounded: "border-radius: 0.25rem;",
    "rounded-none": "border-radius: 0;",
    "rounded-sm": "border-radius: 0.125rem;",
    "rounded-md": "border-radius: 0.375rem;",
    "rounded-lg": "border-radius: 0.5rem;",
    "rounded-xl": "border-radius: 0.75rem;",
    "rounded-2xl": "border-radius: 1rem;",
    "rounded-3xl": "border-radius: 1.5rem;",
    "rounded-full": "border-radius: 9999px;",

    // Font Size
    "text-xs": "font-size: 0.75rem; line-height: 1rem;",
    "text-sm": "font-size: 0.875rem; line-height: 1.25rem;",
    "text-base": "font-size: 1rem; line-height: 1.5rem;",
    "text-lg": "font-size: 1.125rem; line-height: 1.75rem;",
    "text-xl": "font-size: 1.25rem; line-height: 1.75rem;",
    "text-2xl": "font-size: 1.5rem; line-height: 2rem;",
    "text-3xl": "font-size: 1.875rem; line-height: 2.25rem;",
    "text-4xl": "font-size: 2.25rem; line-height: 2.5rem;",
    "text-5xl": "font-size: 3rem; line-height: 1;",

    // Font Weight
    "font-thin": "font-weight: 100;",
    "font-light": "font-weight: 300;",
    "font-normal": "font-weight: 400;",
    "font-medium": "font-weight: 500;",
    "font-semibold": "font-weight: 600;",
    "font-bold": "font-weight: 700;",
    "font-extrabold": "font-weight: 800;",

    // Text Align
    "text-left": "text-align: left;",
    "text-center": "text-align: center;",
    "text-right": "text-align: right;",
    "text-justify": "text-align: justify;",

    // Shadow
    "shadow-sm": "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);",
    shadow: "box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);",
    "shadow-md": "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
    "shadow-lg": "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
    "shadow-xl": "box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);",

    // Opacity
    "opacity-0": "opacity: 0;",
    "opacity-50": "opacity: 0.5;",
    "opacity-75": "opacity: 0.75;",
    "opacity-100": "opacity: 1;",

    // Cursor
    "cursor-pointer": "cursor: pointer;",
    "cursor-default": "cursor: default;",
    "cursor-not-allowed": "cursor: not-allowed;",

    // Overflow
    "overflow-hidden": "overflow: hidden;",
    "overflow-auto": "overflow: auto;",
    "overflow-scroll": "overflow: scroll;",
    "overflow-x-hidden": "overflow-x: hidden;",
    "overflow-y-hidden": "overflow-y: hidden;",
    "overflow-x-auto": "overflow-x: auto;",
    "overflow-y-auto": "overflow-y: auto;",

    // Position
    static: "position: static;",
    fixed: "position: fixed;",
    absolute: "position: absolute;",
    relative: "position: relative;",
    sticky: "position: sticky;",

    // Top/Right/Bottom/Left
    "top-0": "top: 0;",
    "right-0": "right: 0;",
    "bottom-0": "bottom: 0;",
    "left-0": "left: 0;",
    "inset-0": "top: 0; right: 0; bottom: 0; left: 0;",

    // Z-Index
    "z-0": "z-index: 0;",
    "z-10": "z-index: 10;",
    "z-20": "z-index: 20;",
    "z-30": "z-index: 30;",
    "z-40": "z-index: 40;",
    "z-50": "z-index: 50;",
    "z-auto": "z-index: auto;",

    // Max Width
    "max-w-xs": "max-width: 20rem;",
    "max-w-sm": "max-width: 24rem;",
    "max-w-md": "max-width: 28rem;",
    "max-w-lg": "max-width: 32rem;",
    "max-w-xl": "max-width: 36rem;",
    "max-w-2xl": "max-width: 42rem;",
    "max-w-3xl": "max-width: 48rem;",
    "max-w-4xl": "max-width: 56rem;",
    "max-w-5xl": "max-width: 64rem;",
    "max-w-6xl": "max-width: 72rem;",
    "max-w-7xl": "max-width: 80rem;",
    "max-w-full": "max-width: 100%;",
    "max-w-screen-sm": "max-width: 640px;",
    "max-w-screen-md": "max-width: 768px;",
    "max-w-screen-lg": "max-width: 1024px;",
    "max-w-screen-xl": "max-width: 1280px;",

    // Min Width/Height
    "min-w-0": "min-width: 0;",
    "min-w-full": "min-width: 100%;",
    "min-h-0": "min-height: 0;",
    "min-h-full": "min-height: 100%;",
    "min-h-screen": "min-height: 100vh;",

    // Max Height
    "max-h-full": "max-height: 100%;",
    "max-h-screen": "max-height: 100vh;",

    // Specific Width/Height values
    "w-4": "width: 1rem;",
    "w-6": "width: 1.5rem;",
    "w-8": "width: 2rem;",
    "w-10": "width: 2.5rem;",
    "w-12": "width: 3rem;",
    "w-16": "width: 4rem;",
    "w-20": "width: 5rem;",
    "w-24": "width: 6rem;",
    "w-32": "width: 8rem;",
    "w-48": "width: 12rem;",
    "w-64": "width: 16rem;",

    "h-4": "height: 1rem;",
    "h-6": "height: 1.5rem;",
    "h-8": "height: 2rem;",
    "h-10": "height: 2.5rem;",
    "h-12": "height: 3rem;",
    "h-16": "height: 4rem;",
    "h-20": "height: 5rem;",
    "h-24": "height: 6rem;",
    "h-32": "height: 8rem;",
    "h-48": "height: 12rem;",
    "h-64": "height: 16rem;",

    // Margin specific values
    "mt-1": "margin-top: 0.25rem;",
    "mt-2": "margin-top: 0.5rem;",
    "mt-3": "margin-top: 0.75rem;",
    "mt-4": "margin-top: 1rem;",
    "mt-6": "margin-top: 1.5rem;",
    "mt-8": "margin-top: 2rem;",
    "mt-12": "margin-top: 3rem;",

    "mb-1": "margin-bottom: 0.25rem;",
    "mb-2": "margin-bottom: 0.5rem;",
    "mb-3": "margin-bottom: 0.75rem;",
    "mb-4": "margin-bottom: 1rem;",
    "mb-6": "margin-bottom: 1.5rem;",
    "mb-8": "margin-bottom: 2rem;",
    "mb-12": "margin-bottom: 3rem;",

    "ml-1": "margin-left: 0.25rem;",
    "ml-2": "margin-left: 0.5rem;",
    "ml-4": "margin-left: 1rem;",
    "ml-auto": "margin-left: auto;",

    "mr-1": "margin-right: 0.25rem;",
    "mr-2": "margin-right: 0.5rem;",
    "mr-4": "margin-right: 1rem;",
    "mr-auto": "margin-right: auto;",

    // Padding specific values
    "pt-1": "padding-top: 0.25rem;",
    "pt-2": "padding-top: 0.5rem;",
    "pt-4": "padding-top: 1rem;",
    "pt-6": "padding-top: 1.5rem;",

    "pb-1": "padding-bottom: 0.25rem;",
    "pb-2": "padding-bottom: 0.5rem;",
    "pb-4": "padding-bottom: 1rem;",
    "pb-6": "padding-bottom: 1.5rem;",

    "pl-2": "padding-left: 0.5rem;",
    "pl-4": "padding-left: 1rem;",
    "pr-2": "padding-right: 0.5rem;",
    "pr-4": "padding-right: 1rem;",

    // Space Between
    "space-x-1": "gap: 0.25rem;",
    "space-x-2": "gap: 0.5rem;",
    "space-x-4": "gap: 1rem;",
    "space-y-1": "row-gap: 0.25rem;",
    "space-y-2": "row-gap: 0.5rem;",
    "space-y-4": "row-gap: 1rem;",

    // Line Height
    "leading-none": "line-height: 1;",
    "leading-tight": "line-height: 1.25;",
    "leading-snug": "line-height: 1.375;",
    "leading-normal": "line-height: 1.5;",
    "leading-relaxed": "line-height: 1.625;",
    "leading-loose": "line-height: 2;",

    // Text Decoration
    underline: "text-decoration: underline;",
    "line-through": "text-decoration: line-through;",
    "no-underline": "text-decoration: none;",

    // Text Transform
    uppercase: "text-transform: uppercase;",
    lowercase: "text-transform: lowercase;",
    capitalize: "text-transform: capitalize;",
    "normal-case": "text-transform: none;",

    // White Space
    "whitespace-normal": "white-space: normal;",
    "whitespace-nowrap": "white-space: nowrap;",
    "whitespace-pre": "white-space: pre;",
    "whitespace-pre-wrap": "white-space: pre-wrap;",

    // Word Break
    "break-normal": "overflow-wrap: normal; word-break: normal;",
    "break-words": "overflow-wrap: break-word;",
    "break-all": "word-break: break-all;",

    // Transition
    "transition-all": "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
    "transition-colors": "transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
    transition: "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",

    // Duration
    "duration-75": "transition-duration: 75ms;",
    "duration-100": "transition-duration: 100ms;",
    "duration-150": "transition-duration: 150ms;",
    "duration-200": "transition-duration: 200ms;",
    "duration-300": "transition-duration: 300ms;",
    "duration-500": "transition-duration: 500ms;",

    // Transform
    "scale-0": "transform: scale(0);",
    "scale-50": "transform: scale(0.5);",
    "scale-75": "transform: scale(0.75);",
    "scale-90": "transform: scale(0.9);",
    "scale-95": "transform: scale(0.95);",
    "scale-100": "transform: scale(1);",
    "scale-105": "transform: scale(1.05);",
    "scale-110": "transform: scale(1.1);",
    "scale-125": "transform: scale(1.25);",
    "scale-150": "transform: scale(1.5);",

    // Rotate
    "rotate-0": "transform: rotate(0deg);",
    "rotate-45": "transform: rotate(45deg);",
    "rotate-90": "transform: rotate(90deg);",
    "rotate-180": "transform: rotate(180deg);",
    "-rotate-45": "transform: rotate(-45deg);",
    "-rotate-90": "transform: rotate(-90deg);",
    "-rotate-180": "transform: rotate(-180deg);",

    // More Colors
    "text-indigo-500": "color: #6366f1;",
    "text-purple-500": "color: #a855f7;",
    "text-pink-500": "color: #ec4899;",
    "text-yellow-500": "color: #eab308;",
    "text-orange-500": "color: #f97316;",

    "bg-indigo-500": "background-color: #6366f1;",
    "bg-purple-500": "background-color: #a855f7;",
    "bg-pink-500": "background-color: #ec4899;",
    "bg-yellow-500": "background-color: #eab308;",
    "bg-orange-500": "background-color: #f97316;",

    // Pointer Events
    "pointer-events-none": "pointer-events: none;",
    "pointer-events-auto": "pointer-events: auto;",

    // Select
    "select-none": "user-select: none;",
    "select-text": "user-select: text;",
    "select-all": "user-select: all;",
    "select-auto": "user-select: auto;",

    // Resize
    "resize-none": "resize: none;",
    resize: "resize: both;",
    "resize-y": "resize: vertical;",
    "resize-x": "resize: horizontal;",

    // Object Fit
    "object-contain": "object-fit: contain;",
    "object-cover": "object-fit: cover;",
    "object-fill": "object-fit: fill;",
    "object-none": "object-fit: none;",

    // Object Position
    "object-center": "object-position: center;",
    "object-top": "object-position: top;",
    "object-bottom": "object-position: bottom;",
    "object-left": "object-position: left;",
    "object-right": "object-position: right;",

    // Outline
    "outline-none": "outline: 2px solid transparent; outline-offset: 2px;",
    outline: "outline-style: solid;",

    // Ring (Focus rings)
    "ring-0": "box-shadow: 0 0 0 0px;",
    "ring-1": "box-shadow: 0 0 0 1px;",
    "ring-2": "box-shadow: 0 0 0 2px;",
    "ring-4": "box-shadow: 0 0 0 4px;",

    // Filter
    blur: "filter: blur(8px);",
    "blur-sm": "filter: blur(4px);",
    "blur-none": "filter: blur(0);",
    grayscale: "filter: grayscale(100%);",
    "grayscale-0": "filter: grayscale(0);",

    // Backdrop Filter
    "backdrop-blur": "backdrop-filter: blur(8px);",
    "backdrop-blur-sm": "backdrop-filter: blur(4px);",
    "backdrop-blur-none": "backdrop-filter: blur(0);",
};

export default function TailwindCssClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [mode, setMode] = useState<"tailwindToCss" | "cssToTailwind">("tailwindToCss");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const convertTailwindToCSS = (classes: string) => {
        const classArray = classes.trim().split(/\s+/);
        const cssLines: string[] = [];

        classArray.forEach((className) => {
            if (tailwindToCSS[className]) {
                cssLines.push(tailwindToCSS[className]);
            } else {
                // Handle unknown classes
                cssLines.push(`/* Unknown: ${className} */`);
            }
        });

        return cssLines.join("\n");
    };

    const convertCSSToTailwind = (css: string) => {
        // Reverse lookup
        const cssToTailwind: Record<string, string> = {};
        Object.entries(tailwindToCSS).forEach(([tw, cs]) => {
            cssToTailwind[cs] = tw;
        });

        // Parse CSS (simple parser)
        const lines = css
            .split(";")
            .map((line) => line.trim())
            .filter((line) => line);
        const tailwindClasses: string[] = [];

        lines.forEach((line) => {
            const normalized = line.endsWith(";") ? line : line + ";";
            const found = cssToTailwind[normalized];
            if (found) {
                tailwindClasses.push(found);
            } else {
                // Try to find partial match
                const match = Object.entries(cssToTailwind).find(([cssRule]) => normalized.includes(cssRule.split(":")[0]));
                if (match) {
                    tailwindClasses.push(`/* Closest: ${match[1]} (check value) */`);
                } else {
                    tailwindClasses.push(`/* No match: ${line} */`);
                }
            }
        });

        return tailwindClasses.join(" ");
    };

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput("");
            return;
        }

        if (mode === "tailwindToCss") {
            setOutput(convertTailwindToCSS(input));
        } else {
            setOutput(convertCSSToTailwind(input));
        }
    };

    const handleCopy = async () => {
        if (!output) return;

        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12'>
            {/* Mode Tabs */}
            <div className='flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700'>
                <button
                    onClick={() => {
                        setMode("tailwindToCss");
                        setInput("");
                        setOutput("");
                    }}
                    className={`px-6 py-3 font-semibold transition-colors relative ${mode === "tailwindToCss" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                >
                    {t.tools.tailwindCss.tailwindToCss}
                    {mode === "tailwindToCss" && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400' />}
                </button>
                <button
                    onClick={() => {
                        setMode("cssToTailwind");
                        setInput("");
                        setOutput("");
                    }}
                    className={`px-6 py-3 font-semibold transition-colors relative ${mode === "cssToTailwind" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                >
                    {t.tools.tailwindCss.cssToTailwind}
                    {mode === "cssToTailwind" && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400' />}
                </button>
            </div>

            {/* Input Area */}
            <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>{mode === "tailwindToCss" ? t.tools.tailwindCss.tailwindInput : t.tools.tailwindCss.cssInput}</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "tailwindToCss" ? t.tools.tailwindCss.tailwindPlaceholder : t.tools.tailwindCss.cssPlaceholder} className='w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none' />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 mb-6'>
                <button onClick={handleConvert} className='flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg'>
                    {t.tools.tailwindCss.convert}
                </button>
                <Button onClick={handleClear} variant='secondary' className='px-6 py-3 font-semibold'>
                    {t.common.clear}
                </Button>
            </div>

            {/* Output Area */}
            {output && (
                <div>
                    <div className='flex justify-between items-center mb-2'>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.outputLabel}</label>
                        <Button onClick={handleCopy} variant='success' size='sm' className='flex items-center gap-2'>
                            {copied ? (
                                <>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                    {t.common.copied}
                                </>
                            ) : (
                                <>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                    </svg>
                                    {t.common.copy}
                                </>
                            )}
                        </Button>
                    </div>
                    <pre className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm overflow-x-auto whitespace-pre-wrap'>{output}</pre>
                </div>
            )}
        </div>
    );
}
