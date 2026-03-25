// Profile Screen - Shared by Teacher and Student

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MESSAGES } from '../../constants';

const ProfileScreen = ({ navigation, route }: any) => {
    const { user, updateUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [department, setDepartment] = useState(user?.department || '');
    const [institution, setInstitution] = useState(user?.institution || '');
    const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        try {
            await updateUser({
                name: name.trim(),
                phone: phone.trim(),
                department: department.trim(),
                institution: institution.trim(),
                rollNumber: rollNumber.trim(),
            });
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', MESSAGES.UNKNOWN_ERROR);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
            ]
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {user?.photoUrl ? (
                        <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{getInitials(user?.name || 'U')}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Ionicons name="camera" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>{user?.name}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>
                        {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                    </Text>
                </View>
            </View>

            {/* Profile Form */}
            <View style={styles.formContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                        <Ionicons
                            name={isEditing ? 'close' : 'create'}
                            size={24}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor={COLORS.textLight}
                        editable={isEditing}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={email}
                        placeholder="Email address"
                        placeholderTextColor={COLORS.textLight}
                        editable={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="phone-pad"
                        editable={isEditing}
                    />
                </View>

                {user?.role === 'student' && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Roll Number</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={rollNumber}
                            onChangeText={setRollNumber}
                            placeholder="Enter roll number"
                            placeholderTextColor={COLORS.textLight}
                            editable={isEditing}
                        />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Department</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={department}
                        onChangeText={setDepartment}
                        placeholder="Enter department"
                        placeholderTextColor={COLORS.textLight}
                        editable={isEditing}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institution</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={institution}
                        onChangeText={setInstitution}
                        placeholder="Enter institution"
                        placeholderTextColor={COLORS.textLight}
                        editable={isEditing}
                    />
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="save" size={20} color={COLORS.white} />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Account Section */}
            <View style={styles.accountSection}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="lock-closed-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="information-circle-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>About</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={styles.version}>Version 1.0.0</Text>
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
        marginBottom: SPACING.lg,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.secondary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.surface,
    },
    userName: {
        fontSize: FONT_SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    roleBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.round,
    },
    roleText: {
        fontSize: FONT_SIZES.bodySmall,
        color: COLORS.primary,
        fontWeight: '600',
    },
    formContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h4,
        fontWeight: '600',
        color: COLORS.text,
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
    inputDisabled: {
        backgroundColor: COLORS.background,
        color: COLORS.textSecondary,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    accountSection: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuText: {
        flex: 1,
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        marginLeft: SPACING.md,
    },
    logoutButton: {
        backgroundColor: COLORS.error + '15',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    logoutButtonText: {
        color: COLORS.error,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        fontSize: FONT_SIZES.caption,
        color: COLORS.textLight,
    },
});

export default ProfileScreen;