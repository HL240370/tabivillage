import { Link } from 'expo-router';
import type { ImageSourcePropType } from 'react-native';
import { ImageBackground, Pressable, Text, View } from 'react-native';

import { useTranslation } from '@/i18n';

const TITLE_BACKGROUND_SOURCE: ImageSourcePropType | null = null;

export default function IndexScreen() {
  const { t } = useTranslation();

  const content = (
    <Link href="/village" asChild>
      <Pressable className="flex-1 items-center justify-center p-6">
        <View className="items-center gap-4">
          <Text className="text-[42px] font-extrabold text-slate-800">{t('app.title')}</Text>
          <Text className="text-lg font-semibold text-slate-600">{t('titleScreen.startPrompt')}</Text>
        </View>
      </Pressable>
    </Link>
  );

  if (TITLE_BACKGROUND_SOURCE) {
    return (
      <ImageBackground source={TITLE_BACKGROUND_SOURCE} className="flex-1" resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return <View className="flex-1 bg-sky-100">{content}</View>;
}
