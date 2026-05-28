# src 구조 분석 문서

작성일: 2026-05-28

이 문서는 현재 `src/` 안에 만들어진 폴더와 파일이 어떤 역할을 맡고 있는지, 그리고 지금 구현 상태가 어디까지인지 정리한 문서입니다. Expo SDK 56 프로젝트이므로 작업 전 `https://docs.expo.dev/versions/v56.0.0/` 문서를 확인했습니다.

## 현재 상태 요약

- 프로젝트는 `expo-router` 기반입니다. 실제 라우트 파일은 `app/` 아래에 있고, `src/`는 화면, 컴포넌트, 타입, 데이터, 기능 로직을 보관하는 구조입니다.
- `src/types/`와 `src/data/`에는 게임의 핵심 데이터 모델이 어느 정도 잡혀 있습니다.
- `src/features/`에는 게임 규칙 로직을 둘 위치가 잡혀 있지만, 실제 구현은 일부만 들어간 상태입니다.
- `src/screens/mainScreen/`과 `src/screens/maps/`는 화면 단위 구조가 먼저 만들어져 있고, 대부분 TODO 스텁입니다.
- 현재 `app/village.tsx`, `app/map.tsx`, `app/shop.tsx`, `app/inventory.tsx`, `app/settings.tsx`는 단순 placeholder 화면입니다. `src/screens/mainScreen/MainScreen.tsx`나 `src/screens/maps/MapsScreen.tsx`를 아직 import해서 쓰지 않습니다.
- `npx.cmd tsc --noEmit` 기준 TypeScript 컴파일은 통과합니다.

## 전체 의도

현재 구조는 크게 두 축으로 나뉩니다.

1. 방치형 마을 만들기
   - 플레이어 레벨, 골드, 경험치, 집, 집 위치, 방치 보상, 상점 구매, 저장 데이터가 이 흐름에 속합니다.

2. 일본 47개 도도부현 방문/지도 진행도
   - 도도부현 목록, 지역, 방문 상태, 지역 완료 보상, 지도 화면, 지도 테마, 위치 기반 판정이 이 흐름에 속합니다.

## app/와 src/의 관계

`app/`는 Expo Router의 실제 URL/화면 진입점입니다.

- `app/_layout.tsx`
  - 현재 `<Stack />`만 반환합니다.
  - 탭 UI나 공통 레이아웃은 아직 연결되어 있지 않습니다.

- `app/index.tsx`
  - 앱 첫 화면입니다.
  - `47 Villages` 제목과 `/village`로 가는 링크만 있습니다.

- `app/village.tsx`
  - 현재 `Village` 텍스트만 보여주는 placeholder입니다.
  - 추후 `src/screens/mainScreen/MainScreen.tsx`를 연결할 가능성이 높습니다.

- `app/map.tsx`
  - 현재 `Japan Map` 텍스트만 보여주는 placeholder입니다.
  - 추후 `src/screens/maps/MapsScreen.tsx`를 연결할 가능성이 높습니다.

- `app/shop.tsx`, `app/inventory.tsx`, `app/settings.tsx`
  - 각각 `Shop`, `Inventory`, `Settings` 텍스트만 보여주는 placeholder입니다.

즉, 지금 `src/screens/`는 화면 구현을 담을 준비 장소이고, `app/`의 실제 라우트에는 아직 본격 연결되지 않은 상태입니다.

## src 폴더별 역할

### `src/types/`

게임 전체에서 공유하는 TypeScript 타입을 모아둔 곳입니다. 저장 데이터, 플레이어, 집, 아이템, 보상, 도도부현, 지역 같은 도메인 모델이 여기에 있습니다.

### `src/data/`

정적 게임 데이터를 모아둔 곳입니다. 레벨 테이블, 47개 도도부현, 지역 목록, 보상 목록, 상점 아이템 같은 데이터가 여기에 있습니다.

### `src/features/`

순수 게임 규칙과 상태 변경 로직을 넣는 곳입니다. 예를 들면 경험치로 레벨 계산, 레벨에 따라 집 해금, 방치 보상 계산, 상점 구매, 도도부현 해금 같은 로직입니다.

### `src/screens/`

화면 단위 구현을 넣는 곳입니다. 현재는 `mainScreen`과 `maps` 두 축이 있습니다.

