"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import CryptoJS from "crypto-js";

type CipherType = "aes" | "rot13" | "caesar" | "atbash";

export default function TextEncryptionClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [caesarShift, setCaesarShift] = useState(3);
    const [cipherType, setCipherType] = useState<CipherType>("aes");
    const [error, setError] = useState("");

    // AES Encryption
    const encryptAES = () => {
        if (!input.trim()) {
            setError("Please enter text to encrypt");
            return;
        }
        if (!secretKey.trim()) {
            setError("Please enter a secret key");
            return;
        }

        try {
            const encrypted = CryptoJS.AES.encrypt(input, secretKey).toString();
            setOutput(encrypted);
            setError("");
        } catch (e) {
            setError("Encryption failed");
        }
    };

    // AES Decryption
    const decryptAES = () => {
        if (!input.trim()) {
            setError("Please enter text to decrypt");
            return;
        }
        if (!secretKey.trim()) {
            setError("Please enter a secret key");
            return;
        }

        try {
            const decrypted = CryptoJS.AES.decrypt(input, secretKey);
            const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
            
            if (!plaintext) {
                setError("Decryption failed. Wrong key or invalid ciphertext.");
                setOutput("");
                return;
            }
            
            setOutput(plaintext);
            setError("");
        } catch (e) {
            setError("Decryption failed. Invalid ciphertext or wrong key.");
            setOutput("");
        }
    };

    // ROT13 Cipher
    const rot13 = (text: string): string => {
        return text.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
        });
    };

    // Caesar Cipher
    const caesar = (text: string, shift: number, decrypt: boolean = false): string => {
        const actualShift = decrypt ? -shift : shift;
        return text.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + actualShift + 26) % 26) + base);
        });
    };

    // Atbash Cipher
    const atbash = (text: string): string => {
        return text.replace(/[a-zA-Z]/g, (char) => {
            if (char <= 'Z') {
                return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
            } else {
                return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
            }
        });
    };

    const handleEncrypt = () => {
        if (!input.trim()) {
            setError("Please enter text");
            return;
        }

        try {
            let result = "";
            switch (cipherType) {
                case "aes":
                    encryptAES();
                    return;
                case "rot13":
                    result = rot13(input);
                    break;
                case "caesar":
                    result = caesar(input, caesarShift);
                    break;
                case "atbash":
                    result = atbash(input);
                    break;
            }
            setOutput(result);
            setError("");
        } catch (e) {
            setError("Encryption failed");
        }
    };

    const handleDecrypt = () => {
        if (!input.trim()) {
            setError("Please enter text");
            return;
        }

        try {
            let result = "";
            switch (cipherType) {
                case "aes":
                    decryptAES();
                    return;
                case "rot13":
                    result = rot13(input); // ROT13 is symmetric
                    break;
                case "caesar":
                    result = caesar(input, caesarShift, true);
                    break;
                case "atbash":
                    result = atbash(input); // Atbash is symmetric
                    break;
            }
            setOutput(result);
            setError("");
        } catch (e) {
            setError("Decryption failed");
        }
    };

    const generateRandomKey = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let key = "";
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setSecretKey(key);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output).then(
            () => alert(t.common.copied),
            () => alert(t.common.failedToCopy)
        );
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
    };

    return (
        <div className='space-y-6'>
            {/* Cipher Type Selection */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {t.tools.textEncryption.selectCipher}
                </h2>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {(['aes', 'rot13', 'caesar', 'atbash'] as CipherType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setCipherType(type)}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                cipherType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* AES Key Input */}
                {cipherType === "aes" && (
                    <div className='mt-4'>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                            {t.tools.textEncryption.secretKey}
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder={t.tools.textEncryption.enterKey}
                                className='flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <Button onClick={generateRandomKey} variant='info'>
                                {t.tools.textEncryption.generateKey}
                            </Button>
                        </div>
                        <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                            ⚠️ {t.tools.textEncryption.keyWarning}
                        </p>
                    </div>
                )}

                {/* Caesar Shift Input */}
                {cipherType === "caesar" && (
                    <div className='mt-4'>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                            {t.tools.textEncryption.caesarShift}
                        </label>
                        <input
                            type='number'
                            value={caesarShift}
                            onChange={(e) => setCaesarShift(parseInt(e.target.value) || 0)}
                            min='1'
                            max='25'
                            className='w-24 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                )}
            </div>

            {/* Input/Output */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.textEncryption.input}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.tools.textEncryption.inputPlaceholder}
                        className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={handleEncrypt} variant='primary'>
                            {t.tools.textEncryption.encrypt}
                        </Button>
                        <Button onClick={handleDecrypt} variant='success'>
                            {t.tools.textEncryption.decrypt}
                        </Button>
                        <Button onClick={clearAll} variant='gray'>
                            {t.common.clear}
                        </Button>
                    </div>
                </div>

                {/* Output */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.textEncryption.output}
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder={t.tools.textEncryption.outputPlaceholder}
                        className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    {error && (
                        <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>
                            {error}
                        </div>
                    )}
                    {output && (
                        <div className='mt-4'>
                            <Button onClick={copyToClipboard} variant='dark'>
                                {t.common.copy}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
