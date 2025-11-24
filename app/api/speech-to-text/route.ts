import { withErrorHandler } from "@/lib/api-wrapper";
import { tryServicesWithFallback } from "@/lib/service-fallback";
import { NextRequest, NextResponse } from "next/server";

type ServiceProvider = "auto" | "fpt-ai" | "azure";

// Service call functions
async function callFptAI(audioFile: File): Promise<string> {
    const apiKey = process.env.FPT_API_KEY;

    if (!apiKey) {
        throw new Error("FPT_API_KEY is not configured");
    }

    try {
        const response = await fetch("https://api.fpt.ai/hmi/asr/general", {
            method: "POST",
            headers: {
                api_key: apiKey,
            },
            body: audioFile,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("FPT AI error response:", errorText);
            throw new Error(`FPT AI service failed with status ${response.status}`);
        }

        const data = await response.json();

        // Check for status code 9 (service not available)
        if (data.status === 9) {
            throw new Error("FPT AI service is currently not available");
        }

        if (data.status !== 0) {
            throw new Error(`FPT AI returned error status: ${data.status}`);
        }

        const utterance = data.hypotheses?.[0]?.utterance;

        if (!utterance) {
            throw new Error("FPT AI returned empty transcription");
        }

        return utterance;
    } catch (error) {
        console.error("FPT AI transcription error:", error);
        throw error;
    }
}

async function callAzureSpeech(audioFile: File): Promise<string> {
    // TODO: Implement Microsoft Azure Speech Services
    // Example:
    /*
    const sdk = require('microsoft-cognitiveservices-speech-sdk');
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_SPEECH_KEY || '',
        process.env.AZURE_SPEECH_REGION || ''
    );
    
    // Create audio config from buffer
    const pushStream = sdk.AudioInputStream.createPushStream();
    pushStream.write(audioBuffer);
    pushStream.close();
    
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
    return new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(
            (result: any) => {
                if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                    resolve(result.text);
                } else {
                    reject(new Error('Azure Speech service failed'));
                }
                recognizer.close();
            },
            (error: any) => {
                recognizer.close();
                reject(error);
            }
        );
    });
    */

    throw new Error("Azure Speech service not implemented");
}

async function handleStt(request: NextRequest) {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const mode = formData.get("mode") as string;
    const provider = (formData.get("provider") as ServiceProvider) || "auto";

    if (!audioFile) {
        return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Validate file size (25MB max)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large. Maximum size is 25MB." }, { status: 400 });
    }

    let transcriptionText: string;
    let usedProvider: string;

    if (provider === "auto") {
        // Try all services with fallback
        const result = await tryServicesWithFallback<string>(
            [
                { name: "fpt-ai", handler: () => callFptAI(audioFile) },
                { name: "azure", handler: () => callAzureSpeech(audioFile) },
            ],
            {
                endpoint: "/api/speech-to-text",
                method: request.method,
                userAgent: request.headers.get("user-agent") || undefined,
                additionalParams: {
                    fileName: audioFile.name,
                    fileSize: audioFile.size,
                    fileType: audioFile.type,
                    requestedProvider: provider,
                    mode,
                },
            }
        );
        transcriptionText = result.data!;
        usedProvider = result.usedService!;
    } else {
        // Use specific provider (no fallback)
        console.log(`Using specific provider: ${provider}`);
        if (provider === "fpt-ai") {
            transcriptionText = await callFptAI(audioFile);
        } else if (provider === "azure") {
            transcriptionText = await callAzureSpeech(audioFile);
        } else {
            throw new Error(`Unknown provider: ${provider}`);
        }
        usedProvider = provider;
    }

    return NextResponse.json({
        text: transcriptionText,
        provider: usedProvider,
        mode,
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
    });
}

export const POST = withErrorHandler(handleStt, "/api/speech-to-text");

// Optional: Add GET endpoint for health check
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Speech-to-text API is ready",
        supportedFormats: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/m4a", "audio/ogg", "audio/webm"],
        maxFileSize: "25MB",
    });
}
