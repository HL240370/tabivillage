import type { HouseData } from '@/types/house';

export type HouseSpawnPoint = {
  id: string;
  xPercent: number;
  yPercent: number;
};

export type PlacedHouseData = HouseData & {
  spawnPointId: string;
};

export const HOUSE_SPAWN_POINTS: HouseSpawnPoint[] = [
  { id: 'front-left', xPercent: 22, yPercent: 62 },
  { id: 'front-right', xPercent: 76, yPercent: 62 },
  { id: 'center', xPercent: 50, yPercent: 48 },
  { id: 'back-left', xPercent: 30, yPercent: 34 },
  { id: 'back-right', xPercent: 68, yPercent: 34 },
];

export const INITIAL_HOUSES: HouseData[] = [
  {
    id: 'house_01',
    nameKey: 'houses.house01.name',
    level: 1,
    skinId: 'default_house',
    region: 'hokkaido',
    goldPerHour: 12,
    expPerHour: 5,
    isUnlocked: true,
  },
  {
    id: 'house_02',
    nameKey: 'houses.house02.name',
    level: 1,
    skinId: 'default_house',
    region: 'tohoku',
    goldPerHour: 16,
    expPerHour: 7,
    isUnlocked: true,
  },
  {
    id: 'house_03',
    nameKey: 'houses.house03.name',
    level: 1,
    skinId: 'default_house',
    region: 'kanto',
    goldPerHour: 20,
    expPerHour: 9,
    isUnlocked: true,
  },
  {
    id: 'house_04',
    nameKey: 'houses.house04.name',
    level: 1,
    skinId: 'default_house',
    region: 'chubu',
    goldPerHour: 24,
    expPerHour: 11,
    isUnlocked: true,
  },
  {
    id: 'house_05',
    nameKey: 'houses.house05.name',
    level: 1,
    skinId: 'default_house',
    region: 'kansai',
    goldPerHour: 28,
    expPerHour: 13,
    isUnlocked: true,
  },
];

export function getUnlockedHouseCount(level: number) {
  return Math.max(1, Math.min(level, HOUSE_SPAWN_POINTS.length));
}

export function getHouseSpawnPoint(spawnPointId: string) {
  return HOUSE_SPAWN_POINTS.find((spawnPoint) => spawnPoint.id === spawnPointId);
}

export function createPlacedHousesForLevel(level: number) {
  const houseCount = getUnlockedHouseCount(level);
  const shuffledSpawnPoints = shuffle(HOUSE_SPAWN_POINTS);

  return INITIAL_HOUSES.slice(0, houseCount).map<PlacedHouseData>((house, index) => ({
    ...house,
    spawnPointId: shuffledSpawnPoints[index].id,
  }));
}

export function fillHousesForLevel(currentHouses: PlacedHouseData[], level: number) {
  const nextHouseCount = getUnlockedHouseCount(level);

  if (currentHouses.length >= nextHouseCount) {
    return currentHouses;
  }

  const usedSpawnPointIds = new Set(currentHouses.map((house) => house.spawnPointId));
  const emptySpawnPoints = HOUSE_SPAWN_POINTS.filter((spawnPoint) => !usedSpawnPointIds.has(spawnPoint.id));
  const housesToAdd = INITIAL_HOUSES.slice(currentHouses.length, nextHouseCount);

  return housesToAdd.reduce<PlacedHouseData[]>((houses, house) => {
    const spawnPoint = pickRandom(emptySpawnPoints.filter((point) => !houses.some((item) => item.spawnPointId === point.id)));

    if (!spawnPoint) {
      return houses;
    }

    return [
      ...houses,
      {
        ...house,
        spawnPointId: spawnPoint.id,
      },
    ];
  }, currentHouses);
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
