/**
 * ===================================================================
 * AnyTools — Two-Sided Referral Engine (P2P / Giới thiệu Bạn bè)
 * ===================================================================
 * 
 * Flow:
 *   1. User B (Tân thủ) nhập mã giới thiệu = User ID của User A.
 *      → User B nhận ngay +3 Credits (REFEREE_WELCOME_BONUS).
 *      → Tạo referral record với status "pending".
 *   2. Khi User B hoàn thành lượt tải đầu tiên (free hoặc credit):
 *      → User A (Người mời) nhận +5 Credits (REFERRER_MILESTONE_REWARD).
 *      → Referral record chuyển thành "completed".
 * 
 * Chống gian lận (Anti-Fraud):
 *   - Chặn tự mời chính mình (self-referral).
 *   - Mỗi User chỉ được nhập mã giới thiệu 1 lần duy nhất.
 *   - Không cho phép cùng IP / cùng dải mạng /24 giữa người mời & người được mời.
 *   - Mỗi người mời tối đa 10 lần thưởng / ngày (DAILY_CAP).
 *   - User mới phải nhập mã trong vòng 48 giờ đầu kể từ khi tạo tài khoản (GRACE_PERIOD).
 */

import { getDb } from "@/lib/db/mongodb";

// ============ Referral Configuration ============
const REFEREE_WELCOME_BONUS = 3;      // Credits tặng người được mời
const REFERRER_MILESTONE_REWARD = 5;   // Credits thưởng người mời khi referee tải xong lần đầu
const DAILY_REFERRAL_CAP = 10;         // Tối đa lượt thưởng / ngày / người mời
const GRACE_PERIOD_HOURS = 48;         // Thời hạn nhập mã giới thiệu (giờ)

let referralIndexesEnsured = false;

// ============ Helpers ============

