"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";

export default function UuidGeneratorClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.uuidGenerator;
    const common = getTranslation(locale).common;

    const [uuidV4, setUuidV4] = useState("");
    const [uuidV1, setUuidV1] = useState("");
    const [copiedV4, setCopiedV4] = useState(false);
    const [copiedV1, setCopiedV1] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [uuidList, setUuidList] = useState<string[]>([]);

    const generateUUIDv4 = (): string => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const generateUUIDv1 = (): string => {
        const now = new Date().getTime();
        const timestamp = now * 10000 + 122192928000000000;

        const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, "0");
        const timeMid = ((timestamp / 0x100000000) & 0xffff).toString(16).padStart(4, "0");
        const timeHi = (((timestamp / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, "0");

        const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, "0");
        const node = Array(6)
            .fill(0)
            .map(() =>
                Math.floor(Math.random() * 256)
                    .toString(16)
                    .padStart(2, "0")
            )
            .join("");

        return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
    };

    const handleGenerateSingle = (version: "v4" | "v1") => {
        const uuid = version === "v4" ? generateUUIDv4() : generateUUIDv1();
        if (version === "v4") {
            setUuidV4(uuid);
        } else {
            setUuidV1(uuid);
        }
    };

    const handleGenerateBulk = () => {
        const uuids: string[] = [];
        for (let i = 0; i < quantity; i++) {
            uuids.push(generateUUIDv4());
        }
        setUuidList(uuids);
    };

    const copyToClipboard = async (text: string, version: "v4" | "v1" | "bulk") => {
        try {
            await navigator.clipboard.writeText(text);
            if (version === "v4") {
                setCopiedV4(true);
                setTimeout(() => setCopiedV4(false), 2000);
            } else if (version === "v1") {
                setCopiedV1(true);
                setTimeout(() => setCopiedV1(false), 2000);
            }
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className='space-y-8'>
            {/* UUID v4 */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>UUID v4 (Random)</h2>
                    <Button onClick={handleGenerateBulk} variant='primary'>
                        {t.generate}
                    </Button>
                </div>

                {uuidV4 && (
                    <div className='space-y-3'>
                        <div className='relative'>
                            <input type='text' value={uuidV4} readOnly className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono' />
                            <Button onClick={() => copyToClipboard(uuidV4, "v4")} variant='secondary' size='sm' className='absolute right-2 top-1/2 -translate-y-1/2'>
                                {copiedV4 ? common.copied : common.copy}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* UUID v1 */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>UUID v1 (Timestamp)</h2>
                    <Button onClick={() => handleGenerateSingle("v1")} variant='primary'>
                        {t.generate}
                    </Button>
                </div>

                {uuidV1 && (
                    <div className='space-y-3'>
                        <div className='relative'>
                            <input type='text' value={uuidV1} readOnly className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono' />
                            <Button onClick={() => copyToClipboard(uuidV1, "v1")} variant='secondary' size='sm' className='absolute right-2 top-1/2 -translate-y-1/2'>
                                {copiedV1 ? common.copied : common.copy}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Generation */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.bulkGenerate}</h2>

                <div className='flex gap-4 mb-4'>
                    <input type='number' min='1' max='100' value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className='w-32 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100' />
                    <Button onClick={handleGenerateBulk} variant='primary'>
                        {t.generateBulk}
                    </Button>
                </div>

                {uuidList.length > 0 && (
                    <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>{uuidList.length} UUIDs</span>
                            <Button onClick={() => copyToClipboard(uuidList.join("\n"), "bulk")} variant='secondary' size='sm'>
                                {common.copy}
                            </Button>
                        </div>
                        <textarea value={uuidList.join("\n")} readOnly rows={10} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm' />
                    </div>
                )}
            </div>
        </div>
    );
}