- `mainScreen`: 방치형 마을 메인 화면
- `maps`: 일본 전국 지도 및 도도부현 방문 진행도 화면

각 화면 폴더 안에는 `components`, `types`, `data`, `features`, `utils`처럼 화면 전용 하위 구조가 들어갑니다.

### `src/components/`

여러 화면에서 재사용할 공통 UI 컴포넌트를 두는 곳입니다. 버튼, 카드, 테마 텍스트/뷰, 외부 링크, 탭, 접기 패널 등이 있습니다.

### `src/hooks/`

테마와 컬러 스킴 관련 React hook을 모아둔 곳입니다.

### `src/constants/`

색상, 폰트, spacing 같은 앱 공통 상수를 모아둔 곳입니다.

### `src/storage/`

게임 저장/불러오기 API를 둘 곳입니다. 현재는 저장 키와 스텁 함수만 있습니다.

### `src/utils/`

특정 화면에 묶이지 않는 범용 유틸리티를 둡니다. 현재는 위도/경도 거리 계산 함수가 있습니다.

## 핵심 데이터 흐름

현재 타입 기준으로 게임 저장 데이터의 중심은 `GameData`입니다.

```ts
GameData
  player: PlayerData
  houses: HouseData[]
  inventory: InventoryData
  village: VillageData
  prefectureVisits: PrefectureVisitData[]
  lastSavedAt: string
```

예상 흐름은 다음과 같습니다.

1. 앱 시작 시 `storage/gameStorage.ts`의 `loadGame()`으로 저장 데이터를 불러옵니다.
2. 저장 데이터가 없으면 `data/`의 정적 데이터와 초기값으로 새 게임 상태를 만듭니다.
3. 플레이어 경험치는 `features/player/calculatePlayerLevel.ts`로 레벨 정보와 최대 집 수를 계산합니다.
4. 집 데이터는 시간당 골드/경험치를 생산하고, 방치 시간은 `features/idle/calculateIdleReward.ts`에서 보상으로 환산될 예정입니다.
5. 도도부현 방문 기록은 `PrefectureVisitData[]`에 쌓이고, 지역 완료 보상은 `regions.ts`와 `rewards.ts`를 통해 연결됩니다.
6. 변경된 게임 상태는 `storage/gameStorage.ts`의 `saveGame()`으로 저장될 예정입니다.

현재 이 흐름 중 실제 구현된 것은 레벨 계산과 거리 계산 정도이고, 저장/구매/방치 보상/방문 해금은 스텁입니다.

## 파일별 상세 분석

### `src/types/game.ts`

`GameData`를 정의합니다. 전체 저장 데이터의 루트 타입입니다.

- `player`: 플레이어 레벨/경험치/골드
- `houses`: 마을에 존재하는 집 목록
- `inventory`: 보유 아이템과 장착 상태
- `village`: 배경과 집 배치 정보
- `prefectureVisits`: 도도부현 방문 진행도
- `lastSavedAt`: 마지막 저장 시각

현재 게임 전체 상태를 한 객체로 저장하려는 구조입니다.

### `src/types/player.ts`

`PlayerData`를 정의합니다.

- `level`: 현재 레벨
- `totalExp`: 누적 경험치
- `gold`: 보유 골드

레벨은 `totalExp`에서 계산할 수 있으므로, 저장값으로 둘지 계산값으로 둘지는 추후 정책 결정이 필요합니다.

### `src/types/house.ts`

`HouseData`를 정의합니다.

- `id`: 집 식별자
- `name`: 표시 이름
- `level`: 집 레벨
- `skinId`: 장착한 집 스킨 ID
- `region`: 연결 지역 문자열
- `goldPerHour`: 시간당 골드 생산량
- `expPerHour`: 시간당 경험치 생산량
- `inUnlocked`: 해금 여부로 보이는 boolean

주의점: `inUnlocked`는 의미상 `isUnlocked` 오타일 가능성이 높습니다. 아직 이 필드를 사용하는 코드는 없습니다.

### `src/types/inventory.ts`

`InventoryData`를 정의합니다.

- `ownedItemIds`: 보유 아이템 ID 목록
- `equippedBackgroundId`: 장착 중인 배경 ID
- `equippedBgmId`: 장착 중인 BGM ID 또는 `null`

