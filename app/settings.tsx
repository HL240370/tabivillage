import { Pressable, Text, View } from 'react-native';

import { useTranslation, type AppLanguage } from '@/i18n';

const LANGUAGE_OPTIONS: AppLanguage[] = ['ko', 'ja'];

export default function SettingsScreen() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <View className="flex-1 justify-center gap-6 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-900">{t('screens.settings')}</Text>

      <View className="gap-3">
        <Text className="text-base font-semibold text-slate-700">{t('settings.language')}</Text>

        <View className="flex-row gap-3">
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = language === option;

            return (
              <Pressable
                key={option}
                className={`min-h-12 flex-1 items-center justify-center rounded-lg border px-4 ${
                  isSelected ? 'border-teal-700 bg-teal-700' : 'border-slate-300 bg-white'
                }`}
                onPress={() => setLanguage(option)}>
                <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {option === 'ko' ? t('settings.korean') : t('settings.japanese')}
                </Text>
                {isSelected ? <Text className="mt-1 text-xs font-semibold text-white">{t('settings.selected')}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
