"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { loanCalculatorTranslations } from "@/lib/i18n/tools/loan-calculator";

type CalculatorTab = "loan" | "compound";
type RepaymentMethod = "reducing" | "flat";
type CompoundFrequency = "monthly" | "quarterly" | "yearly";

export default function LoanCalculatorContent() {
    const { locale } = useLanguage();
    const t = loanCalculatorTranslations[locale as "en" | "vi"] || loanCalculatorTranslations.en;
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<CalculatorTab>("loan");

    // Loan State
    const [loanAmount, setLoanAmount] = useState<number>(500000000); // 500 million VND default
    const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% / year
    const [loanTermYears, setLoanTermYears] = useState<number>(5);
    const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>("reducing");

    // Compound State
    const [initialDeposit, setInitialDeposit] = useState<number>(50000000); // 50 million VND
    const [monthlyContribution, setMonthlyContribution] = useState<number>(5000000); // 5 million VND/month
    const [compoundRate, setCompoundRate] = useState<number>(7.0); // 7% / year
    const [compoundYears, setCompoundYears] = useState<number>(10);
    const [compoundFreq, setCompoundFreq] = useState<CompoundFrequency>("monthly");

    // Format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat(isVi ? "vi-VN" : "en-US", {
            maximumFractionDigits: 0,
        }).format(Math.round(val));
    };

    // Loan calculations
    const loanResult = useMemo(() => {
        const totalMonths = Math.max(1, loanTermYears * 12);
        const monthlyRate = interestRate / 100 / 12;

        const schedule: Array<{
            month: number;
            startBalance: number;
            principal: number;
            interest: number;
            totalPayment: number;
            endBalance: number;
        }> = [];

        let currentBalance = loanAmount;
        let totalInterest = 0;
        const monthlyPrincipal = loanAmount / totalMonths;

        if (repaymentMethod === "reducing") {
            for (let m = 1; m <= totalMonths; m++) {
                const interest = currentBalance * monthlyRate;
                totalInterest += interest;
                const endBalance = Math.max(0, currentBalance - monthlyPrincipal);

                schedule.push({
                    month: m,
                    startBalance: currentBalance,
                    principal: monthlyPrincipal,
                    interest,
                    totalPayment: monthlyPrincipal + interest,
                    endBalance,
                });

                currentBalance = endBalance;
            }
        } else {
            // Flat rate
            const fixedMonthlyInterest = loanAmount * monthlyRate;
            totalInterest = fixedMonthlyInterest * totalMonths;

            for (let m = 1; m <= totalMonths; m++) {
                const endBalance = Math.max(0, currentBalance - monthlyPrincipal);
                schedule.push({
                    month: m,
                    startBalance: currentBalance,
                    principal: monthlyPrincipal,
                    interest: fixedMonthlyInterest,
                    totalPayment: monthlyPrincipal + fixedMonthlyInterest,
                    endBalance,
                });
                currentBalance = endBalance;
            }
        }

        const firstMonthPayment = schedule[0]?.totalPayment || 0;
        const totalPayment = loanAmount + totalInterest;

        return {
            firstMonthPayment,
            totalPrincipal: loanAmount,
            totalInterest,
            totalPayment,
            schedule,
        };
    }, [loanAmount, interestRate, loanTermYears, repaymentMethod]);

    // Compound interest calculations
    const compoundResult = useMemo(() => {
        const n = compoundFreq === "monthly" ? 12 : compoundFreq === "quarterly" ? 4 : 1;
        const r = compoundRate / 100;
        const tYears = Math.max(1, compoundYears);
        const totalMonths = tYears * 12;

        let balance = initialDeposit;
        let totalDeposited = initialDeposit;

        for (let m = 1; m <= totalMonths; m++) {
            balance += monthlyContribution;
            totalDeposited += monthlyContribution;
            // Compound based on frequency
            if (compoundFreq === "monthly" || (compoundFreq === "quarterly" && m % 3 === 0) || (compoundFreq === "yearly" && m % 12 === 0)) {
                const periodRate = r / n;
                balance += balance * periodRate;
            }
        }

        const interestEarned = Math.max(0, balance - totalDeposited);

        return {
            totalPrincipal: totalDeposited,
            interestEarned,
            futureValue: balance,
        };
    }, [initialDeposit, monthlyContribution, compoundRate, compoundYears, compoundFreq]);

    // Export schedule to CSV
    const exportToCSV = () => {
        const headers = ["Month,Starting Balance,Principal,Interest,Total Payment,Ending Balance"];
        const rows = loanResult.schedule.map((row) =>
            [
                row.month,
                Math.round(row.startBalance),
                Math.round(row.principal),
                Math.round(row.interest),
                Math.round(row.totalPayment),
                Math.round(row.endBalance),
            ].join(",")
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `loan_amortization_schedule_${loanTermYears}y.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const principalRatio =
        activeTab === "loan"
            ? (loanResult.totalPrincipal / loanResult.totalPayment) * 100
            : (compoundResult.totalPrincipal / compoundResult.futureValue) * 100;
    const interestRatio = 100 - principalRatio;

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Tab Navigation */}
            <div className='flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full max-w-md mx-auto'>
                <button
                    type='button'
                    onClick={() => setActiveTab("loan")}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "loan"
                            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🏦 {t.tabLoan}
                </button>
                <button
                    type='button'
                    onClick={() => setActiveTab("compound")}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "compound"
                            ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📈 {t.tabCompound}
                </button>
            </div>

            {/* Inputs & Summary Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 w-full'>
                {/* Inputs Column */}
                <div className='lg:col-span-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <h3 className='text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800'>
                        {activeTab === "loan" ? (isVi ? "Thông Tin Khoản Vay" : "Loan Parameters") : (isVi ? "Thông Tin Tích Lũy" : "Investment Parameters")}
                    </h3>

                    {activeTab === "loan" ? (
                        <>
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.loanAmount}
                                </label>
                                <input
                                    type='number'
                                    step='5000000'
                                    min='1000000'
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                                    className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-gray-900 dark:text-white'
                                />
                                <div className='text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono'>
                                    {formatCurrency(loanAmount)} {isVi ? "đồng" : "$"}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                        {t.interestRate}
                                    </label>
                                    <input
                                        type='number'
                                        step='0.1'
                                        min='0.1'
                                        max='50'
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                                        className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-gray-900 dark:text-white'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                        {t.loanTerm} ({t.termYears})
                                    </label>
                                    <input
                                        type='number'
                                        min='1'
                                        max='40'
                                        value={loanTermYears}
                                        onChange={(e) => setLoanTermYears(Math.max(1, Number(e.target.value)))}
                                        className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-gray-900 dark:text-white'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.repaymentMethod}
                                </label>
                                <div className='space-y-2 mt-1'>
                                    <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs ${repaymentMethod === "reducing" ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200" : "border-gray-200 dark:border-gray-700"}`}>
                                        <input
                                            type='radio'
                                            name='method'
                                            checked={repaymentMethod === "reducing"}
                                            onChange={() => setRepaymentMethod("reducing")}
                                            className='mt-0.5 text-blue-600'
                                        />
                                        <div>
                                            <div className='font-bold'>{t.methodReducing}</div>
                                            <div className='text-[11px] opacity-80 mt-0.5'>{t.methodReducingDesc}</div>
                                        </div>
                                    </label>

                                    <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs ${repaymentMethod === "flat" ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200" : "border-gray-200 dark:border-gray-700"}`}>
                                        <input
                                            type='radio'
                                            name='method'
                                            checked={repaymentMethod === "flat"}
                                            onChange={() => setRepaymentMethod("flat")}
                                            className='mt-0.5 text-blue-600'
                                        />
                                        <div>
                                            <div className='font-bold'>{t.methodFlat}</div>
                                            <div className='text-[11px] opacity-80 mt-0.5'>{t.methodFlatDesc}</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.initialDeposit}
                                </label>
                                <input
                                    type='number'
                                    step='1000000'
                                    min='0'
                                    value={initialDeposit}
                                    onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                                    className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-gray-900 dark:text-white'
                                />
                                <div className='text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono'>
                                    {formatCurrency(initialDeposit)} {isVi ? "đồng" : "$"}
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.monthlyDeposit}
                                </label>
                                <input
                                    type='number'
                                    step='500000'
                                    min='0'
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                                    className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-gray-900 dark:text-white'
                                />
                                <div className='text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono'>
                                    {formatCurrency(monthlyContribution)} {isVi ? "đồng/tháng" : "$/month"}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                        {t.interestRate}
                                    </label>
                                    <input
                                        type='number'
                                        step='0.1'
                                        min='0.1'
                                        max='40'
                                        value={compoundRate}
                                        onChange={(e) => setCompoundRate(Math.max(0, Number(e.target.value)))}
                                        className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-gray-900 dark:text-white'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                        {t.investmentYears}
                                    </label>
                                    <input
                                        type='number'
                                        min='1'
                                        max='50'
                                        value={compoundYears}
                                        onChange={(e) => setCompoundYears(Math.max(1, Number(e.target.value)))}
                                        className='w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-gray-900 dark:text-white'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.compoundFrequency}
                                </label>
                                <div className='grid grid-cols-3 gap-2'>
                                    {(["monthly", "quarterly", "yearly"] as CompoundFrequency[]).map((freq) => (
                                        <button
                                            key={freq}
                                            type='button'
                                            onClick={() => setCompoundFreq(freq)}
                                            className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                                compoundFreq === freq
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                            }`}
                                        >
                                            {freq === "monthly" && t.freqMonthly}
                                            {freq === "quarterly" && t.freqQuarterly}
                                            {freq === "yearly" && t.freqYearly}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Summary Results Column */}
                <div className='lg:col-span-6 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-gray-900 dark:to-blue-950/20 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-6'>
                    <div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200/80 dark:border-gray-800'>
                            {isVi ? "Báo Cáo Dự Tính" : "Financial Summary"}
                        </h3>

                        {activeTab === "loan" ? (
                            <div className='space-y-4 mt-4'>
                                <div className='p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-blue-200 dark:border-blue-800/50 shadow-xs'>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>
                                        {t.monthlyPayment}
                                    </div>
                                    <div className='text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1'>
                                        {formatCurrency(loanResult.firstMonthPayment)} {isVi ? "đ" : "$"}
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='p-3.5 rounded-xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80'>
                                        <div className='text-[11px] text-gray-500 dark:text-gray-400'>{t.totalPrincipal}</div>
                                        <div className='text-base font-bold text-gray-900 dark:text-white font-mono mt-0.5'>
                                            {formatCurrency(loanResult.totalPrincipal)} {isVi ? "đ" : "$"}
                                        </div>
                                    </div>

                                    <div className='p-3.5 rounded-xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80'>
                                        <div className='text-[11px] text-gray-500 dark:text-gray-400'>{t.totalInterest}</div>
                                        <div className='text-base font-bold text-red-500 font-mono mt-0.5'>
                                            +{formatCurrency(loanResult.totalInterest)} {isVi ? "đ" : "$"}
                                        </div>
                                    </div>
                                </div>

                                <div className='p-3.5 rounded-xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80'>
                                    <div className='text-[11px] text-gray-500 dark:text-gray-400'>{t.totalPayment}</div>
                                    <div className='text-xl font-extrabold text-gray-900 dark:text-white font-mono mt-0.5'>
                                        {formatCurrency(loanResult.totalPayment)} {isVi ? "đ" : "$"}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-4 mt-4'>
                                <div className='p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-emerald-200 dark:border-emerald-800/50 shadow-xs'>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>
                                        {t.futureValue}
                                    </div>
                                    <div className='text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1'>
                                        {formatCurrency(compoundResult.futureValue)} {isVi ? "đ" : "$"}
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='p-3.5 rounded-xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80'>
                                        <div className='text-[11px] text-gray-500 dark:text-gray-400'>{t.totalPrincipal}</div>
                                        <div className='text-base font-bold text-gray-900 dark:text-white font-mono mt-0.5'>
                                            {formatCurrency(compoundResult.totalPrincipal)} {isVi ? "đ" : "$"}
                                        </div>
                                    </div>

                                    <div className='p-3.5 rounded-xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80'>
                                        <div className='text-[11px] text-gray-500 dark:text-gray-400'>{t.interestEarned}</div>
                                        <div className='text-base font-bold text-emerald-600 font-mono mt-0.5'>
                                            +{formatCurrency(compoundResult.interestEarned)} {isVi ? "đ" : "$"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visual Ratio Bar */}
                    <div className='space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800'>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400'>
                            <span className='flex items-center gap-1.5'>
                                <span className='w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 inline-block' />
                                {isVi ? "Tiền Gốc" : "Principal"}: {Math.round(principalRatio)}%
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <span className={`w-2.5 h-2.5 rounded-full inline-block ${activeTab === "loan" ? "bg-red-500" : "bg-emerald-500"}`} />
                                {isVi ? "Tiền Lãi" : "Interest"}: {Math.round(interestRatio)}%
                            </span>
                        </div>
                        <div className='w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex'>
                            <div style={{ width: `${principalRatio}%` }} className='h-full bg-blue-600 dark:bg-blue-500 transition-all' />
                            <div style={{ width: `${interestRatio}%` }} className={`h-full transition-all ${activeTab === "loan" ? "bg-red-500" : "bg-emerald-500"}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Amortization Schedule Table (for loan tab) */}
            {activeTab === "loan" && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center justify-between flex-wrap gap-3 mb-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-lg'>📑</span>
                            <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                                {t.amortizationSchedule} ({loanResult.schedule.length} {isVi ? "tháng" : "months"})
                            </h3>
                        </div>

                        <Button onClick={exportToCSV} variant='secondary' size='sm' className='cursor-pointer'>
                            📥 {t.exportCsv}
                        </Button>
                    </div>

                    <div className='overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl'>
                        <table className='w-full text-left text-xs font-mono'>
                            <thead className='bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold sticky top-0 border-b border-gray-200 dark:border-gray-700'>
                                <tr>
                                    <th className='p-3 text-center'>{t.period}</th>
                                    <th className='p-3 text-right'>{t.startingBalance}</th>
                                    <th className='p-3 text-right'>{t.principalPayment}</th>
                                    <th className='p-3 text-right'>{t.interestPayment}</th>
                                    <th className='p-3 text-right'>{isVi ? "Tổng Trả" : "Total Payment"}</th>
                                    <th className='p-3 text-right'>{t.remainingBalance}</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300'>
                                {loanResult.schedule.map((row) => (
                                    <tr key={row.month} className='hover:bg-blue-50/30 dark:hover:bg-gray-800/50 transition-colors'>
                                        <td className='p-2.5 text-center font-bold text-gray-500'>{row.month}</td>
                                        <td className='p-2.5 text-right'>{formatCurrency(row.startBalance)}</td>
                                        <td className='p-2.5 text-right text-blue-600 dark:text-blue-400 font-semibold'>{formatCurrency(row.principal)}</td>
                                        <td className='p-2.5 text-right text-red-500'>{formatCurrency(row.interest)}</td>
                                        <td className='p-2.5 text-right font-bold text-gray-900 dark:text-white'>{formatCurrency(row.totalPayment)}</td>
                                        <td className='p-2.5 text-right font-semibold'>{formatCurrency(row.endBalance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
