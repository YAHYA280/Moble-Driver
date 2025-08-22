# VSN Driver Frontend

A comprehensive React Native mobile application built with Expo for vehicle fleet management and driver operations.

## 🚀 Features

### Core Features

- **Dashboard**: Feature cards with quick access to all modules
- **Payslips**: Digital payslip management and downloads
- **Fleet Management**: Vehicle tracking and status monitoring
- **Documents**: Digital document storage and access
- **Route Planning**: Trip planning and navigation
- **Geolocation**: Real-time vehicle tracking
- **Planning**: Schedule and calendar management
- **Notifications**: In-app messaging and alerts

## 🛠️ Tech Stack

- **Framework**: Expo 53
- **Runtime**: React Native 0.79
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet with theme system
- **Icons**: FontAwesome + Expo Vector Icons
- **Graphics**: React Native SVG

## 📁 Project Architecture

```
vsn-driver-front/
├── app/                          # Expo Router pages
│   ├── (tabs)/                  # Tab navigation routes
│   │   ├── _layout.tsx          # Custom curved tab bar
│   │   ├── index.tsx            # Home tab
│   │   ├── map.tsx              # Map tab
│   │   ├── calendar.tsx         # Calendar tab
│   │   ├── chat.tsx             # Chat tab
│   │   └── profile.tsx          # Profile tab
│   ├── auth/                    # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   ├── register.tsx         # Register screen
│   │   └── forgot-password.tsx  # Password recovery
│   ├── innerApplication/        # Main app features
│   │   ├── home/                # Dashboard
│   │   ├── payslips/            # Payslip management
│   │   ├── vehicles/            # Fleet management
│   │   ├── documents/           # Document storage
│   │   ├── routes/              # Route planning
│   │   ├── geolocation/         # GPS tracking
│   │   ├── planning/            # Schedule management
│   │   └── notifications/       # Alerts & messages
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point
├── screens/                     # Screen components
│   ├── auth/                    # Auth screen implementations
│   └── innerApplication/        # Feature screen implementations
├── shared/                      # Shared resources
│   ├── components/              # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   ├── ui/                  # UI component library
│   │   └── conditionalComponent/ # Conditional rendering
│   └── types/                   # TypeScript interfaces
├── contexts/                    # React contexts
├── hooks/                       # Custom hooks
├── store/                       # State management
├── constants/                   # App constants
├── utils/                       # Utility functions
└── assets/                      # Static assets
    ├── images/                  # App images
    └── fonts/                   # Custom fonts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd vsn-driver-front
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npx expo start
```

