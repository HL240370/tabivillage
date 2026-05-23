import { StyleSheet, Text, View } from 'react-native';

export type PrefectureCardProps = {
  name: string;
  unlocked?: boolean;
};

export function PrefectureCard({ name, unlocked = false }: PrefectureCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text>{unlocked ? 'Unlocked' : 'Locked'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PrefectureCard;