아이템 상세 정보는 `src/types/item.ts`와 `src/data/items.ts`가 담당합니다.

### `src/types/item.ts`

상점/보상/기본 지급 아이템의 공통 타입 `ItemData`를 정의합니다.

- `type`: `houseSkin`, `background`, `bgm`
- `source`: `default`, `shop`, `prefectureReward`
- `price`: 상점 아이템일 때 사용할 가격
- `prefectureId`: 도도부현 보상과 연결할 때 사용할 ID

주의점: `src/data/items.ts`의 `Item` 타입은 `skin`, `background`, `bgm`, `consumable`을 사용합니다. `ItemData`와 타입 설계가 아직 통일되지 않았습니다.

### `src/types/level.ts`

`LevelTableEntry`를 정의합니다.

- `level`: 레벨
- `requiredTotalExp`: 해당 레벨에 필요한 누적 경험치
- `maxHouses`: 해당 레벨에서 허용되는 최대 집 수

### `src/types/prefecture.ts`

도도부현 관련 타입을 정의합니다.

- `Prefecture`: 정적 도도부현 데이터
- `PrefectureVisitData`: 플레이어별 방문 진행도
- `PrefectureId`: 47개 도도부현 ID union

`Prefecture` 안에는 `isVisited`, `visitedAt`이 들어 있습니다. 동시에 플레이어 방문 데이터용 `PrefectureVisitData`도 있으므로, 정적 데이터와 유저 진행 데이터를 나눌지 합칠지 추후 정리가 필요합니다.

현재 `PrefectureId`는 47개 ID를 모두 포함합니다.

### `src/types/regions.ts`

일본 지역 타입을 정의합니다.

- `JapanRegion`: 지역 ID, 한국어 이름, 일본어 이름, 보상 ID 목록
- `JapanRegionId`: 9개 지역 ID union

지역 ID는 `hokkaido`, `tohoku`, `kanto`, `chubu`, `kansai`, `chugoku`, `shikoku`, `kyushu`, `okinawa`입니다.

### `src/types/rewards.ts`

보상 타입을 정의합니다.

- `RewardId`: string alias
- `Reward`: 보상 데이터
- `RewardType`: `building`, `decoration`, `character`, `currency`, `title`

현재 실제 보상 데이터는 지역 정복 칭호 위주입니다.

### `src/types/village.ts`

마을 화면 배치 데이터를 정의합니다.

- `backgroundId`: 장착된 배경
- `housePositions`: 집 ID와 x/y 위치 목록

집 자체의 생산 정보는 `HouseData`, 배치 정보는 `VillageData`로 분리되어 있습니다.

### `src/types/css.d.ts`

CSS import를 TypeScript가 이해하도록 선언합니다.

- `*.module.css`: CSS module 객체로 import 가능
- `*.css`: 일반 CSS import 가능

웹용 `animated-icon.module.css`와 `global.css`를 쓰기 위한 선언입니다.

## `src/data/` 상세

### `src/data/levelTable.ts`

레벨 테이블을 정의합니다. 현재 1~5레벨까지 있습니다.

- 레벨 1: 누적 경험치 0, 최대 집 1
- 레벨 2: 누적 경험치 120, 최대 집 2
- 레벨 3: 누적 경험치 320, 최대 집 3
- 레벨 4: 누적 경험치 650, 최대 집 4
- 레벨 5: 누적 경험치 1100, 최대 집 5

`calculatePlayerLevel()`이 이 데이터를 사용합니다.

### `src/data/prefectures.ts`

47개 도도부현 정적 데이터를 정의합니다.

- 데이터 개수: 47개
- 각 항목은 `id`, `nameKo`, `nameJa`, `regionId`, `isVisited`, `visitedAt`, `rewardIds`를 가집니다.
- 현재 모든 `isVisited`는 `false`, `visitedAt`은 `null`, `rewardIds`는 빈 배열입니다.

주의점: 정적 데이터에 `isVisited` 같은 플레이어 진행 상태가 들어 있습니다. 저장 데이터와 구분하려면 나중에 `Prefecture`는 정적 정보만, `PrefectureVisitData`는 유저 상태만 담당하도록 정리하는 편이 좋습니다.

### `src/data/regions.ts`

9개 일본 지역 데이터를 정의합니다.

