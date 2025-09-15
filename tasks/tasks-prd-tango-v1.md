## Relevant Files

- `src/components/GameLibrary.tsx` - Main component for browsing and filtering the game library
- `src/components/GameLibrary.test.tsx` - Unit tests for GameLibrary component
- `src/components/GameModes.tsx` - Component for selecting different game modes (1v1, 2v2, Co-Op, Tournament)
- `src/components/GameModes.test.tsx` - Unit tests for GameModes component
- `src/components/TangoFlow/` - Directory containing all components for the 1v1 Tango flow
- `src/components/TangoFlow/PlayerSelection.tsx` - Component for selecting opponent and entering names
- `src/components/TangoFlow/PlayerSelection.test.tsx` - Unit tests for PlayerSelection
- `src/components/TangoFlow/PunishmentSelection.tsx` - Component for selecting punishment before game starts
- `src/components/TangoFlow/PunishmentSelection.test.tsx` - Unit tests for PunishmentSelection
- `src/components/TangoFlow/ItemGathering.tsx` - Component for confirming available household items
- `src/components/TangoFlow/ItemGathering.test.tsx` - Unit tests for ItemGathering
- `src/components/TangoFlow/GameInstructions.tsx` - Component displaying game instructions and tutorial video
- `src/components/TangoFlow/GameInstructions.test.tsx` - Unit tests for GameInstructions
- `src/components/TangoFlow/Gameplay.tsx` - Main gameplay screen with timer and controls
- `src/components/TangoFlow/Gameplay.test.tsx` - Unit tests for Gameplay
- `src/components/TangoFlow/Scoring.tsx` - Component for round scoring and winner selection
- `src/components/TangoFlow/Scoring.test.tsx` - Unit tests for Scoring
- `src/components/TangoFlow/GameConclusion.tsx` - Final screen with winner celebration and punishment
- `src/components/TangoFlow/GameConclusion.test.tsx` - Unit tests for GameConclusion
- `src/components/ReplayLibrary.tsx` - Component for viewing saved photos and videos
- `src/components/ReplayLibrary.test.tsx` - Unit tests for ReplayLibrary
- `src/services/gameService.ts` - Service for game logic, selection, and management
- `src/services/gameService.test.ts` - Unit tests for game service
- `src/services/mediaService.ts` - Service for handling camera, photo, and video recording
- `src/services/mediaService.test.ts` - Unit tests for media service
- `src/types/game.ts` - TypeScript interfaces for game-related data structures
- `src/types/user.ts` - TypeScript interfaces for user and gameplay data
- `src/data/games.json` - JSON file containing all game data, instructions, and metadata
- `src/data/punishments.json` - JSON file containing pre-written punishment options
- `src/utils/gameLogic.ts` - Utility functions for game selection, handicap calculation, etc.
- `src/utils/gameLogic.test.ts` - Unit tests for game logic utilities
- `src/utils/timer.ts` - Timer utility functions for gameplay
- `src/utils/timer.test.ts` - Unit tests for timer utilities
- `src/screens/HomeScreen.tsx` - Main home screen with navigation to different features
- `src/screens/HomeScreen.test.tsx` - Unit tests for HomeScreen
- `App.tsx` - Root application component with navigation setup
- `App.test.tsx` - Unit tests for main App component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Project Setup & Core Infrastructure (Mock Data First)
  - [x] 1.1 Initialize Expo React Native project with TypeScript
  - [x] 1.2 Install and configure Tailwind CSS (NativeWind)
  - [x] 1.3 Set up project folder structure (components, screens, services, utils, types, data)
  - [x] 1.4 Configure Jest testing framework
  - [x] 1.5 Create TypeScript interfaces for core data types (Game, User, GameSession)
  - [x] 1.6 Create mock data files (games.json, punishments.json)
  - [x] 1.7 Set up basic navigation structure with React Navigation
  - [x] 1.8 Configure app icons, splash screen, and basic app metadata

- [x] 2.0 Home Screen & Navigation
  - [x] 2.1 Create main HomeScreen component with game mode selection
  - [x] 2.2 Design and implement game mode cards (1v1, 2v2, Co-Op, Tournament)
  - [ ] 2.3 Add navigation to Game Library from home screen (moved to later section - lower priority)
  - [x] 2.4 Implement responsive layout for different screen sizes
  - [x] 2.5 Add basic app branding and visual design elements
  - [x] 2.6 Create navigation header with app logo

- [x] 3.0 1v1 Tango Flow Implementation
  - [x] 3.1 Create PlayerSelection screen for entering opponent name
  - [x] 3.2 Implement PunishmentSelection screen with random punishment options
  - [x] 3.3 Build ItemGathering screen for confirming available household items
  - [ ] 3.4 Create game selection animation and random game picker (moved to later section)
  - [x] 3.5a Implement GameInstructions screen with text instructions
  - [ ] 3.5b Implement GameInstructions screen with tutorial video (moved to later section)
  - [x] 3.6 Build Gameplay screen with timer, pause/reset controls, and turn indicator
  - [x] 3.7 Create Scoring screen for round winner selection and scoreboard
  - [x] 3.8 Implement handicap system for players with 2-game lead
  - [x] 3.9 Build GameConclusion screen with winner celebration and punishment display
  - [x] 3.10 Add sound effects for countdown, round end, and game completion
  - [x] 3.11 Create game logic service for managing 1v1 flow state

