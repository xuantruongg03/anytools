"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState, useEffect, useCallback, useMemo } from "react";

type ReminderFrequency = "once" | "hourly" | "daily" | "custom";

type EventReminder = {
    id: string;
    name: string;
    description: string;
    targetDate: string; // ISO string
    email: string;
    reminderFrequency: ReminderFrequency;
    customRemindersPerDay: number;
    remindersBefore: number[]; // minutes before event
    createdAt: number;
    emailSent: boolean;
    browserNotified: boolean;
    isCompleted: boolean;
};

type TimeRemaining = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
    totalSeconds: number;
};

const REMINDER_BEFORE_OPTIONS = [
    { value: 5, labelEn: "5 minutes", labelVi: "5 phút" },
    { value: 15, labelEn: "15 minutes", labelVi: "15 phút" },
    { value: 30, labelEn: "30 minutes", labelVi: "30 phút" },
    { value: 60, labelEn: "1 hour", labelVi: "1 giờ" },
    { value: 120, labelEn: "2 hours", labelVi: "2 giờ" },
    { value: 360, labelEn: "6 hours", labelVi: "6 giờ" },
    { value: 720, labelEn: "12 hours", labelVi: "12 giờ" },
    { value: 1440, labelEn: "1 day", labelVi: "1 ngày" },
    { value: 2880, labelEn: "2 days", labelVi: "2 ngày" },
    { value: 10080, labelEn: "1 week", labelVi: "1 tuần" },
];

