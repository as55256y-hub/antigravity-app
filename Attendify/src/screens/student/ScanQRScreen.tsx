// Scan QR Screen

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAttendance } from '../../context/AttendanceContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MESSAGES } from '../../constants';

const { width } = Dimensions.get('window');

const ScanQRScreen = () => {
    const { scanQRCode } = useAttendance();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
    const [scaleAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (scanResult) {
            // Animate success/error feedback
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setScanResult(null);
                setScanned(false);
            });
        }
    }, [scanResult]);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);

        try {
            const result = await scanQRCode(data);
            setScanResult({
                success: result.success,
                message: result.message,
            });
        } catch (error) {
            setScanResult({
                success: false,
                message: MESSAGES.UNKNOWN_ERROR,
            });
        }
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={64} color={COLORS.textSecondary} />
                    <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to scan QR codes for attendance
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                {/* Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.headerOverlay}>
                        <Text style={styles.headerTitle}>Scan QR Code</Text>
                        <Text style={styles.headerSubtitle}>
                            Position the QR code within the frame
                        </Text>
                    </View>

                    {/* Scanning Frame */}
                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <View style={styles.footerOverlay}>
                        <View style={styles.instructionCard}>
                            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.instructionText}>
                                Make sure the QR code is clearly visible and well-lit
                            </Text>
                        </View>
                    </View>
                </View>
            </CameraView>

            {/* Result Overlay */}
            {scanResult && (
                <Animated.View
                    style={[
                        styles.resultOverlay,
                        {
                            transform: [{ scale: scaleAnim }],
                            backgroundColor: scanResult.success ? COLORS.secondary + 'F0' : COLORS.error + 'F0'
                        }
                    ]}
                >
                    <View style={styles.resultContent}>
                        <Ionicons
                            name={scanResult.success ? "checkmark-circle" : "close-circle"}
                            size={80}
                            color={COLORS.white}
                        />
                        <Text style={styles.resultTitle}>
                            {scanResult.success ? 'Success!' : 'Error'}
                        </Text>
                        <Text style={styles.resultMessage}>{scanResult.message}</Text>
                        {scanResult.success && (
                            <Text style={styles.resultSubtext}>
                                Your attendance has been marked
                            </Text>
                        )}
                    </View>
                </Animated.View>
            )}

            {/* Manual Entry Button */}
            <TouchableOpacity style={styles.manualButton}>
                <Ionicons name="keypad" size={24} color={COLORS.primary} />
                <Text style={styles.manualButtonText}>Enter Code Manually</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    headerOverlay: {
        paddingTop: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.body,
        color: COLORS.white,
        opacity: 0.8,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    scanFrame: {
        width: width * 0.7,
        height: width * 0.7,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: COLORS.white,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 8,
    },
    footerOverlay: {
        paddingBottom: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
    },
    instructionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    instructionText: {
        flex: 1,
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.text,
    },
    resultOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultContent: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    resultTitle: {
        fontSize: FONT_SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: SPACING.lg,
    },
    resultMessage: {
        fontSize: FONT_SIZES.h4,
        color: COLORS.white,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    resultSubtext: {
        fontSize: FONT_SIZES.body,
        color: COLORS.white,
        opacity: 0.8,
        marginTop: SPACING.sm,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    permissionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.lg,
        textAlign: 'center',
    },
    permissionText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    permissionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.lg,
    },
    permissionButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    manualButton: {
        position: 'absolute',
        bottom: SPACING.xxl,
        alignSelf: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.round,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    manualButtonText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});

export default ScanQRScreen;