- [x] 4.0 Supabase Integration for 1v1 Flow
  - [x] 4.1 Set up Supabase project and configure database schema for 1v1 games
  - [x] 4.2 Create database tables for games, users, players, and 1v1 game sessions
  - [x] 4.3 Create API service layer for Supabase integration
  - [x] 4.4 Replace mock game data with Supabase queries for 1v1 flow
  - [x] 4.5 Integrate game logic service with Supabase backend
  - [x] 4.6 Implement game session persistence and retrieval
  - [x] 4.7 Add match history tracking and statistics for 1v1
  - [x] 4.8 Set up Row Level Security (RLS) policies for 1v1 data
  - [x] 4.9 Update 1v1 components to use real backend data
  - [x] 4.10 Add offline mode support with sync capabilities
  - [ ] 4.11 Write integration tests for 1v1 backend connectivity

- [ ] 5.0 2v2 Game Mode Implementation
  - [ ] 5.1 Create TeamSelection screen for forming teams
  - [ ] 5.2 Adapt ItemGathering for team-based item confirmation
  - [ ] 5.3 Modify game selection to filter for team-compatible games
  - [ ] 5.4 Update Gameplay screen for team turn indicators
  - [ ] 5.5 Adapt Scoring screen for team-based scoring
  - [ ] 5.6 Implement team-based GameConclusion with team celebration
  - [ ] 5.7 Create team game logic service
  - [ ] 5.8 Extend Supabase integration for 2v2 game mode
  - [ ] 5.9 Write unit tests for 2v2 components and logic

- [ ] 6.0 Co-Op Game Mode Implementation
  - [ ] 6.1 Create PlayerSetup screen for co-op participant selection
  - [ ] 6.2 Implement cooperative ItemGathering with shared item pool
  - [ ] 6.3 Filter game selection for cooperative-compatible games
  - [ ] 6.4 Build cooperative Gameplay screen with shared objectives
  - [ ] 6.5 Create cooperative Scoring screen with team achievement tracking
  - [ ] 6.6 Implement cooperative GameConclusion with shared celebration
  - [ ] 6.7 Create cooperative game logic service
  - [ ] 6.8 Extend Supabase integration for Co-Op game mode
  - [ ] 6.9 Write unit tests for Co-Op components and logic

- [ ] 7.0 Tournament Game Mode Implementation
  - [ ] 7.1 Create TournamentSetup screen for bracket configuration
  - [ ] 7.2 Implement bracket visualization component
  - [ ] 7.3 Build tournament progression logic and bracket updates
  - [ ] 7.4 Integrate existing game flows into tournament structure
  - [ ] 7.5 Create tournament management screens for hosts
  - [ ] 7.6 Implement tournament conclusion with final winner celebration
  - [ ] 7.7 Create tournament logic service
  - [ ] 7.8 Extend Supabase integration for Tournament game mode
  - [ ] 7.9 Write unit tests for Tournament components and logic

- [ ] 8.0 Game Library & Filtering System
  - [ ] 8.1 Create GameLibrary screen with grid/list view of all games
  - [ ] 8.2 Implement filtering by category (Creative, Physical, Foodie)
  - [ ] 8.3 Add filtering by theme (Christmas, Halloween, etc.)
  - [ ] 8.4 Create filtering by available household items
  - [ ] 8.5 Build individual GameDetail screen with instructions and video
  - [ ] 8.6 Implement search functionality for finding specific games
  - [ ] 8.7 Add game favoriting and recently played tracking
  - [ ] 8.8 Create game service for library management
  - [ ] 8.9 Write unit tests for GameLibrary components and services

- [ ] 9.0 Authentication System (Google Auth, Apple Auth)
  - [ ] 9.1 Configure Supabase Auth with Google and Apple providers
  - [ ] 9.2 Create login/signup screens with social auth buttons
  - [ ] 9.3 Implement authentication flow and session management
  - [ ] 9.4 Create user profile screens and account management
  - [ ] 9.5 Add authentication guards to protected features
  - [ ] 9.6 Implement guest mode for trying the app without signup
  - [ ] 9.7 Write unit tests for authentication components and flows

- [ ] 10.0 Premium Features & Monetization
  - [ ] 10.1 Integrate in-app purchase system (App Store/Google Play)
  - [ ] 10.2 Implement premium game library unlock functionality
  - [ ] 10.3 Create premium tournament feature access controls
  - [ ] 10.4 Build expansion pack purchase and download system
  - [ ] 10.5 Implement free game rotation system (10 rotating free games)
  - [ ] 10.6 Create purchase confirmation and receipt management
  - [ ] 10.7 Add premium status indicators throughout the app
  - [ ] 10.8 Write unit tests for monetization features

- [ ] 11.0 Comprehensive Testing & Quality Assurance
  - [ ] 11.1 Write unit tests for all 1v1 components and logic
  - [ ] 11.2 Write unit tests for game logic service and Supabase integration
  - [ ] 11.3 Create end-to-end tests for complete 1v1 game flows
  - [ ] 11.4 Add performance testing for game state management
  - [ ] 11.5 Implement accessibility testing and improvements
  - [ ] 11.6 Create automated testing pipeline for CI/CD
