"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";


const AutoSearchContent = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [currentTopic, setCurrentTopic] = useState("");
    const [progress, setProgress] = useState(0);
    const [searchCount, setSearchCount] = useState(20);
    const [delayTime, setDelayTime] = useState(5);
    const searchTab = useRef<Window | null>(null);

    useEffect(() => {
        const history = localStorage.getItem("autoSearchHistory");
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const handleSearch = async () => {
        setIsSearching(true);
        setCurrentTopic("Generating unique topics with Gemini...");

        let topicsToSearch: string[] = [];
        try {
            const response = await fetch("/api/generate-topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ existingTopics: searchHistory, count: searchCount }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to generate topics");
            }
            
            const data = await response.json();
            topicsToSearch = data.topics;
            
            if (!topicsToSearch || topicsToSearch.length === 0) {
                throw new Error("Empty topics returned");
            }
        } catch (error) {
            console.error("Error fetching topics:", error);
            alert("Failed to generate topics using Gemini. Please check your API key or try again.");
            setIsSearching(false);
            setCurrentTopic("");
            return;
        }

        // Open a single tab for the first search
        const firstTopic = topicsToSearch[0];
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(firstTopic)}`;
        searchTab.current = window.open(searchUrl, "autoSearchTab");

        let newHistory = [...searchHistory];

        for (let i = 0; i < topicsToSearch.length; i++) {
            const topic = topicsToSearch[i];
            setCurrentTopic(`Searching for: "${topic}"`);
            setProgress(((i + 1) / topicsToSearch.length) * 100);

            if (i > 0) {
                // For subsequent searches, just update the URL
                if (searchTab.current && !searchTab.current.closed) {
                    searchTab.current.location.href = `https://www.bing.com/search?q=${encodeURIComponent(topic)}`;
                } else {
                    // If the tab was closed, stop the process
                    alert("Search tab was closed. Stopping the process.");
                    break;
                }
            }

            if (!newHistory.includes(topic.toLowerCase())) {
                newHistory.push(topic.toLowerCase());
            }

            await delay(delayTime * 1000); // Wait for the specified delay
        }

        setSearchHistory(newHistory);
        localStorage.setItem("autoSearchHistory", JSON.stringify(newHistory));

        setIsSearching(false);
        setCurrentTopic("Search complete!");
        setProgress(100);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-2xl mx-auto'>
            <div className='w-full space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='searchCount' className='block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100'>
                            Number of Searches
                        </label>
                        <input type='number' id='searchCount' value={searchCount} onChange={(e) => setSearchCount(parseInt(e.target.value, 10))} className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white' min='1' />
                    </div>
                    <div>
                        <label htmlFor='delayTime' className='block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100'>
                            Delay (seconds)
                        </label>
                        <input type='number' id='delayTime' value={delayTime} onChange={(e) => setDelayTime(parseInt(e.target.value, 10))} className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white' min='1' />
                    </div>
                </div>
                <Button onClick={handleSearch} disabled={isSearching} variant='primary' className='w-full mt-4'>
                    {isSearching ? "Searching..." : "Start Auto Search"}
                </Button>
            </div>

            {isSearching && (
                <div className='w-full mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Progress</h2>
                    <p className='mt-2 text-gray-600 dark:text-gray-400'>{currentTopic}</p>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4 overflow-hidden'>
                        <div className='bg-blue-600 h-2.5 rounded-full transition-all duration-300' style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className='w-full mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Search History (Last 10)</h2>
                <ul className='list-disc pl-5 mt-4 text-gray-600 dark:text-gray-400 space-y-1'>
                    {searchHistory.slice(-10).map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AutoSearchContent;
