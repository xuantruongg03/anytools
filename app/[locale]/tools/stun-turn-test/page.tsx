import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import StunTurnContent from "./StunTurnContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Kiểm Tra STUN/TURN Server - Công Cụ Test WebRTC 2026" : "STUN/TURN Server Test - WebRTC ICE Candidate Tool 2026";
    const description = isVi ? "Công cụ kiểm tra STUN/TURN server miễn phí cho WebRTC. Test cấu hình server, xác thực ICE candidate, chẩn đoán kết nối." : "Free online STUN/TURN server tester for WebRTC. Test server config, validate ICE candidate gathering, diagnose issues.";

    return {
        title,
        description,
        keywords: ["stun server test", "turn server test", "webrtc test", "ice candidate", "stun turn tester", "webrtc debug", "kiểm tra stun", "kiểm tra turn", "webrtc test tool"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/stun-turn-test`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/stun-turn-test`,
            languages: {
                en: "https://anytools.online/en/tools/stun-turn-test",
                vi: "https://anytools.online/vi/tools/stun-turn-test",
                "x-default": "https://anytools.online/en/tools/stun-turn-test",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export default async function StunTurnTestPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/stun-turn-test", 6);

    return (
        <ToolPageLayout title={isVi ? "Kiểm Tra STUN/TURN Server" : "STUN/TURN Server Test"} description={isVi ? "Kiểm tra STUN/TURN server cho WebRTC. Xác thực ICE candidates và chẩn đoán kết nối." : "Test STUN/TURN servers for WebRTC. Validate ICE candidates and diagnose connectivity issues."}>
            <StunTurnContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/stun-turn-test' />
        </ToolPageLayout>
    );
}
