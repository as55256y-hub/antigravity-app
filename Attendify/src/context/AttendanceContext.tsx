// Attendance Context for managing QR codes and attendance data

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRCode, Attendance, QRGenerationParams, ScanResult } from '../types';
import { generateQRToken, calculateExpiryTime, isQRExpired, parseQRToken, generateUniqueId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { MESSAGES } from '../constants';

interface AttendanceContextType {
    qrCodes: QRCode[];
    attendances: Attendance[];
    isLoading: boolean;
    generateQRCode: (params: QRGenerationParams) => Promise<QRCode | null>;
    deactivateQRCode: (qrId: string) => Promise<void>;
    scanQRCode: (token: string, studentLat?: number, studentLng?: number) => Promise<ScanResult>;
    getAttendanceForQR: (qrId: string) => Attendance[];
    getStudentAttendance: (studentId: string) => Attendance[];
    getActiveQRCodes: () => QRCode[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const QR_CODES_KEY = '@attendify_qr_codes';
const ATTENDANCES_KEY = '@attendify_attendances';

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDataFromStorage();
    }, []);

    // Clean up expired QR codes periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setQrCodes(prev =>
                prev.map(qr => ({
                    ...qr,
                    isActive: qr.isActive && !isQRExpired(qr.expiresAt)
                }))
            );
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const loadDataFromStorage = async () => {
        try {
            const qrCodesData = await AsyncStorage.getItem(QR_CODES_KEY);
            const attendancesData = await AsyncStorage.getItem(ATTENDANCES_KEY);

            if (qrCodesData) {
                const parsed = JSON.parse(qrCodesData);
                // Filter out expired QR codes
                setQrCodes(parsed.map((qr: QRCode) => ({
                    ...qr,
                    isActive: qr.isActive && !isQRExpired(qr.expiresAt)
                })));
            }

            if (attendancesData) {
                setAttendances(JSON.parse(attendancesData));
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveQRCodesToStorage = async (codes: QRCode[]) => {
        try {
            await AsyncStorage.setItem(QR_CODES_KEY, JSON.stringify(codes));
        } catch (error) {
            console.error('Error saving QR codes:', error);
        }
    };

    const saveAttendancesToStorage = async (records: Attendance[]) => {
        try {
            await AsyncStorage.setItem(ATTENDANCES_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('Error saving attendances:', error);
        }
    };

    const generateQRCode = useCallback(async (params: QRGenerationParams): Promise<QRCode | null> => {
        if (!user || user.role !== 'teacher') {
            return null;
        }

        try {
            const expiresAt = calculateExpiryTime(params.duration, params.customDuration);
            const token = generateQRToken(
                user.id,
                user.name,
                params.subject,
                params.className,
                expiresAt
            );

            const newQRCode: QRCode = {
                id: generateUniqueId(),
                teacherId: user.id,
                teacherName: user.name,
                subject: params.subject,
                className: params.className,
                createdAt: Date.now(),
                expiresAt,
                isActive: true,
                maxStudents: params.maxStudents,
                locationEnabled: params.locationEnabled,
                locationLat: params.locationLat,
                locationLng: params.locationLng,
                scannedCount: 0,
                token,
            };

            const updatedQRCodes = [...qrCodes, newQRCode];
            setQrCodes(updatedQRCodes);
            await saveQRCodesToStorage(updatedQRCodes);

            return newQRCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return null;
        }
    }, [user, qrCodes]);

    const deactivateQRCode = useCallback(async (qrId: string) => {
        const updatedQRCodes = qrCodes.map(qr =>
            qr.id === qrId ? { ...qr, isActive: false } : qr
        );
        setQrCodes(updatedQRCodes);
        await saveQRCodesToStorage(updatedQRCodes);
    }, [qrCodes]);

    const scanQRCode = useCallback(async (token: string, studentLat?: number, studentLng?: number): Promise<ScanResult> => {
        if (!user || user.role !== 'student') {
            return { success: false, message: MESSAGES.UNKNOWN_ERROR };
        }

        try {
            // Parse the QR token
            const parsed = parseQRToken(token);
            if (!parsed) {
                return { success: false, message: MESSAGES.INVALID_QR };
            }

            // Find the QR code in storage
            const qrCode = qrCodes.find(qr => qr.token === token);

            if (!qrCode) {
                return { success: false, message: MESSAGES.INVALID_QR };
            }

            // Check if QR is active
            if (!qrCode.isActive) {
                return { success: false, message: MESSAGES.QR_EXPIRED };
            }

            // Check if QR is expired
            if (isQRExpired(qrCode.expiresAt)) {
                return { success: false, message: MESSAGES.QR_EXPIRED };
            }

            // Check max students limit
            if (qrCode.maxStudents && qrCode.scannedCount >= qrCode.maxStudents) {
                return { success: false, message: 'Maximum students limit reached' };
            }

            // Check location if enabled
            if (qrCode.locationEnabled && qrCode.locationLat && qrCode.locationLng && studentLat && studentLng) {
                const distance = Math.sqrt(
                    Math.pow(studentLat - qrCode.locationLat, 2) +
                    Math.pow(studentLng - qrCode.locationLng, 2)
                );
                // Simple distance check (in degrees, simplified)
                if (distance > 0.01) { // Roughly 1km
                    return { success: false, message: MESSAGES.OUT_OF_RANGE };
                }
            }

            // Check if already marked
            const existingAttendance = attendances.find(
                a => a.qrCodeId === qrCode.id && a.studentId === user.id
            );

            if (existingAttendance) {
                return { success: false, message: MESSAGES.ALREADY_MARKED };
            }

            // Create attendance record
            const newAttendance: Attendance = {
                id: generateUniqueId(),
                qrCodeId: qrCode.id,
                studentId: user.id,
                studentName: user.name,
                rollNumber: user.rollNumber || '',
                scannedAt: Date.now(),
            };

            const updatedAttendances = [...attendances, newAttendance];
            setAttendances(updatedAttendances);
            await saveAttendancesToStorage(updatedAttendances);

            // Update QR code scanned count
            const updatedQRCodes = qrCodes.map(qr =>
                qr.id === qrCode.id ? { ...qr, scannedCount: qr.scannedCount + 1 } : qr
            );
            setQrCodes(updatedQRCodes);
            await saveQRCodesToStorage(updatedQRCodes);

            return {
                success: true,
                message: MESSAGES.ATTENDANCE_MARKED,
                qrCode: qrCode,
            };
        } catch (error) {
            console.error('Error scanning QR code:', error);
            return { success: false, message: MESSAGES.UNKNOWN_ERROR };
        }
    }, [user, qrCodes, attendances]);

    const getAttendanceForQR = useCallback((qrId: string): Attendance[] => {
        return attendances.filter(a => a.qrCodeId === qrId);
    }, [attendances]);

    const getStudentAttendance = useCallback((studentId: string): Attendance[] => {
        return attendances.filter(a => a.studentId === studentId);
    }, [attendances]);

    const getActiveQRCodes = useCallback((): QRCode[] => {
        return qrCodes.filter(qr => qr.isActive && !isQRExpired(qr.expiresAt));
    }, [qrCodes]);

    return (
        <AttendanceContext.Provider
            value={{
                qrCodes,
                attendances,
                isLoading,
                generateQRCode,
                deactivateQRCode,
                scanQRCode,
                getAttendanceForQR,
                getStudentAttendance,
                getActiveQRCodes,
            }}
        >
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendance = (): AttendanceContextType => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
};