function getVnTimeString(): string {
    return new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

/**
 * Trích xuất dải mạng /24 từ IPv4 để kiểm tra cùng mạng LAN.
 * VD: "113.160.234.56" → "113.160.234"
 */
function getSubnet24(ip: string): string {
    if (!ip || ip === "unknown") return "";
    const parts = ip.split(".");
    if (parts.length === 4) return parts.slice(0, 3).join(".");
    return ip; // IPv6 hoặc format khác → so sánh trực tiếp
}

async function ensureReferralIndexes() {
    if (referralIndexesEnsured) return;
    try {
        const db = await getDb();
        if (db) {
            await Promise.all([
                // Mỗi referee chỉ được giới thiệu 1 lần
                db.collection("credits_referrals").createIndex({ refereeId: 1 }, { unique: true }).catch(() => {}),
                // Truy vấn nhanh theo referrer
                db.collection("credits_referrals").createIndex({ referrerId: 1 }).catch(() => {}),
                // Truy vấn theo status
                db.collection("credits_referrals").createIndex({ status: 1 }).catch(() => {}),
                // Truy vấn daily cap
                db.collection("credits_referrals").createIndex({ referrerId: 1, createdAt: 1 }).catch(() => {}),
            ]);
            referralIndexesEnsured = true;
        }
    } catch (_) {}
}

// ============ Core Functions ============

/**
 * User B (referee) nhập mã giới thiệu của User A (referrer).
 * Mã giới thiệu chính là User ID của User A.
 */
export async function claimReferralCode(params: {
    refereeId: string;      // User ID của người nhập mã (người mới)
    referralCode: string;    // Mã giới thiệu = User ID của người mời
    refereeIp?: string;      // IP của người mới
}): Promise<{
    success: boolean;
    creditsAwarded: number;
    message: string;
    error?: string;
}> {
    const { refereeId, referralCode, refereeIp = "unknown" } = params;
    const cleanRefereeId = refereeId.trim();
    const cleanReferralCode = referralCode.trim().toUpperCase();
    const now = getVnTimeString();

    // --- Anti-Fraud Checks ---

    // 1. Chặn tự mời chính mình
    if (cleanRefereeId.toUpperCase() === cleanReferralCode) {
        return { success: false, creditsAwarded: 0, message: "Không thể tự giới thiệu chính mình.", error: "SELF_REFERRAL" };
    }

    const db = await getDb();
    if (!db) {
        return { success: false, creditsAwarded: 0, message: "Hệ thống tạm gián đoạn, vui lòng thử lại sau.", error: "DB_UNAVAILABLE" };
    }

    await ensureReferralIndexes();

    // 2. Kiểm tra mã giới thiệu có tồn tại (= User ID người mời phải có trong DB)
    // Hỗ trợ cả 2 định dạng ID: USER_XXXX (uppercase) và usr_xxxx_xxxx (lowercase)
    let referrerUser = await db.collection("credits_users").findOne({ userId: cleanReferralCode });
    if (!referrerUser) {
        // Thử tìm lowercase cho dạng usr_
        const lowerCode = referralCode.trim().toLowerCase();
        referrerUser = await db.collection("credits_users").findOne({ userId: lowerCode });
    }
    if (!referrerUser) {
        return { success: false, creditsAwarded: 0, message: "Mã giới thiệu không hợp lệ hoặc không tồn tại.", error: "INVALID_CODE" };
    }

    const referrerId = referrerUser.userId; // Use the exact casing from DB

    // 3. Kiểm tra referee đã từng nhập mã giới thiệu chưa (chỉ được 1 lần)
    const existingClaim = await db.collection("credits_referrals").findOne({ refereeId: cleanRefereeId });
    if (existingClaim) {
        return { success: false, creditsAwarded: 0, message: "Bạn đã sử dụng mã giới thiệu trước đó rồi.", error: "ALREADY_CLAIMED" };
    }

    // 4. Kiểm tra thời hạn nhập mã (Grace Period — 48 giờ kể từ khi tạo tài khoản)
    const refereeUser = await db.collection("credits_users").findOne({ userId: cleanRefereeId });
    if (refereeUser && refereeUser.createdAt) {
        const createdTime = new Date(refereeUser.createdAt).getTime();
        const gracePeriodMs = GRACE_PERIOD_HOURS * 60 * 60 * 1000;
        if (!isNaN(createdTime) && Date.now() - createdTime > gracePeriodMs) {
            return {
                success: false,
                creditsAwarded: 0,
                message: `Chỉ có thể nhập mã giới thiệu trong ${GRACE_PERIOD_HOURS} giờ đầu sau khi cài đặt.`,
                error: "GRACE_PERIOD_EXPIRED",
            };
        }
    }

    // 5. Kiểm tra cùng IP / cùng dải mạng /24 giữa referrer & referee
    const referrerIp = referrerUser.createdIp || "unknown";
    if (refereeIp !== "unknown" && referrerIp !== "unknown") {
        if (refereeIp === referrerIp) {
            return { success: false, creditsAwarded: 0, message: "Không thể sử dụng mã giới thiệu từ cùng mạng.", error: "SAME_IP" };
        }
        const refereeSub = getSubnet24(refereeIp);
        const referrerSub = getSubnet24(referrerIp);
        if (refereeSub && referrerSub && refereeSub === referrerSub) {
            return { success: false, creditsAwarded: 0, message: "Không thể sử dụng mã giới thiệu từ cùng mạng.", error: "SAME_SUBNET" };
        }
    }

    // 6. Kiểm tra Daily Cap của người mời (tối đa 10 lượt / ngày)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await db.collection("credits_referrals").countDocuments({
        referrerId: referrerId,
        createdAt: { $gte: todayStart.toISOString() },
    });
    if (todayCount >= DAILY_REFERRAL_CAP) {
        return {
            success: false,
            creditsAwarded: 0,
            message: "Người giới thiệu đã đạt giới hạn giới thiệu trong ngày. Vui lòng thử lại ngày mai.",
            error: "DAILY_CAP_REACHED",
        };
    }

    // --- Tất cả kiểm tra hợp lệ → Thực thi ---

    try {
        // A. Tạo referral record (status = "pending" cho tới khi referee tải xong lần đầu)
        await db.collection("credits_referrals").insertOne({
            referrerId: referrerId,
            refereeId: cleanRefereeId,
            status: "pending",          // → "completed" khi referee tải xong lần đầu
            bonusCredited: false,       // → true khi đã cộng 5cr cho referrer
            refereeCreditsAwarded: REFEREE_WELCOME_BONUS,
            referrerCreditsAwarded: 0,  // Chưa cộng cho referrer
            ipReferee: refereeIp,
            ipReferrer: referrerIp,
            createdAt: now,
            completedAt: null,
        });

        // B. Cộng ngay 3 Credits cho referee (người mới)
        await db.collection("credits_users").updateOne(
            { userId: cleanRefereeId },
            {
                $inc: { credits: REFEREE_WELCOME_BONUS },
                $set: { updatedAt: now, referredBy: referrerId },
                $setOnInsert: {
                    totalDownloaded: 0,
                    createdIp: refereeIp,
                    createdAt: now,
                },
            },
            { upsert: true }
        );

        console.log(`✅ [Referral] ${cleanRefereeId} claimed ref code of ${referrerId}. +${REFEREE_WELCOME_BONUS}cr awarded.`);

        return {
            success: true,
            creditsAwarded: REFEREE_WELCOME_BONUS,
            message: `🎉 Bạn nhận được ${REFEREE_WELCOME_BONUS} credits miễn phí! Tải tài liệu ngay mà không cần chờ đợi.`,
        };
    } catch (err: any) {
        // Duplicate key = đã claim rồi
        if (err?.code === 11000) {
            return { success: false, creditsAwarded: 0, message: "Bạn đã sử dụng mã giới thiệu trước đó rồi.", error: "ALREADY_CLAIMED" };
        }
        console.error("❌ [Referral] claimReferralCode error:", err.message);
        return { success: false, creditsAwarded: 0, message: "Lỗi hệ thống, vui lòng thử lại.", error: "INTERNAL_ERROR" };
    }
}

