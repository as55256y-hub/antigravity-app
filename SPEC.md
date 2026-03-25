# Attendify - QR Code Based Attendance System

## Project Overview
- **Project Name**: Attendify
- **Type**: Cross-platform Mobile Application (iOS & Android)
- **Core Functionality**: Teachers generate time-limited QR codes for attendance; Students scan QR codes to mark their attendance automatically

## Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Authentication, Firestore, Realtime Database)
- **State Management**: React Context API + AsyncStorage
- **QR Generation**: react-native-qrcode-svg
- **QR Scanning**: expo-camera
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper (Material Design 3)
- **Icons**: @expo/vector-icons

## Feature List

### Authentication
- Email/Phone login with OTP verification
- Role selection (Teacher/Student)
- Profile setup with required fields

### Teacher Module
- Dashboard with prominent "Generate QR Code" button
- QR Code generation form with:
  - Class/Subject selection
  - Duration selection (1hr, 2hr, 4hr, 1day, 2days, custom)
  - Optional student count limit
  - Optional location restriction
- Active QR codes list with:
  - Live countdown timer
  - Deactivate early option
  - Real-time attendance count
  - Full-screen QR display
- Attendance reports with:
  - Date-wise and class-wise filters
  - Export to Excel/PDF
  - Individual student history
  - Search by name/roll number

### Student Module
- Dashboard with "Scan QR" button
- Camera-based QR scanning
- Success/Error animations and messages
- My Attendance view:
  - Calendar with color-coded days
  - Subject-wise percentage
  - Statistics

### Technical Features
- Encrypted QR codes (Base64 encoded unique tokens)
- Duplicate scan prevention
- Real-time updates via Firebase
- Push notifications
- Offline support with local storage
- Multi-language support (English, Hindi, Hinglish)
- Dark mode support

## UI/UX Design Specification

### Color Scheme
- Primary: #2563EB (Deep Blue)
- Secondary: #10B981 (Bright Green)
- Accent: #F59E0B (Orange)
- Background: #F3F4F6 (Light Gray)
- Text: #1F2937 (Dark Gray)
- Error: #EF4444 (Red)
- Surface: #FFFFFF

### Typography
- Headings: Bold Sans-serif (System default)
- Body: Clean readable font
- Sizes: H1=28, H2=24, H3=20, Body=16, Caption=12

### Layout
- Bottom tab navigation for main sections
- Card-based UI with glassmorphism effect
- Pull-to-refresh on lists
- Skeleton loaders during data fetch

### Animations
- Confetti on successful scan
- Circular countdown progress
- Smooth page transitions
- Haptic feedback on button press

## Data Models

### User
```
{
  id: string
  email: string
  phone: string
  role: 'teacher' | 'student'
  name: string
  department: string
  institution: string
  createdAt: timestamp
}
```

### QRCode
```
{
  id: string
  teacherId: string
  teacherName: string
  subject: string
  class: string
  createdAt: timestamp
  expiresAt: timestamp
  isActive: boolean
  maxStudents: number
  locationEnabled: boolean
  locationLat: number
  locationLng: number
  scannedCount: number
}
```

### Attendance
```
{
  id: string
  qrCodeId: string
  studentId: string
  studentName: string
  rollNumber: string
  scannedAt: timestamp
  deviceId: string
  ipAddress: string
}
```

## Success Metrics
- QR scan time < 3 seconds
- 99.9% uptime
- Support 1000+ concurrent users
- App size < 50MB
- Battery efficient (GPS optional)
