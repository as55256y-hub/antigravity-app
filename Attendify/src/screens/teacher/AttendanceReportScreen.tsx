// Attendance Report Screen

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { Attendance, QRCode } from '../../types';
import { format } from 'date-fns';

const AttendanceReportScreen = () => {
    const { user } = useAuth();
    const { qrCodes, attendances } = useAttendance();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
    const [filterDate, setFilterDate] = useState<string | null>(null);

    // Get teacher's QR codes
    const teacherQRCodes = useMemo(() => {
        return qrCodes.filter(qr => qr.teacherId === user?.id);
    }, [qrCodes, user]);

    // Get attendances for selected QR or all teacher QR codes
    const filteredAttendances = useMemo(() => {
        let filtered = attendances.filter(a =>
            teacherQRCodes.some(qr => qr.id === a.qrCodeId)
        );

        if (selectedQR) {
            filtered = filtered.filter(a => a.qrCodeId === selectedQR.id);
        }

        if (searchQuery) {
            filtered = filtered.filter(a =>
                a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => b.scannedAt - a.scannedAt);
    }, [attendances, teacherQRCodes, selectedQR, searchQuery]);

    // Stats
    const stats = useMemo(() => {
        const total = filteredAttendances.length;
        const uniqueStudents = new Set(filteredAttendances.map(a => a.studentId)).size;
        return { total, uniqueStudents };
    }, [filteredAttendances]);

    const renderAttendanceItem = ({ item }: { item: Attendance }) => (
        <View style={styles.attendanceCard}>
            <View style={styles.attendanceInfo}>
                <Text style={styles.studentName}>{item.studentName}</Text>
                <Text style={styles.rollNumber}>Roll: {item.rollNumber || 'N/A'}</Text>
                <Text style={styles.scanTime}>
                    {format(new Date(item.scannedAt), 'MMM dd, yyyy - hh:mm a')}
                </Text>
            </View>
            <View style={styles.presentBadge}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
                <Text style={styles.presentText}>Present</Text>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No Attendance Records</Text>
            <Text style={styles.emptyText}>
                {selectedQR
                    ? 'No students have scanned this QR code yet'
                    : 'Select a QR code to view attendance records'
                }
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search student by name or roll number"
                    placeholderTextColor={COLORS.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* QR Code Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                <TouchableOpacity
                    style={[styles.filterChip, !selectedQR && styles.filterChipActive]}
                    onPress={() => setSelectedQR(null)}
                >
                    <Text style={[styles.filterChipText, !selectedQR && styles.filterChipTextActive]}>
                        All
                    </Text>
                </TouchableOpacity>
                {teacherQRCodes.map((qr) => (
                    <TouchableOpacity
                        key={qr.id}
                        style={[styles.filterChip, selectedQR?.id === qr.id && styles.filterChipActive]}
                        onPress={() => setSelectedQR(qr)}
                    >
                        <Text style={[styles.filterChipText, selectedQR?.id === qr.id && styles.filterChipTextActive]}>
                            {qr.subject} ({qr.className})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.uniqueStudents}</Text>
                    <Text style={styles.statLabel}>Unique Students</Text>
                </View>
            </View>

            {/* Attendance List */}
            <FlatList
                data={filteredAttendances}
                renderItem={renderAttendanceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
            />

            {/* Export Button */}
            <TouchableOpacity style={styles.exportButton}>
                <Ionicons name="download-outline" size={20} color={COLORS.white} />
                <Text style={styles.exportButtonText}>Export to Excel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        margin: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
    },
    filterScroll: {
        maxHeight: 50,
    },
    filterContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        gap: SPACING.sm,
    },
    filterChip: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.round,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
    filterChipTextActive: {
        color: COLORS.white,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
    listContent: {
        padding: SPACING.lg,
        paddingTop: 0,
        flexGrow: 1,
    },
    attendanceCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    attendanceInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    rollNumber: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    scanTime: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textLight,
        marginTop: 2,
    },
    presentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    presentText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.secondary,
        fontWeight: '600',
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
    exportButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        margin: SPACING.lg,
        marginTop: 0,
    },
    exportButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});

export default AttendanceReportScreen;