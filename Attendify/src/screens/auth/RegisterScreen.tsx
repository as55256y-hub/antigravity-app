// Register Screen with Teacher ID Validation

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MESSAGES } from '../../constants';
import { UserRole } from '../../types';

const YEAR_OPTIONS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const CORRECT_TEACHER_ID = 'Teacher@123';

const RegisterScreen = ({ navigation }: any) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [institution, setInstitution] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [role, setRole] = useState<UserRole>('student');
    const [password, setPassword] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Teacher ID validation
        if (role === 'teacher') {
            if (!teacherId.trim()) {
                Alert.alert('Error', 'Please enter Teacher ID');
                return;
            }
            if (teacherId.trim() !== CORRECT_TEACHER_ID) {
                Alert.alert('Error', 'Invalid Teacher ID. Please contact administration.');
                return;
            }
            if (!selectedYear) {
                Alert.alert('Error', 'Please select the year you teach');
                return;
            }
        }

        setIsLoading(true);
        try {
            const success = await register(
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    department: department.trim(),
                    institution: institution.trim(),
                    rollNumber: rollNumber.trim(),
                    role,
                    teachingYear: role === 'teacher' ? selectedYear : undefined,
                },
                password
            );
            if (!success) {
                Alert.alert('Error', MESSAGES.UNKNOWN_ERROR);
            }
        } catch (error) {
            Alert.alert('Error', MESSAGES.NETWORK_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Suryodaya College</Text>
                    <Text style={styles.tagline}>Create Your Account</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.roleSelector}>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'student' && styles.roleButtonActive]}
                            onPress={() => setRole('student')}
                        >
                            <Text style={[styles.roleButtonText, role === 'student' && styles.roleButtonTextActive]}>
                                Student
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'teacher' && styles.roleButtonActive]}
                            onPress={() => setRole('teacher')}
                        >
                            <Text style={[styles.roleButtonText, role === 'teacher' && styles.roleButtonTextActive]}>
                                Teacher
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Department</Text>
                        <TextInput
                            style={styles.input}
                            value={department}
                            onChangeText={setDepartment}
                            placeholder="Enter department"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Institution</Text>
                        <TextInput
                            style={styles.input}
                            value={institution}
                            onChangeText={setInstitution}
                            placeholder="Enter institution name"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>

                    {role === 'student' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Roll Number</Text>
                            <TextInput
                                style={styles.input}
                                value={rollNumber}
                                onChangeText={setRollNumber}
                                placeholder="Enter roll number"
                                placeholderTextColor={COLORS.textLight}
                            />
                        </View>
                    )}

                    {/* Teacher-specific fields */}
                    {role === 'teacher' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Teacher ID *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={teacherId}
                                    onChangeText={setTeacherId}
                                    placeholder="Enter Teacher ID"
                                    placeholderTextColor={COLORS.textLight}
                                    secureTextEntry
                                />
                                <Text style={styles.hintText}>
                                    Contact administration for Teacher ID
                                </Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Year You Teach *</Text>
                                <View style={styles.yearSelector}>
                                    {YEAR_OPTIONS.map((year) => (
                                        <TouchableOpacity
                                            key={year}
                                            style={[
                                                styles.yearButton,
                                                selectedYear === year && styles.yearButtonActive
                                            ]}
                                            onPress={() => setSelectedYear(year)}
                                        >
                                            <Text style={[
                                                styles.yearButtonText,
                                                selectedYear === year && styles.yearButtonTextActive
                                            ]}>
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password"
                            placeholderTextColor={COLORS.textLight}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.loginLinkText}>
                            Already have an account? Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    tagline: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    formContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    roleSelector: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        padding: SPACING.sm,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
    },
    roleButtonActive: {
        backgroundColor: COLORS.primary,
    },
    roleButtonText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    roleButtonTextActive: {
        color: COLORS.white,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.bodySmall,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    hintText: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    yearSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    yearButton: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    yearButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    yearButtonText: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.text,
    },
    yearButtonTextActive: {
        color: COLORS.white,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    buttonDisabled: {
        backgroundColor: COLORS.primaryLight,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    loginLink: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    loginLinkText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.body,
    },
});

export default RegisterScreen;