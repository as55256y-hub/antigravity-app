// Login Screen with Theme Toggle and Share

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Share,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MESSAGES } from '../../constants';

const LoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic colors based on theme
    const colors = isDark ? darkColors : lightColors;

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email.trim(), password);
            if (!success) {
                Alert.alert('Error', MESSAGES.UNKNOWN_ERROR);
            }
        } catch (error) {
            Alert.alert('Error', MESSAGES.NETWORK_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Download Suryodaya College Attendance App - Track your attendance easily!',
                title: 'Suryodaya College Attendance App',
            });
        } catch (error) {
            Alert.alert('Error', 'Unable to share');
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header Actions */}
            <View style={styles.headerActions}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.surface }]}
                    onPress={toggleTheme}
                >
                    <Ionicons
                        name={isDark ? 'sunny' : 'moon'}
                        size={22}
                        color={colors.text}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.surface }]}
                    onPress={handleShare}
                >
                    <Ionicons name="share-social" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                        <Ionicons name="school" size={48} color={COLORS.white} />
                    </View>
                    <Text style={[styles.logoText, { color: colors.text }]}>Suryodaya College</Text>
                    <Text style={[styles.tagline, { color: colors.textSecondary }]}>Attendance System</Text>
                </View>

                <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.textLight}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor={colors.textLight}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    </View>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: colors.secondary }]}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.secondaryButtonText}>
                            Create New Account
                        </Text>
                    </TouchableOpacity>

                    <View style={[styles.hintContainer, { backgroundColor: colors.accent + '20' }]}>
                        <Text style={[styles.hintText, { color: colors.accentDark }]}>
                            Demo: Use email containing "teacher" for teacher account
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const lightColors = {
    background: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    primary: '#2563EB',
    secondary: '#10B981',
    accent: '#F59E0B',
    accentDark: '#D97706',
    border: '#E5E7EB',
    inputBg: '#F9FAFB',
};

const darkColors = {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textLight: '#6B7280',
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    accentDark: '#D97706',
    border: '#374151',
    inputBg: '#374151',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: SPACING.xxl + SPACING.lg,
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    tagline: {
        fontSize: FONT_SIZES.body,
        marginTop: SPACING.xs,
    },
    formContainer: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.body,
        marginBottom: SPACING.lg,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.bodySmall,
        fontWeight: '600',
        marginBottom: SPACING.xs,
    },
    input: {
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.body,
        borderWidth: 1,
    },
    button: {
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        paddingHorizontal: SPACING.md,
        fontSize: FONT_SIZES.caption,
    },
    secondaryButton: {
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    hintContainer: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    hintText: {
        fontSize: FONT_SIZES.caption,
        textAlign: 'center',
    },
});

export default LoginScreen;