- 데이터 개수: 9개
- export 이름은 `JAPANREGION`입니다.
- 각 지역은 완료 보상 ID를 1개씩 가집니다.

주의점: 상수 이름은 보통 복수형 `JAPAN_REGIONS`나 `JAPAN_REGIONS`처럼 쓰면 읽기 좋습니다. 현재 이름도 컴파일에는 문제 없습니다.

### `src/data/rewards.ts`

지역 완료 보상 데이터를 정의합니다.

- 데이터 개수: 9개
- export 이름은 `REWARD`입니다.
- 현재 모두 `title` 타입 보상입니다.
- 각 보상은 한국어/일본어 이름과 설명을 가집니다.

주의점: 상수 이름은 복수형 `REWARDS`가 자연스럽습니다. 현재 이름도 컴파일에는 문제 없습니다.

### `src/data/items.ts`

아이템 목록을 정의하려는 파일입니다.

- 현재 `Item` 타입과 빈 배열 `items`만 있습니다.
- `items`는 아직 비어 있습니다.

주의점: `src/types/item.ts`의 `ItemData`와 타입 필드가 다릅니다. 앞으로 하나로 통일해야 합니다.

### `src/data/shopItems.ts`

상점 판매 목록을 정의하려는 파일입니다.

- `ShopItem`: `itemId`, `price`
- `shopItems`: 현재 빈 배열

상점 구매 로직은 `src/features/shop/purchaseItem.ts`와 연결될 예정입니다.

### `src/data/initialHouses.ts`

초기 집 5개 데이터를 정의하려는 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.
- 실제 초기 집 데이터는 아직 없습니다.

## `src/features/` 상세

### `src/features/player/calculatePlayerLevel.ts`

누적 경험치로 현재 레벨 데이터를 계산합니다.

- `levelTable`에서 `totalExp >= requiredTotalExp`인 항목만 필터링합니다.
- 마지막 항목을 현재 레벨로 반환합니다.
- 조건에 맞는 레벨이 없으면 `levelTable[0]`을 반환합니다.

현재 실제로 동작하는 순수 로직입니다.

주의점: `levelTable`이 오름차순으로 정렬되어 있다는 전제가 있습니다.

### `src/features/player/unlockHousesByLevel.ts`

플레이어 레벨에 따라 집을 해금하는 로직을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/features/idle/calculateIdleReward.ts`

방치 보상을 계산할 함수입니다.

- 현재는 인자 없이 `0`만 반환합니다.
- 실제 구현에서는 마지막 저장 시각, 현재 시각, 집별 `goldPerHour`, `expPerHour`가 필요할 가능성이 큽니다.

### `src/features/prefecture/unlockPrefecture.ts`

도도부현 방문/해금 로직을 둘 함수입니다.

- 현재는 인자 없이 `true`만 반환합니다.
- 실제 구현에서는 위치 판정, 방문 횟수, 최초/마지막 방문 시간, 보상 지급 여부를 처리해야 합니다.

### `src/features/shop/purchaseItem.ts`

상점 구매 로직을 둘 함수입니다.

- 현재는 인자 없이 `true`만 반환합니다.
- 실제 구현에서는 골드 확인, 이미 보유한 아이템 확인, 인벤토리 갱신이 필요합니다.

## `src/storage/` 상세

### `src/storage/gameStorage.ts`

게임 저장/불러오기 API를 둘 파일입니다.

- `GAME_STORAGE_KEY`: `47villages:game`
- `loadGame()`: 현재 `null` 반환
- `saveGame()`: 현재 `undefined` 반환

현재 AsyncStorage나 SecureStore 같은 실제 저장소는 연결되어 있지 않습니다.

## `src/utils/` 상세

### `src/utils/distance.ts`

위도/경도 사이의 거리를 km 단위로 계산합니다.

- `Coordinates`: `latitude`, `longitude`
- `calculateDistanceKm(from, to)`: haversine 공식을 사용합니다.
- 내부 `toRadians()`로 degree를 radian으로 변환합니다.

현재 실제로 동작하는 범용 유틸리티입니다. 위치 기반 도도부현 판정 로직에서 사용할 수 있습니다.

## `src/screens/mainScreen/` 상세

마을 메인 화면 전용 구조입니다. 현재는 일부 작은 컴포넌트만 구현되어 있고, 화면 본체와 주요 로직은 TODO입니다.

### `src/screens/mainScreen/MainScreen.tsx`

방치형 마을 메인 화면 본체를 둘 파일입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/mainScreen/components/GoldDisplay.tsx`

