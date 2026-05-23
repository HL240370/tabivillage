import type { HouseData } from './house';
import type { InventoryData } from './inventory';
import type { PlayerData } from './player';
import type { PrefectureVisitData } from './prefecture';
import type { VillageData } from './village';

export type GameData = {
  player: PlayerData;
  houses: HouseData[];
  inventory: InventoryData;
  village: VillageData;
  prefectureVisits: PrefectureVisitData[];
  lastSavedAt: string;
};

