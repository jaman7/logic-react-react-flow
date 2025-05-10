import { useTranslation } from 'react-i18next';

type TranslationFunction = (key: string, options?: any) => string;

export const useFallbackTranslation = (currentPath: string, fallbackNs = 'common'): { t: TranslationFunction } => {
  const { t: tPrimary } = useTranslation(currentPath);
  const { t: tFallback } = useTranslation(fallbackNs);

  const t: TranslationFunction = (key, options) => {
    const result = tPrimary(key, options);
    return result === key ? tFallback(key, options).toString() : result.toString();
  };

  return { t };
};
