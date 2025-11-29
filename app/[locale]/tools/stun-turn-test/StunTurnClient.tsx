"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { useState, useRef } from "react";
import Button from "@/components/ui/Button";

interface TestResults {
    stunWorking: boolean;
    turnWorking: boolean;
    candidates: {
        host: number;
        srflx: number;
        relay: number;
    };
    startTime: number | null;
    endTime: number | null;
}

interface LogEntry {
    message: string;
    type: "info" | "success" | "warning" | "error" | "debug";
    timestamp: string;
}

export default function StunTurnClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.stunTurnTest;

    const [stunServer, setStunServer] = useState("");
    const [turnServer, setTurnServer] = useState("");
    const [turnUsername, setTurnUsername] = useState("");
    const [turnPassword, setTurnPassword] = useState("");
    const [testing, setTesting] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [showSummary, setShowSummary] = useState(false);
    const [testResults, setTestResults] = useState<TestResults>({
        stunWorking: false,
        turnWorking: false,
        candidates: { host: 0, srflx: 0, relay: 0 },
        startTime: null,
        endTime: null,
    });

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string, type: LogEntry["type"] = "info") => {
        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
        });
        setLogs((prev) => [...prev, { message, type, timestamp }]);
        setTimeout(() => {
            logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const clearResults = () => {
        setLogs([]);
        setShowSummary(false);
        setTestResults({
            stunWorking: false,
            turnWorking: false,
            candidates: { host: 0, srflx: 0, relay: 0 },
            startTime: null,
            endTime: null,
        });
    };

    const runTest = async () => {
        clearResults();
        setTesting(true);

        const results: TestResults = {
            stunWorking: false,
            turnWorking: false,
            candidates: { host: 0, srflx: 0, relay: 0 },
            startTime: Date.now(),
            endTime: null,
        };

        addLog(`🚀 ${t.logs.starting}`, "info");
        addLog(`📡 ${t.logs.stunServer}: ${stunServer}`, "debug");
        if (turnServer) {
            addLog(`🔄 ${t.logs.turnServer}: ${turnServer}`, "debug");
            addLog(`👤 ${t.logs.turnUser}: ${turnUsername}`, "debug");
        }

        const iceServers: RTCIceServer[] = [{ urls: stunServer }];
        if (turnServer && turnUsername && turnPassword) {
            iceServers.push({
                urls: turnServer,
                username: turnUsername,
                credential: turnPassword,
            });
        }

        const config: RTCConfiguration = {
            iceServers,
            iceCandidatePoolSize: 0,
        };

        addLog(`🔧 ${t.logs.creatingConnection}...`, "info");
        addLog(`Config: ${JSON.stringify(config, null, 2)}`, "debug");

        try {
            const pc = new RTCPeerConnection(config);
            pcRef.current = pc;
            addLog(`✅ ${t.logs.connectionCreated}`, "success");

            // Listen for ICE gathering state changes
            pc.addEventListener("icegatheringstatechange", () => {
                const state = pc.iceGatheringState;
                addLog(`🧊 ${t.logs.iceGatheringState}: ${state}`, "info");

                if (state === "gathering") {
                    addLog(`⏳ ${t.logs.gathering}`, "info");
                } else if (state === "complete") {
                    addLog(`🎉 ${t.logs.gatheringComplete}`, "success");
                    results.endTime = Date.now();

                    // Analyze results
                    if (results.candidates.srflx > 0) {
                        results.stunWorking = true;
                        addLog(`✅ ${t.logs.stunWorking}`, "success");
                    } else {
                        addLog(`❌ ${t.logs.stunNotWorking}`, "error");
                    }

                    if (results.candidates.relay > 0) {
                        results.turnWorking = true;
                        addLog(`✅ ${t.logs.turnWorking}`, "success");
                    } else if (turnServer) {
                        addLog(`❌ ${t.logs.turnNotWorking}`, "error");
                    }

                    setTimeout(() => {
                        setTestResults(results);
                        setShowSummary(true);
                        setTesting(false);
                        pc.close();
                    }, 1000);
                }
            });

            // Listen for ICE connection state changes
            pc.addEventListener("iceconnectionstatechange", () => {
                const state = pc.iceConnectionState;
                addLog(`🌐 ${t.logs.iceConnectionState}: ${state}`, "info");
            });

            // Listen for ICE candidates
            pc.addEventListener("icecandidate", (event) => {
                if (event.candidate) {
                    const candidate = event.candidate;
                    const parts = candidate.candidate.split(" ");
                    const type = candidate.type || "unknown";
                    const protocol = parts[2] || "unknown";
                    const address = parts[4] || "unknown";
                    const port = parts[5] || "unknown";

                    // Count candidate types
                    if (type === "host") results.candidates.host++;
                    else if (type === "srflx") results.candidates.srflx++;
                    else if (type === "relay") results.candidates.relay++;

                    let emoji = "📍";
                    let colorClass = "bg-gray-100 dark:bg-gray-700";
                    if (type === "host") {
                        emoji = "🏠";
                        colorClass = "bg-green-100 dark:bg-green-900/30";
                    } else if (type === "srflx") {
                        emoji = "🌐";
                        colorClass = "bg-blue-100 dark:bg-blue-900/30";
                    } else if (type === "relay") {
                        emoji = "🔄";
                        colorClass = "bg-purple-100 dark:bg-purple-900/30";
                    }

                    const candidateMsg = `${emoji} ${t.logs.candidateFound}:
                        <div class="${colorClass} p-3 mt-2 rounded-lg border border-gray-200 dark:border-gray-600">
                            <span class="inline-block px-2 py-1 rounded text-xs font-semibold ${type === "host" ? "bg-green-600" : type === "srflx" ? "bg-blue-600" : "bg-purple-600"} text-white mr-2">${type.toUpperCase()}</span>
                            <strong>${protocol}</strong> ${address}:${port}
                            <br><small class="text-gray-600 dark:text-gray-400">${t.candidate.foundation}: ${candidate.foundation} | ${t.candidate.priority}: ${candidate.priority}</small>
                        </div>`;

                    addLog(candidateMsg, "success");
                } else {
                    addLog(`🏁 ${t.logs.allCandidatesGathered}`, "info");
                }
            });

            // Create a data channel to trigger ICE gathering
            addLog(`📢 ${t.logs.creatingDataChannel}`, "info");
            pc.createDataChannel("test");

            // Create and set local description
            addLog(`📝 ${t.logs.creatingOffer}...`, "info");
            const offer = await pc.createOffer();
            addLog(`✅ ${t.logs.offerCreated}`, "success");

            addLog(`💾 ${t.logs.settingLocalDesc}...`, "info");
            await pc.setLocalDescription(offer);
            addLog(`✅ ${t.logs.localDescSet}`, "success");

            // Set timeout
            setTimeout(() => {
                if (pc && pc.iceGatheringState !== "complete") {
                    addLog(`⏱️ ${t.logs.timeout}`, "error");
                    addLog(`⚠️ ${t.logs.networkIssue}`, "warning");
                    results.endTime = Date.now();
                    setTestResults(results);
                    setShowSummary(true);
                    setTesting(false);
                    pc.close();
                }
            }, 30000);
        } catch (error: any) {
            addLog(`❌ ${t.logs.error}: ${error.message}`, "error");
            addLog(`Stack: ${error.stack}`, "debug");
            setTesting(false);
        }
    };

    const getLogClass = (type: LogEntry["type"]) => {
        const baseClass = "p-3 mb-2 rounded-lg border-l-4 font-mono text-sm";
        switch (type) {
            case "info":
                return `${baseClass} bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-200`;
            case "success":
                return `${baseClass} bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-200`;
            case "warning":
                return `${baseClass} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-200`;
            case "error":
                return `${baseClass} bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-200`;
            case "debug":
                return `${baseClass} bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-900 dark:text-purple-200`;
        }
    };

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Config Section */}
            <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6'>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.stunServerUrl}:</label>
                        <input type='text' value={stunServer} onChange={(e) => setStunServer(e.target.value)} placeholder={t.stunPlaceholder} className='w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.turnServerUrl}:</label>
                        <input type='text' value={turnServer} onChange={(e) => setTurnServer(e.target.value)} placeholder={t.turnPlaceholder} className='w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.turnUsername}:</label>
                        <input type='text' value={turnUsername} onChange={(e) => setTurnUsername(e.target.value)} placeholder={t.usernamePlaceholder} className='w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.turnPassword}:</label>
                        <input type='password' value={turnPassword} onChange={(e) => setTurnPassword(e.target.value)} placeholder={t.passwordPlaceholder} className='w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-3 mb-6'>
                <button onClick={runTest} disabled={testing} className='flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                    {testing ? (
                        <>
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>{t.testing}</span>
                        </>
                    ) : (
                        <>
                            <span>▶️</span>
                            <span>{t.startTest}</span>
                        </>
                    )}
                </button>
                <Button onClick={clearResults} variant='gray' className='px-6 py-3 font-semibold'>
                    🗑️ {t.clearResults}
                </Button>
            </div>

            {/* Results/Logs */}
            <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-[500px] overflow-y-auto mb-6 relative'>
                {logs.length === 0 && !testing ? (
                    <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                        <p>ℹ️ {t.logs.ready}</p>
                    </div>
                ) : logs.length === 0 && testing ? (
                    <div className='text-center py-8'>
                        <div className='inline-flex items-center gap-3'>
                            <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                            <span className='text-gray-600 dark:text-gray-300 font-medium'>{t.logs.initializing || "Initializing test..."}</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        {logs.map((log, index) => (
                            <div key={index} className={getLogClass(log.type)}>
                                <span className='text-gray-500 text-xs mr-2'>[{log.timestamp}]</span>
                                <span dangerouslySetInnerHTML={{ __html: log.message }} />
                            </div>
                        ))}
                        {testing && (
                            <div className='flex items-center gap-2 p-3 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700'>
                                <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                                <span className='text-blue-700 dark:text-blue-300 text-sm font-medium'>{t.logs.gatheringCandidates || "Gathering ICE candidates..."}</span>
                            </div>
                        )}
                        <div ref={logsEndRef} />
                    </div>
                )}
            </div>

            {/* Summary */}
            {showSummary && testResults.startTime && testResults.endTime && (
                <div className='bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                    <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>📊 {t.summary.title}</h3>
                    <div className='space-y-3'>
                        <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                            <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.duration}:</span>
                            <span className='text-gray-900 dark:text-gray-100 font-mono'>
                                {((testResults.endTime - testResults.startTime) / 1000).toFixed(2)}
                                {t.summary.seconds}
                            </span>
                        </div>
                        <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                            <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.stunStatus}:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${testResults.stunWorking ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{testResults.stunWorking ? `✅ ${t.summary.working}` : `❌ ${t.summary.failed}`}</span>
                        </div>
                        {turnServer && (
                            <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                                <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.turnStatus}:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${testResults.turnWorking ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{testResults.turnWorking ? `✅ ${t.summary.working}` : `❌ ${t.summary.failed}`}</span>
                            </div>
                        )}
                        <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                            <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.hostCandidates}:</span>
                            <span className='text-gray-900 dark:text-gray-100 font-mono'>{testResults.candidates.host}</span>
                        </div>
                        <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                            <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.srflxCandidates}:</span>
                            <span className='text-gray-900 dark:text-gray-100 font-mono'>{testResults.candidates.srflx}</span>
                        </div>
                        <div className='flex justify-between items-center py-2'>
                            <span className='text-gray-700 dark:text-gray-300 font-semibold'>{t.summary.relayCandidates}:</span>
                            <span className='text-gray-900 dark:text-gray-100 font-mono'>{testResults.candidates.relay}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
