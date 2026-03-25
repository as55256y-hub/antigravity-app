// Generate QR Code Screen - Auto-generates unique QR codes

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, DURATION_OPTIONS } from '../../constants';
import { DurationOption, QRGenerationParams } from '../../types';
import { formatRemainingTime, generateUniqueId } from '../../utils/helpers';

const GenerateQRScreen = ({ navigation }: any) => {
    const { generateQRCode, qrCodes } = useAttendance();
    const { user } = useAuth();
    const [duration, setDuration] = useState<DurationOption>('1hour');
    const [customMinutes, setCustomMinutes] = useState('');
    const [maxStudents, setMaxStudents] = useState('');
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [generatedQR, setGeneratedQR] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [sessionNote, setSessionNote] = useState('');

    // Generate unique session ID
    const generateSessionId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        return `SESSION_${timestamp}_${random}`.toUpperCase();
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Auto-generate unique subject and class based on session
            const sessionId = generateSessionId();
            const sessionLabel = sessionNote.trim() || `Session ${new Date().toLocaleTimeString()}`;

            const params: QRGenerationParams = {
                subject: sessionLabel, // Use session note as subject
                className: user?.teachingYear || 'General', // Use teaching year as class
                duration,
                customDuration: duration === 'custom' ? parseInt(customMinutes, 10) : undefined,
                maxStudents: maxStudents ? parseInt(maxStudents, 10) : undefined,
                locationEnabled,
            };

            const qrCode = await generateQRCode(params);
            if (qrCode) {
                setGeneratedQR(qrCode);
                Alert.alert('Success', 'Unique QR Code generated successfully!');
            } else {
                Alert.alert('Error', 'Failed to generate QR Code');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setIsGenerating(false);
        }
    };

    // Get total QR codes generated
    const totalGenerated = qrCodes.filter(qr => qr.teacherId === user?.id).length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {!generatedQR ? (
                <>
                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                        <Text style={styles.infoText}>
                            Each QR code generated is unique and cannot be repeated.
                            The system automatically creates a unique session identifier.
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{totalGenerated}</Text>
                            <Text style={styles.statLabel}>Total QR Generated</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{user?.teachingYear || 'N/A'}</Text>
                            <Text style={styles.statLabel}>Your Year</Text>
                        </View>
                    </View>

                    {/* Session Note */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Session Label (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={sessionNote}
                            onChangeText={setSessionNote}
                            placeholder="e.g., Morning Class, Lab Session, etc."
                            placeholderTextColor={COLORS.textLight}
                        />
                        <Text style={styles.hintText}>
                            This will help you identify the session later
                        </Text>
                    </View>

                    {/* Duration Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Duration *</Text>
                        <View style={styles.durationGrid}>
                            {DURATION_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.durationButton, duration === option.value && styles.durationButtonActive]}
                                    onPress={() => setDuration(option.value as DurationOption)}
                                >
                                    <Text style={[styles.durationText, duration === option.value && styles.durationTextActive]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Custom Duration Input */}
                    {duration === 'custom' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Custom Duration (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={customMinutes}
                                onChangeText={setCustomMinutes}
                                placeholder="Enter minutes"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="numeric"
                            />
                        </View>
                    )}

                    {/* Optional Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Optional Settings</Text>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Max Students</Text>
                            <TextInput
                                style={[styles.input, styles.smallInput]}
                                value={maxStudents}
                                onChangeText={setMaxStudents}
                                placeholder="No limit"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View>
                                <Text style={styles.settingLabel}>Location Restriction</Text>
                                <Text style={styles.settingHint}>Only allow scanning within campus</Text>
                            </View>
                            <Switch
                                value={locationEnabled}
                                onValueChange={setLocationEnabled}
                                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                                thumbColor={COLORS.white}
                            />
                        </View>
                    </View>

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={[styles.generateButton, isGenerating && styles.buttonDisabled]}
                        onPress={handleGenerate}
                        disabled={isGenerating}
                    >
                        <Ionicons name="qr-code" size={24} color={COLORS.white} />
                        <Text style={styles.generateButtonText}>
                            {isGenerating ? 'Generating Unique QR...' : 'Generate Unique QR Code'}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {/* Generated QR Display */}
                    <View style={styles.qrDisplayContainer}>
                        <View style={styles.uniqueBadge}>
                            <Ionicons name="checkmark-circle" size={16} color={COLORS.secondary} />
                            <Text style={styles.uniqueBadgeText}>Unique QR Generated</Text>
                        </View>

                        <Text style={styles.qrDisplayTitle}>QR Code Ready!</Text>
                        <View style={styles.qrCodeWrapper}>
                            <QRCode
                                value={generatedQR.token}
                                size={250}
                                backgroundColor={COLORS.white}
                                color={COLORS.text}
                            />
                        </View>
                        <View style={styles.qrDetails}>
                            <Text style={styles.qrDetailText}>Session: {generatedQR.subject}</Text>
                            <Text style={styles.qrDetailText}>Year: {generatedQR.className}</Text>
                            <Text style={styles.qrDetailText}>
                                Expires in: {formatRemainingTime(generatedQR.expiresAt)}
                            </Text>
                            <Text style={styles.qrDetailText}>
                                Unique ID: {generatedQR.id.substring(0, 8)}...
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => setGeneratedQR(null)}
                        >
                            <Ionicons name="refresh" size={20} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonText}>Generate New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('ActiveQR')}
                        >
                            <Ionicons name="list" size={20} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>View Active QR</Text>
                        </TouchableOpacity>
                    </View>
                </>
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
    infoCard: {
        backgroundColor: COLORS.primary + '15',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    infoText: {
        flex: 1,
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.primary,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
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
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    smallInput: {
        width: 120,
    },
    hintText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    durationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    durationButton: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    durationButtonActive: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    durationText: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.text,
    },
    durationTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    settingLabel: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
    },
    settingHint: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    generateButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    buttonDisabled: {
        backgroundColor: COLORS.primaryLight,
    },
    generateButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    qrDisplayContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    uniqueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        backgroundColor: COLORS.secondary + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.round,
        marginBottom: SPACING.md,
    },
    uniqueBadgeText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.secondary,
        fontWeight: '600',
    },
    qrDisplayTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: SPACING.lg,
    },
    qrCodeWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    qrDetails: {
        alignItems: 'center',
    },
    qrDetailText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.lg,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    primaryButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});

export default GenerateQRScreen;