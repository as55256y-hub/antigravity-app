// Authentication Context for managing user state

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Partial<User>, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@attendify_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            const userData = await AsyncStorage.getItem(STORAGE_KEY);
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveUserToStorage = async (userData: User) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            // Simulate API call - In production, this would call Firebase or your backend
            // For demo purposes, we'll create a mock user
            const mockUser: User = {
                id: Date.now().toString(),
                email,
                phone: '',
                role: email.includes('teacher') ? 'teacher' : 'student',
                name: email.split('@')[0],
                department: 'Computer Science',
                institution: 'Demo University',
                createdAt: Date.now(),
            };

            setUser(mockUser);
            await saveUserToStorage(mockUser);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            const newUser: User = {
                id: Date.now().toString(),
                email: userData.email || '',
                phone: userData.phone || '',
                role: userData.role || 'student',
                name: userData.name || '',
                department: userData.department || '',
                institution: userData.institution || '',
                rollNumber: userData.rollNumber,
                studentId: userData.studentId,
                createdAt: Date.now(),
            };

            setUser(newUser);
            await saveUserToStorage(newUser);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            await saveUserToStorage(updatedUser);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};