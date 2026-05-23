import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>47 Villages</Text>
      <Link href="/village" style={styles.link}>
        Start Village
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  link: {
    fontSize: 16,
  },
});

