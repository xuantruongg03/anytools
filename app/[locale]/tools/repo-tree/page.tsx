import type { Metadata } from "next";
import RepoTreeClient from "./RepoTreeClient";
import RepoTreeContent from "./RepoTreeContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "GitHub Repository Tree Viewer - Generate Folder Structure Markdown 2025 | AnyTools",
            description: "Free GitHub repository tree viewer. Visualize folder structure, generate markdown tree for README. Support public and private repos. Perfect for documentation and project overview.",
            keywords: "github tree, repo tree viewer, folder structure, directory tree, github markdown, repository structure, project tree, github visualizer, readme tree, file structure generator",
        },
        vi: {
            title: "Xem cây thư mục GitHub - Tạo cấu trúc Markdown cho README 2025 | AnyTools",
            description: "Công cụ xem cây thư mục GitHub miễn phí. Hiển thị cấu trúc thư mục, tạo markdown tree cho README. Hỗ trợ repo public và private. Hoàn hảo cho tài liệu dự án.",
            keywords: "github tree, xem cây thư mục, cấu trúc thư mục, directory tree, github markdown, cấu trúc repo, project tree, repo structure, readme tree, tạo cây thư mục",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: currentMetadata.keywords,
        openGraph: {
            title: currentMetadata.title,
            description: currentMetadata.description,
            type: "website",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            url: `https://anytools.online/${locale}/tools/repo-tree`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/repo-tree`,
            languages: {
                en: "https://anytools.online/en/tools/repo-tree",
                vi: "https://anytools.online/vi/tools/repo-tree",
            },
        },
    };
}

function RepoTreePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "GitHub Repository Tree Viewer",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: "Free online GitHub repository tree viewer and markdown generator. Visualize repository structure, generate formatted tree for README documentation. Support both public and private repositories.",
        featureList: ["GitHub repository visualization", "Markdown tree generation", "Public repository support", "Private repository support with token", "Copy to clipboard", "Interactive tree view", "README documentation helper"],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Do I need a GitHub token for public repositories?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, GitHub tokens are only required for private repositories. Public repositories can be viewed without any authentication.",
                },
            },
            {
                "@type": "Question",
                name: "How do I get a GitHub personal access token?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Visit github.com/settings/tokens, click 'Generate new token', select 'repo' scope for private repositories, and copy the generated token. The token is stored securely and never exposed to the client.",
                },
            },
            {
                "@type": "Question",
                name: "What format does the markdown tree use?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The tool generates a standard tree structure using ASCII characters (├──, └──, │) that displays correctly in GitHub README files and most markdown viewers.",
                },
            },
            {
                "@type": "Question",
                name: "Is my GitHub token safe?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, your token is sent securely to our server via HTTPS and used only to authenticate with GitHub API. It's never stored or logged. All API calls are made server-side to protect your credentials.",
                },
            },
        ],
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://anytools.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: "https://anytools.online/#tools",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "GitHub Repository Tree",
                item: "https://anytools.online/en/tools/repo-tree",
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/repo-tree", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-8 max-w-6xl'>
                    <RepoTreeClient />
                    <RepoTreeContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/repo-tree' />
                </div>
            </div>
        </>
    );
}

export default RepoTreePage;
