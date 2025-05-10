import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

export enum LanguageSEnum {
  PL = 'pl',
  EN = 'en',
}

const { PL, EN } = LanguageSEnum;
const { ROUND } = ButtonVariant;

const LANGUAGES = [
  { code: LanguageSEnum.PL, label: PL },
  { code: LanguageSEnum.EN, label: EN },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="language-switcher">
      {LANGUAGES?.map(({ code, label }) => (
        <Button key={code} variant={ROUND} active={currentLang === code} handleClick={() => changeLanguage(code)}>
          {label.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