4. Run on your preferred platform

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web
npx expo start --web
```

## 🎨 UI Component Library

### Core Components

- **Button**: Primary, secondary, and outline variants with loading states
- **Input**: Text input with validation, password toggle, and animations
- **Checkbox**: Customizable checkbox with different sizes
- **Header**: Navigation header with icons, badges, and actions
- **Card**: Flexible card component with multiple layouts
- **Screen**: Layout wrapper with safe area and scroll handling

### Theme System

- Centralized color management
- Dark/light mode support
- Platform-specific styling
- Consistent design tokens

## 🎯 Development Guidelines

### Coding Standards & Rules

#### File Size Limits

- **Maximum 500 lines per file** - If a file exceeds this limit, consider breaking it into smaller, focused components or modules
- Use composition over large monolithic components
- Extract utilities, types, and constants to separate files

#### Code Quality Requirements

- **Always run ESLint before pushing**:
  ```bash
  npm run lint
  ```
- **Always run TypeScript type checking before pushing**:
  ```bash
  npx tsc --noEmit
  ```
- **Pre-commit checklist**:
  - [ ] ESLint passes with no errors
  - [ ] TypeScript compilation successful
  - [ ] No console.log statements in production code
  - [ ] All imports are used and properly typed
  - [ ] No commented-out code left in files
  - [ ] No hard-coded configuration values
  - [ ] Code properly formatted (Prettier/ESLint)
  - [ ] All merge conflicts resolved
  - [ ] No localhost URLs in code

#### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Proper type definitions
- Use meaningful variable and function names
- Follow consistent indentation (2 spaces)
- **Naming conventions**:
  - Use camelCase for variables, functions, and properties
  - Use PascalCase for components and types
  - Use descriptive, understandable names in English only
- **Language consistency**:
  - Never mix languages in code (English only for code, French for UI text)
  - Use English for all variable names, function names, and comments
  - French text only in user-facing strings and UI labels
- **Code cleanliness**:
  - No console.log, console.warn, or System.out statements in production code
  - No commented-out code blocks
  - No hard-coded configuration values (use constants or environment variables)
  - Format code using Prettier/ESLint before committing
  - No localhost URLs in code

#### Component Development Rules

- **One component per file** (except for small, tightly coupled components)
- **Component files should not exceed 300 lines** (excluding styles)
- Export components as named exports, not default exports (except for screens)
- Always use TypeScript interfaces for props
- Include proper prop validation and default values
- Theme integration required for all UI components
- Accessibility considerations (proper labels, touch targets)
- Platform-specific optimizations when needed
- **Always wrap `&&` conditional rendering in ConditionalComponent** for consistent default rendering:

  ```typescript
  // ❌ Don't do this
  {
    condition && <Component />;
  }

  // ✅ Do this instead
  <ConditionalComponent isValid={!!condition}>
    <Component />
  </ConditionalComponent>;
  ```

#### Additional Frontend Rules

- **Conditional Rendering**: Always use ConditionalComponent for inline conditional rendering instead of && operators
- **Business Logic**: Never add business logic in controllers - keep controllers thin and delegate to services
- **Architecture**: Maintain clear separation between UI components and business logic
- **State Management**: Use proper state management patterns (Zustand, Context) for complex state

#### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `HomeCard.tsx`)
- Hooks: `camelCase.ts` starting with 'use' (e.g., `useTheme.ts`)
- Utilities: `camelCase.ts` (e.g., `validators.ts`)
- Types: `camelCase.ts` (e.g., `auth.ts`)
- Constants: `camelCase.ts` (e.g., `colors.ts`)

#### Import Organization

```typescript
// 1. React and React Native imports
import React from "react";
import { View, Text } from "react-native";

// 2. Third-party libraries
import { router } from "expo-router";

// 3. Internal imports (components, hooks, utils)
import { Button } from "@/shared/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";

// 4. Type imports (always last)
import type { ComponentProps } from "@/types";
```

#### Performance Guidelines

- Use `React.memo` for expensive components
- Implement proper `useMemo` and `useCallback` where needed
- Optimize images and SVGs
- Lazy load screens and heavy components
- Use FlatList for large lists

#### Git Workflow Rules

1. **Never push directly to develop**
2. **Create feature branches** with descriptive names
3. **Always pull latest changes** before creating new branches
4. **Resolve all merge conflicts** before sharing the merge request
5. **Run quality checks** before every commit:
   ```bash
   # Add to your pre-commit routine
   npm run lint
   npx tsc --noEmit
   npm test # when tests are added
   ```
6. **Use conventional commit messages**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `docs:` for documentation
   - `style:` for formatting changes
   - `test:` for testing

#### Error Handling

- Always wrap async operations in try-catch blocks
- Provide meaningful error messages
- Use proper TypeScript error types
- Implement proper loading and error states in UI
- **Never return HTTP status 404 or 500** directly to users
- Use application-specific exceptions from mc-starter when available
- Handle errors gracefully with user-friendly feedback

## 🚀 Build

### Development Build

```bash
npx expo build:android
npx expo build:ios
```

### Production Build

```bash
npx expo build:android --release-channel production
npx expo build:ios --release-channel production
```

## 📱 Platform Support

- **iOS**: iOS 13.0+
- **Android**: Android 6.0+ (API 23)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
