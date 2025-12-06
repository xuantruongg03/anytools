"use client";

import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState } from "react";

interface TreeItem {
    path: string;
    type: "blob" | "tree";
    size?: number;
}

interface RepoTreeData {
    owner: string;
    repo: string;
    branch: string;
    tree: TreeItem[];
    truncated: boolean;
}

export default function RepoTreeClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [repoUrl, setRepoUrl] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [treeData, setTreeData] = useState<RepoTreeData | null>(null);
    const [showToken, setShowToken] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleFetch = async () => {
        if (!repoUrl.trim()) {
            setError(t.tools.repoTree.errors.emptyUrl || "Please enter a repository URL");
            return;
        }

        setLoading(true);
        setError("");
        setTreeData(null);

        try {
            const response = await fetch("/api/github-tree", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    repoUrl: repoUrl.trim(),
                    token: token.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch repository tree");
            }

            setTreeData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const generateMarkdown = () => {
        if (!treeData) return "";

        const lines: string[] = [];
        lines.push("```");

        // Build tree structure
        const tree = treeData.tree;
        const pathMap = new Map<string, TreeItem[]>();

        // Group by parent directory
        tree.forEach((item) => {
            const parts = item.path.split("/");
            if (parts.length === 1) {
                if (!pathMap.has("")) pathMap.set("", []);
                pathMap.get("")!.push(item);
            } else {
                const parent = parts.slice(0, -1).join("/");
                if (!pathMap.has(parent)) pathMap.set(parent, []);
                pathMap.get(parent)!.push(item);
            }
        });

        // Recursive function to build tree
        const buildTree = (path: string, prefix: string, isLast: boolean) => {
            const items = pathMap.get(path) || [];
            const sortedItems = items.sort((a, b) => {
                // Directories first
                if (a.type === "tree" && b.type === "blob") return -1;
                if (a.type === "blob" && b.type === "tree") return 1;
                return a.path.localeCompare(b.path);
            });

            sortedItems.forEach((item, index) => {
                const isLastItem = index === sortedItems.length - 1;
                const connector = isLastItem ? "└── " : "├── ";
                const name = item.path.split("/").pop() || "";
                const displayName = item.type === "tree" ? `${name}/` : name;

                lines.push(`${prefix}${connector}${displayName}`);

                if (item.type === "tree") {
                    const newPrefix = prefix + (isLastItem ? "    " : "│   ");
                    buildTree(item.path, newPrefix, isLastItem);
                }
            });
        };

        // Start building from root
        lines.push(`${treeData.repo}/`);
        buildTree("", "", true);

        lines.push("```");
        return lines.join("\n");
    };

    const handleCopy = async () => {
        const markdown = generateMarkdown();
        try {
            await navigator.clipboard.writeText(markdown);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Render visual tree structure
    const renderVisualTree = () => {
        if (!treeData) return null;

        const tree = treeData.tree;
        const pathMap = new Map<string, TreeItem[]>();

        // Group by parent directory
        tree.forEach((item) => {
            const parts = item.path.split("/");
            if (parts.length === 1) {
                if (!pathMap.has("")) pathMap.set("", []);
                pathMap.get("")!.push(item);
            } else {
                const parent = parts.slice(0, -1).join("/");
                if (!pathMap.has(parent)) pathMap.set(parent, []);
                pathMap.get(parent)!.push(item);
            }
        });

        const TreeNode = ({ item, level = 0 }: { item: TreeItem; level?: number }) => {
            const name = item.path.split("/").pop() || "";
            const isDir = item.type === "tree";
            const [isOpen, setIsOpen] = useState(true);
            const children = pathMap.get(item.path) || [];

            return (
                <div>
                    <div className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors`} style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }} onClick={() => isDir && setIsOpen(!isOpen)}>
                        {isDir ? <span className='text-yellow-600 dark:text-yellow-400'>{isOpen ? "📂" : "📁"}</span> : <span className='text-gray-500 dark:text-gray-400'>📄</span>}
                        <span className={`text-sm ${isDir ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>{name}</span>
                        {item.size && <span className='text-xs text-gray-400 ml-auto'>{(item.size / 1024).toFixed(1)} KB</span>}
                    </div>
                    {isDir && isOpen && children.length > 0 && (
                        <div>
                            {children
                                .sort((a, b) => {
                                    if (a.type === "tree" && b.type === "blob") return -1;
                                    if (a.type === "blob" && b.type === "tree") return 1;
                                    return a.path.localeCompare(b.path);
                                })
                                .map((child) => (
                                    <TreeNode key={child.path} item={child} level={level + 1} />
                                ))}
                        </div>
                    )}
                </div>
            );
        };

        const rootItems = pathMap.get("") || [];
        const sortedRoot = rootItems.sort((a, b) => {
            if (a.type === "tree" && b.type === "blob") return -1;
            if (a.type === "blob" && b.type === "tree") return 1;
            return a.path.localeCompare(b.path);
        });

        return (
            <div className='space-y-1'>
                <div className='flex items-center gap-2 py-1 px-2 font-bold text-blue-700 dark:text-blue-300'>
                    <span>📦</span>
                    <span>{treeData.repo}/</span>
                </div>
                {sortedRoot.map((item) => (
                    <TreeNode key={item.path} item={item} />
                ))}
            </div>
        );
    };

    return (
        <div className='max-w-6xl mx-auto'>

            {/* Input Section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.tools.repoTree.repoUrl || "Repository URL"}</label>
                    <input type='text' value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder='https://github.com/username/repository' className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' onKeyDown={(e) => e.key === "Enter" && handleFetch()} />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.tools.repoTree.token || "GitHub Token (optional for public repos)"}</label>
                    <div className='relative'>
                        <input type={showToken ? "text" : "password"} value={token} onChange={(e) => setToken(e.target.value)} placeholder='ghp_xxxxxxxxxxxx' className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-20' onKeyDown={(e) => e.key === "Enter" && handleFetch()} />
                        <button type='button' onClick={() => setShowToken(!showToken)} className='absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700'>
                            {showToken ? "Hide" : "Show"}
                        </button>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{t.tools.repoTree.tokenHint || "Required for private repositories. Get your token at github.com/settings/tokens"}</p>
                </div>

                <button onClick={handleFetch} disabled={loading} className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'>
                    {loading && (
                        <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                    )}
                    <span>{loading ? t.tools.repoTree.loading || "Loading..." : t.tools.repoTree.fetch || "Fetch Repository Tree"}</span>
                </button>

                {error && (
                    <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                        <p className='text-red-800 dark:text-red-300 text-sm'>{error}</p>
                    </div>
                )}
            </div>

            {/* Result Section */}
            {treeData && (
                <div className='space-y-4'>
                    {/* Info */}
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                        <div className='text-sm text-blue-800 dark:text-blue-300'>
                            <span className='font-medium'>
                                {treeData.owner}/{treeData.repo}
                            </span>
                            <span className='mx-2'>•</span>
                            <span>Branch: {treeData.branch}</span>
                            <span className='mx-2'>•</span>
                            <span>{treeData.tree.length} items</span>
                        </div>
                    </div>

                    {/* Visual Tree */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>🌳 Visual Tree</h2>
                        <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-[500px] overflow-auto border border-gray-200 dark:border-gray-700'>{renderVisualTree()}</div>
                    </div>

                    {/* Markdown Preview */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>📝 {t.tools.repoTree.preview || "Markdown Preview"}</h2>
                            <button onClick={handleCopy} className='px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2'>
                                {copySuccess ? (
                                    <>
                                        <span>✓</span>
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>📋</span>
                                        <span>Copy Markdown</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre border border-gray-200 dark:border-gray-700'>{generateMarkdown()}</pre>
                    </div>

                    {treeData.truncated && (
                        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
                            <p className='text-yellow-800 dark:text-yellow-300 text-sm'>⚠️ {t.tools.repoTree.truncated || "Tree is truncated. Large repositories may not show all files."}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{t.tools.repoTree.howToUse || "How to Use"}</h2>
                <ol className='list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300'>
                    <li>{t.tools.repoTree.step1 || "Paste your GitHub repository URL (e.g., https://github.com/username/repo)"}</li>
                    <li>{t.tools.repoTree.step2 || "For private repos, add your GitHub personal access token"}</li>
                    <li>{t.tools.repoTree.step3 || "Click 'Fetch Repository Tree' to visualize the structure"}</li>
                    <li>{t.tools.repoTree.step4 || "Copy the generated markdown and paste it into your README.md"}</li>
                </ol>
            </div>
        </div>
    );
}
