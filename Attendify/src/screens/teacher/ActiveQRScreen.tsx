// Active QR Codes Screen

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAttendance } from '../../context/AttendanceContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { QRCode as QRCodeType } from '../../types';
import { formatRemainingTime, isQRExpired } from '../../utils/helpers';

const ActiveQRScreen = () => {
    const { qrCodes, getActiveQRCodes, deactivateQRCode, getAttendanceForQR } = useAttendance();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedQR, setSelectedQR] = useState<QRCodeType | null>(null);

    const activeQRCodes = getActiveQRCodes();

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleDeactivate = (qrId: string) => {
        Alert.alert(
            'Deactivate QR Code',
            'Are you sure you want to deactivate this QR code?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Deactivate',
                    style: 'destructive',
                    onPress: async () => {
                        await deactivateQRCode(qrId);
                        setSelectedQR(null);
                    },
                },
            ]
        );
    };

    const renderQRItem = ({ item }: { item: QRCodeType }) => {
        const attendance = getAttendanceForQR(item.id);
        const remainingTime = formatRemainingTime(item.expiresAt);
        const isExpired = isQRExpired(item.expiresAt);

        return (
            <TouchableOpacity
                style={styles.qrCard}
                onPress={() => setSelectedQR(item)}
            >
                <View style={styles.qrHeader}>
                    <View style={styles.qrInfo}>
                        <Text style={styles.qrSubject}>{item.subject}</Text>
                        <Text style={styles.qrClass}>{item.className}</Text>
                    </View>
                    <View style={[styles.statusBadge, !item.isActive && styles.statusBadgeInactive]}>
                        <Text style={styles.statusText}>
                            {isExpired ? 'Expired' : item.isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                <View style={styles.qrStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="people" size={20} color={COLORS.secondary} />
                        <Text style={styles.statValue}>{item.scannedCount}</Text>
                        <Text style={styles.statLabel}>Scanned</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="time" size={20} color={isExpired ? COLORS.error : COLORS.accent} />
                        <Text style={[styles.statValue, isExpired && styles.expiredText]}>
                            {remainingTime}
                        </Text>
                        <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                    {item.maxStudents && (
                        <View style={styles.statItem}>
                            <Ionicons name="person" size={20} color={COLORS.primary} />
                            <Text style={styles.statValue}>{item.maxStudents}</Text>
                            <Text style={styles.statLabel}>Max</Text>
                        </View>
                    )}
                </View>

                {item.isActive && !isExpired && (
                    <TouchableOpacity
                        style={styles.deactivateButton}
                        onPress={() => handleDeactivate(item.id)}
                    >
                        <Ionicons name="close-circle" size={18} color={COLORS.error} />
                        <Text style={styles.deactivateText}>Deactivate Early</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="qr-code-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No Active QR Codes</Text>
            <Text style={styles.emptyText}>
                Generate a new QR code to start taking attendance
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {selectedQR && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedQR(null)}
                        >
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>{selectedQR.subject}</Text>
                        <Text style={styles.modalSubtitle}>{selectedQR.className}</Text>

                        <View style={styles.qrCodeWrapper}>
                            <QRCode
                                value={selectedQR.token}
                                size={200}
                                backgroundColor={COLORS.white}
                                color={COLORS.text}
                            />
                        </View>

                        <View style={styles.modalStats}>
                            <View style={styles.modalStatItem}>
                                <Text style={styles.modalStatValue}>{selectedQR.scannedCount}</Text>
                                <Text style={styles.modalStatLabel}>Students Scanned</Text>
                            </View>
                            <View style={styles.modalStatItem}>
                                <Text style={styles.modalStatValue}>
                                    {formatRemainingTime(selectedQR.expiresAt)}
                                </Text>
                                <Text style={styles.modalStatLabel}>Time Remaining</Text>
                            </View>
                        </View>

                        {selectedQR.isActive && !isQRExpired(selectedQR.expiresAt) && (
                            <TouchableOpacity
                                style={styles.fullscreenButton}
                                onPress={() => {
                                    // In a real app, this would open full screen
                                    Alert.alert('Full Screen', 'QR Code displayed in full screen mode');
                                }}
                            >
                                <Ionicons name="expand" size={20} color={COLORS.white} />
                                <Text style={styles.fullscreenButtonText}>Display Full Screen</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            <FlatList
                data={activeQRCodes}
                renderItem={renderQRItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        padding: SPACING.lg,
        flexGrow: 1,
    },
    qrCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    qrHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    qrInfo: {
        flex: 1,
    },
    qrSubject: {
        fontSize: FONT_SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    qrClass: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: COLORS.secondary + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusBadgeInactive: {
        backgroundColor: COLORS.error + '20',
    },
    statusText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.secondary,
        fontWeight: '600',
    },
    qrStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.xs,
    },
    statLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
    expiredText: {
        color: COLORS.error,
    },
    deactivateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.sm,
        marginTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    deactivateText: {
        color: COLORS.error,
        fontSize: FONT_SIZES.bodySmall,
        fontWeight: '600',
        marginLeft: SPACING.xs,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.lg,
    },
    emptyText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        width: '85%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        padding: SPACING.sm,
    },
    modalTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalSubtitle: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    qrCodeWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginVertical: SPACING.lg,
    },
    modalStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: SPACING.lg,
    },
    modalStatItem: {
        alignItems: 'center',
    },
    modalStatValue: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    modalStatLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
    fullscreenButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    fullscreenButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});

export default ActiveQRScreen;