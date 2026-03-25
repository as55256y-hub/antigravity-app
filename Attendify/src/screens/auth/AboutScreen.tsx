// About/Help Screen - College Information

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, COLLEGE_INFO } from '../../constants';

const AboutScreen = ({ navigation }: any) => {
    const handlePhonePress = () => {
        Linking.openURL(`tel:${COLLEGE_INFO.contact}`);
    };

    const handleWebsitePress = () => {
        Linking.openURL(`https://${COLLEGE_INFO.website}`);
    };

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${COLLEGE_INFO.email}`);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* College Logo Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="school" size={40} color={COLORS.accent} />
                    </View>
                </View>
                <Text style={styles.headerTitle}>Suryodaya College</Text>
                <Text style={styles.headerSubtitle}>Attendance Portal</Text>
            </View>

            {/* College Information Card */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>College Information</Text>

                <View style={styles.infoItem}>
                    <Ionicons name="business" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>College Name</Text>
                        <Text style={styles.infoValue}>{COLLEGE_INFO.name}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="location" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>{COLLEGE_INFO.address}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.infoItem} onPress={handlePhonePress}>
                    <Ionicons name="call" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Contact</Text>
                        <Text style={[styles.infoValue, styles.linkText]}>{COLLEGE_INFO.contact}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoItem} onPress={handleWebsitePress}>
                    <Ionicons name="globe" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Website</Text>
                        <Text style={[styles.infoValue, styles.linkText]}>{COLLEGE_INFO.website}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoItem} onPress={handleEmailPress}>
                    <Ionicons name="mail" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={[styles.infoValue, styles.linkText]}>{COLLEGE_INFO.email}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* App Information */}
            <View style={styles.appInfoCard}>
                <Text style={styles.sectionTitle}>App Information</Text>

                <View style={styles.infoItem}>
                    <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="code-slash" size={22} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Platform</Text>
                        <Text style={styles.infoValue}>React Native + Expo</Text>
                    </View>
                </View>
            </View>

            {/* Help & Support */}
            <View style={styles.helpCard}>
                <Text style={styles.sectionTitle}>Help & Support</Text>

                <TouchableOpacity style={styles.helpItem}>
                    <Ionicons name="help-circle" size={24} color={COLORS.accent} />
                    <Text style={styles.helpText}>FAQs</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpItem}>
                    <Ionicons name="document-text" size={24} color={COLORS.accent} />
                    <Text style={styles.helpText}>User Guide</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpItem}>
                    <Ionicons name="shield-checkmark" size={24} color={COLORS.accent} />
                    <Text style={styles.helpText}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpItem}>
                    <Ionicons name="document-attach" size={24} color={COLORS.accent} />
                    <Text style={styles.helpText}>Terms of Service</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Copyright */}
            <Text style={styles.copyright}>
                © 2024 Suryodaya College of Engineering & Technology{'\n'}
                All Rights Reserved
            </Text>
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
        alignItems: 'center',
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    logoContainer: {
        marginBottom: SPACING.md,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    headerTitle: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: SPACING.lg,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    infoLabel: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        fontWeight: '500',
    },
    linkText: {
        color: COLORS.primary,
    },
    appInfoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    helpCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    helpItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    helpText: {
        flex: 1,
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        marginLeft: SPACING.md,
    },
    copyright: {
        textAlign: 'center',
        fontSize: FONT_SIZES.caption,
        color: COLORS.textLight,
        marginTop: SPACING.lg,
        lineHeight: 20,
    },
});

export default AboutScreen;