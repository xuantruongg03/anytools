import { toolsConfig, allTools, type Tool } from "@/config/tools";
import { translations } from "@/lib/i18n/translations";

interface RelatedTool {
    href: string;
    icon: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
}

/**
 * Get tool translation from the main translations file
 */
function getToolTranslation(key: string): { nameEn: string; nameVi: string; descriptionEn: string; descriptionVi: string } {
    const enTools = translations.en.tools as Record<string, { name?: string; description?: string }>;
    const viTools = translations.vi.tools as Record<string, { name?: string; description?: string }>;

    const enTool = enTools[key];
    const viTool = viTools[key];

    return {
        nameEn: enTool?.name || key,
        nameVi: viTool?.name || key,
        descriptionEn: enTool?.description || "",
        descriptionVi: viTool?.description || "",
    };
}

/**
 * Get related tools for a specific tool
 * @param currentToolPath - Current tool path (e.g., "/tools/json-formatter")
 * @param count - Number of related tools to return (default: 6)
 * @returns Array of related tools with translations
 */
export function getRelatedTools(currentToolPath: string, count: number = 6): RelatedTool[] {
    // Find the current tool's category
    const currentCategory = toolsConfig.find((category) => category.tools.some((tool) => tool.href === currentToolPath));

    let relatedTools: Tool[] = [];

    if (currentCategory) {
        // Get tools from the same category (excluding current tool)
        relatedTools = currentCategory.tools.filter((tool) => tool.href !== currentToolPath);

        // If we need more tools, add from other categories
        if (relatedTools.length < count) {
            const otherTools = allTools.filter((tool) => tool.href !== currentToolPath && !relatedTools.some((t) => t.href === tool.href));
            relatedTools = [...relatedTools, ...otherTools];
        }
    } else {
        // If current tool not found, return random tools
        relatedTools = allTools.filter((tool) => tool.href !== currentToolPath);
    }

    // Shuffle and pick the required count
    const shuffled = relatedTools.sort(() => Math.random() - 0.5).slice(0, count);

    // Map to RelatedTool format with translations from main translation file
    return shuffled.map((tool) => {
        const translation = getToolTranslation(tool.key);

        return {
            href: tool.href,
            icon: tool.icon,
            nameVi: translation.nameVi,
            nameEn: translation.nameEn,
            descriptionVi: translation.descriptionVi,
            descriptionEn: translation.descriptionEn,
        };
    });
}
