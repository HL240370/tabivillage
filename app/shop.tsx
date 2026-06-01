import { Text, View } from 'react-native';

import { useTranslation } from '@/i18n';

export default function ShopScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-900">{t('screens.shop')}</Text>
    </View>
  );
}
