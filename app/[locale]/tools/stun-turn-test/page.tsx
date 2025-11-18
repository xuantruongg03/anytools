import type { Metadata } from "next";
import StunTurnContent from "./StunTurnContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "STUN/TURN Server Test - WebRTC ICE Candidate Testing Tool 2025",
        description: "Free online STUN/TURN server tester for WebRTC applications. Test server configuration, validate ICE candidate gathering, and diagnose connectivity issues. Real-time logging and detailed test summary.",
        keywords: ["stun server test", "turn server test", "webrtc test", "ice candidate", "stun turn tester", "webrtc debug", "nat traversal", "peer connection test", "coturn test", "twilio stun", "kiểm tra stun", "kiểm tra turn", "webrtc test tool", "ice gathering", "srflx relay test"],
        openGraph: {
            title: "STUN/TURN Server Test - Test WebRTC Server Configuration",
            description: "Test your STUN/TURN servers for WebRTC. Validate ICE candidates, diagnose connectivity issues, and ensure reliable peer-to-peer connections.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "STUN/TURN Server Test - WebRTC Testing Tool",
            description: "Free tool to test STUN/TURN server configuration. Real-time ICE candidate gathering and detailed diagnostics.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/stun-turn-test",
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

export default function StunTurnTestPage() {
    const relatedTools = getRelatedTools("/tools/stun-turn-test", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <StunTurnContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/stun-turn-test' />
            </div>
        </div>
    );
}
