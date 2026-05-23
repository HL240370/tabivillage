import { StyleSheet, View } from 'react-native';

export type ExpBarProps = {
  currentExp: number;
  requiredExp: number;
};

export function ExpBar({ currentExp, requiredExp }: ExpBarProps) {
  const progress = requiredExp > 0 ? Math.min(currentExp / requiredExp, 1) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#d9d9d9',
  },
  fill: {
    height: '100%',
    backgroundColor: '#3f8cff',
  },
});

export default ExpBar;
