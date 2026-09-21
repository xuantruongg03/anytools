import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { generateInstantSearchTopics } from "@/lib/constants/bing-search-topics";

async function generateTopics(existingTopics: string[], count: number, locale: string = "vi"): Promise<string[]> {
    const isVi = locale === "vi";
    const language = isVi ? "Vietnamese" : "English";
    // Limit recent history context to last 25 items to avoid token bloat
    const recentHistory = existingTopics.slice(-25).join(", ");
    
    const prompt = `Generate a JSON array of ${count} diverse, natural search queries in ${language}. 
Topics should cover everyday interests: tech questions, cooking recipes, travel spots, science trivia, health tips, pop culture. 
Must look like realistic search engine queries typed by real humans (e.g., "thời tiết đà lạt cuối tuần", "how to speed up laptop").
${recentHistory ? `Avoid these recent queries: ${recentHistory}.` : ""}
Return ONLY a valid JSON array of strings, with no markdown code blocks and no extra text.`;

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY not found, falling back to instant search topics");
            return generateInstantSearchTopics(count, existingTopics, locale);
        }

        const { response } = await callGemini("gemini-2.5-flash", [{ role: "user", content: prompt }]);
        
        // Extract JSON array from the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from Gemini response.");
        }

        const topics = JSON.parse(jsonMatch[0]);
        if (Array.isArray(topics) && topics.length > 0) {
            return topics;
        }
        return generateInstantSearchTopics(count, existingTopics, locale);
    } catch (error) {
        console.error("Error calling Gemini API for topics, falling back to instant:", error);
        return generateInstantSearchTopics(count, existingTopics, locale);
    }
}

export const POST = withErrorHandler(async (req: NextRequest) => {
    const { existingTopics = [], count = 20, locale = "vi" } = await req.json();
    const safeCount = Math.min(Math.max(1, count), 50);
    const newTopics = await generateTopics(existingTopics, safeCount, locale);
    return NextResponse.json({ topics: newTopics });
}, "/api/generate-topics");

async function callGemini(model: string, messages: { role: string; content: string }[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key not configured");

    const systemMessage = messages.find((m) => m.role === "system");
    const contents = messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents,
            systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
            generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
        }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        usage: { promptTokens: data.usageMetadata?.promptTokenCount || 0, completionTokens: data.usageMetadata?.candidatesTokenCount || 0 },
    };
}