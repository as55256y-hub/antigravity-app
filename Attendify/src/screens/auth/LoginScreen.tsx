// Login Screen - Sophisticated Teal & Gold Luxury Theme

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

const LoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sophisticated Teal & Gold Luxury Color Palette
    const colors = {
        background: '#1A1A1A',
        surface: '#2C2C2C',
        primary: '#4F7C82',
        accent: '#D4AF37',
        copper: '#A05E3C',
        text: '#FFF8DC',
        textSecondary: '#C0C0C0',
        textMuted: '#8A8A8A',
    };

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <View style={[styles.logoCircle, { borderColor: colors.accent }]}>
                        <Ionicons name="qr-code" size={48} color={colors.accent} />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>ATTENDIFY</Text>
                    <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                        Smart Attendance Solution
                    </Text>
                </View>

                {/* Login Form */}
                <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.formTitle, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                        Sign in to continue
                    </Text>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Email or Phone"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Password"
                                placeholderTextColor={colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: colors.accent }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.textMuted }]} />
                        <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.textMuted }]} />
                    </View>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.registerLink, { color: colors.accent }]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Guest Mode */}
                <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => navigation.navigate('About')}
                >
                    <Text style={[styles.guestText, { color: colors.textSecondary }]}>
                        Learn more about Attendify
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        marginBottom: SPACING.md,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    tagline: {
        fontSize: FONT_SIZES.body,
        marginTop: SPACING.xs,
    },
    formCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    formTitle: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: FONT_SIZES.body,
        textAlign: 'center',
        marginTop: SPACING.xs,
        marginBottom: SPACING.lg,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.md,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.body,
    },
    eyeButton: {
        padding: SPACING.xs,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.lg,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZES.bodySmall,
    },
    loginButton: {
        borderRadius: BORDER_RADIUS.lg,
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#1A1A1A',
        fontSize: FONT_SIZES.body,
        fontWeight: 'bold',
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
        marginHorizontal: SPACING.md,
        fontSize: FONT_SIZES.bodySmall,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.xs,
    },
    registerText: {
        fontSize: FONT_SIZES.body,
    },
    registerLink: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    guestButton: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    guestText: {
        fontSize: FONT_SIZES.bodySmall,
    },
});

export default LoginScreen;