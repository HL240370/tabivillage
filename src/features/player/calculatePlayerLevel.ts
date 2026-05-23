import { levelTable } from '@/data/levelTable';

export const calculatePlayerLevel = (totalExp: number) => {
  const currentLevelData = levelTable
    .filter((levelData) => totalExp >= levelData.requiredTotalExp)
    .at(-1);

  return currentLevelData ?? levelTable[0];
};