골드 표시 컴포넌트입니다.

- props: `gold: number`
- 화면에는 `{gold} G` 형태로 표시합니다.

현재 실제 구현되어 있습니다.

### `src/screens/mainScreen/components/ExpBar.tsx`

경험치 진행 바 컴포넌트입니다.

- props: `currentExp`, `requiredExp`
- `requiredExp > 0`이면 `currentExp / requiredExp`로 진행률을 계산합니다.
- 최대 진행률은 `1`로 제한합니다.
- 회색 track 안에 파란 fill을 표시합니다.

주의점: 현재 `currentExp`가 누적 경험치인지 현재 레벨 안에서의 경험치인지 정책이 명확하지 않습니다. `calculatePlayerLevel()`은 누적 경험치 기반이므로, UI에서는 레벨 구간 경험치로 변환하는 로직이 추가로 필요할 수 있습니다.

### `src/screens/mainScreen/components/HouseObject.tsx`

마을 화면에 배치되는 집 오브젝트 컴포넌트를 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/mainScreen/components/IdleRewardModal.tsx`

앱 복귀 시 획득한 방치 보상을 보여줄 모달 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/mainScreen/types/mainScreenTypes.ts`

메인 화면 전용 UI 상태 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/mainScreen/types/villageObjectTypes.ts`

마을 화면에 표시되는 집/장식 오브젝트 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/mainScreen/utils/getHousePosition.ts`

집 개수에 따라 화면 배치 좌표를 계산하는 유틸리티 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

## `src/screens/maps/` 상세

일본 전국 지도 화면 전용 구조입니다. 현재는 타입, 데이터, 기능, 컴포넌트 파일이 모두 자리만 잡혀 있고 대부분 TODO입니다.

### `src/screens/maps/MapsScreen.tsx`

지도 화면 본체를 둘 파일입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/components/JapanMap.tsx`

47개 도도부현 조각을 조립해서 보여줄 지도 컴포넌트 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/components/PrefecturePiece.tsx`

개별 도도부현 지도 조각 컴포넌트 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/components/PrefectureInfoModal.tsx`

선택한 도도부현 상세 정보를 보여줄 모달 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/components/PrefectureRewardList.tsx`

도도부현에서 받을 수 있는 보상 목록 컴포넌트 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/components/MapThemeSelector.tsx`

지도 테마를 선택하는 컴포넌트 자리입니다.

- TODO에는 음식, 랜드마크, 축제, 이벤트 같은 테마가 언급되어 있습니다.
- 현재 구현은 없습니다.

### `src/screens/maps/types/mapTheme.ts`

지도 표시 테마 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/types/prefectureProgress.ts`

유저의 도도부현 방문 진행도 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.
- 전역 타입인 `PrefectureVisitData`와 역할이 겹칠 수 있어, 나중에 통합 여부를 결정해야 합니다.

### `src/screens/maps/types/prefectureReward.ts`

도도부현 방문 보상 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.
- 전역 타입인 `Reward`와 어떤 차이를 둘지 정해야 합니다.

### `src/screens/maps/types/prefectureSpecialty.ts`

도도부현 특산품/아이콘 타입을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/data/mapImages.ts`

도도부현 지도 조각 이미지의 `require` 매핑을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/data/mapIconImages.ts`

지도 아이콘 이미지의 `require` 매핑을 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/data/mapThemes.ts`

지도 테마 데이터를 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/data/prefectureRewards.ts`

도도부현 방문 보상 데이터를 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/data/prefectureSpecialties.ts`

도도부현 특산품/아이콘 데이터를 둘 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/features/createInitialPrefectureProgresses.ts`

새 게임 시작 시 47개 도도부현의 초기 방문 진행도를 생성하는 함수 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/features/getPrefectureDisplayState.ts`

방문 상태에 따라 지도 조각을 컬러/흑백 등으로 표시할 상태를 계산하는 함수 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/features/getPrefectureThemeIcon.ts`

선택된 지도 테마에 맞는 도도부현 아이콘을 반환하는 함수 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.

