// Student Dashboard Screen

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

const StudentDashboardScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const { attendances, getStudentAttendance, qrCodes } = useAttendance();
    const [refreshing, setRefreshing] = useState(false);

    const myAttendance = useMemo(() => {
        return getStudentAttendance(user?.id || '');
    }, [attendances, user]);

    const stats = useMemo(() => {
        const total = myAttendance.length;
        const uniqueSubjects = new Set(
            myAttendance.map(a => {
                const qr = qrCodes.find(q => q.id === a.qrCodeId);
                return qr?.subject || 'Unknown';
            })
        ).size;

        return {
            total,
            uniqueSubjects,
        };
    }, [myAttendance, qrCodes]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Get recent attendance
    const recentAttendance = useMemo(() => {
        return myAttendance
            .sort((a, b) => b.scannedAt - a.scannedAt)
            .slice(0, 5);
    }, [myAttendance]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.studentName}>{user?.name}</Text>
                    <Text style={styles.rollNumber}>Roll: {user?.rollNumber || 'N/A'}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={32} color={COLORS.secondary} />
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total Present</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="book" size={32} color={COLORS.primary} />
                    <Text style={styles.statNumber}>{stats.uniqueSubjects}</Text>
                    <Text style={styles.statLabel}>Subjects</Text>
                </View>
            </View>

            {/* Scan QR Button */}
            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => navigation.navigate('ScanQR')}
            >
                <View style={styles.scanButtonContent}>
                    <Ionicons name="scan" size={48} color={COLORS.white} />
                    <Text style={styles.scanButtonText}>Scan QR Code</Text>
                    <Text style={styles.scanButtonSubtext}>
                        Mark your attendance
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('MyAttendance')}
                    >
                        <Ionicons name="calendar" size={28} color={COLORS.primary} />
                        <Text style={styles.actionText}>My Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('ScanQR')}
                    >
                        <Ionicons name="scan" size={28} color={COLORS.secondary} />
                        <Text style={styles.actionText}>Scan QR</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Attendance */}
            {recentAttendance.length > 0 && (
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Recent Attendance</Text>
                    {recentAttendance.map((attendance) => {
                        const qr = qrCodes.find(q => q.id === attendance.qrCodeId);
                        return (
                            <View key={attendance.id} style={styles.attendanceCard}>
                                <View style={styles.attendanceInfo}>
                                    <Text style={styles.subjectText}>{qr?.subject || 'Unknown Subject'}</Text>
                                    <Text style={styles.classText}>{qr?.className || 'Unknown Class'}</Text>
                                </View>
                                <View style={styles.timeContainer}>
                                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.timeText}>
                                        {new Date(attendance.scannedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        padding: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    greeting: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
    },
    studentName: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    rollNumber: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    logoutButton: {
        padding: SPACING.sm,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.round,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: FONT_SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.sm,
    },
    statLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    scanButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    scanButtonContent: {
        alignItems: 'center',
    },
    scanButtonText: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: SPACING.md,
    },
    scanButtonSubtext: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.white,
        opacity: 0.8,
        marginTop: SPACING.xs,
    },
    quickActions: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionText: {
        fontSize: FONT_SIZES.bodySmall,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    recentSection: {
        marginBottom: SPACING.lg,
    },
    attendanceCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    attendanceInfo: {
        flex: 1,
    },
    subjectText: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    classText: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
});

export default StudentDashboardScreen;