# Tango! 🎉

Fun mini-games with household items for friends and family.

## Description

Tango! is a mobile app that brings people together through engaging mini-games using everyday household items. Challenge your friends in 1v1 duels, team up in co-op mode, or compete in tournaments with games that require nothing more than items you already have at home.

## Features

- **1v1 Tango**: Head-to-head competitive duels
- **2v2 Mode**: Team-based competitions  
- **Co-Op Mode**: Work together to achieve goals
- **Tournament Mode**: Bracket-style competitions
- **Game Library**: Browse and filter available games
- **Smart Item Detection**: Games adapt to available household items

## Tech Stack

- **Framework**: Expo React Native with TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **Navigation**: React Navigation v7
- **Testing**: Jest with React Native Testing Library
- **Backend**: Supabase (planned)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AlexGunnerson/Tango.git
cd TangoApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Use Expo Go to scan the QR code or press `i` for iOS simulator / `a` for Android emulator.

### Testing

Run the test suite:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

Coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/          # Mock data and static content
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── services/      # API and external services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Development Status

Currently in **V1 Development** - Core features being implemented with mock data first, followed by backend integration.

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## License

Private project - All rights reserved.
