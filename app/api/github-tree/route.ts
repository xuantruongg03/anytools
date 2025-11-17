import { NextRequest, NextResponse } from "next/server";

interface GitHubTreeItem {
    path: string;
    type: "blob" | "tree";
    size?: number;
    sha: string;
}

interface GitHubTreeResponse {
    tree: GitHubTreeItem[];
    truncated: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { repoUrl, token } = await request.json();

        // Parse GitHub URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 });
        }

        const [, owner, repo] = match;
        const repoName = repo.replace(/\.git$/, "");

        // Get default branch first
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
        };

        if (token) {
            headers["Authorization"] = `token ${token}`;
        }

        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            headers,
        });

        if (!repoResponse.ok) {
            if (repoResponse.status === 404) {
                return NextResponse.json({ error: "Repository not found or is private (token required)" }, { status: 404 });
            }
            return NextResponse.json({ error: "Failed to fetch repository" }, { status: repoResponse.status });
        }

        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;

        // Get tree recursively
        const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${defaultBranch}?recursive=1`, {
            headers,
        });

        if (!treeResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch repository tree" }, { status: treeResponse.status });
        }

        const treeData: GitHubTreeResponse = await treeResponse.json();

        // Filter and organize tree
        const tree = treeData.tree
            .filter((item) => {
                // Skip common files/folders to ignore
                const ignore = [".git", "node_modules", ".next", "dist", "build", ".vscode", ".idea", "__pycache__", ".DS_Store"];
                return !ignore.some((pattern) => item.path.includes(pattern));
            })
            .map((item) => ({
                path: item.path,
                type: item.type,
                size: item.size,
            }));

        return NextResponse.json({
            owner,
            repo: repoName,
            branch: defaultBranch,
            tree,
            truncated: treeData.truncated,
        });
    } catch (error) {
        console.error("GitHub Tree API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
