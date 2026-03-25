// My Attendance Screen

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { format } from 'date-fns';

const MyAttendanceScreen = () => {
    const { user } = useAuth();
    const { attendances, qrCodes } = useAttendance();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const myAttendance = useMemo(() => {
        return attendances.filter(a => a.studentId === user?.id);
    }, [attendances, user]);

    // Generate marked dates for calendar
    const markedDates = useMemo(() => {
        const dates: { [key: string]: any } = {};
        myAttendance.forEach(attendance => {
            const date = format(new Date(attendance.scannedAt), 'yyyy-MM-dd');
            dates[date] = {
                marked: true,
                dotColor: COLORS.secondary,
                selected: date === selectedDate,
                selectedColor: COLORS.primary,
            };
        });

        // Add selected date if not already marked
        if (!dates[selectedDate]) {
            dates[selectedDate] = {
                selected: true,
                selectedColor: COLORS.primary,
            };
        }

        return dates;
    }, [myAttendance, selectedDate]);

    // Get attendances for selected date
    const selectedDateAttendance = useMemo(() => {
        return myAttendance.filter(a =>
            format(new Date(a.scannedAt), 'yyyy-MM-dd') === selectedDate
        );
    }, [myAttendance, selectedDate]);

    // Subject-wise stats
    const subjectStats = useMemo(() => {
        const stats: { [key: string]: number } = {};
        myAttendance.forEach(attendance => {
            const qr = qrCodes.find(q => q.id === attendance.qrCodeId);
            const subject = qr?.subject || 'Unknown';
            stats[subject] = (stats[subject] || 0) + 1;
        });
        return Object.entries(stats).map(([subject, count]) => ({
            subject,
            count,
            percentage: Math.round((count / myAttendance.length) * 100),
        }));
    }, [myAttendance, qrCodes]);

    // Overall stats
    const overallStats = useMemo(() => {
        const totalDays = new Set(
            myAttendance.map(a => format(new Date(a.scannedAt), 'yyyy-MM-dd'))
        ).size;

        return {
            totalDays,
            totalSessions: myAttendance.length,
            averagePerDay: totalDays > 0 ? Math.round(myAttendance.length / totalDays * 10) / 10 : 0,
        };
    }, [myAttendance]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Calendar */}
            <View style={styles.calendarContainer}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
                    markingType="dot"
                    theme={{
                        backgroundColor: COLORS.surface,
                        calendarBackground: COLORS.surface,
                        textSectionTitleColor: COLORS.textSecondary,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: COLORS.white,
                        todayTextColor: COLORS.primary,
                        dayTextColor: COLORS.text,
                        textDisabledColor: COLORS.textLight,
                        dotColor: COLORS.secondary,
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.text,
                        indicatorColor: COLORS.primary,
                    }}
                />
            </View>

            {/* Selected Date Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {format(new Date(selectedDate), 'MMMM dd, yyyy')}
                </Text>

                {selectedDateAttendance.length > 0 ? (
                    <View style={styles.attendanceList}>
                        {selectedDateAttendance.map((attendance) => {
                            const qr = qrCodes.find(q => q.id === attendance.qrCodeId);
                            return (
                                <View key={attendance.id} style={styles.attendanceCard}>
                                    <View style={styles.attendanceIcon}>
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
                                    </View>
                                    <View style={styles.attendanceInfo}>
                                        <Text style={styles.subjectText}>{qr?.subject || 'Unknown'}</Text>
                                        <Text style={styles.classText}>{qr?.className || 'Unknown'}</Text>
                                        <Text style={styles.timeText}>
                                            {format(new Date(attendance.scannedAt), 'hh:mm a')}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyDay}>
                        <Ionicons name="close-circle-outline" size={40} color={COLORS.textLight} />
                        <Text style={styles.emptyDayText}>No attendance marked</Text>
                    </View>
                )}
            </View>

            {/* Subject-wise Stats */}
            {subjectStats.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subject-wise Attendance</Text>
                    <View style={styles.statsCard}>
                        {subjectStats.map((stat, index) => (
                            <View key={index} style={styles.statRow}>
                                <Text style={styles.statSubject}>{stat.subject}</Text>
                                <View style={styles.statBarContainer}>
                                    <View style={[styles.statBar, { width: `${stat.percentage}%` }]} />
                                </View>
                                <Text style={styles.statCount}>{stat.count}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Overall Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Overall Statistics</Text>
                <View style={styles.overallStatsContainer}>
                    <View style={styles.overallStatCard}>
                        <Ionicons name="calendar" size={28} color={COLORS.primary} />
                        <Text style={styles.overallStatValue}>{overallStats.totalDays}</Text>
                        <Text style={styles.overallStatLabel}>Days Present</Text>
                    </View>
                    <View style={styles.overallStatCard}>
                        <Ionicons name="time" size={28} color={COLORS.secondary} />
                        <Text style={styles.overallStatValue}>{overallStats.totalSessions}</Text>
                        <Text style={styles.overallStatLabel}>Total Sessions</Text>
                    </View>
                    <View style={styles.overallStatCard}>
                        <Ionicons name="speedometer" size={28} color={COLORS.accent} />
                        <Text style={styles.overallStatValue}>{overallStats.averagePerDay}</Text>
                        <Text style={styles.overallStatLabel}>Avg/Day</Text>
                    </View>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
                    <Text style={styles.legendText}>Present</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.textLight }]} />
                    <Text style={styles.legendText}>Absent</Text>
                </View>
            </View>
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
    calendarContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    attendanceList: {
        gap: SPACING.sm,
    },
    attendanceCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    attendanceIcon: {
        backgroundColor: COLORS.secondary + '20',
        borderRadius: BORDER_RADIUS.round,
        padding: SPACING.sm,
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
    timeText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textLight,
        marginTop: 2,
    },
    emptyDay: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyDayText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    statsCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    statSubject: {
        width: 100,
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.text,
    },
    statBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: BORDER_RADIUS.round,
        marginHorizontal: SPACING.sm,
    },
    statBar: {
        height: '100%',
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.round,
    },
    statCount: {
        width: 30,
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'right',
    },
    overallStatsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    overallStatCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
    },
    overallStatValue: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.sm,
    },
    overallStatLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
});

export default MyAttendanceScreen;