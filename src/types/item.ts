export type ItemData = {
  id: string;
  type: "houseSkin" | "background" | "bgm";
  nameKo: string;
  nameJa: string;
  description: string;
  source: "default" | "shop" | "prefectureReward";
  price?: number;
  prefectureId?: string;
};
