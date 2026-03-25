// Teacher Dashboard Screen

import React, { useState, useEffect } from 'react';
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
import { formatRemainingTime, isQRExpired } from '../../utils/helpers';

const TeacherDashboardScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const { qrCodes, getActiveQRCodes, isLoading } = useAttendance();
    const [refreshing, setRefreshing] = useState(false);

    const activeQRCodes = getActiveQRCodes();
    const totalScanned = qrCodes.reduce((sum, qr) => sum + qr.scannedCount, 0);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

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
                    <Text style={styles.teacherName}>{user?.name}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="qr-code" size={32} color={COLORS.primary} />
                    <Text style={styles.statNumber}>{activeQRCodes.length}</Text>
                    <Text style={styles.statLabel}>Active QR Codes</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="people" size={32} color={COLORS.secondary} />
                    <Text style={styles.statNumber}>{totalScanned}</Text>
                    <Text style={styles.statLabel}>Total Scans</Text>
                </View>
            </View>

            {/* Generate QR Button */}
            <TouchableOpacity
                style={styles.generateButton}
                onPress={() => navigation.navigate('GenerateQR')}
            >
                <View style={styles.generateButtonContent}>
                    <Ionicons name="qr-code-outline" size={40} color={COLORS.white} />
                    <Text style={styles.generateButtonText}>Generate QR Code</Text>
                    <Text style={styles.generateButtonSubtext}>
                        Create a new attendance QR
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('ActiveQR')}
                    >
                        <Ionicons name="list" size={28} color={COLORS.primary} />
                        <Text style={styles.actionText}>Active QR Codes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('Reports')}
                    >
                        <Ionicons name="document-text" size={28} color={COLORS.secondary} />
                        <Text style={styles.actionText}>View Reports</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Active QR Codes */}
            {activeQRCodes.length > 0 && (
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Active QR Codes</Text>
                    {activeQRCodes.slice(0, 3).map((qr) => (
                        <View key={qr.id} style={styles.qrCard}>
                            <View style={styles.qrInfo}>
                                <Text style={styles.qrSubject}>{qr.subject}</Text>
                                <Text style={styles.qrClass}>{qr.className}</Text>
                                <View style={styles.qrMeta}>
                                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.qrTime}>
                                        {formatRemainingTime(qr.expiresAt)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.qrStats}>
                                <Text style={styles.scanCount}>{qr.scannedCount}</Text>
                                <Text style={styles.scanLabel}>scans</Text>
                            </View>
                        </View>
                    ))}
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
    teacherName: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
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
    generateButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    generateButtonContent: {
        alignItems: 'center',
    },
    generateButtonText: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: SPACING.md,
    },
    generateButtonSubtext: {
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
    qrCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
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
    qrInfo: {
        flex: 1,
    },
    qrSubject: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    qrClass: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    qrMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    qrTime: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.accent,
        marginLeft: 4,
        fontWeight: '500',
    },
    qrStats: {
        alignItems: 'center',
        backgroundColor: COLORS.secondary + '20',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.sm,
    },
    scanCount: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    scanLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.secondary,
    },
});

export default TeacherDashboardScreen;