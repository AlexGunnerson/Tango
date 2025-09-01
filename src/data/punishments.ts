import type { Punishment } from '../types/common';

// Mock punishments data - in a real app, this would come from an API or database
export const punishments: Punishment[] = [
  {
    id: "punishment-001",
    title: "Victory Speech",
    description: "Read the winner's concession speech praising their incredible skills",
    category: "speech" as any,
    duration: 30,
    isActive: true
  },
  {
    id: "punishment-002",
    title: "Dramatic Bow",
    description: "Perform an overly dramatic bow while declaring the winner as your superior",
    category: "performance" as any,
    duration: 15,
    isActive: true
  },
  {
    id: "punishment-003",
    title: "Victory Dance",
    description: "Perform a 30-second victory dance for the winner",
    category: "performance" as any,
    duration: 30,
    isActive: true
  },
  {
    id: "punishment-004",
    title: "Compliment Marathon",
    description: "Give the winner 5 genuine compliments about their gaming skills",
    category: "speech" as any,
    duration: 45,
    isActive: true
  },
  {
    id: "punishment-005",
    title: "Royal Treatment",
    description: "Address the winner as 'Your Majesty' for the next 5 minutes",
    category: "speech" as any,
    duration: 300,
    isActive: true
  }
] as Punishment[];

// Helper functions for working with punishments data
export const getPunishmentById = (id: string): Punishment | undefined => {
  return punishments.find(punishment => punishment.id === id);
};

export const getPunishmentsByCategory = (category: string): Punishment[] => {
  return punishments.filter(punishment => punishment.category === category);
};

export const getActivePunishments = (): Punishment[] => {
  return punishments.filter(punishment => punishment.isActive);
};

export const getRandomPunishment = (category?: string): Punishment | undefined => {
  let availablePunishments = getActivePunishments();
  
  if (category) {
    availablePunishments = availablePunishments.filter(
      punishment => punishment.category === category
    );
  }

  if (availablePunishments.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * availablePunishments.length);
  return availablePunishments[randomIndex];
};

export const getPunishmentsByDuration = (maxDuration?: number): Punishment[] => {
  let availablePunishments = getActivePunishments();
  
  if (maxDuration) {
    availablePunishments = availablePunishments.filter(punishment => 
      punishment.duration === null || (punishment.duration !== null && punishment.duration <= maxDuration)
    );
  }

  return availablePunishments;
};

// Pre-written concession speeches for the winner
export const concessionSpeeches = [
  "I stand before you today, humbled by the incredible display of skill and talent I have just witnessed. {winner}, you have shown mastery beyond my comprehension. Your victory today is not just a win, but a testament to your superior abilities. I bow to your greatness!",
  
  "Ladies and gentlemen, we have witnessed something extraordinary today. {winner} has demonstrated such remarkable prowess that I can only stand in awe. Their strategic thinking, lightning-fast reflexes, and unwavering determination have left me speechless. I am honored to have competed against such a champion!",
  
  "Never in my wildest dreams did I imagine I would face an opponent of such caliber. {winner}, you have redefined what it means to be a true competitor. Your victory today will be remembered for generations. I am but a mere mortal in the presence of your gaming divinity!",
  
  "I came here thinking I had a chance, but {winner} has shown me what true excellence looks like. Their performance today was nothing short of legendary. I tip my hat to the superior player, the master of games, the one and only {winner}!",
  
  "Words cannot express how thoroughly outplayed I have been today. {winner}, you have elevated this competition to an art form. Your victory is so complete, so decisive, that I can only applaud and acknowledge your supreme dominance!"
];

export const getRandomConcessionSpeech = (winnerName: string): string => {
  const randomIndex = Math.floor(Math.random() * concessionSpeeches.length);
  return concessionSpeeches[randomIndex].replace('{winner}', winnerName);
};