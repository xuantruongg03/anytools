import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";

async function generateTopics(existingTopics: string[], count: number): Promise<string[]> {
    const prompt = `Generate a list of ${count} unique and interesting search topics. The topics should be diverse and suitable for general audience. Avoid topics that are too niche or controversial. Here are some topics that have already been used, please provide completely new ones: ${existingTopics.join(", ")}. Return the topics as a JSON array of strings ONLY, no other text.`;

    try {
        const { response } = await callGemini("gemini-2.5-flash", [{ role: "user", content: prompt }]);
        
        // Extract JSON array from the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from Gemini response.");
        }

        const topics = JSON.parse(jsonMatch[0]);
        return topics;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate topics from Gemini.");
    }
}

export const POST = withErrorHandler(async (req: NextRequest) => {
    const { existingTopics = [], count = 20 } = await req.json();
    const newTopics = await generateTopics(existingTopics, count);
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        usage: { promptTokens: data.usageMetadata?.promptTokenCount || 0, completionTokens: data.usageMetadata?.candidatesTokenCount || 0 },
    };
}