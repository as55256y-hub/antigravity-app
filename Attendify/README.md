# Attendify - QR Code Based Attendance System

A cross-platform mobile application that allows teachers to generate time-limited QR codes for attendance and students to mark their attendance by scanning QR codes.

## Features

### Teacher Module
- **Dashboard**: Overview of active QR codes and scan statistics
- **Generate QR Code**: Create time-limited QR codes (1 hour to 2 days)
- **Active QR Codes**: View and manage active QR codes with live countdown
- **Attendance Reports**: View and export attendance records

### Student Module
- **Dashboard**: View attendance statistics
- **Scan QR**: Camera-based QR code scanning for attendance
- **My Attendance**: Calendar view with subject-wise statistics

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **QR Generation**: react-native-qrcode-svg
- **QR Scanning**: expo-camera
- **UI**: Custom components with Material Design 3 styling

## Installation

1. Install dependencies:
```bash
cd Attendify
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on Android:
```bash
npx expo run:android
```

4. Run on iOS:
```bash
npx expo run:ios
```

## Demo Instructions

1. Use an email containing "teacher" (e.g., `teacher@test.com`) to login as a teacher
2. Use any other email to login as a student
3. Teachers can generate QR codes with various durations
4. Students can scan QR codes using the camera
5. Both roles have access to their respective dashboards

## Project Structure

```
Attendify/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and theme
│   ├── context/             # React Context (Auth, Attendance)
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   │   ├── auth/           # Login, Register
│   │   ├── teacher/        # Teacher dashboard, QR generation, reports
│   │   └── student/       # Student dashboard, QR scanner, attendance
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── App.tsx                 # App entry point
└── package.json           # Dependencies
```

## Color Scheme
- Primary: Deep Blue (#2563EB)
- Secondary: Bright Green (#10B981)
- Accent: Orange (#F59E0B)
- Background: Light Gray (#F3F4F6)
- Text: Dark Gray (#1F2937)

## License
MIT