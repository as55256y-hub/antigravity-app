// Register Screen - Sophisticated Teal & Gold Luxury Theme

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { UserRole } from '../../types';

const RegisterScreen = ({ navigation }: any) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'teacher' | 'student'>('student');
    const [teacherId, setTeacherId] = useState('');
    const [rollNumber, setRollNumber] = useState('');
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

    const handleRegister = async () => {
        if (!name || !email || !password) {
            alert('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (role === 'teacher' && teacherId !== 'Teacher@123') {
            alert('Invalid Teacher ID. Please contact administrator.');
            return;
        }

        setLoading(true);
        try {
            const userData = {
                name,
                email,
                role,
                rollNumber: role === 'student' ? rollNumber : undefined,
            };
            await register(userData, password);
        } catch (error) {
            alert('Registration failed. Please try again.');
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
                {/* Header */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Join Attendify today
                    </Text>
                </View>

                {/* Role Selection */}
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            {
                                backgroundColor: role === 'student' ? colors.accent : colors.surface,
                                borderColor: role === 'student' ? colors.accent : colors.textMuted,
                            }
                        ]}
                        onPress={() => setRole('student')}
                    >
                        <Ionicons
                            name="school"
                            size={24}
                            color={role === 'student' ? '#1A1A1A' : colors.textMuted}
                        />
                        <Text style={[
                            styles.roleText,
                            { color: role === 'student' ? '#1A1A1A' : colors.textMuted }
                        ]}>
                            Student
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            {
                                backgroundColor: role === 'teacher' ? colors.accent : colors.surface,
                                borderColor: role === 'teacher' ? colors.accent : colors.textMuted,
                            }
                        ]}
                        onPress={() => setRole('teacher')}
                    >
                        <Ionicons
                            name="person"
                            size={24}
                            color={role === 'teacher' ? '#1A1A1A' : colors.textMuted}
                        />
                        <Text style={[
                            styles.roleText,
                            { color: role === 'teacher' ? '#1A1A1A' : colors.textMuted }
                        ]}>
                            Teacher
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Full Name"
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Email"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Role-specific Input */}
                    {role === 'teacher' ? (
                        <View style={styles.inputContainer}>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                                <Ionicons name="card-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Teacher ID (Teacher@123)"
                                    placeholderTextColor={colors.textMuted}
                                    value={teacherId}
                                    onChangeText={setTeacherId}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                                <Ionicons name="id-card-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Roll Number"
                                    placeholderTextColor={colors.textMuted}
                                    value={rollNumber}
                                    onChangeText={setRollNumber}
                                />
                            </View>
                        </View>
                    )}

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

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Confirm Password"
                                placeholderTextColor={colors.textMuted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, { backgroundColor: colors.accent }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.registerButtonText}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.loginLink, { color: colors.accent }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    },
    backButton: {
        marginBottom: SPACING.md,
    },
    headerContainer: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.h1,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: FONT_SIZES.body,
        marginTop: SPACING.xs,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
    },
    roleText: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    formCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
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
    registerButton: {
        borderRadius: BORDER_RADIUS.lg,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    registerButtonText: {
        color: '#1A1A1A',
        fontSize: FONT_SIZES.body,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.lg,
    },
    loginText: {
        fontSize: FONT_SIZES.body,
    },
    loginLink: {
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});

export default RegisterScreen;