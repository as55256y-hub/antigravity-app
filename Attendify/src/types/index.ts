// Type definitions for Attendify

export type UserRole = 'teacher' | 'student';

export interface User {
    id: string;
    email: string;
    phone: string;
    role: UserRole;
    name: string;
    department: string;
    institution: string;
    rollNumber?: string;
    studentId?: string;
    photoUrl?: string;
    teachingYear?: string;
    createdAt: number;
}

export interface QRCode {
    id: string;
    teacherId: string;
    teacherName: string;
    subject: string;
    className: string;
    createdAt: number;
    expiresAt: number;
    isActive: boolean;
    maxStudents?: number;
    locationEnabled: boolean;
    locationLat?: number;
    locationLng?: number;
    scannedCount: number;
    token: string;
}

export interface Attendance {
    id: string;
    qrCodeId: string;
    studentId: string;
    studentName: string;
    rollNumber: string;
    scannedAt: number;
    deviceId?: string;
}

export interface AttendanceStats {
    totalPresent: number;
    totalAbsent: number;
    percentage: number;
}

export type DurationOption =
    | '1hour'
    | '2hours'
    | '4hours'
    | '1day'
    | '2days'
    | 'custom';

export interface QRGenerationParams {
    subject: string;
    className: string;
    duration: DurationOption;
    customDuration?: number; // in minutes
    maxStudents?: number;
    locationEnabled: boolean;
    locationLat?: number;
    locationLng?: number;
}

export interface ScanResult {
    success: boolean;
    message: string;
    qrCode?: QRCode;
}