### `src/screens/maps/utils/findPrefectureByLocation.ts`

현재 위도/경도를 기준으로 도도부현을 찾는 유틸리티 자리입니다.

- 현재 TODO와 `export {}`만 있습니다.
- `src/utils/distance.ts`의 `calculateDistanceKm()`를 사용할 가능성이 높습니다.

## 공통 컴포넌트 상세

### `src/components/Button.tsx`

공통 버튼 컴포넌트입니다.

- props: `title`, `disabled`, `onPress`
- `Pressable` 기반입니다.
- `accessibilityRole="button"`이 설정되어 있습니다.
- disabled 상태에서는 opacity가 낮아집니다.

### `src/components/House.tsx`

집 이름을 표시하는 아주 단순한 공통 컴포넌트입니다.

- props: `name?: string`
- 기본값은 `House`

현재는 실제 집 UI라기보다 placeholder에 가깝습니다.

### `src/components/PrefectureCard.tsx`

도도부현 이름과 잠금/해금 상태를 보여주는 카드입니다.

- props: `name`, `unlocked`
- `Unlocked` 또는 `Locked` 텍스트를 표시합니다.

### `src/components/themed-text.tsx`

앱 테마 색상을 적용하는 텍스트 컴포넌트입니다.

- `type`: `default`, `title`, `small`, `smallBold`, `subtitle`, `link`, `linkPrimary`, `code`
- `themeColor`: `Colors`의 색상 키
- `useTheme()`로 현재 light/dark 색상을 가져옵니다.

### `src/components/themed-view.tsx`

앱 테마 색상을 배경으로 적용하는 View 컴포넌트입니다.

- `type`: `Colors`의 색상 키
- 현재 `lightColor`, `darkColor` props는 선언되어 있지만 실제로 사용하지 않습니다.

### `src/components/external-link.tsx`

외부 링크 컴포넌트입니다.

- 웹에서는 새 탭 target으로 열립니다.
- 네이티브에서는 기본 링크 동작을 막고 `expo-web-browser`의 `openBrowserAsync()`로 인앱 브라우저를 엽니다.

### `src/components/hint-row.tsx`

Expo Starter 템플릿 성격의 안내 행 컴포넌트입니다.

- 기본 title은 `Try editing`
- 기본 hint는 `app/index.tsx`

현재 앱 도메인 기능과 직접 관련은 약합니다.

### `src/components/web-badge.tsx`

웹에서 Expo 버전과 Expo badge 이미지를 보여주는 컴포넌트입니다.

- `expo/package.json`의 `version`을 표시합니다.
- light/dark 모드에 따라 badge 이미지를 바꿉니다.

현재 앱 도메인 기능과 직접 관련은 약합니다.

### `src/components/animated-icon.tsx`

네이티브용 animated icon/splash overlay 컴포넌트입니다.

- `AnimatedSplashOverlay()`: 파란 splash overlay를 애니메이션 후 숨깁니다.
- `AnimatedIcon()`: Expo 로고, glow 이미지, 배경 애니메이션을 보여줍니다.
- `expo-image`, `react-native-reanimated`, `react-native-worklets`를 사용합니다.

현재 이미지가 Expo 로고라 앱 브랜딩용으로는 나중에 교체될 가능성이 큽니다.

### `src/components/animated-icon.web.tsx`

웹용 animated icon 컴포넌트입니다.

- `AnimatedSplashOverlay()`는 웹에서 `null`을 반환합니다.
- 배경 gradient는 CSS module의 `.expoLogoBackground`를 사용합니다.

### `src/components/animated-icon.module.css`

웹용 animated icon 배경 스타일입니다.

- `expoLogoBackground` 클래스가 gradient 배경과 크기, border radius를 정의합니다.

### `src/components/app-tabs.tsx`

네이티브용 탭 컴포넌트입니다.

- `expo-router/unstable-native-tabs`의 `NativeTabs`를 사용합니다.
- 현재 trigger name은 `index`, `explore`입니다.
- tab icon으로 `assets/images/tabIcons/home.png`, `explore.png`를 사용합니다.

주의점:

- 현재 `app/_layout.tsx`에서 사용하지 않습니다.
- 현재 라우트에는 `explore`가 없습니다.
- 실제 라우트 구조가 `village`, `map`, `shop`, `inventory`, `settings`라면 탭 구성도 맞춰야 합니다.

