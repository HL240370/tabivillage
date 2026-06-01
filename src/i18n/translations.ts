import ko from './locales/ko.json';
import ja from './locales/ja.json';

export const translations = {
  ko,
  ja,
} as const;

export type AppLanguage = keyof typeof translations;

type Join<Key, Previous> = Key extends string
  ? Previous extends string
    ? `${Key}.${Previous}`
    : never
  : never;

type LeafPaths<T> = T extends string
  ? never
  : {
      [Key in keyof T & string]: T[Key] extends string ? Key : Join<Key, LeafPaths<T[Key]>>;
    }[keyof T & string];

export type TranslationKey = LeafPaths<typeof ko>;

export const supportedLanguages: AppLanguage[] = ['ko', 'ja'];
export const defaultLanguage: AppLanguage = 'ko';

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return supportedLanguages.includes(value as AppLanguage);
}

export function translate(language: AppLanguage, key: TranslationKey, params?: Record<string, string | number>) {
  const template = getNestedValue(translations[language], key) ?? getNestedValue(translations[defaultLanguage], key) ?? key;

  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (text, [paramKey, value]) => text.replaceAll(`{{${paramKey}}}`, String(value)),
    template,
  );
}

function getNestedValue(resource: typeof ko, key: TranslationKey) {
  return key.split('.').reduce<unknown>((currentValue, path) => {
    if (typeof currentValue !== 'object' || currentValue === null) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[path];
  }, resource) as string | undefined;
}
