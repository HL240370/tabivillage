import { Text, View } from 'react-native';

export type HouseProps = {
  name?: string;
};

export function House({ name = 'House' }: HouseProps) {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}

export default House;

