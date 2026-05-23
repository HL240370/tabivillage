import { Text } from 'react-native';

export type GoldDisplayProps = {
  gold: number;
};

export function GoldDisplay({ gold }: GoldDisplayProps) {
  return <Text>{gold} G</Text>;
}

export default GoldDisplay;
