export type RewardId = string;

export type Reward = {
  id: RewardId;
  nameKo: string;
  nameJa: string;
  type: RewardType;
  descriptionKo?: string;
  descriptionJa?: string;
  imagePath?: string;
};

export type RewardType =
  | "building"
  | "decoration"
  | "character"
  | "currency"
  | "title";