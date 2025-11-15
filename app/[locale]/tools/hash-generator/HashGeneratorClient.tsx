"use client";

import Select from "@/components/ui/Select";
import { getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function HashGeneratorClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    const [activeTab, setActiveTab] = useState<"hash" | "encrypt">("hash");
    const [input, setInput] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [output, setOutput] = useState("");
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<"sha1" | "sha256" | "sha512">("sha256");
    const [encryptionAlgorithm, setEncryptionAlgorithm] = useState<"AES-128" | "AES-192" | "AES-256">("AES-256");
    const [hashes, setHashes] = useState({
        sha1: "",
        sha256: "",
        sha512: "",
    });

    const generateHashes = async () => {
        if (!input) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        try {
            let hashBuffer: ArrayBuffer;

            // Generate hash based on selected algorithm
            switch (selectedAlgorithm) {
                case "sha1":
                    hashBuffer = await crypto.subtle.digest("SHA-1", data);
                    break;
                case "sha256":
                    hashBuffer = await crypto.subtle.digest("SHA-256", data);
                    break;
                case "sha512":
                    hashBuffer = await crypto.subtle.digest("SHA-512", data);
                    break;
            }

            const hashHex = Array.from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            setHashes({
                ...hashes,
                [selectedAlgorithm]: hashHex,
            });
        } catch (error) {
            alert(locale === "en" ? "Error generating hashes" : "Lỗi tạo hash");
        }
    };

    const encryptText = async () => {
        if (!input || !secretKey) {
            alert(locale === "en" ? "Please enter both text and secret key" : "Vui lòng nhập cả văn bản và khóa bí mật");
            return;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            // Derive key from secret key
            const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(secretKey), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);

            const salt = crypto.getRandomValues(new Uint8Array(16));
            const keyLength = encryptionAlgorithm === "AES-128" ? 128 : encryptionAlgorithm === "AES-192" ? 192 : 256;
            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: keyLength },
                false,
                ["encrypt"]
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data);

            // Combine salt + iv + encrypted data
            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);

            // Convert to base64
            const base64 = btoa(String.fromCharCode(...combined));
            setOutput(base64);
        } catch (error) {
            alert(locale === "en" ? "Error encrypting text" : "Lỗi mã hóa văn bản");
        }
    };

    const decryptText = async () => {
        if (!input || !secretKey) {
            alert(locale === "en" ? "Please enter both encrypted text and secret key" : "Vui lòng nhập cả văn bản mã hóa và khóa bí mật");
            return;
        }

        try {
            const encoder = new TextEncoder();

            // Decode base64
            const combined = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));

            // Extract salt, iv, and encrypted data
            const salt = combined.slice(0, 16);
            const iv = combined.slice(16, 28);
            const encryptedData = combined.slice(28);

            // Derive key from secret key
            const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(secretKey), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);

            const keyLength = encryptionAlgorithm === "AES-128" ? 128 : encryptionAlgorithm === "AES-192" ? 192 : 256;
            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: keyLength },
                false,
                ["decrypt"]
            );

            const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encryptedData);

            const decoder = new TextDecoder();
            const decryptedText = decoder.decode(decrypted);
            setOutput(decryptedText);
        } catch (error) {
            alert(locale === "en" ? "Error decrypting text. Please check your secret key." : "Lỗi giải mã. Vui lòng kiểm tra khóa bí mật.");
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                alert(locale === "en" ? `Copied ${label} to clipboard!` : `Đã sao chép ${label} vào clipboard!`);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert(locale === "en" ? `Copied ${label} to clipboard!` : `Đã sao chép ${label} vào clipboard!`);
            }
        } catch (e) {
            alert(locale === "en" ? "Failed to copy" : "Sao chép thất bại");
        }
    };

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Tabs */}
            <div className='flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700'>
                <button onClick={() => setActiveTab("hash")} className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === "hash" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}>
                    {t.tools.hashGenerator.hashing}
                </button>
                <button onClick={() => setActiveTab("encrypt")} className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === "encrypt" ? "border-green-600 text-green-600 dark:text-green-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}>
                    {t.tools.hashGenerator.encryptDecrypt}
                </button>
            </div>

            {/* Hashing Tab */}
            {activeTab === "hash" && (
                <div className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Hash Algorithm" : "Thuật toán Hash"}</label>
                        <Select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value as "sha1" | "sha256" | "sha512")}>
                            <option value='sha1'>SHA-1 (160-bit)</option>
                            <option value='sha256'>SHA-256 (256-bit)</option>
                            <option value='sha512'>SHA-512 (512-bit)</option>
                        </Select>

                        {/* Algorithm Description */}
                        <div className='mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                                {selectedAlgorithm === "sha1" && "SHA-1 (Secure Hash Algorithm 1)"}
                                {selectedAlgorithm === "sha256" && "SHA-256 (Secure Hash Algorithm 256-bit)"}
                                {selectedAlgorithm === "sha512" && "SHA-512 (Secure Hash Algorithm 512-bit)"}
                            </h4>
                            <div className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                                {selectedAlgorithm === "sha1" && (
                                    <>
                                        <p className='font-medium'>{locale === "en" ? "How it works:" : "Cách hoạt động:"}</p>
                                        <p>
                                            {locale === "en"
                                                ? "SHA-1 processes input data in 512-bit blocks through 80 rounds of operations, producing a fixed 160-bit (20-byte) hash value. It uses bitwise operations, modular additions, and compression functions to create a unique fingerprint of the data."
                                                : "SHA-1 xử lý dữ liệu đầu vào thành các khối 512-bit qua 80 vòng thao tác, tạo ra giá trị hash cố định 160-bit (20 byte). Nó sử dụng các phép toán bitwise, phép cộng modular và hàm nén để tạo dấu vân tay duy nhất của dữ liệu."}
                                        </p>
                                        <p className='text-red-600 dark:text-red-400 font-medium'>{locale === "en" ? "⚠️ Security Warning: SHA-1 is cryptographically broken. Collision attacks are practical. Do not use for security-critical applications like SSL certificates or digital signatures." : "⚠️ Cảnh báo bảo mật: SHA-1 đã bị phá vỡ về mặt mật mã. Các cuộc tấn công va chạm là khả thi. Không sử dụng cho các ứng dụng bảo mật quan trọng như chứng chỉ SSL hoặc chữ ký số."}</p>
                                    </>
                                )}
                                {selectedAlgorithm === "sha256" && (
                                    <>
                                        <p className='font-medium'>{locale === "en" ? "How it works:" : "Cách hoạt động:"}</p>
                                        <p>
                                            {locale === "en"
                                                ? "SHA-256 divides input into 512-bit blocks and processes each through 64 rounds of cryptographic operations. It uses 8 working variables and 64 constants to mix the data thoroughly. The algorithm applies logical functions (AND, OR, XOR, NOT), bit rotations, and modular addition to create a 256-bit hash that's practically impossible to reverse."
                                                : "SHA-256 chia đầu vào thành các khối 512-bit và xử lý từng khối qua 64 vòng thao tác mật mã. Nó sử dụng 8 biến làm việc và 64 hằng số để trộn dữ liệu kỹ lưỡng. Thuật toán áp dụng các hàm logic (AND, OR, XOR, NOT), phép xoay bit và phép cộng modular để tạo hash 256-bit gần như không thể đảo ngược."}
                                        </p>
                                        <p className='text-green-600 dark:text-green-400 font-medium'>{locale === "en" ? "✓ Recommended: Widely used in blockchain (Bitcoin), SSL/TLS certificates, password storage, and digital signatures. No known practical attacks." : "✓ Được khuyên dùng: Sử dụng rộng rãi trong blockchain (Bitcoin), chứng chỉ SSL/TLS, lưu trữ mật khẩu và chữ ký số. Không có cuộc tấn công thực tế nào được biết đến."}</p>
                                    </>
                                )}
                                {selectedAlgorithm === "sha512" && (
                                    <>
                                        <p className='font-medium'>{locale === "en" ? "How it works:" : "Cách hoạt động:"}</p>
                                        <p>
                                            {locale === "en"
                                                ? "SHA-512 operates on 1024-bit blocks (double SHA-256) and uses 80 rounds of processing with 64-bit words. It employs the same structure as SHA-256 but with larger word size and more rounds, providing greater cryptographic strength. The algorithm produces a 512-bit output through complex mathematical transformations including bit shifting, rotation, and non-linear functions."
                                                : "SHA-512 hoạt động trên các khối 1024-bit (gấp đôi SHA-256) và sử dụng 80 vòng xử lý với các từ 64-bit. Nó sử dụng cấu trúc tương tự SHA-256 nhưng với kích thước từ lớn hơn và nhiều vòng hơn, cung cấp độ mạnh mật mã cao hơn. Thuật toán tạo đầu ra 512-bit thông qua các phép biến đổi toán học phức tạp bao gồm dịch bit, xoay và các hàm phi tuyến."}
                                        </p>
                                        <p className='text-blue-600 dark:text-blue-400 font-medium'>{locale === "en" ? "✓ Maximum Security: Best for high-security applications, government systems, long-term data integrity verification, and when computational resources allow for the additional processing overhead." : "✓ Bảo mật tối đa: Tốt nhất cho các ứng dụng bảo mật cao, hệ thống chính phủ, xác minh tính toàn vẹn dữ liệu dài hạn và khi tài nguyên tính toán cho phép xử lý bổ sung."}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.inputText}</label>
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={locale === "en" ? "Enter text to hash..." : "Nhập văn bản để tạo hash..."} className='w-full h-32 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>

                    <Button onClick={generateHashes} variant='primary' className='px-6 py-3'>
                        {t.tools.hashGenerator.generateHashes}
                    </Button>

                    {hashes[selectedAlgorithm] && (
                        <div className='p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                            <div className='flex justify-between items-center mb-2'>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{selectedAlgorithm.toUpperCase().replace("SHA", "SHA-")}</h3>
                                <Button onClick={() => copyToClipboard(hashes[selectedAlgorithm], selectedAlgorithm.toUpperCase())} variant='secondary' size='sm'>
                                    {t.common.copy}
                                </Button>
                            </div>
                            <code className='text-xs break-all text-gray-700 dark:text-gray-300'>{hashes[selectedAlgorithm]}</code>
                        </div>
                    )}
                </div>
            )}

            {/* Encryption/Decryption Tab */}
            {activeTab === "encrypt" && (
                <div className='space-y-6'>
                    {/* Algorithm Selection */}
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Encryption Algorithm" : "Thuật toán mã hóa"}</label>
                        <Select value={encryptionAlgorithm} onChange={(e) => setEncryptionAlgorithm(e.target.value as "AES-128" | "AES-192" | "AES-256")}>
                            <option value='AES-128'>AES-128 (128-bit key)</option>
                            <option value='AES-192'>AES-192 (192-bit key)</option>
                            <option value='AES-256'>AES-256 (256-bit key)</option>
                        </Select>

                        {/* Algorithm Description */}
                        <div className='mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{encryptionAlgorithm} (Advanced Encryption Standard)</h4>
                            <div className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                                <p className='font-medium'>{locale === "en" ? "How it works:" : "Cách hoạt động:"}</p>
                                {encryptionAlgorithm === "AES-128" && (
                                    <>
                                        <p>
                                            {locale === "en"
                                                ? "AES-128 uses a 128-bit key with 10 rounds of transformation. Each round applies SubBytes (substitution), ShiftRows (permutation), MixColumns (diffusion), and AddRoundKey (key mixing). It processes data in 128-bit blocks using GCM mode for authenticated encryption, ensuring both confidentiality and integrity."
                                                : "AES-128 sử dụng khóa 128-bit với 10 vòng biến đổi. Mỗi vòng áp dụng SubBytes (thay thế), ShiftRows (hoán vị), MixColumns (khuếch tán) và AddRoundKey (trộn khóa). Nó xử lý dữ liệu trong các khối 128-bit sử dụng chế độ GCM cho mã hóa có xác thực, đảm bảo cả tính bảo mật và toàn vẹn."}
                                        </p>
                                        <p className='text-green-600 dark:text-green-400 font-medium'>{locale === "en" ? "✓ Fast & Secure: Excellent balance of speed and security. Suitable for most applications including file encryption, secure messaging, and data protection." : "✓ Nhanh & An toàn: Cân bằng tuyệt vời giữa tốc độ và bảo mật. Phù hợp cho hầu hết ứng dụng bao gồm mã hóa file, nhắn tin bảo mật và bảo vệ dữ liệu."}</p>
                                    </>
                                )}
                                {encryptionAlgorithm === "AES-192" && (
                                    <>
                                        <p>
                                            {locale === "en"
                                                ? "AES-192 uses a 192-bit key with 12 rounds of transformation. The additional key length and rounds provide stronger security margins compared to AES-128. It employs the same core operations but with more iterations, making brute-force attacks computationally infeasible while maintaining reasonable performance."
                                                : "AES-192 sử dụng khóa 192-bit với 12 vòng biến đổi. Độ dài khóa và số vòng bổ sung cung cấp mức độ bảo mật cao hơn so với AES-128. Nó sử dụng cùng các thao tác cốt lõi nhưng với nhiều lần lặp hơn, khiến các cuộc tấn công brute-force không khả thi về mặt tính toán trong khi vẫn duy trì hiệu suất hợp lý."}
                                        </p>
                                        <p className='text-blue-600 dark:text-blue-400 font-medium'>{locale === "en" ? "✓ Enhanced Security: Offers additional security margin for sensitive data. Good for financial transactions, healthcare records, and medium-to-high security requirements." : "✓ Bảo mật nâng cao: Cung cấp mức độ bảo mật bổ sung cho dữ liệu nhạy cảm. Tốt cho giao dịch tài chính, hồ sơ y tế và yêu cầu bảo mật từ trung bình đến cao."}</p>
                                    </>
                                )}
                                {encryptionAlgorithm === "AES-256" && (
                                    <>
                                        <p>
                                            {locale === "en"
                                                ? "AES-256 uses a 256-bit key with 14 rounds of transformation. This is the strongest AES variant, providing maximum cryptographic strength. The algorithm uses PBKDF2 with 100,000 iterations to derive the encryption key from your password, adding protection against dictionary and brute-force attacks. Combined with GCM mode, it provides authenticated encryption."
                                                : "AES-256 sử dụng khóa 256-bit với 14 vòng biến đổi. Đây là biến thể AES mạnh nhất, cung cấp độ mạnh mật mã tối đa. Thuật toán sử dụng PBKDF2 với 100.000 lần lặp để tạo khóa mã hóa từ mật khẩu của bạn, thêm bảo vệ chống lại các cuộc tấn công từ điển và brute-force. Kết hợp với chế độ GCM, nó cung cấp mã hóa có xác thực."}
                                        </p>
                                        <p className='text-purple-600 dark:text-purple-400 font-medium'>{locale === "en" ? "✓ Maximum Security: Approved for TOP SECRET data by NSA. Best for military-grade encryption, government data, long-term sensitive information, and maximum security requirements." : "✓ Bảo mật tối đa: Được NSA phê duyệt cho dữ liệu TỐI MẬT. Tốt nhất cho mã hóa cấp quân sự, dữ liệu chính phủ, thông tin nhạy cảm dài hạn và yêu cầu bảo mật tối đa."}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='grid lg:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.inputText}</label>
                                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={locale === "en" ? "Enter text to encrypt/decrypt..." : "Nhập văn bản để mã hóa/giải mã..."} className='w-full h-40 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.secretKey}</label>
                                <input type='password' value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder={t.tools.hashGenerator.enterSecretKey} className='w-full p-3 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500' />
                            </div>

                            <div className='flex gap-3'>
                                <Button onClick={encryptText} variant='success' size='lg' className='flex-1'>
                                    {t.tools.hashGenerator.encryptText}
                                </Button>
                                <Button onClick={decryptText} variant='purple' size='lg' className='flex-1'>
                                    {t.tools.hashGenerator.decryptText}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Output" : "Kết quả"}</label>
                            <textarea value={output} readOnly placeholder={locale === "en" ? "Result will appear here..." : "Kết quả sẽ hiển thị ở đây..."} className='w-full h-40 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none' />
                            {output && (
                                <Button onClick={() => copyToClipboard(output, locale === "en" ? "result" : "kết quả")} variant='dark' className='mt-3'>
                                    {t.common.copy}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
