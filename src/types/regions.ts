import type { RewardId } from "./rewards";

export type JapanRegion = {
  id: JapanRegionId;
  nameKo: string;
  nameJa: string;

  // 이 지역 완성으로 얻는 보상
  rewardIds: RewardId[];
};

export type JapanRegionId =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";