/**
 * Kiểm tra và kích hoạt Milestone Reward cho người mời.
 * Được gọi SAU KHI một user hoàn tất lượt tải đầu tiên.
 * 
 * @param refereeId  User ID của người vừa tải xong
 * @returns Thông tin referrer đã được thưởng (nếu có)
 */
export async function checkAndRewardReferrerMilestone(refereeId: string): Promise<{
    rewarded: boolean;
    referrerId?: string;
    creditsAwarded?: number;
}> {
    const cleanRefereeId = refereeId.trim();

    try {
        const db = await getDb();
        if (!db) return { rewarded: false };

        await ensureReferralIndexes();

        // Tìm referral record mà referee này đã claim, status vẫn là "pending"
        const referralDoc = await db.collection("credits_referrals").findOne({
            refereeId: cleanRefereeId,
            status: "pending",
            bonusCredited: false,
        });

        if (!referralDoc) return { rewarded: false };

        const now = getVnTimeString();

        // Cập nhật referral → "completed" & cộng 5cr cho referrer
        await db.collection("credits_referrals").updateOne(
            { _id: referralDoc._id },
            {
                $set: {
                    status: "completed",
                    bonusCredited: true,
                    referrerCreditsAwarded: REFERRER_MILESTONE_REWARD,
                    completedAt: now,
                },
            }
        );

        // Cộng credits cho referrer
        await db.collection("credits_users").updateOne(
            { userId: referralDoc.referrerId },
            {
                $inc: { credits: REFERRER_MILESTONE_REWARD },
                $set: { updatedAt: now },
            }
        );

        console.log(`🎯 [Referral] Milestone reward! Referrer ${referralDoc.referrerId} gets +${REFERRER_MILESTONE_REWARD}cr (referee ${cleanRefereeId} completed first download).`);

        return {
            rewarded: true,
            referrerId: referralDoc.referrerId,
            creditsAwarded: REFERRER_MILESTONE_REWARD,
        };
    } catch (err: any) {
        console.error("❌ [Referral] checkAndRewardReferrerMilestone error:", err.message);
        return { rewarded: false };
    }
}

/**
 * Lấy thống kê referral cho 1 user (phục vụ hiển thị trên popup extension & Darkboard).
 */
export async function getReferralStats(userId: string): Promise<{
    totalReferred: number;         // Tổng số người đã mời
    completedReferrals: number;    // Số người đã tải xong (= đã nhận thưởng)
    pendingReferrals: number;      // Đang chờ (mời rồi nhưng chưa tải)
    totalCreditsEarned: number;    // Tổng credits kiếm được từ referral
    referredBy: string | null;     // User đã giới thiệu mình
    hasClaimedReferral: boolean;   // Mình đã dùng mã giới thiệu chưa
}> {
    const cleanId = userId.trim();

    try {
        const db = await getDb();
        if (!db) {
            return { totalReferred: 0, completedReferrals: 0, pendingReferrals: 0, totalCreditsEarned: 0, referredBy: null, hasClaimedReferral: false };
        }

        await ensureReferralIndexes();

        // Lấy tất cả referrals mà user này là referrer
        const referrals = await db.collection("credits_referrals")
            .find({ referrerId: cleanId })
            .toArray();

        const completedReferrals = referrals.filter(r => r.status === "completed").length;
        const pendingReferrals = referrals.filter(r => r.status === "pending").length;
        const totalCreditsEarned = referrals.reduce((sum, r) => sum + (r.referrerCreditsAwarded || 0), 0);

        // Kiểm tra user này đã được ai giới thiệu chưa
        const asReferee = await db.collection("credits_referrals").findOne({ refereeId: cleanId });

        return {
            totalReferred: referrals.length,
            completedReferrals,
            pendingReferrals,
            totalCreditsEarned,
            referredBy: asReferee?.referrerId || null,
            hasClaimedReferral: !!asReferee,
        };
    } catch (err: any) {
        console.error("❌ [Referral] getReferralStats error:", err.message);
        return { totalReferred: 0, completedReferrals: 0, pendingReferrals: 0, totalCreditsEarned: 0, referredBy: null, hasClaimedReferral: false };
    }
}
