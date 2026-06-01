import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createPlacedHousesForLevel,
  fillHousesForLevel,
  getHouseSpawnPoint,
  HOUSE_SPAWN_POINTS,
  type PlacedHouseData,
} from '@/data/initialHouses';
import { levelTable } from '@/data/levelTable';
import { useTranslation } from '@/i18n';
import type { PlayerData } from '@/types/player';

const VILLAGE_BACKGROUND_SOURCE: ImageSourcePropType | null = null;
const HOUSE_SKIN_SOURCES: Partial<Record<string, ImageSourcePropType>> = {};

const INITIAL_PLAYER: PlayerData = {
  level: 1,
  totalExp: 0,
  gold: 0,
};

const CLAIM_REWARD_GOLD = 100;
const CLAIM_REWARD_EXP = 120;

export default function VillageScreen() {
  const { t } = useTranslation();
  const [player, setPlayer] = useState(INITIAL_PLAYER);
  const [placedHouses, setPlacedHouses] = useState<PlacedHouseData[]>(() =>
    createPlacedHousesForLevel(INITIAL_PLAYER.level),
  );

  const levelProgress = useMemo(() => getLevelProgress(player), [player]);

  const handleClaimReward = () => {
    const nextTotalExp = player.totalExp + CLAIM_REWARD_EXP;
    const nextLevel = getLevelFromTotalExp(nextTotalExp);

    setPlayer({
      ...player,
      gold: player.gold + CLAIM_REWARD_GOLD,
      totalExp: nextTotalExp,
      level: nextLevel,
    });
    setPlacedHouses((currentHouses) => fillHousesForLevel(currentHouses, nextLevel));
  };

  const content = (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.profileBox}>
          <Text style={styles.profileName}>{t('village.playerName')}</Text>
          <Text style={styles.profileText}>{t('village.level', { level: player.level })}</Text>
          <View style={styles.expTrack}>
            <View style={[styles.expFill, { width: `${levelProgress.percent}%` }]} />
          </View>
          <Text style={styles.profileText}>
            {t('village.exp', { current: levelProgress.current, required: levelProgress.required })}
          </Text>
          <Text style={styles.profileText}>{t('village.title', { title: t('titles.beginnerMayor') })}</Text>
        </View>

        <Link href="/settings" asChild>
          <Pressable style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>{t('village.settings')}</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.villageStage}>
        <Text style={styles.goldText}>{t('village.gold', { gold: player.gold })}</Text>

        {HOUSE_SPAWN_POINTS.map((spawnPoint) => (
          <View key={spawnPoint.id} style={[styles.spawnSlot, getSpawnPointStyle(spawnPoint.xPercent, spawnPoint.yPercent)]} />
        ))}

        {placedHouses.map((house) => (
          <HouseSlot key={house.id} house={house} />
        ))}
      </View>

      <View style={styles.bottomBar}>
        <Link href="/shop" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>{t('village.shop')}</Text>
          </Pressable>
        </Link>

        <Link href="/map" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>{t('village.map')}</Text>
          </Pressable>
        </Link>

        <Pressable style={[styles.navButton, styles.rewardButton]} onPress={handleClaimReward}>
          <Text style={styles.rewardButtonText}>{t('village.claimReward')}</Text>
        </Pressable>

        <Link href="/inventory" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>{t('village.inventory')}</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>{t('village.menu')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  if (VILLAGE_BACKGROUND_SOURCE) {
    return (
      <ImageBackground source={VILLAGE_BACKGROUND_SOURCE} style={styles.container} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return <View style={[styles.container, styles.backgroundPlaceholder]}>{content}</View>;
}

function HouseSlot({ house }: { house: PlacedHouseData }) {
  const { t } = useTranslation();
  const spawnPoint = getHouseSpawnPoint(house.spawnPointId);
  const houseSkinSource = house.skinId ? HOUSE_SKIN_SOURCES[house.skinId] : null;

  if (!spawnPoint) {
    return null;
  }

  return (
    <View style={[styles.house, getSpawnPointStyle(spawnPoint.xPercent, spawnPoint.yPercent)]}>
      {houseSkinSource ? (
        <Image source={houseSkinSource} style={styles.houseImage} resizeMode="contain" />
      ) : (
        <View style={styles.housePlaceholder}>
          <Text style={styles.houseName}>{t(house.nameKey)}</Text>
        </View>
      )}
    </View>
  );
}

function getLevelFromTotalExp(totalExp: number) {
  return levelTable.reduce((currentLevel, entry) => {
    if (totalExp >= entry.requiredTotalExp) {
      return entry.level;
    }

    return currentLevel;
  }, 1);
}

function getLevelProgress(player: PlayerData) {
  const currentLevel = levelTable.find((entry) => entry.level === player.level) ?? levelTable[0];
  const nextLevel = levelTable.find((entry) => entry.level === player.level + 1);

  if (!nextLevel) {
    return {
      current: player.totalExp - currentLevel.requiredTotalExp,
      required: player.totalExp - currentLevel.requiredTotalExp,
      percent: 100,
    };
  }

  const current = player.totalExp - currentLevel.requiredTotalExp;
  const required = nextLevel.requiredTotalExp - currentLevel.requiredTotalExp;

  return {
    current,
    required,
    percent: Math.min(100, Math.max(0, (current / required) * 100)),
  };
}

function getSpawnPointStyle(xPercent: number, yPercent: number) {
  return {
    left: `${xPercent}%` as const,
    top: `${yPercent}%` as const,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPlaceholder: {
    backgroundColor: '#e7f4ed',
  },
  safeArea: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  topBar: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  profileBox: {
    minWidth: 180,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.78)',
    gap: 4,
  },
  profileName: {
    color: '#1f2933',
    fontSize: 16,
    fontWeight: '700',
  },
  profileText: {
    color: '#334e68',
    fontSize: 12,
    fontWeight: '600',
  },
  expTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#cbd5df',
  },
  expFill: {
    height: '100%',
    backgroundColor: '#4f9a94',
  },
  settingsButton: {
    minWidth: 56,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  settingsButtonText: {
    color: '#1f2933',
    fontWeight: '700',
  },
  villageStage: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  goldText: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    color: '#1f2933',
    fontSize: 14,
    fontWeight: '700',
  },
  spawnSlot: {
    position: 'absolute',
    width: 82,
    height: 82,
    marginLeft: -41,
    marginTop: -41,
    borderWidth: 1,
    borderRadius: 41,
    borderStyle: 'dashed',
    borderColor: 'rgba(31,41,51,0.28)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  house: {
    position: 'absolute',
    width: 92,
    height: 104,
    marginLeft: -46,
    marginTop: -74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  housePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.86)',
    padding: 8,
  },
  houseName: {
    color: '#1f2933',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomBar: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  navButton: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.82)',
    paddingHorizontal: 6,
  },
  rewardButton: {
    flex: 1.4,
    backgroundColor: '#2f6f6b',
  },
  navButtonText: {
    color: '#1f2933',
    fontSize: 13,
    fontWeight: '700',
  },
  rewardButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
