"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";

interface DnsRecord {
    type: string;
    value: string;
    ttl?: number;
}

export default function DnsLookupClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
    const [queryTime, setQueryTime] = useState(0);

    const lookupDNS = async () => {
        if (!domain.trim()) {
            setError("Please enter a domain name");
            return;
        }

        // Validate domain format
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        if (!domainRegex.test(domain)) {
            setError("Please enter a valid domain name (e.g., example.com)");
            return;
        }

        setLoading(true);
        setError("");
        const startTime = Date.now();

        try {
            // Using Google DNS-over-HTTPS API
            const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];
            const allRecords: DnsRecord[] = [];

            for (const type of recordTypes) {
                try {
                    const response = await fetch(
                        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`
                    );
                    
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    
                    if (data.Answer) {
                        data.Answer.forEach((record: any) => {
                            allRecords.push({
                                type: type,
                                value: record.data,
                                ttl: record.TTL,
                            });
                        });
                    }
                } catch (err) {
                    // Skip this record type if it fails
                    continue;
                }
            }

            setQueryTime(Date.now() - startTime);

            if (allRecords.length === 0) {
                setError("No DNS records found for this domain");
                setDnsRecords([]);
            } else {
                setDnsRecords(allRecords);
                setError("");
            }
        } catch (e: any) {
            setError(`DNS lookup failed: ${e.message || "Unknown error"}`);
            setDnsRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setDomain("");
        setDnsRecords([]);
        setError("");
        setQueryTime(0);
    };

    return (
        <div className='space-y-6'>
            {/* Input Section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {t.tools.dnsLookup.enterDomain}
                </h2>

                <div className='flex gap-2'>
                    <input
                        type='text'
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && lookupDNS()}
                        placeholder='example.com'
                        className='flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <Button onClick={lookupDNS} variant='primary' disabled={loading}>
                        {loading ? t.tools.dnsLookup.looking : t.tools.dnsLookup.lookup}
                    </Button>
                    <Button onClick={clearAll} variant='gray'>
                        {t.common.clear}
                    </Button>
                </div>

                {error && (
                    <div className='mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>
                        {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            {dnsRecords.length > 0 && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                            {t.tools.dnsLookup.results}
                        </h2>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {t.tools.dnsLookup.queryTime}: {queryTime}ms
                        </span>
                    </div>

                    <div className='space-y-4'>
                        {['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'].map((recordType) => {
                            const records = dnsRecords.filter(r => r.type === recordType);
                            if (records.length === 0) return null;

                            return (
                                <div key={recordType} className='border-l-4 border-blue-500 pl-4'>
                                    <h3 className='font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2'>
                                        {recordType} {t.tools.dnsLookup.records}
                                    </h3>
                                    <div className='space-y-2'>
                                        {records.map((record, index) => (
                                            <div 
                                                key={index} 
                                                className='bg-gray-50 dark:bg-gray-700 p-3 rounded font-mono text-sm text-gray-900 dark:text-gray-100'
                                            >
                                                <div className='flex justify-between items-start'>
                                                    <span className='break-all'>{record.value}</span>
                                                    {record.ttl && (
                                                        <span className='ml-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                                            TTL: {record.ttl}s
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                        <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                            {t.tools.dnsLookup.domainInfo}
                        </h3>
                        <div className='space-y-1 text-sm text-blue-800 dark:text-blue-200'>
                            <div><strong>{t.tools.dnsLookup.domain}:</strong> {domain}</div>
                            <div><strong>{t.tools.dnsLookup.totalRecords}:</strong> {dnsRecords.length}</div>
                            <div><strong>{t.tools.dnsLookup.recordTypes}:</strong> {
                                [...new Set(dnsRecords.map(r => r.type))].join(', ')
                            }</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                    {t.tools.dnsLookup.recordTypesTitle}
                </h3>
                <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                    <li><strong className='text-gray-900 dark:text-gray-100'>A:</strong> {t.tools.dnsLookup.recordDesc.a}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>AAAA:</strong> {t.tools.dnsLookup.recordDesc.aaaa}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>MX:</strong> {t.tools.dnsLookup.recordDesc.mx}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>TXT:</strong> {t.tools.dnsLookup.recordDesc.txt}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>NS:</strong> {t.tools.dnsLookup.recordDesc.ns}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>CNAME:</strong> {t.tools.dnsLookup.recordDesc.cname}</li>
                </ul>
            </div>
        </div>
    );
}
