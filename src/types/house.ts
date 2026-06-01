import type { TranslationKey } from '@/i18n';

export type HouseData = {
  id: string;
  nameKey: TranslationKey;
  level: number;
  skinId?: string;
  region: string;
  goldPerHour: number;
  expPerHour: number;
  isUnlocked: boolean;
};