### `src/components/app-tabs.web.tsx`

웹용 탭 컴포넌트입니다.

- `expo-router/ui`의 `Tabs`, `TabList`, `TabTrigger`, `TabSlot`을 사용합니다.
- 현재 `Home`은 `/`, `Explore`는 `/explore`로 연결됩니다.
- 오른쪽에 Expo Docs 외부 링크가 있습니다.

주의점:

- 현재 `app/_layout.tsx`에서 사용하지 않습니다.
- 현재 `/explore` 라우트가 없습니다.
- `Expo Starter` 텍스트와 Docs 링크가 남아 있어 템플릿 성격이 강합니다.

### `src/components/ui/collapsible.tsx`

접기/펼치기 UI 컴포넌트입니다.

- 내부 `isOpen` 상태로 열림 여부를 관리합니다.
- `expo-symbols`의 chevron 아이콘을 사용합니다.
- 열릴 때 `FadeIn` 애니메이션을 적용합니다.

## hook/constant 상세

### `src/constants/theme.ts`

앱 공통 테마 상수입니다.

- `Colors`: light/dark 색상 팔레트
- `ThemeColor`: light/dark 양쪽에 존재하는 색상 키
- `Fonts`: 플랫폼별 font family
- `Spacing`: 2, 4, 8, 16, 24, 32, 64 단위 spacing
- `BottomTabInset`: iOS 50, Android 80
- `MaxContentWidth`: 800

파일 상단에서 `@/global.css`를 import합니다. 웹 폰트 CSS 변수를 쓰기 위한 구조입니다.

### `src/global.css`

웹 전역 CSS 변수입니다.

- `--font-display`
- `--font-mono`
- `--font-rounded`
- `--font-serif`

### `src/hooks/use-color-scheme.ts`

네이티브 기본 구현입니다.

- `react-native`의 `useColorScheme`을 그대로 export합니다.

### `src/hooks/use-color-scheme.web.ts`

웹 전용 구현입니다.

- 정적 렌더링/초기 hydration 문제를 피하기 위해 hydration 전에는 `light`를 반환합니다.
- hydration 후에는 React Native의 `useColorScheme()` 값을 반환합니다.

### `src/hooks/use-theme.ts`

현재 color scheme에 맞는 theme 객체를 반환합니다.

- `unspecified`는 `light`로 처리합니다.
- `Colors[theme]`를 반환합니다.

## 현재 구현 완료에 가까운 파일

- `src/types/*`: 핵심 타입 대부분 존재
- `src/data/prefectures.ts`: 47개 도도부현 데이터 존재
- `src/data/regions.ts`: 9개 지역 데이터 존재
- `src/data/rewards.ts`: 9개 지역 완료 칭호 보상 존재
- `src/data/levelTable.ts`: 1~5레벨 테이블 존재
- `src/features/player/calculatePlayerLevel.ts`: 실제 레벨 계산 구현
- `src/utils/distance.ts`: 실제 거리 계산 구현
- `src/screens/mainScreen/components/GoldDisplay.tsx`: 골드 표시 구현
- `src/screens/mainScreen/components/ExpBar.tsx`: 경험치 바 구현
- `src/components/*`: 템플릿/공통 UI 컴포넌트 다수 구현

## 현재 TODO 또는 스텁인 파일

다음 파일들은 구조만 있고 실제 기능은 아직 없습니다.

