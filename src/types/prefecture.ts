import type { JapanRegionId } from "./regions";
import type { RewardId } from "./rewards";

export type Prefecture = {
  id: PrefectureId;
  nameKo: string;
  nameJa: string;
  regionId: JapanRegionId;

  // 유저 상태
  isVisited: boolean;
  visitedAt: number | null;

  // 이 도도부현 방문으로 얻는 보상
  rewardIds: RewardId[];
};

//都道府県の管理
export type PrefectureId =
  | "hokkaido"
  | "aomori"
  | "iwate"
  | "miyagi"
  | "akita"
  | "yamagata"
  | "fukushima"
  | "ibaraki"
  | "tochigi"
  | "gunma"
  | "saitama"
  | "chiba"
  | "tokyo"
  | "kanagawa"
  | "niigata"
  | "toyama"
  | "ishikawa"
  | "fukui"
  | "yamanashi"
  | "nagano"
  | "gifu"
  | "shizuoka"
  | "aichi"
  | "mie"
  | "shiga"
  | "kyoto"
  | "osaka"
  | "hyogo"
  | "nara"
  | "wakayama"
  | "tottori"
  | "shimane"
  | "okayama"
  | "hiroshima"
  | "yamaguchi"
  | "tokushima"
  | "kagawa"
  | "ehime"
  | "kochi"
  | "fukuoka"
  | "saga"
  | "nagasaki"
  | "kumamoto"
  | "oita"
  | "miyazaki"
  | "kagoshima"
  | "okinawa";