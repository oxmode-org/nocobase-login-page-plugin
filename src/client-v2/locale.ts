import { useTranslation } from 'react-i18next';
import pkg from '../../package.json';

export const NAMESPACE = pkg.name;

export const useT = () => {
  const { t } = useTranslation(NAMESPACE);
  return (key: string) => String(t(key));
};
