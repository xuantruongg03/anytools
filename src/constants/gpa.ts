import type { GradeSystem } from "@/types/gpa";

export const GRADE_SYSTEMS: GradeSystem[] = [
    {
        id: "standard",
        name: "Standard System (7 Levels)",
        nameVi: "Khung A - Phổ biến (7 mức)",
        description: "Applied by most Vietnamese universities",
        descriptionVi: "Áp dụng cho đa số trường ĐH Việt Nam",
        scale: 10,
        passingGrade: 4.0,
        ranges: [
            { min: 8.5, max: 10.0, gpa: 4.0, letter: "A" },
            { min: 8.0, max: 8.4, gpa: 3.5, letter: "B+" },
            { min: 7.0, max: 7.9, gpa: 3.0, letter: "B" },
            { min: 6.5, max: 6.9, gpa: 2.5, letter: "C+" },
            { min: 5.5, max: 6.4, gpa: 2.0, letter: "C" },
            { min: 5.0, max: 5.4, gpa: 1.5, letter: "D+" },
            { min: 4.0, max: 4.9, gpa: 1.0, letter: "D" },
            { min: 0, max: 3.9, gpa: 0.0, letter: "F" },
        ],
    },
    {
        id: "detailed",
        name: "Detailed System (11 Levels)",
        nameVi: "Khung B - Chi tiết (11 mức)",
        description: "More detailed grade classification",
        descriptionVi: "Phân loại điểm chi tiết hơn",
        scale: 10,
        passingGrade: 4.0,
        ranges: [
            { min: 9.0, max: 10.0, gpa: 4.0, letter: "A" },
            { min: 8.5, max: 8.9, gpa: 3.7, letter: "A-" },
            { min: 8.0, max: 8.4, gpa: 3.3, letter: "B+" },
            { min: 7.5, max: 7.9, gpa: 3.0, letter: "B" },
            { min: 7.0, max: 7.4, gpa: 2.7, letter: "B-" },
            { min: 6.5, max: 6.9, gpa: 2.3, letter: "C+" },
            { min: 6.0, max: 6.4, gpa: 2.0, letter: "C" },
            { min: 5.5, max: 5.9, gpa: 1.7, letter: "C-" },
            { min: 5.0, max: 5.4, gpa: 1.3, letter: "D+" },
            { min: 4.0, max: 4.9, gpa: 1.0, letter: "D" },
            { min: 0, max: 3.9, gpa: 0.0, letter: "F" },
        ],
    },
    {
        id: "international",
        name: "International System (Scale 100)",
        nameVi: "Khung C - Thang 100 (Quốc tế)",
        description: "International grading scale",
        descriptionVi: "Thang điểm quốc tế",
        scale: 100,
        passingGrade: 60,
        ranges: [
            { min: 90, max: 100, gpa: 4.0, letter: "A" },
            { min: 85, max: 89, gpa: 3.5, letter: "B+" },
            { min: 80, max: 84, gpa: 3.0, letter: "B" },
            { min: 75, max: 79, gpa: 2.5, letter: "C+" },
            { min: 70, max: 74, gpa: 2.0, letter: "C" },
            { min: 65, max: 69, gpa: 1.5, letter: "D+" },
            { min: 60, max: 64, gpa: 1.0, letter: "D" },
            { min: 0, max: 59, gpa: 0.0, letter: "F" },
        ],
    },
];

export const CLASSIFICATION = {
    excellent: { min: 3.6, nameEn: "Excellent", nameVi: "Xuất sắc" },
    good: { min: 3.2, nameEn: "Good", nameVi: "Giỏi" },
    fair: { min: 2.5, nameEn: "Fair", nameVi: "Khá" },
    average: { min: 2.0, nameEn: "Average", nameVi: "Trung bình" },
    weak: { min: 0, nameEn: "Weak", nameVi: "Yếu" },
};

export const PROGRAM_CREDITS = {
    bachelor: { min: 120, max: 140, nameEn: "Bachelor (4 years)", nameVi: "Đại học (4 năm)" },
    college: { min: 90, max: 110, nameEn: "College (3 years)", nameVi: "Cao đẳng (3 năm)" },
    engineer: { min: 150, max: 180, nameEn: "Engineer (5 years)", nameVi: "Kỹ sư (5 năm)" },
    medical: { min: 180, max: 220, nameEn: "Medical (6 years)", nameVi: "Y dược (6 năm)" },
};
