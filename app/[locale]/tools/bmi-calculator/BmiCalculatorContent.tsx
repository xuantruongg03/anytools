"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { bmiCalculatorTranslations } from "@/lib/i18n/tools/bmi-calculator";

export default function BmiCalculatorContent() {
    const { locale } = useLanguage();
    const t = bmiCalculatorTranslations[locale as "en" | "vi"] || bmiCalculatorTranslations.en;

    // Unit & Inputs
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [age, setAge] = useState<number>(25);

    // Metric states
    const [heightCm, setHeightCm] = useState<number>(170);
    const [weightKg, setWeightKg] = useState<number>(65);

    // Imperial states
    const [heightFt, setHeightFt] = useState<number>(5);
    const [heightIn, setHeightIn] = useState<number>(7);
    const [weightLbs, setWeightLbs] = useState<number>(145);

    const [activity, setActivity] = useState<number>(1.375); // Light active default

    // Convert inputs to unified metric for computation
    const effectiveHeightCm = useMemo(() => {
        if (unit === "metric") return heightCm;
        return (heightFt * 12 + heightIn) * 2.54;
    }, [unit, heightCm, heightFt, heightIn]);

    const effectiveWeightKg = useMemo(() => {
        if (unit === "metric") return weightKg;
        return weightLbs * 0.45359237;
    }, [unit, weightKg, weightLbs]);

    // Core Calculations
    const calculations = useMemo(() => {
        const heightM = effectiveHeightCm / 100;
        if (heightM <= 0 || effectiveWeightKg <= 0) return null;

        const bmi = effectiveWeightKg / (heightM * heightM);

        // Classification (Asian criteria + WHO)
        let categoryKey = "normal";
        let color = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300";
        let gaugeDegree = 0; // -90 (underweight) to +90 (obese)

        if (bmi < 18.5) {
            categoryKey = "underweight";
            color = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300";
            gaugeDegree = Math.max(-85, -85 + ((bmi - 14) / 4.5) * 40);
        } else if (bmi < 23) {
            categoryKey = "normal";
            color = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300";
            gaugeDegree = -45 + ((bmi - 18.5) / 4.5) * 45;
        } else if (bmi < 27.5) {
            categoryKey = "overweight";
            color = "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-300";
            gaugeDegree = 0 + ((bmi - 23) / 4.5) * 45;
        } else {
            categoryKey = "obese";
            color = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-300";
            gaugeDegree = Math.min(85, 45 + ((bmi - 27.5) / 8) * 40);
        }

        // Ideal weight range for height (BMI 18.5 to 22.9)
        const minIdealWeight = 18.5 * heightM * heightM;
        const maxIdealWeight = 22.9 * heightM * heightM;

        // BMR via Mifflin-St Jeor Formula
        let bmr = 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age;
        if (gender === "male") {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        // TDEE
        const tdee = Math.round(bmr * activity);
        const roundedBmr = Math.round(bmr);

        // Calorie goals
        const maintainCalories = tdee;
        const mildLossCalories = Math.max(roundedBmr, tdee - 250);
        const lossCalories = Math.max(roundedBmr, tdee - 500);
        const gainCalories = tdee + 500;

        // Macros for standard weight loss / maintenance (Protein 30%, Carbs 45%, Fat 25%)
        const targetCal = lossCalories;
        const proteinGrams = Math.round((targetCal * 0.3) / 4);
        const carbsGrams = Math.round((targetCal * 0.45) / 4);
        const fatGrams = Math.round((targetCal * 0.25) / 9);

        return {
            bmi: bmi.toFixed(1),
            categoryKey,
            color,
            gaugeDegree,
            minIdeal: minIdealWeight.toFixed(1),
            maxIdeal: maxIdealWeight.toFixed(1),
            bmr: roundedBmr,
            tdee: tdee,
            maintainCalories,
            mildLossCalories,
            lossCalories,
            gainCalories,
            proteinGrams,
            carbsGrams,
            fatGrams,
        };
    }, [effectiveHeightCm, effectiveWeightKg, age, gender, activity]);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Unit Switcher */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-xs w-full'>
                <button
                    onClick={() => setUnit("metric")}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        unit === "metric"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    {t.unitMetric}
                </button>
                <button
                    onClick={() => setUnit("imperial")}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        unit === "imperial"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    {t.unitImperial}
                </button>
            </div>

            {/* Main Form & Results Grid */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Form Input Card */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-900 p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                    <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>⚖️</span> {t.name}
                    </h3>

                    {/* Gender Selection */}
                    <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                            {t.gender}
                        </label>
                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                onClick={() => setGender("male")}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    gender === "male"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <span>👨</span> {t.genderMale}
                            </button>
                            <button
                                onClick={() => setGender("female")}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    gender === "female"
                                        ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <span>👩</span> {t.genderFemale}
                            </button>
                        </div>
                    </div>

                    {/* Age */}
                    <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                            {t.age} ({t.years})
                        </label>
                        <input
                            type='number'
                            min='10'
                            max='100'
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                            className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* Height */}
                    {unit === "metric" ? (
                        <div>
                            <div className='flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                <span>{t.height} (cm)</span>
                                <span className='text-blue-600 font-mono'>{heightCm} cm</span>
                            </div>
                            <input
                                type='number'
                                min='100'
                                max='230'
                                value={heightCm}
                                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 160)}
                                className='w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white'
                            />
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {t.heightFt}
                                </label>
                                <input
                                    type='number'
                                    min='3'
                                    max='7'
                                    value={heightFt}
                                    onChange={(e) => setHeightFt(parseInt(e.target.value, 10) || 5)}
                                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {t.heightIn}
                                </label>
                                <input
                                    type='number'
                                    min='0'
                                    max='11'
                                    value={heightIn}
                                    onChange={(e) => setHeightIn(parseInt(e.target.value, 10) || 0)}
                                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold'
                                />
                            </div>
                        </div>
                    )}

                    {/* Weight */}
                    <div>
                        <div className='flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                            <span>{t.weight} ({unit === "metric" ? "kg" : "lbs"})</span>
                            <span className='text-blue-600 font-mono'>
                                {unit === "metric" ? `${weightKg} kg` : `${weightLbs} lbs`}
                            </span>
                        </div>
                        <input
                            type='number'
                            min='30'
                            max='250'
                            value={unit === "metric" ? weightKg : weightLbs}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value) || 50;
                                if (unit === "metric") setWeightKg(val);
                                else setWeightLbs(val);
                            }}
                            className='w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white'
                        />
                    </div>

                    {/* Activity Level */}
                    <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                            {t.activityLevel}
                        </label>
                        <select
                            value={activity}
                            onChange={(e) => setActivity(parseFloat(e.target.value))}
                            className='w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-900 dark:text-white cursor-pointer'
                        >
                            <option value={1.2}>🛋️ {t.actSedentary}</option>
                            <option value={1.375}>🚶 {t.actLight}</option>
                            <option value={1.55}>🏃 {t.actModerate}</option>
                            <option value={1.725}>🏋️ {t.actActive}</option>
                            <option value={1.9}>⚡ {t.actExtra}</option>
                        </select>
                    </div>
                </div>

                {/* Results & Visual Gauge Column */}
                <div className='lg:col-span-7 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
                    {calculations && (
                        <>
                            {/* BMI Score & Gauge */}
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800'>
                                <div className='space-y-1 text-center sm:text-left'>
                                    <div className='text-xs font-bold uppercase tracking-wider text-gray-400'>
                                        {t.yourBmi}
                                    </div>
                                    <div className='text-5xl font-black font-mono text-gray-900 dark:text-white'>
                                        {calculations.bmi}
                                    </div>
                                    <div className='pt-2'>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${calculations.color}`}>
                                            {calculations.categoryKey === "underweight"
                                                ? t.catUnderweight
                                                : calculations.categoryKey === "normal"
                                                ? t.catNormal
                                                : calculations.categoryKey === "overweight"
                                                ? t.catOverweight
                                                : t.catObese}
                                        </span>
                                    </div>
                                    <p className='text-[11px] text-gray-400 pt-1'>
                                        {t.healthyRange}
                                    </p>
                                </div>

                                {/* Speedometer / Semicircle SVG Gauge */}
                                <div className='relative w-44 h-24 flex items-end justify-center'>
                                    <svg viewBox='0 0 160 90' className='w-full h-full'>
                                        {/* Arc sections */}
                                        <path d='M 10 80 A 70 70 0 0 1 45 25' fill='none' stroke='#f59e0b' strokeWidth='12' strokeLinecap='round' />
                                        <path d='M 45 25 A 70 70 0 0 1 115 25' fill='none' stroke='#10b981' strokeWidth='12' />
                                        <path d='M 115 25 A 70 70 0 0 1 150 80' fill='none' stroke='#ef4444' strokeWidth='12' strokeLinecap='round' />

                                        {/* Needle */}
                                        <g transform={`rotate(${calculations.gaugeDegree} 80 80)`} className='transition-transform duration-300'>
                                            <line x1='80' y1='80' x2='80' y2='22' stroke='#1e293b' strokeWidth='3.5' strokeLinecap='round' className='dark:stroke-white' />
                                            <circle cx='80' cy='80' r='5' fill='#3b82f6' />
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            {/* Ideal Weight & Metabolism Cards */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                                <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center'>
                                    <div className='text-xs font-semibold text-gray-400 mb-1'>{t.idealWeight}</div>
                                    <div className='text-lg font-black text-gray-900 dark:text-white font-mono'>
                                        {calculations.minIdeal} - {calculations.maxIdeal} kg
                                    </div>
                                </div>

                                <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center'>
                                    <div className='text-xs font-semibold text-gray-400 mb-1' title={t.bmrDesc}>
                                        {t.bmrTitle} ℹ️
                                    </div>
                                    <div className='text-lg font-black text-blue-600 dark:text-blue-400 font-mono'>
                                        {calculations.bmr} kcal
                                    </div>
                                </div>

                                <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center'>
                                    <div className='text-xs font-semibold text-gray-400 mb-1' title={t.tdeeDesc}>
                                        {t.tdeeTitle} ℹ️
                                    </div>
                                    <div className='text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono'>
                                        {calculations.tdee} kcal
                                    </div>
                                </div>
                            </div>

                            {/* Calorie Goals Targets Table */}
                            <div className='space-y-3 pt-2'>
                                <h4 className='text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                                    🎯 {t.calorieTargets}
                                </h4>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                                        <span className='font-semibold text-gray-700 dark:text-gray-300'>{t.goalMaintain}</span>
                                        <span className='font-bold font-mono text-gray-900 dark:text-white'>
                                            {calculations.maintainCalories} {t.kcalDay}
                                        </span>
                                    </div>

                                    <div className='p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center'>
                                        <span className='font-semibold text-emerald-800 dark:text-emerald-300'>{t.goalMildLoss}</span>
                                        <span className='font-bold font-mono text-emerald-700 dark:text-emerald-400'>
                                            {calculations.mildLossCalories} {t.kcalDay}
                                        </span>
                                    </div>

                                    <div className='p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex justify-between items-center'>
                                        <span className='font-semibold text-blue-800 dark:text-blue-300'>{t.goalLoss}</span>
                                        <span className='font-bold font-mono text-blue-700 dark:text-blue-400'>
                                            {calculations.lossCalories} {t.kcalDay}
                                        </span>
                                    </div>

                                    <div className='p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex justify-between items-center'>
                                        <span className='font-semibold text-purple-800 dark:text-purple-300'>{t.goalGain}</span>
                                        <span className='font-bold font-mono text-purple-700 dark:text-purple-400'>
                                            {calculations.gainCalories} {t.kcalDay}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Macronutrients Breakdown */}
                            <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-2'>
                                <div className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                    🥗 {t.macroTitle} ({calculations.lossCalories} kcal):
                                </div>
                                <div className='grid grid-cols-3 gap-2 text-center text-xs'>
                                    <div className='p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                        <div className='text-gray-400 font-semibold'>{t.macroProtein} (30%)</div>
                                        <div className='font-bold text-sm text-blue-600 dark:text-blue-400 font-mono'>
                                            {calculations.proteinGrams}g
                                        </div>
                                    </div>
                                    <div className='p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                        <div className='text-gray-400 font-semibold'>{t.macroCarbs} (45%)</div>
                                        <div className='font-bold text-sm text-amber-600 dark:text-amber-400 font-mono'>
                                            {calculations.carbsGrams}g
                                        </div>
                                    </div>
                                    <div className='p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                        <div className='text-gray-400 font-semibold'>{t.macroFat} (25%)</div>
                                        <div className='font-bold text-sm text-emerald-600 dark:text-emerald-400 font-mono'>
                                            {calculations.fatGrams}g
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Guide & Knowledge */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
