"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { GRADE_SYSTEMS, CLASSIFICATION } from "@/constants/gpa";
import type { Course, GradeSystemType, GPAResult, PredictionInput } from "@/types/gpa";

export default function GpaCalculatorClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [selectedSystem, setSelectedSystem] = useState<GradeSystemType>("standard");
    const [courses, setCourses] = useState<Course[]>([{ id: "1", name: "", grade: 0, credits: 0 }]);
    const [showConversionTable, setShowConversionTable] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const simFileInputRef = useRef<HTMLInputElement>(null);

    // Simulation states
    const [simulationCourses, setSimulationCourses] = useState<Course[]>([{ id: "sim-1", name: "", grade: 0, credits: 0 }]);
    const [simCurrentGPA, setSimCurrentGPA] = useState<number>(0);
    const [simCurrentCredits, setSimCurrentCredits] = useState<number>(0);

    // Import states
    const [importError, setImportError] = useState<string>("");
    const [importSuccess, setImportSuccess] = useState<string>("");

    // Prediction states
    const [prediction, setPrediction] = useState<PredictionInput>({
        currentGPA: 0,
        currentCredits: 0,
        targetGPA: 0,
        remainingCredits: 0,
    });

    // Grade converter states
    const [gradeInput, setGradeInput] = useState<number>(0);
    const [gpaInput, setGpaInput] = useState<number>(0);

    const currentSystem = useMemo(() => GRADE_SYSTEMS.find((s) => s.id === selectedSystem) || GRADE_SYSTEMS[0], [selectedSystem]);

    // Convert grade to GPA
    const gradeToGPA = useCallback(
        (grade: number): number => {
            const range = currentSystem.ranges.find((r) => grade >= r.min && grade <= r.max);
            return range?.gpa || 0;
        },
        [currentSystem]
    );

    // Convert GPA to grade range
    const gpaToGrade = useCallback(
        (gpa: number): { min: number; max: number; letter: string } => {
            const range = currentSystem.ranges.find((r) => r.gpa === gpa);
            if (range) {
                return { min: range.min, max: range.max, letter: range.letter || "" };
            }
            // Find closest match
            const closest = currentSystem.ranges.reduce((prev, curr) => {
                return Math.abs(curr.gpa - gpa) < Math.abs(prev.gpa - gpa) ? curr : prev;
            });
            return { min: closest.min, max: closest.max, letter: closest.letter || "" };
        },
        [currentSystem]
    );

    // Calculate GPA
    const gpaResult: GPAResult = useMemo(() => {
        const validCourses = courses.filter((c) => c.grade > 0 && c.credits > 0);
        if (validCourses.length === 0) {
            return {
                gpa: 0,
                totalCredits: 0,
                totalGradePoints: 0,
                classification: CLASSIFICATION.weak.nameEn,
                classificationVi: CLASSIFICATION.weak.nameVi,
            };
        }

        const totalGradePoints = validCourses.reduce((sum, course) => {
            const gpa = gradeToGPA(course.grade);
            return sum + gpa * course.credits;
        }, 0);

        const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
        const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

        let classification = CLASSIFICATION.weak.nameEn;
        let classificationVi = CLASSIFICATION.weak.nameVi;

        if (gpa >= CLASSIFICATION.excellent.min) {
            classification = CLASSIFICATION.excellent.nameEn;
            classificationVi = CLASSIFICATION.excellent.nameVi;
        } else if (gpa >= CLASSIFICATION.good.min) {
            classification = CLASSIFICATION.good.nameEn;
            classificationVi = CLASSIFICATION.good.nameVi;
        } else if (gpa >= CLASSIFICATION.fair.min) {
            classification = CLASSIFICATION.fair.nameEn;
            classificationVi = CLASSIFICATION.fair.nameVi;
        } else if (gpa >= CLASSIFICATION.average.min) {
            classification = CLASSIFICATION.average.nameEn;
            classificationVi = CLASSIFICATION.average.nameVi;
        }

        return { gpa, totalCredits, totalGradePoints, classification, classificationVi };
    }, [courses, gradeToGPA]);

    // Prediction calculation
    const predictionResult = useMemo(() => {
        const { currentGPA, currentCredits, targetGPA, remainingCredits } = prediction;

        if (currentCredits <= 0 || remainingCredits <= 0) {
            return {
                requiredAverage: 0,
                isAchievable: false,
                message: "Please enter valid values",
                messageVi: "Vui lòng nhập giá trị hợp lệ",
            };
        }

        const totalCredits = currentCredits + remainingCredits;
        const requiredTotalPoints = targetGPA * totalCredits;
        const currentTotalPoints = currentGPA * currentCredits;
        const requiredPoints = requiredTotalPoints - currentTotalPoints;
        const requiredAverage = requiredPoints / remainingCredits;

        const isAchievable = requiredAverage <= 4.0 && requiredAverage >= 0;

        let message = "";
        let messageVi = "";

        if (!isAchievable) {
            if (requiredAverage > 4.0) {
                message = "Target GPA is not achievable (required average > 4.0)";
                messageVi = "GPA mục tiêu không thể đạt được (cần điểm TB > 4.0)";
            } else {
                message = "Current GPA already exceeds target";
                messageVi = "GPA hiện tại đã vượt mục tiêu";
            }
        } else {
            message = `You need an average of ${requiredAverage.toFixed(2)} GPA for remaining courses`;
            messageVi = `Bạn cần đạt trung bình ${requiredAverage.toFixed(2)} GPA cho các môn còn lại`;
        }

        return { requiredAverage, isAchievable, message, messageVi };
    }, [prediction]);

    // Course management functions
    const addCourse = useCallback(() => {
        setCourses((prev) => [...prev, { id: Date.now().toString(), name: "", grade: 0, credits: 0 }]);
    }, []);

    const removeCourse = useCallback((id: string) => {
        setCourses((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
    }, []);

    const updateCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
        setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    }, []);

    const addSimulationCourse = useCallback(() => {
        setSimulationCourses((prev) => [...prev, { id: `sim-${Date.now()}`, name: "", grade: 0, credits: 0 }]);
    }, []);

    const removeSimulationCourse = useCallback((id: string) => {
        setSimulationCourses((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
    }, []);

    const updateSimulationCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
        setSimulationCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    }, []);

    // Import from Excel/CSV
    const handleFileImport = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, isSimulation: boolean = false) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // Reset messages
            setImportError("");
            setImportSuccess("");

            // Validate file type
            const validTypes = [".csv", ".txt", ".xlsx", ".xls"];
            const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
            if (!validTypes.includes(fileExtension)) {
                setImportError(locale === "vi" ? "Định dạng file không hợp lệ. Vui lòng chọn file CSV hoặc TXT." : "Invalid file format. Please select CSV or TXT file.");
                event.target.value = "";
                return;
            }

            // Validate file size (max 1MB)
            if (file.size > 1024 * 1024) {
                setImportError(locale === "vi" ? "File quá lớn. Kích thước tối đa là 1MB." : "File too large. Maximum size is 1MB.");
                event.target.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onerror = () => {
                setImportError(locale === "vi" ? "Lỗi khi đọc file. Vui lòng thử lại." : "Error reading file. Please try again.");
                event.target.value = "";
            };

            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    if (!text || text.trim().length === 0) {
                        setImportError(locale === "vi" ? "File trống. Vui lòng chọn file khác." : "Empty file. Please select another file.");
                        return;
                    }

                    const rows = text.split("\n").filter((row) => row.trim());

                    if (rows.length < 2) {
                        setImportError(locale === "vi" ? "File phải có ít nhất 2 dòng (1 dòng tiêu đề + 1 dòng dữ liệu)." : "File must have at least 2 rows (1 header + 1 data row).");
                        return;
                    }

                    const importedCourses: Course[] = [];
                    const invalidRows: number[] = [];

                    for (let i = 1; i < rows.length; i++) {
                        const columns = rows[i].split(/[,\t]/).map((col) => col.trim().replace(/"/g, ""));

                        if (columns.length < 3) {
                            invalidRows.push(i + 1);
                            continue;
                        }

                        const name = columns[0];
                        const gradeStr = columns[1].replace(",", ".");
                        const creditsStr = columns[2];

                        const grade = parseFloat(gradeStr);
                        const credits = parseInt(creditsStr);

                        // Validate data
                        if (!name || name.length === 0) {
                            invalidRows.push(i + 1);
                            continue;
                        }

                        if (isNaN(grade) || grade <= 0 || grade > 10) {
                            invalidRows.push(i + 1);
                            continue;
                        }

                        if (isNaN(credits) || credits <= 0 || credits > 20) {
                            invalidRows.push(i + 1);
                            continue;
                        }

                        importedCourses.push({
                            id: `${isSimulation ? "sim-" : ""}${Date.now()}-${i}`,
                            name,
                            grade,
                            credits,
                        });
                    }

                    if (importedCourses.length === 0) {
                        setImportError(locale === "vi" ? "Không tìm thấy dữ liệu hợp lệ trong file. Kiểm tra format: Tên môn, Điểm (0-10), Tín chỉ (1-20)" : "No valid data found in file. Check format: Course Name, Grade (0-10), Credits (1-20)");
                        return;
                    }

                    // Update state
                    if (isSimulation) {
                        setSimulationCourses(importedCourses);
                    } else {
                        setCourses(importedCourses);
                    }

                    // Success message
                    let message = locale === "vi" ? `Đã import thành công ${importedCourses.length} môn học.` : `Successfully imported ${importedCourses.length} courses.`;

                    if (invalidRows.length > 0) {
                        message += locale === "vi" ? ` (Bỏ qua ${invalidRows.length} dòng không hợp lệ: ${invalidRows.slice(0, 5).join(", ")}${invalidRows.length > 5 ? "..." : ""})` : ` (Skipped ${invalidRows.length} invalid rows: ${invalidRows.slice(0, 5).join(", ")}${invalidRows.length > 5 ? "..." : ""})`;
                    }

                    setImportSuccess(message);

                    // Auto hide success message after 5 seconds
                    setTimeout(() => setImportSuccess(""), 5000);
                } catch (error) {
                    setImportError(locale === "vi" ? "Lỗi khi xử lý file. Vui lòng kiểm tra định dạng file." : "Error processing file. Please check file format.");
                }
            };

            reader.readAsText(file);
            event.target.value = "";
        },
        [locale]
    );

    // Simulation GPA calculation
    const simulationResult = useMemo(() => {
        const validSimCourses = simulationCourses.filter((c) => c.grade > 0 && c.credits > 0);
        if (prediction.currentGPA <= 0 || prediction.currentCredits <= 0 || validSimCourses.length === 0) {
            return { projectedGPA: 0, newCredits: 0 };
        }

        const newTotalPoints = validSimCourses.reduce((sum, c) => sum + gradeToGPA(c.grade) * c.credits, 0);
        const newTotalCredits = validSimCourses.reduce((sum, c) => sum + c.credits, 0);
        const currentTotalPoints = prediction.currentGPA * prediction.currentCredits;
        const projectedGPA = (currentTotalPoints + newTotalPoints) / (prediction.currentCredits + newTotalCredits);

        return { projectedGPA: isNaN(projectedGPA) ? 0 : projectedGPA, newCredits: newTotalCredits };
    }, [simulationCourses, prediction.currentGPA, prediction.currentCredits, gradeToGPA]);

    // Memoize converter results
    const convertedGPA = useMemo(() => {
        if (gradeInput <= 0) return null;
        const gpa = gradeToGPA(gradeInput);
        const letter = currentSystem.ranges.find((r) => gradeInput >= r.min && gradeInput <= r.max)?.letter || "-";
        return { gpa, letter };
    }, [gradeInput, gradeToGPA, currentSystem.ranges]);

    const convertedGrade = useMemo(() => {
        if (gpaInput <= 0) return null;
        return gpaToGrade(gpaInput);
    }, [gpaInput, gpaToGrade]);

    // Memoize callbacks
    const handleImportError = useCallback(() => setImportError(""), []);
    const handleImportSuccess = useCallback(() => setImportSuccess(""), []);

    return (
        <div className='space-y-8 max-w-6xl mx-auto'>
            {/* Import Messages */}
            {importError && (
                <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3'>
                    <svg className='w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <div className='flex-1'>
                        <h3 className='text-sm font-semibold text-red-800 dark:text-red-300 mb-1'>{locale === "vi" ? "Lỗi Import" : "Import Error"}</h3>
                        <p className='text-sm text-red-700 dark:text-red-400'>{importError}</p>
                    </div>
                    <button onClick={handleImportError} className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>
            )}

            {importSuccess && (
                <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3'>
                    <svg className='w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <div className='flex-1'>
                        <h3 className='text-sm font-semibold text-green-800 dark:text-green-300 mb-1'>{locale === "vi" ? "Thành công" : "Success"}</h3>
                        <p className='text-sm text-green-700 dark:text-green-400'>{importSuccess}</p>
                    </div>
                    <button onClick={handleImportSuccess} className='text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>
            )}

            {/* Grade System Selection */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "Chọn hệ thống tính điểm" : "Select Grading System"}</h2>
                <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                    <label className='block text-sm font-medium text-gray-900 dark:text-white mb-3'>{locale === "vi" ? "Chọn hệ thống tính điểm của trường bạn:" : "Select your school's grading system:"}</label>
                    <div className='space-y-3'>
                        {GRADE_SYSTEMS.map((system) => (
                            <label key={system.id} className='flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors'>
                                <input type='radio' name='gradeSystem' value={system.id} checked={selectedSystem === system.id} onChange={(e) => setSelectedSystem(e.target.value as GradeSystemType)} className='mt-1' />
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900 dark:text-white'>{locale === "vi" ? system.nameVi : system.name}</div>
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>{locale === "vi" ? system.descriptionVi : system.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button onClick={() => setShowConversionTable(!showConversionTable)} className='mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                        {showConversionTable ? (locale === "vi" ? "Ẩn bảng quy đổi" : "Hide conversion table") : locale === "vi" ? "Xem bảng quy đổi" : "View conversion table"}
                    </button>

                    {showConversionTable && (
                        <div className='mt-4 overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-gray-300 dark:border-gray-600'>
                                        <th className='py-2 px-3 text-left text-gray-900 dark:text-white'>{locale === "vi" ? "Điểm chữ" : "Letter"}</th>
                                        <th className='py-2 px-3 text-left text-gray-900 dark:text-white'>{locale === "vi" ? `Thang ${currentSystem.scale}` : `Scale ${currentSystem.scale}`}</th>
                                        <th className='py-2 px-3 text-left text-gray-900 dark:text-white'>GPA (4.0)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSystem.ranges.map((range, idx) => (
                                        <tr key={idx} className='border-b border-gray-200 dark:border-gray-700'>
                                            <td className='py-2 px-3 font-medium text-gray-900 dark:text-white'>{range.letter}</td>
                                            <td className='py-2 px-3 text-gray-900 dark:text-white'>
                                                {range.min} - {range.max}
                                            </td>
                                            <td className='py-2 px-3 text-gray-900 dark:text-white'>{range.gpa.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 1: Calculate Current GPA */}
            <div id='calculate-gpa' className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "1. Tính GPA hiện tại" : "1. Calculate Current GPA"}</h2>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>{locale === "vi" ? "Nhập danh sách các môn học của bạn để tính GPA tổng" : "Enter your course list to calculate your cumulative GPA"}</p>

                <div className='space-y-4'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b-2 border-gray-300 dark:border-gray-600'>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Tên môn học" : "Course Name"}</th>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Điểm (thang 10)" : "Grade (10 scale)"}</th>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Tín chỉ" : "Credits"}</th>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>GPA (4.0)</th>
                                    <th className='py-3 px-2'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className='border-b border-gray-200 dark:border-gray-700'>
                                        <td className='py-2 px-2'>
                                            <input type='text' value={course.name} onChange={(e) => updateCourse(course.id, "name", e.target.value)} placeholder={locale === "vi" ? "Nhập tên môn" : "Enter course name"} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                                        </td>
                                        <td className='py-2 px-2'>
                                            <input type='number' step='0.1' min='0' max={currentSystem.scale} value={course.grade || ""} onChange={(e) => updateCourse(course.id, "grade", parseFloat(e.target.value) || 0)} placeholder='0.0' className='w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                                        </td>
                                        <td className='py-2 px-2'>
                                            <input type='number' min='0' max='10' value={course.credits || ""} onChange={(e) => updateCourse(course.id, "credits", parseInt(e.target.value) || 0)} placeholder='0' className='w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                                        </td>
                                        <td className='py-2 px-2 font-medium text-blue-600 dark:text-blue-400'>{course.grade > 0 ? gradeToGPA(course.grade).toFixed(1) : "-"}</td>
                                        <td className='py-2 px-2'>
                                            <button onClick={() => removeCourse(course.id)} disabled={courses.length === 1} className='p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex gap-3'>
                        <button onClick={addCourse} className='flex-1 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                            </svg>
                            {locale === "vi" ? "Thêm môn học" : "Add Course"}
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className='py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                            </svg>
                            {locale === "vi" ? "Import Excel" : "Import Excel"}
                        </button>
                        <input ref={fileInputRef} type='file' accept='.csv,.xlsx,.xls' onChange={(e) => handleFileImport(e, false)} className='hidden' />
                    </div>

                    {/* Results */}
                    <div className='mt-6 p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "Kết quả" : "Results"}</h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg'>
                                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>GPA (4.0)</div>
                                <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>{gpaResult.gpa.toFixed(2)}</div>
                            </div>
                            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg'>
                                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "Tổng tín chỉ" : "Total Credits"}</div>
                                <div className='text-3xl font-bold text-purple-600 dark:text-purple-400'>{gpaResult.totalCredits}</div>
                            </div>
                            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg'>
                                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "Xếp loại" : "Classification"}</div>
                                <div className='text-xl font-bold text-green-600 dark:text-green-400'>{locale === "vi" ? gpaResult.classificationVi : gpaResult.classification}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Predict Target GPA */}
            <div id='predict-gpa' className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "2. Dự đoán GPA mục tiêu" : "2. Predict Target GPA"}</h2>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>{locale === "vi" ? "Tính điểm trung bình cần đạt để đạt được GPA mục tiêu" : "Calculate the average grade needed to achieve your target GPA"}</p>

                <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "GPA hiện tại (thang 4.0)" : "Current GPA (4.0 scale)"}</label>
                            <input type='number' step='0.01' min='0' max='4' value={prediction.currentGPA || ""} onChange={(e) => setPrediction({ ...prediction, currentGPA: parseFloat(e.target.value) || 0 })} placeholder='3.50' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "Số tín chỉ đã học" : "Current Credits"}</label>
                            <input type='number' min='0' value={prediction.currentCredits || ""} onChange={(e) => setPrediction({ ...prediction, currentCredits: parseInt(e.target.value) || 0 })} placeholder='60' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "GPA mục tiêu (thang 4.0)" : "Target GPA (4.0 scale)"}</label>
                            <input type='number' step='0.01' min='0' max='4' value={prediction.targetGPA || ""} onChange={(e) => setPrediction({ ...prediction, targetGPA: parseFloat(e.target.value) || 0 })} placeholder='3.80' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "Số tín chỉ còn lại" : "Remaining Credits"}</label>
                            <input type='number' min='0' value={prediction.remainingCredits || ""} onChange={(e) => setPrediction({ ...prediction, remainingCredits: parseInt(e.target.value) || 0 })} placeholder='60' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                    </div>

                    {prediction.currentCredits > 0 && prediction.remainingCredits > 0 && (
                        <div className={`p-6 rounded-xl ${predictionResult.isAchievable ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>{locale === "vi" ? "Kết quả dự đoán" : "Prediction Result"}</h3>
                            {predictionResult.isAchievable && (
                                <div className='mb-4'>
                                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "Điểm trung bình cần đạt (thang 4.0)" : "Required Average GPA (4.0 scale)"}</div>
                                    <div className='text-4xl font-bold text-green-600 dark:text-green-400'>{predictionResult.requiredAverage.toFixed(2)}</div>
                                </div>
                            )}
                            <p className='text-gray-700 dark:text-gray-300'>{locale === "vi" ? predictionResult.messageVi : predictionResult.message}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3: Simulate Scenario */}
            <div id='simulate-gpa' className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "3. Mô phỏng kịch bản" : "3. Simulate Scenario"}</h2>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>{locale === "vi" ? "Nhập GPA hiện tại và thêm các môn dự kiến để xem GPA thay đổi như thế nào" : "Enter your current GPA and add expected courses to see how your GPA will change"}</p>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "GPA hiện tại (thang 4.0)" : "Current GPA (4.0 scale)"}</label>
                            <input type='number' step='0.01' min='0' max='4' value={simCurrentGPA || ""} onChange={(e) => setSimCurrentGPA(parseFloat(e.target.value) || 0)} placeholder='3.50' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "Số tín chỉ đã học" : "Current Credits"}</label>
                            <input type='number' min='0' value={simCurrentCredits || ""} onChange={(e) => setSimCurrentCredits(parseInt(e.target.value) || 0)} placeholder='60' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>
                    </div>

                    <h4 className='font-medium text-gray-900 dark:text-white mb-3'>{locale === "vi" ? "Thêm các môn dự kiến:" : "Add Expected Courses:"}</h4>

                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b-2 border-gray-300 dark:border-gray-600'>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Tên môn" : "Course"}</th>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Điểm dự kiến (thang 10)" : "Expected Grade (10 scale)"}</th>
                                    <th className='py-3 px-2 text-left text-sm font-medium text-gray-900 dark:text-white'>{locale === "vi" ? "Tín chỉ" : "Credits"}</th>
                                    <th className='py-3 px-2'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {simulationCourses.map((course) => (
                                    <tr key={course.id} className='border-b border-gray-200 dark:border-gray-700'>
                                        <td className='py-2 px-2'>
                                            <input type='text' value={course.name} onChange={(e) => updateSimulationCourse(course.id, "name", e.target.value)} placeholder={locale === "vi" ? "Nhập tên môn" : "Course name"} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500' />
                                        </td>
                                        <td className='py-2 px-2'>
                                            <input type='number' step='0.1' min='0' max={currentSystem.scale} value={course.grade || ""} onChange={(e) => updateSimulationCourse(course.id, "grade", parseFloat(e.target.value) || 0)} className='w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500' />
                                        </td>
                                        <td className='py-2 px-2'>
                                            <input type='number' min='0' value={course.credits || ""} onChange={(e) => updateSimulationCourse(course.id, "credits", parseInt(e.target.value) || 0)} className='w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500' />
                                        </td>
                                        <td className='py-2 px-2'>
                                            <button onClick={() => removeSimulationCourse(course.id)} disabled={simulationCourses.length === 1} className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'>
                                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex gap-3'>
                        <button onClick={addSimulationCourse} className='flex-1 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                            </svg>
                            {locale === "vi" ? "Thêm môn" : "Add Course"}
                        </button>
                        <button onClick={() => simFileInputRef.current?.click()} className='py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                            </svg>
                            {locale === "vi" ? "Import Excel" : "Import Excel"}
                        </button>
                        <input ref={simFileInputRef} type='file' accept='.csv,.xlsx,.xls' onChange={(e) => handleFileImport(e, true)} className='hidden' />
                    </div>

                    {simCurrentGPA > 0 && simCurrentCredits > 0 && (
                        <div className='mt-6 p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "GPA dự kiến sau kỳ" : "Projected GPA"}</h3>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "GPA hiện tại (4.0)" : "Current GPA (4.0)"}</div>
                                    <div className='text-2xl font-bold text-gray-700 dark:text-gray-300'>{simCurrentGPA.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "GPA dự kiến (4.0)" : "Projected GPA (4.0)"}</div>
                                    <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>{simulationResult.projectedGPA.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 4: Grade Converter */}
            <div id='grade-converter' className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "4. Chuyển đổi điểm - Thang 10 ⇄ Thang 4.0" : "4. Grade Converter - 10 Scale ⇄ 4.0 Scale"}</h2>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>{locale === "vi" ? "Chuyển đổi nhanh giữa thang điểm 10 và thang GPA 4.0" : "Quick conversion between 10-point scale and 4.0 GPA scale"}</p>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* 10 to 4.0 Converter */}
                    <div className='space-y-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "Thang 10 → Thang 4.0" : "10 Scale → 4.0 Scale"}</h3>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "Nhập điểm (thang 10)" : "Enter Grade (10 scale)"}</label>
                                    <input type='number' step='0.1' min='0' max={currentSystem.scale} value={gradeInput || ""} onChange={(e) => setGradeInput(parseFloat(e.target.value) || 0)} placeholder='8.5' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                                </div>
                                {convertedGPA && (
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-center py-2'>
                                            <svg className='w-6 h-6 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                                            </svg>
                                        </div>
                                        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-500'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "GPA (Thang 4.0)" : "GPA (4.0 Scale)"}</div>
                                            <div className='text-4xl font-bold text-blue-600 dark:text-blue-400'>{convertedGPA.gpa.toFixed(1)}</div>
                                            <div className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                                {locale === "vi" ? "Điểm chữ:" : "Letter Grade:"} <span className='font-semibold'>{convertedGPA.letter}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4.0 to 10 Converter */}
                    <div className='space-y-4'>
                        <div className='bg-green-50 dark:bg-green-900/20 p-6 rounded-xl'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "Thang 4.0 → Thang 10" : "4.0 Scale → 10 Scale"}</h3>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-900 dark:text-white mb-2'>{locale === "vi" ? "Nhập GPA (thang 4.0)" : "Enter GPA (4.0 scale)"}</label>
                                    <input type='number' step='0.1' min='0' max='4' value={gpaInput || ""} onChange={(e) => setGpaInput(parseFloat(e.target.value) || 0)} placeholder='3.5' className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent' />
                                </div>
                                {convertedGrade && (
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-center py-2'>
                                            <svg className='w-6 h-6 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                                            </svg>
                                        </div>
                                        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-green-500'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{locale === "vi" ? "Khoảng điểm (Thang 10)" : "Grade Range (10 Scale)"}</div>
                                            <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                                                {convertedGrade.min.toFixed(1)} - {convertedGrade.max.toFixed(1)}
                                            </div>
                                            <div className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                                {locale === "vi" ? "Điểm chữ:" : "Letter Grade:"} <span className='font-semibold'>{convertedGrade.letter}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Reference Table */}
                <div className='mt-8'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>{locale === "vi" ? "Bảng tra cứu nhanh" : "Quick Reference Table"}</h3>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg'>
                            <thead className='bg-gray-100 dark:bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>{locale === "vi" ? "Điểm chữ" : "Letter"}</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>{locale === "vi" ? "Thang 10" : "10 Scale"}</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>{locale === "vi" ? "GPA (4.0)" : "GPA (4.0)"}</th>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>{locale === "vi" ? "Xếp loại" : "Classification"}</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-700 dark:text-gray-300'>
                                {currentSystem.ranges.map((range, index) => {
                                    let classification = "";
                                    let classificationVi = "";

                                    if (range.gpa >= 3.6) {
                                        classification = "Excellent";
                                        classificationVi = "Xuất sắc";
                                    } else if (range.gpa >= 3.2) {
                                        classification = "Good";
                                        classificationVi = "Giỏi";
                                    } else if (range.gpa >= 2.5) {
                                        classification = "Fair";
                                        classificationVi = "Khá";
                                    } else if (range.gpa >= 2.0) {
                                        classification = "Average";
                                        classificationVi = "Trung bình";
                                    } else {
                                        classification = "Weak";
                                        classificationVi = "Yếu";
                                    }

                                    return (
                                        <tr key={index} className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                                            <td className='px-4 py-3 font-semibold'>{range.letter || "-"}</td>
                                            <td className='px-4 py-3 text-center'>
                                                {range.min.toFixed(1)} - {range.max.toFixed(1)}
                                            </td>
                                            <td className='px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400'>{range.gpa.toFixed(1)}</td>
                                            <td className='px-4 py-3'>{locale === "vi" ? classificationVi : classification}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
