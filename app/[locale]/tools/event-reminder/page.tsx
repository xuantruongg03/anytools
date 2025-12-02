import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import EventReminderClient from "./EventReminderClient";
import EventReminderContent from "./EventReminderContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Nhắc Nhở Sự Kiện - Đặt Lịch Hẹn & Gửi Email Nhắc Nhở 2025" : "Event Reminder - Schedule Events & Email Reminders 2025";
    const description = isVi ? "Đặt lịch nhắc nhở sự kiện với thông báo email. Tùy chọn số lần nhắc nhở, thông báo sắp đến giờ, và nhiều tính năng hữu ích khác." : "Schedule event reminders with email notifications. Customize reminder frequency, get alerts before events, and more.";

    return {
        title,
        description,
        keywords: ["event reminder", "email reminder", "countdown timer", "schedule reminder", "notification", "nhắc nhở sự kiện", "hẹn giờ email", "đặt lịch nhắc nhở", "thông báo sự kiện", "countdown", "đếm ngược"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/event-reminder`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/event-reminder`,
            languages: {
                en: "https://www.anytools.online/en/tools/event-reminder",
                vi: "https://www.anytools.online/vi/tools/event-reminder",
                "x-default": "https://www.anytools.online/en/tools/event-reminder",
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

export default async function EventReminderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/event-reminder", 6);

    return (
        <ToolPageLayout title={isVi ? "Nhắc Nhở Sự Kiện" : "Event Reminder"} description={isVi ? "Đặt lịch nhắc nhở sự kiện với thông báo email và browser" : "Schedule event reminders with email and browser notifications"}>
            <EventReminderClient />
            <EventReminderContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/event-reminder' />
        </ToolPageLayout>
    );
}
