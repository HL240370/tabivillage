export type PrefectureVisitData = {
  id: string;
  nameKo: string;
  nameJa: string;
  region: string;
  isVisited: boolean;
  visitedAt: number | null;
  rewardIds: string[];
};
