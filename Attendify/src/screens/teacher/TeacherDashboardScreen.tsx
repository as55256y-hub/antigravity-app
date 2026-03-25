// Teacher Dashboard Screen - Sophisticated Teal & Gold Luxury Theme

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
import { useTheme } from '../../context/ThemeContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { formatRemainingTime, isQRExpired } from '../../utils/helpers';

const TeacherDashboardScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const { qrCodes, getActiveQRCodes, isLoading } = useAttendance();
    const { isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    // Sophisticated Teal & Gold Luxury Color Palette
    const colors = {
        background: '#1A1A1A',
        surface: '#2C2C2C',
        surfaceLight: '#3A3A3A',
        primary: '#4F7C82',
        accent: '#D4AF37',
        copper: '#A05E3C',
        forestGreen: '#1F4529',
        text: '#FFF8DC',
        textSecondary: '#C0C0C0',
        textMuted: '#8A8A8A',
    };

    const activeQRCodes = getActiveQRCodes();
    const totalScanned = qrCodes.filter(qr => qr.teacherId === user?.id)
        .reduce((sum, qr) => sum + qr.scannedCount, 0);

    // Update QR codes every second to refresh countdown
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate(n => n + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome,</Text>
                        <Text style={[styles.teacherName, { color: colors.text }]}>{user?.name}</Text>
                        <Text style={[styles.yearText, { color: colors.textMuted }]}>
                            {user?.teachingYear || 'Faculty'}
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.avatarText, { color: colors.copper }]}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.logoutButton, { borderColor: colors.accent }]}
                            onPress={logout}
                        >
                            <Ionicons name="log-out-outline" size={20} color={colors.accent} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Banner Section - Teal to Forest Green Gradient */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <View style={styles.bannerContent}>
                            <View style={[styles.qrIconCircle, { borderColor: colors.accent }]}>
                                <Ionicons name="qr-code-outline" size={32} color={colors.accent} />
                            </View>
                            <View style={styles.bannerText}>
                                <Text style={styles.bannerTitle}>Generate QR Code</Text>
                                <Text style={styles.bannerSubtitle}>Create a new attendance session</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: colors.accent + '30' }]}>
                            <Ionicons name="qr-code" size={24} color={colors.accent} />
                        </View>
                        <Text style={[styles.statNumber, { color: colors.text }]}>{activeQRCodes.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active QR</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: colors.copper + '30' }]}>
                            <Ionicons name="people" size={24} color={colors.copper} />
                        </View>
                        <Text style={[styles.statNumber, { color: colors.text }]}>{totalScanned}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Scans</Text>
                    </View>
                </View>

                {/* Quick Actions - Neumorphic Cards */}
                <View style={styles.quickActions}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: colors.surface }]}
                            onPress={() => navigation.navigate('ActiveQR')}
                        >
                            <View style={[styles.actionIconContainer, { borderColor: colors.primary }]}>
                                <Ionicons name="list" size={24} color={colors.primary} />
                            </View>
                            <Text style={[styles.actionText, { color: colors.text }]}>Active QR Codes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: colors.surface }]}
                            onPress={() => navigation.navigate('Reports')}
                        >
                            <View style={[styles.actionIconContainer, { borderColor: colors.accent }]}>
                                <Ionicons name="document-text" size={24} color={colors.accent} />
                            </View>
                            <Text style={[styles.actionText, { color: colors.text }]}>View Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Active QR Codes */}
                {activeQRCodes.length > 0 && (
                    <View style={styles.recentSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active QR Codes</Text>
                        {activeQRCodes.slice(0, 3).map((qr) => {
                            const isExpiringSoon = (qr.expiresAt - Date.now()) < 5 * 60 * 1000; // Less than 5 minutes
                            return (
                                <View key={qr.id} style={[styles.qrCard, { backgroundColor: colors.surface }]}>
                                    <View style={styles.qrInfo}>
                                        <Text style={[styles.qrSubject, { color: colors.text }]}>{qr.subject}</Text>
                                        <Text style={[styles.qrClass, { color: colors.textSecondary }]}>{qr.className}</Text>
                                        <View style={styles.qrMeta}>
                                            <Ionicons
                                                name="time-outline"
                                                size={14}
                                                color={isExpiringSoon ? '#E57373' : colors.accent}
                                            />
                                            <Text style={[
                                                styles.qrTime,
                                                { color: isExpiringSoon ? '#E57373' : colors.accent }
                                            ]}>
                                                {formatRemainingTime(qr.expiresAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.qrStats, { backgroundColor: colors.accent + '20' }]}>
                                        <Text style={[styles.scanCount, { color: colors.accent }]}>{qr.scannedCount}</Text>
                                        <Text style={[styles.scanLabel, { color: colors.accent }]}>scans</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Empty State - Neumorphic */}
                {activeQRCodes.length === 0 && (
                    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="qr-code-outline" size={48} color={colors.accent} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Active QR Codes</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Generate a new QR code to start taking attendance
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <View style={[styles.navIconActive, { backgroundColor: colors.primary + '30' }]}>
                        <Ionicons name="grid" size={22} color={colors.accent} />
                    </View>
                    <Text style={[styles.navTextActive, { color: colors.accent }]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GenerateQR')}>
                    <Ionicons name="add-circle-outline" size={22} color={colors.textMuted} />
                    <Text style={[styles.navText, { color: colors.textMuted }]}>Generate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name="person-outline" size={22} color={colors.textMuted} />
                    <Text style={[styles.navText, { color: colors.textMuted }]}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        color: '#FFF8DC',
        fontFamily: 'serif',
        marginBottom: SPACING.xs,
    },
    greeting: {
        fontSize: FONT_SIZES.body,
    },
    teacherName: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
    },
    yearText: {
        fontSize: FONT_SIZES.bodySmall,
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    profileAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#A05E3C',
    },
    avatarText: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
    },
    logoutButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        marginBottom: SPACING.lg,
    },
    banner: {
        backgroundColor: '#4F7C82',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        overflow: 'hidden',
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    bannerText: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    bannerTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: '#FFF8DC',
    },
    bannerSubtitle: {
        fontSize: FONT_SIZES.bodySmall,
        color: '#C0C0C0',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statNumber: {
        fontSize: FONT_SIZES.h1,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: FONT_SIZES.caption,
        marginTop: SPACING.xs,
    },
    quickActions: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        marginBottom: SPACING.md,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    actionCard: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    actionText: {
        fontSize: FONT_SIZES.bodySmall,
        fontWeight: '600',
    },
    recentSection: {
        marginBottom: SPACING.lg,
    },
    qrCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    qrInfo: {
        flex: 1,
    },
    qrSubject: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    qrClass: {
        fontSize: FONT_SIZES.bodySmall,
        marginTop: 2,
    },
    qrMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
        gap: 4,
    },
    qrTime: {
        fontSize: FONT_SIZES.caption,
        fontWeight: '500',
    },
    qrStats: {
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.sm,
        minWidth: 50,
    },
    scanCount: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
    },
    scanLabel: {
        fontSize: FONT_SIZES.caption,
    },
    emptyState: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: FONT_SIZES.body,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.1)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navIconActive: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTextActive: {
        fontSize: FONT_SIZES.caption,
        fontWeight: '600',
    },
    navText: {
        fontSize: FONT_SIZES.caption,
    },
});

export default TeacherDashboardScreen;