- `src/data/initialHouses.ts`
- `src/features/player/unlockHousesByLevel.ts`
- `src/screens/mainScreen/MainScreen.tsx`
- `src/screens/mainScreen/components/HouseObject.tsx`
- `src/screens/mainScreen/components/IdleRewardModal.tsx`
- `src/screens/mainScreen/types/mainScreenTypes.ts`
- `src/screens/mainScreen/types/villageObjectTypes.ts`
- `src/screens/mainScreen/utils/getHousePosition.ts`
- `src/screens/maps/MapsScreen.tsx`
- `src/screens/maps/components/JapanMap.tsx`
- `src/screens/maps/components/MapThemeSelector.tsx`
- `src/screens/maps/components/PrefectureInfoModal.tsx`
- `src/screens/maps/components/PrefecturePiece.tsx`
- `src/screens/maps/components/PrefectureRewardList.tsx`
- `src/screens/maps/data/mapIconImages.ts`
- `src/screens/maps/data/mapImages.ts`
- `src/screens/maps/data/mapThemes.ts`
- `src/screens/maps/data/prefectureRewards.ts`
- `src/screens/maps/data/prefectureSpecialties.ts`
- `src/screens/maps/features/createInitialPrefectureProgresses.ts`
- `src/screens/maps/features/getPrefectureDisplayState.ts`
- `src/screens/maps/features/getPrefectureThemeIcon.ts`
- `src/screens/maps/types/mapTheme.ts`
- `src/screens/maps/types/prefectureProgress.ts`
- `src/screens/maps/types/prefectureReward.ts`
- `src/screens/maps/types/prefectureSpecialty.ts`
- `src/screens/maps/utils/findPrefectureByLocation.ts`

다음 파일들은 함수는 있지만 임시 반환값만 있습니다.

- `src/features/idle/calculateIdleReward.ts`: 항상 `0`
- `src/features/prefecture/unlockPrefecture.ts`: 항상 `true`
- `src/features/shop/purchaseItem.ts`: 항상 `true`
- `src/storage/gameStorage.ts`: `loadGame()`은 항상 `null`, `saveGame()`은 항상 `undefined`

## 설계상 주의할 점

### 정적 데이터와 유저 진행 상태 분리

`Prefecture`에 `isVisited`, `visitedAt`이 들어 있고, 별도로 `PrefectureVisitData`도 있습니다. 장기적으로는 다음처럼 나누는 편이 안전합니다.

- `Prefecture`: 도도부현의 변하지 않는 정보
- `PrefectureVisitData`: 유저별 방문 횟수, 방문 시각, 획득 보상

### 아이템 타입 통일

`src/types/item.ts`의 `ItemData`와 `src/data/items.ts`의 `Item` 타입이 다릅니다.

- `ItemData.type`: `houseSkin`, `background`, `bgm`
- `Item.type`: `skin`, `background`, `bgm`, `consumable`

나중에 상점/인벤토리 구현 전에 하나로 맞춰야 합니다.

### 라우트와 화면 연결

`src/screens`의 화면 본체는 아직 `app/` 라우트와 연결되어 있지 않습니다.

우선순위가 높은 연결 후보는 다음입니다.

- `app/village.tsx` -> `src/screens/mainScreen/MainScreen.tsx`
- `app/map.tsx` -> `src/screens/maps/MapsScreen.tsx`

### 탭 구조 정리

`src/components/app-tabs.tsx`, `src/components/app-tabs.web.tsx`는 현재 라우트와 맞지 않습니다.

- 현재 탭은 `Home`, `Explore` 중심입니다.
- 실제 앱은 `Village`, `Map`, `Shop`, `Inventory`, `Settings` 구조를 의도하는 것으로 보입니다.

### 저장소 구현

`gameStorage.ts`가 아직 실제 저장소에 연결되어 있지 않습니다. `package.json`에는 AsyncStorage dependency가 보이지 않으므로, 저장소를 구현하려면 사용할 라이브러리와 Expo SDK 56 호환성을 먼저 확인해야 합니다.

### 이름 정리 후보

컴파일 문제는 없지만, 읽기 쉬움을 위해 나중에 정리할 후보입니다.

- `HouseData.inUnlocked` -> `isUnlocked`
- `JAPANREGION` -> `JAPAN_REGIONS`
- `REWARD` -> `REWARDS`
- `items` 타입과 `ItemData` 타입 통합

## 추천 작업 순서

1. `GameData` 초기 상태를 생성하는 함수 만들기
2. `initialHouses.ts`에 초기 집 데이터 추가
3. `gameStorage.ts` 실제 저장/불러오기 구현
4. `calculateIdleReward()` 구현
5. `MainScreen.tsx`를 최소 플레이 가능한 화면으로 구현
6. `app/village.tsx`에서 `MainScreen` 연결
7. 도도부현 정적 데이터와 방문 진행 상태 분리
8. 지도 진행도 초기화 함수 구현
9. `MapsScreen.tsx`와 `app/map.tsx` 연결
10. 탭 라우트 구조를 실제 앱 화면에 맞게 재구성
