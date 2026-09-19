import { NextResponse } from "next/server";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
    const bankInfo = {
        bankId: process.env.BANK_ID || "MB",
        accountNo: process.env.BANK_ACCOUNT_NO || "09819012003",
        accountName: process.env.BANK_ACCOUNT_NAME || "LE XUAN TRUONG",
    };

    const packages = [
        {
            id: "pkg_2k",
            amount: 2000,
            credits: 3,
            bonus: 0,
            label: "2,000 VND",
            desc: "3 instant downloads",
            isPopular: false,
        },
        {
            id: "pkg_5k",
            amount: 5000,
            credits: 7,
            bonus: 2,
            label: "5,000 VND",
            desc: "7 instant downloads (+2 bonus)",
            isPopular: false,
        },
        {
            id: "pkg_10k",
            amount: 10000,
            credits: 25,
            bonus: 10,
            label: "10,000 VND",
            desc: "25 instant downloads (Best value)",
            isPopular: true,
        },
    ];

    return NextResponse.json(
        {
            success: true,
            bankInfo,
            packages,
            qrTemplateUrl: "https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png?amount={amount}&addInfo={content}&accountName={accountName}",
        },
        { status: 200, headers: CORS_HEADERS }
    );
}
