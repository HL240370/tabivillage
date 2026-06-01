import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  defaultLanguage,
  isAppLanguage,
  translate,
  type AppLanguage,
  type TranslationKey,
} from './translations';

const LANGUAGE_STORAGE_KEY = '47villages.language';

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>(() => getDeviceLanguage());

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((storedLanguage) => {
        if (isMounted && isAppLanguage(storedLanguage)) {
          setLanguageState(storedLanguage);
        }
      })
      .catch(() => {
        // Falling back to the device language is enough for now.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => translate(language, key, params),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used inside LanguageProvider.');
  }

  return context;
}

function getDeviceLanguage(): AppLanguage {
  const deviceLanguage = getLocales()[0]?.languageCode;

  if (isAppLanguage(deviceLanguage)) {
    return deviceLanguage;
  }

  return defaultLanguage;
}
