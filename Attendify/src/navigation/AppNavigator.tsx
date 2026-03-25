// Main Navigation Configuration

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

// Teacher Screens
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import GenerateQRScreen from '../screens/teacher/GenerateQRScreen';
import ActiveQRScreen from '../screens/teacher/ActiveQRScreen';
import AttendanceReportScreen from '../screens/teacher/AttendanceReportScreen';

// Student Screens
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import ScanQRScreen from '../screens/student/ScanQRScreen';
import MyAttendanceScreen from '../screens/student/MyAttendanceScreen';

// Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type TeacherTabParamList = {
    TeacherDashboard: undefined;
    GenerateQR: undefined;
    ActiveQR: undefined;
    Reports: undefined;
    Profile: undefined;
};

export type StudentTabParamList = {
    StudentDashboard: undefined;
    ScanQR: undefined;
    MyAttendance: undefined;
    Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
};

// Teacher Tab Navigator
const TeacherNavigator = () => {
    return (
        <TeacherTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'TeacherDashboard':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'GenerateQR':
                            iconName = focused ? 'qr-code' : 'qr-code-outline';
                            break;
                        case 'ActiveQR':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                        case 'Reports':
                            iconName = focused ? 'document-text' : 'document-text-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <TeacherTab.Screen
                name="TeacherDashboard"
                component={TeacherDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <TeacherTab.Screen
                name="GenerateQR"
                component={GenerateQRScreen}
                options={{ title: 'Generate QR' }}
            />
            <TeacherTab.Screen
                name="ActiveQR"
                component={ActiveQRScreen}
                options={{ title: 'Active QR' }}
            />
            <TeacherTab.Screen
                name="Reports"
                component={AttendanceReportScreen}
                options={{ title: 'Reports' }}
            />
            <TeacherTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </TeacherTab.Navigator>
    );
};

// Student Tab Navigator
const StudentNavigator = () => {
    return (
        <StudentTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'StudentDashboard':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'ScanQR':
                            iconName = focused ? 'scan' : 'scan-outline';
                            break;
                        case 'MyAttendance':
                            iconName = focused ? 'calendar' : 'calendar-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <StudentTab.Screen
                name="StudentDashboard"
                component={StudentDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <StudentTab.Screen
                name="ScanQR"
                component={ScanQRScreen}
                options={{ title: 'Scan QR' }}
            />
            <StudentTab.Screen
                name="MyAttendance"
                component={MyAttendanceScreen}
                options={{ title: 'My Attendance' }}
            />
            <StudentTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </StudentTab.Navigator>
    );
};

// Main App Navigator
const AppNavigator = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <RootStack.Screen name="Main" component={user?.role === 'teacher' ? TeacherNavigator : StudentNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;