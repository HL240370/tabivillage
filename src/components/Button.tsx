import { Pressable, StyleSheet, Text } from 'react-native';

export type ButtonProps = {
  title: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function Button({ title, disabled = false, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2f6fed',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default Button;

