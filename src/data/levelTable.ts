import { LevelTableEntry } from "@/types/level";

export const levelTable: LevelTableEntry[] = [
  {
    level: 1,
    requiredTotalExp: 0,
    maxHouses: 1,
  },
  {
    level: 2,
    requiredTotalExp: 120,
    maxHouses: 2,
  },
  {
    level: 3,
    requiredTotalExp: 320,
    maxHouses: 3,
  },
  {
    level: 4,
    requiredTotalExp: 650,
    maxHouses: 4,
  },
  {
    level: 5,
    requiredTotalExp: 1100,
    maxHouses: 5,
  },
] as const;