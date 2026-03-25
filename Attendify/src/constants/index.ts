// App constants and theme configuration

export const COLORS = {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#3B82F6',
    secondary: '#10B981',
    secondaryDark: '#059669',
    accent: '#F59E0B',
    accentDark: '#D97706',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    error: '#EF4444',
    errorDark: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#E5E7EB',
    divider: '#F3F4F6',
    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const FONT_SIZES = {
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
};

export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
};

export const DURATION_OPTIONS = [
    { label: '1 Hour', value: '1hour', minutes: 60 },
    { label: '2 Hours', value: '2hours', minutes: 120 },
    { label: '4 Hours', value: '4hours', minutes: 240 },
    { label: '1 Day', value: '1day', minutes: 1440 },
    { label: '2 Days', value: '2days', minutes: 2880 },
    { label: 'Custom', value: 'custom', minutes: 0 },
];

export const MESSAGES = {
    // Auth
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
    LOGOUT_SUCCESS: 'Logged out successfully',

    // QR Generation
    QR_GENERATED: 'QR Code generated successfully!',
    QR_DEACTIVATED: 'QR Code deactivated',

    // QR Scanning
    ATTENDANCE_MARKED: 'Attendance marked successfully!',
    QR_EXPIRED: 'QR Code has expired',
    ALREADY_MARKED: 'Attendance already marked',
    INVALID_QR: 'Invalid QR Code',
    OUT_OF_RANGE: 'You are out of the allowed location range',

    // Errors
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNKNOWN_ERROR: 'Something went wrong. Please try again.',
    PERMISSION_DENIED: 'Permission denied',
};

// QR Code token format: ATTENDIFY_[TeacherID]_[Timestamp]_[Expiry]_[RandomSalt]
export const QR_PREFIX = 'ATTENDIFY';