export default function EventReminderClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.eventReminder?.page || {
        title: locale === "vi" ? "Nhắc Nhở Sự Kiện" : "Event Reminder",
        createNew: locale === "vi" ? "Tạo Nhắc Nhở Mới" : "Create New Reminder",
        eventName: locale === "vi" ? "Tên sự kiện" : "Event Name",
        eventDescription: locale === "vi" ? "Mô tả (tùy chọn)" : "Description (optional)",
        targetDateTime: locale === "vi" ? "Ngày giờ đích" : "Target Date & Time",
        email: locale === "vi" ? "Email nhận thông báo" : "Email for notifications",
        reminderFrequency: locale === "vi" ? "Tần suất nhắc nhở" : "Reminder Frequency",
        frequencyOptions: {
            once: locale === "vi" ? "Một lần" : "Once",
            hourly: locale === "vi" ? "Mỗi giờ" : "Every hour",
            daily: locale === "vi" ? "Mỗi ngày" : "Daily",
            custom: locale === "vi" ? "Tùy chỉnh" : "Custom",
        },
        remindersPerDay: locale === "vi" ? "Số lần nhắc trong ngày" : "Reminders per day",
        remindersBefore: locale === "vi" ? "Nhắc trước sự kiện" : "Remind before event",
        addButton: locale === "vi" ? "Thêm Nhắc Nhở" : "Add Reminder",
        days: locale === "vi" ? "Ngày" : "Days",
        hours: locale === "vi" ? "Giờ" : "Hours",
        minutes: locale === "vi" ? "Phút" : "Minutes",
        seconds: locale === "vi" ? "Giây" : "Seconds",
        expired: locale === "vi" ? "Đã hết hạn!" : "Event has passed!",
        completed: locale === "vi" ? "Đã hoàn thành" : "Completed",
        markComplete: locale === "vi" ? "Đánh dấu hoàn thành" : "Mark as complete",
        delete: locale === "vi" ? "Xóa" : "Delete",
        noEvents: locale === "vi" ? "Chưa có sự kiện nào. Tạo một sự kiện mới ở trên!" : "No events yet. Create one above!",
        enableNotifications: locale === "vi" ? "Bật thông báo trình duyệt" : "Enable browser notifications",
        notificationsEnabled: locale === "vi" ? "Thông báo đã bật" : "Notifications enabled",
        notificationsBlocked: locale === "vi" ? "Thông báo bị chặn" : "Notifications blocked",
        testNotification: locale === "vi" ? "Thử thông báo" : "Test notification",
        sendTestEmail: locale === "vi" ? "Gửi email thử" : "Send test email",
        emailSent: locale === "vi" ? "Email đã được gửi!" : "Email sent!",
        emailError: locale === "vi" ? "Lỗi gửi email" : "Email error",
        upcomingReminders: locale === "vi" ? "Nhắc nhở sắp tới" : "Upcoming Reminders",
        errors: {
            fillFields: locale === "vi" ? "Vui lòng nhập tên sự kiện và chọn ngày giờ" : "Please enter event name and select date/time",
            futureDate: locale === "vi" ? "Vui lòng chọn thời gian trong tương lai" : "Please select a future date/time",
            invalidEmail: locale === "vi" ? "Email không hợp lệ" : "Invalid email address",
        },
        quickEvents: locale === "vi" ? "Sự kiện nhanh" : "Quick Events",
    };

    const [events, setEvents] = useState<EventReminder[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: TimeRemaining }>({});
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        targetDate: "",
        email: "",
        reminderFrequency: "daily" as ReminderFrequency,
        customRemindersPerDay: 3,
        remindersBefore: [60, 1440] as number[], // 1 hour and 1 day before by default
    });

    const [emailStatus, setEmailStatus] = useState<{ [key: string]: "sending" | "sent" | "error" | null }>({});
    const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

    // Sync event to server (for email reminders to work even when browser is closed)
    const syncEventToServer = useCallback(async (event: EventReminder) => {
        if (!event.email) return; // Only sync events with email

        try {
            setSyncStatus("syncing");
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: {
                        id: event.id,
                        name: event.name,
                        description: event.description,
                        targetDate: event.targetDate,
                        email: event.email,
                        remindersBefore: event.remindersBefore,
                        createdAt: event.createdAt,
                        sentReminders: [],
                        isCompleted: event.isCompleted,
                    },
                }),
            });

            if (response.ok) {
                setSyncStatus("synced");
                console.log(`Event "${event.name}" synced to server for email reminders`);
            } else {
                setSyncStatus("error");
                console.error("Failed to sync event to server");
            }
        } catch (error) {
            setSyncStatus("error");
            console.error("Failed to sync event:", error);
        }

        // Auto-hide sync status after 3 seconds
        setTimeout(() => setSyncStatus("idle"), 3000);
    }, []);

    // Delete event from server
    const deleteEventFromServer = useCallback(async (email: string, eventId: string) => {
        if (!email) return;

        try {
            await fetch(`/api/events?email=${encodeURIComponent(email)}&id=${eventId}`, {
                method: "DELETE",
            });
            console.log(`Event deleted from server`);
        } catch (error) {
            console.error("Failed to delete event from server:", error);
        }
    }, []);

    // Update event on server
    const updateEventOnServer = useCallback(async (email: string, eventId: string, updates: Partial<EventReminder>) => {
        if (!email) return;

        try {
            await fetch("/api/events", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, eventId, updates }),
            });
        } catch (error) {
            console.error("Failed to update event on server:", error);
        }
    }, []);

    // Check notification permission on mount and update periodically
    useEffect(() => {
        const checkPermission = () => {
            if (typeof window !== "undefined" && "Notification" in window) {
                const currentPermission = Notification.permission;
                setNotificationPermission(currentPermission);
            }
        };

        checkPermission();

        // Re-check permission periodically in case user changes it in browser settings
        const interval = setInterval(checkPermission, 1000);
        return () => clearInterval(interval);
    }, []);

    // Load events from localStorage
    useEffect(() => {
        const savedEvents = localStorage.getItem("eventReminders");
        if (savedEvents) {
            try {
                const parsed = JSON.parse(savedEvents);
                setEvents(parsed);
            } catch (e) {
                console.error("Failed to parse saved events", e);
            }
        }
    }, []);

    // Save events to localStorage
    useEffect(() => {
        if (events.length > 0) {
            localStorage.setItem("eventReminders", JSON.stringify(events));
        } else {
            localStorage.removeItem("eventReminders");
        }
    }, [events]);

    // Calculate time remaining for all events
    useEffect(() => {
        const calculateTimeRemaining = () => {
            const times: { [key: string]: TimeRemaining } = {};
            const now = Date.now();

            events.forEach((event) => {
                const targetTime = new Date(event.targetDate).getTime();
                const diff = targetTime - now;
                const totalSeconds = Math.floor(diff / 1000);

                if (diff <= 0) {
                    times[event.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, totalSeconds: 0 };
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    times[event.id] = { days, hours, minutes, seconds, expired: false, totalSeconds };
                }
            });
            setTimeRemaining(times);
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [events]);

    // Check for upcoming reminders and send notifications
    useEffect(() => {
        const checkReminders = () => {
            const now = Date.now();

            events.forEach((event) => {
                if (event.isCompleted) return;

                const targetTime = new Date(event.targetDate).getTime();

                // Check each reminder before time
                event.remindersBefore.forEach((minutesBefore) => {
                    const reminderTime = targetTime - minutesBefore * 60 * 1000;
                    const timeDiff = reminderTime - now;

                    // If within 30 seconds of reminder time
                    if (timeDiff >= 0 && timeDiff < 30000) {
                        showBrowserNotification(event, minutesBefore);
                    }
                });

                // Event time reached
                if (targetTime - now >= 0 && targetTime - now < 30000) {
                    showBrowserNotification(event, 0);
                }
            });
        };

        const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
        checkReminders(); // Initial check

        return () => clearInterval(interval);
    }, [events]);

    const showBrowserNotification = useCallback(
        (event: EventReminder, minutesBefore: number) => {
            if (notificationPermission !== "granted") return;

            const title = minutesBefore === 0 ? (locale === "vi" ? `🎉 ${event.name} - Đến giờ rồi!` : `🎉 ${event.name} - It's time!`) : locale === "vi" ? `⏰ ${event.name} - Còn ${formatMinutes(minutesBefore, locale)}` : `⏰ ${event.name} - ${formatMinutes(minutesBefore, locale)} left`;

            const body = event.description || (locale === "vi" ? "Đừng quên sự kiện này!" : "Don't forget this event!");

            try {
                new Notification(title, {
                    body,
                    icon: "/favicon.ico",
                    tag: `${event.id}-${minutesBefore}`,
                    requireInteraction: true,
                });
            } catch (e) {
                console.error("Failed to show notification", e);
            }
        },
        [notificationPermission, locale]
    );

    const requestNotificationPermission = async () => {
        if (typeof window !== "undefined" && "Notification" in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };

    const testNotification = () => {
        if (notificationPermission === "granted") {
            new Notification(locale === "vi" ? "Thông báo thử nghiệm" : "Test Notification", {
                body: locale === "vi" ? "Thông báo hoạt động tốt!" : "Notifications are working!",
                icon: "/favicon.ico",
            });
        }
    };

    const sendTestEmail = async (eventId: string) => {
        const event = events.find((e) => e.id === eventId);
        if (!event || !event.email) return;

        setEmailStatus((prev) => ({ ...prev, [eventId]: "sending" }));

        try {
            const response = await fetch("/api/send-reminder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: event.email,
                    eventName: event.name,
                    eventDescription: event.description,
                    targetDate: event.targetDate,
                    isTest: true,
                }),
            });

            if (response.ok) {
                setEmailStatus((prev) => ({ ...prev, [eventId]: "sent" }));
                setTimeout(() => {
                    setEmailStatus((prev) => ({ ...prev, [eventId]: null }));
                }, 3000);
            } else {
                setEmailStatus((prev) => ({ ...prev, [eventId]: "error" }));
            }
        } catch {
            setEmailStatus((prev) => ({ ...prev, [eventId]: "error" }));
        }
    };

    const addEvent = useCallback(() => {
        if (!formData.name || !formData.targetDate) {
            alert(page.errors.fillFields);
            return;
        }

        const targetTime = new Date(formData.targetDate).getTime();
        if (targetTime <= Date.now()) {
            alert(page.errors.futureDate);
            return;
        }

        if (formData.email && !isValidEmail(formData.email)) {
            alert(page.errors.invalidEmail);
            return;
        }

        const newEvent: EventReminder = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            targetDate: formData.targetDate,
            email: formData.email,
            reminderFrequency: formData.reminderFrequency,
            customRemindersPerDay: formData.customRemindersPerDay,
            remindersBefore: formData.remindersBefore,
            createdAt: Date.now(),
            emailSent: false,
            browserNotified: false,
            isCompleted: false,
        };

        setEvents((prev) => [...prev, newEvent]);

        // Sync to server if email is provided (for server-side email reminders)
        if (newEvent.email) {
            syncEventToServer(newEvent);
        }

        // Reset form
        setFormData({
            name: "",
            description: "",
            targetDate: "",
            email: formData.email, // Keep email for convenience
            reminderFrequency: "daily",
            customRemindersPerDay: 3,
            remindersBefore: [60, 1440],
        });
    }, [formData, page.errors, syncEventToServer]);

    const removeEvent = useCallback(
        (id: string) => {
            // Find event to get email before removing
            setEvents((prev) => {
                const eventToRemove = prev.find((e) => e.id === id);
                if (eventToRemove?.email) {
                    deleteEventFromServer(eventToRemove.email, id);
                }
                return prev.filter((e) => e.id !== id);
            });
        },
        [deleteEventFromServer]
    );

    const toggleComplete = useCallback(
        (id: string) => {
            setEvents((prev) =>
                prev.map((event) => {
                    if (event.id === id) {
                        const updated = { ...event, isCompleted: !event.isCompleted };
                        // Sync to server if has email
                        if (event.email) {
                            updateEventOnServer(event.email, id, { isCompleted: updated.isCompleted });
                        }
                        return updated;
                    }
                    return event;
                })
            );
        },
        [updateEventOnServer]
    );

    const toggleReminderBefore = (minutes: number) => {
        setFormData((prev) => {
            const current = prev.remindersBefore;
            if (current.includes(minutes)) {
                return { ...prev, remindersBefore: current.filter((m) => m !== minutes) };
            } else {
                return { ...prev, remindersBefore: [...current, minutes].sort((a, b) => a - b) };
            }
        });
    };

    // Helper to format date for datetime-local input (local timezone)
    const formatDateTimeLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Quick event presets
    const quickEvents = useMemo(() => {
        const now = new Date();
        return [
            {
                name: locale === "vi" ? "⏰ 1 giờ nữa" : "⏰ In 1 hour",
                getDate: () => formatDateTimeLocal(new Date(now.getTime() + 60 * 60 * 1000)),
            },
            {
                name: locale === "vi" ? "🌅 Ngày mai sáng" : "🌅 Tomorrow morning",
                getDate: () => {
                    const tomorrow = new Date(now);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0);
                    return formatDateTimeLocal(tomorrow);
                },
            },
            {
                name: locale === "vi" ? "📅 1 tuần nữa" : "📅 In 1 week",
                getDate: () => formatDateTimeLocal(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
            },
            {
                name: locale === "vi" ? "🗓️ 1 tháng nữa" : "🗓️ In 1 month",
                getDate: () => {
                    const nextMonth = new Date(now);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    return formatDateTimeLocal(nextMonth);
                },
            },
        ];
    }, [locale]);

    const applyQuickEvent = (getDate: () => string) => {
        setFormData((prev) => ({ ...prev, targetDate: getDate() }));
    };

    return (
        <div className='space-y-4'>
            {/* Sync Status Indicator */}
            {syncStatus !== "idle" && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all ${syncStatus === "syncing" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : syncStatus === "synced" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"}`}>
                    {syncStatus === "syncing" && (
                        <>
                            <div className='animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full'></div>
                            {locale === "vi" ? "Đang đồng bộ..." : "Syncing..."}
                        </>
                    )}
                    {syncStatus === "synced" && (
                        <>
                            <span>✓</span>
                            {locale === "vi" ? "Đã lưu! Email sẽ được gửi tự động" : "Saved! Emails will be sent automatically"}
                        </>
                    )}
                    {syncStatus === "error" && (
                        <>
                            <span>✗</span>
                            {locale === "vi" ? "Lỗi đồng bộ" : "Sync error"}
                        </>
                    )}
                </div>
            )}

            {/* Notification Permission */}
            <div className='bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-lg p-4 mb-6 border border-indigo-200 dark:border-indigo-800'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='flex items-center gap-3'>
                        <span className='text-2xl'>🔔</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white'>{locale === "vi" ? "Thông báo trình duyệt" : "Browser Notifications"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{notificationPermission === "granted" ? page.notificationsEnabled : notificationPermission === "denied" ? page.notificationsBlocked : page.enableNotifications}</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        {notificationPermission === "default" && (
                            <button onClick={requestNotificationPermission} className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors'>
                                {page.enableNotifications}
                            </button>
                        )}
                        {notificationPermission === "granted" && (
                            <button onClick={testNotification} className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors'>
                                {page.testNotification}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Events */}
            <div className='bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg shadow-lg p-6 mb-6 border border-blue-200 dark:border-blue-800'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                    <span>⚡</span>
                    {page.quickEvents}
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {quickEvents.map((item, index) => (
                        <button key={index} onClick={() => applyQuickEvent(item.getDate)} className='px-4 py-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border-2 border-blue-200 dark:border-blue-700 rounded-lg transition-all hover:scale-105 hover:shadow-md text-sm font-medium text-gray-700 dark:text-gray-300 text-center'>
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create New Event */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{page.createNew}</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.eventName} *</label>
                        <input type='text' value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder={page.eventName} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.targetDateTime} *</label>
                        <input type='datetime-local' value={formData.targetDate} onChange={(e) => setFormData((prev) => ({ ...prev, targetDate: e.target.value }))} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:scheme-dark' />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.eventDescription}</label>
                    <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} placeholder={page.eventDescription} rows={2} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none' />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.email}</label>
                        <input type='email' value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder='your@email.com' className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.reminderFrequency}</label>
                        <div className='relative'>
                            <select value={formData.reminderFrequency} onChange={(e) => setFormData((prev) => ({ ...prev, reminderFrequency: e.target.value as ReminderFrequency }))} className='w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer'>
                                <option value='once'>{page.frequencyOptions.once}</option>
                                <option value='hourly'>{page.frequencyOptions.hourly}</option>
                                <option value='daily'>{page.frequencyOptions.daily}</option>
                                <option value='custom'>{page.frequencyOptions.custom}</option>
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                                <svg className='h-5 w-5 text-gray-400 dark:text-gray-500' viewBox='0 0 20 20' fill='currentColor'>
                                    <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {formData.reminderFrequency === "custom" && (
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{page.remindersPerDay}</label>
                        <input type='number' min={1} max={24} value={formData.customRemindersPerDay} onChange={(e) => setFormData((prev) => ({ ...prev, customRemindersPerDay: parseInt(e.target.value) || 1 }))} className='w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' />
                    </div>
                )}

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{page.remindersBefore}</label>
                    <div className='flex flex-wrap gap-2'>
                        {REMINDER_BEFORE_OPTIONS.map((option) => (
                            <button key={option.value} type='button' onClick={() => toggleReminderBefore(option.value)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.remindersBefore.includes(option.value) ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                {locale === "vi" ? option.labelVi : option.labelEn}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={addEvent} className='w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    {page.addButton}
                </button>
            </div>

            {/* Events List */}
            <div className='grid grid-cols-1 gap-6'>
                {events.map((event) => {
                    const time = timeRemaining[event.id];
                    if (!time) return null;

                    const isUpcoming = time.totalSeconds > 0 && time.totalSeconds <= 3600; // Within 1 hour

                    return (
                        <div
                            key={event.id}
                            className={`bg-linear-to-br rounded-xl shadow-xl p-6 relative transition-all duration-300 hover:shadow-2xl ${
                                event.isCompleted
                                    ? "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-300 dark:border-green-700 opacity-75"
                                    : time.expired
                                    ? "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-300 dark:border-red-700"
                                    : isUpcoming
                                    ? "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700 animate-pulse"
                                    : "from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            {/* Action buttons */}
                            <div className='absolute top-4 right-4 flex gap-2'>
                                {event.email && (
                                    <button
                                        onClick={() => sendTestEmail(event.id)}
                                        disabled={emailStatus[event.id] === "sending"}
                                        className={`p-2 rounded-lg transition-colors ${emailStatus[event.id] === "sent" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : emailStatus[event.id] === "error" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400"}`}
                                        title={page.sendTestEmail}
                                    >
                                        {emailStatus[event.id] === "sending" ? (
                                            <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'></path>
                                            </svg>
                                        ) : (
                                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                            </svg>
                                        )}
                                    </button>
                                )}
                                <button onClick={() => toggleComplete(event.id)} className={`p-2 rounded-lg transition-colors ${event.isCompleted ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"}`} title={page.markComplete}>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                </button>
                                <button onClick={() => removeEvent(event.id)} className='p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400 transition-colors' title={page.delete}>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                            </div>

                            {/* Event info */}
                            <div className='pr-32 mb-4'>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3'>
                                    {event.name}
                                    {event.isCompleted && <span className='text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium'>✓ {page.completed}</span>}
                                    {isUpcoming && !event.isCompleted && <span className='text-sm px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium animate-bounce'>🔥 {locale === "vi" ? "Sắp đến!" : "Coming soon!"}</span>}
                                </h3>
                                {event.description && <p className='text-gray-600 dark:text-gray-400 mb-2'>{event.description}</p>}
                                <div className='flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400'>
                                    <span className='flex items-center gap-1'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                        </svg>
                                        {new Date(event.targetDate).toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                                    </span>
                                    {event.email && (
                                        <span className='flex items-center gap-1'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                            </svg>
                                            {event.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Countdown display */}
                            {event.isCompleted ? (
                                <div className='text-center py-4'>
                                    <div className='text-4xl mb-2'>✅</div>
                                    <div className='text-xl font-bold text-green-600 dark:text-green-400'>{page.completed}</div>
                                </div>
                            ) : time.expired ? (
                                <div className='text-center py-4'>
                                    <div className='text-4xl mb-2 animate-bounce'>🎉</div>
                                    <div className='text-2xl font-bold text-red-600 dark:text-red-400 animate-pulse'>{page.expired}</div>
                                </div>
                            ) : (
                                <div className='grid grid-cols-4 gap-3'>
                                    <div className='bg-linear-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-3 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-3xl md:text-4xl font-bold mb-1'>{String(time.days).padStart(2, "0")}</div>
                                        <div className='text-xs font-medium uppercase tracking-wider opacity-90'>{page.days}</div>
                                    </div>
                                    <div className='bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-3 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-3xl md:text-4xl font-bold mb-1'>{String(time.hours).padStart(2, "0")}</div>
                                        <div className='text-xs font-medium uppercase tracking-wider opacity-90'>{page.hours}</div>
                                    </div>
                                    <div className='bg-linear-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-xl p-3 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-3xl md:text-4xl font-bold mb-1'>{String(time.minutes).padStart(2, "0")}</div>
                                        <div className='text-xs font-medium uppercase tracking-wider opacity-90'>{page.minutes}</div>
                                    </div>
                                    <div className='bg-linear-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl p-3 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-3xl md:text-4xl font-bold mb-1'>{String(time.seconds).padStart(2, "0")}</div>
                                        <div className='text-xs font-medium uppercase tracking-wider opacity-90'>{page.seconds}</div>
                                    </div>
                                </div>
                            )}

                            {/* Reminder times */}
                            {!event.isCompleted && !time.expired && event.remindersBefore.length > 0 && (
                                <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                                        </svg>
                                        {locale === "vi" ? "Nhắc trước:" : "Reminders:"} {event.remindersBefore.map((m) => formatMinutes(m, locale)).join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {events.length === 0 && (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
                    <div className='text-6xl mb-4'>📅</div>
                    <p className='text-gray-500 dark:text-gray-400 text-lg'>{page.noEvents}</p>
                </div>
            )}
        </div>
    );
}

// Helper functions
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatMinutes(minutes: number, locale: string): string {
    if (minutes < 60) {
        return locale === "vi" ? `${minutes} phút` : `${minutes} min`;
    } else if (minutes < 1440) {
        const hours = minutes / 60;
        return locale === "vi" ? `${hours} giờ` : `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes < 10080) {
        const days = minutes / 1440;
        return locale === "vi" ? `${days} ngày` : `${days} day${days > 1 ? "s" : ""}`;
    } else {
        const weeks = minutes / 10080;
        return locale === "vi" ? `${weeks} tuần` : `${weeks} week${weeks > 1 ? "s" : ""}`;
    }
}
