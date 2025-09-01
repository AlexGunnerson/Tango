import type { Game } from '../types/game';

// Mock games data - in a real app, this would come from an API or database
// Using type assertion to handle string to enum conversion
export const games: Game[] = [
  {
    id: "game-001",
    title: "Marshmallow Scoop",
    description: "See who can scoop the most marshmallows into a bowl using only a spoon in their mouth",
    category: "physical" as any,
    theme: null,
    requiredItems: ["marshmallows", "2 bowls", "spoon"],
    minPlayers: 2,
    maxPlayers: 4,
    estimatedDuration: 3,
    difficulty: "easy" as any,
    instructions: "Place marshmallows in one bowl. Hold spoon in mouth (no hands!). Transfer as many marshmallows as possible to the empty bowl within the time limit.",
    videoUrl: null,
    hasTimer: true,
    timerDuration: 60,
    gameType: "competitive" as any,
    isPremium: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "game-002",
    title: "Cookie Face Challenge",
    description: "Move a cookie from your forehead to your mouth using only facial muscles",
    category: "physical" as any,
    theme: null,
    requiredItems: ["cookies"],
    minPlayers: 2,
    maxPlayers: 6,
    estimatedDuration: 2,
    difficulty: "medium" as any,
    instructions: "Place cookie on forehead. Tilt head back slightly. Use only facial muscles to move cookie to mouth. No hands allowed!",
    videoUrl: null,
    hasTimer: true,
    timerDuration: 90,
    gameType: "competitive" as any,
    isPremium: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "game-003",
    title: "Penny Tower",
    description: "Stack as many pennies as possible in 60 seconds",
    category: "physical" as any,
    theme: null,
    requiredItems: ["pennies or coins"],
    minPlayers: 2,
    maxPlayers: 4,
    estimatedDuration: 2,
    difficulty: "easy" as any,
    instructions: "Stack pennies on top of each other. The person with the tallest stable tower when time runs out wins.",
    videoUrl: null,
    hasTimer: true,
    timerDuration: 60,
    gameType: "competitive" as any,
    isPremium: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "game-004",
    title: "Paper Airplane Contest",
    description: "Design and fly the paper airplane that travels the farthest",
    category: "creative" as any,
    theme: null,
    requiredItems: ["paper", "measuring tape or ruler"],
    minPlayers: 2,
    maxPlayers: 6,
    estimatedDuration: 5,
    difficulty: "easy" as any,
    instructions: "Each player gets one sheet of paper. Design your airplane. Take turns flying from the same starting line. Measure distances.",
    videoUrl: null,
    hasTimer: false,
    timerDuration: null,
    gameType: "competitive" as any,
    isPremium: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "game-005",
    title: "Blind Taste Test",
    description: "Identify mystery foods while blindfolded",
    category: "foodie" as any,
    theme: null,
    requiredItems: ["various foods", "blindfold", "small spoons"],
    minPlayers: 2,
    maxPlayers: 4,
    estimatedDuration: 4,
    difficulty: "medium" as any,
    instructions: "One player is blindfolded. Others prepare 5 different foods. Blindfolded player tastes and guesses each item. Most correct guesses wins.",
    videoUrl: null,
    hasTimer: false,
    timerDuration: null,
    gameType: "competitive" as any,
    isPremium: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
] as unknown as Game[];

// Helper functions for working with games data
export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getGamesByCategory = (category: string): Game[] => {
  return games.filter(game => game.category === category);
};

export const getGamesByTheme = (theme: string): Game[] => {
  return games.filter(game => game.theme === theme);
};

export const getFreeGames = (): Game[] => {
  return games.filter(game => !game.isPremium);
};

export const getPremiumGames = (): Game[] => {
  return games.filter(game => game.isPremium);
};

export const getGamesByPlayerCount = (playerCount: number): Game[] => {
  return games.filter(game => 
    playerCount >= game.minPlayers && playerCount <= game.maxPlayers
  );
};

export const getGamesByRequiredItems = (availableItems: string[]): Game[] => {
  return games.filter(game => 
    game.requiredItems.every(item => 
      availableItems.some(availableItem => 
        availableItem.toLowerCase().includes(item.toLowerCase())
      )
    )
  );
};

export const getRandomGame = (filters?: {
  category?: string;
  theme?: string;
  maxPlayers?: number;
  minPlayers?: number;
  availableItems?: string[];
  isPremium?: boolean;
}): Game | undefined => {
  let filteredGames = [...games];

  if (filters) {
    if (filters.category) {
      filteredGames = filteredGames.filter(game => game.category === filters.category);
    }
    if (filters.theme) {
      filteredGames = filteredGames.filter(game => game.theme === filters.theme);
    }
    if (filters.maxPlayers) {
      filteredGames = filteredGames.filter(game => game.maxPlayers <= filters.maxPlayers!);
    }
    if (filters.minPlayers) {
      filteredGames = filteredGames.filter(game => game.minPlayers >= filters.minPlayers!);
    }
    if (filters.availableItems) {
      filteredGames = getGamesByRequiredItems(filters.availableItems);
    }
    if (filters.isPremium !== undefined) {
      filteredGames = filteredGames.filter(game => game.isPremium === filters.isPremium);
    }
  }

  if (filteredGames.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * filteredGames.length);
  return filteredGames[randomIndex];
};

export const getRandomGames = (count: number, filters?: Parameters<typeof getRandomGame>[0]): Game[] => {
  const selectedGames: Game[] = [];
  const availableGames = [...games];

  // Apply filters if provided
  let filteredGames = availableGames;
  if (filters) {
    if (filters.category) {
      filteredGames = filteredGames.filter(game => game.category === filters.category);
    }
    if (filters.theme) {
      filteredGames = filteredGames.filter(game => game.theme === filters.theme);
    }
    if (filters.maxPlayers) {
      filteredGames = filteredGames.filter(game => game.maxPlayers <= filters.maxPlayers!);
    }
    if (filters.minPlayers) {
      filteredGames = filteredGames.filter(game => game.minPlayers >= filters.minPlayers!);
    }
    if (filters.availableItems) {
      filteredGames = getGamesByRequiredItems(filters.availableItems);
    }
    if (filters.isPremium !== undefined) {
      filteredGames = filteredGames.filter(game => game.isPremium === filters.isPremium);
    }
  }

  // Randomly select games without repetition
  const shuffled = [...filteredGames].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};