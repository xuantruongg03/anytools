export type GradeSystemType = "standard" | "detailed" | "international" | "custom";

export interface GradeRange {
    min: number;
    max: number;
    gpa: number;
    letter?: string;
}

export interface GradeSystem {
    id: GradeSystemType;
    name: string;
    nameVi: string;
    description: string;
    descriptionVi: string;
    scale: number;
    ranges: GradeRange[];
    passingGrade: number;
}

export interface Course {
    id: string;
    name: string;
    grade: number;
    credits: number;
    gpa?: number;
}

export interface GPAResult {
    gpa: number;
    gpa10: number;
    totalCredits: number;
    totalGradePoints: number;
    classification: string;
    classificationVi: string;
}

export interface PredictionInput {
    currentGPA: number;
    currentCredits: number;
    targetGPA: number;
    remainingCredits: number;
}

export interface PredictionResult {
    requiredAverage: number;
    isAchievable: boolean;
    message: string;
    messageVi: string;
}
