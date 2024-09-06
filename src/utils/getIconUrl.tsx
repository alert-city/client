import useTheme from '@/utils/switchTheme';
import { IndexConfig } from '@/routes';
import { DARK, LIGHT } from '@/shared/constants/storage';

const getIconUrl = () => {
  const { displayTheme, isSystemDark } = useTheme();
  let avatarUrl: string;
  if (displayTheme === LIGHT) {
    avatarUrl = IndexConfig.IconTheme.Light;
  } else if (displayTheme === DARK) {
    avatarUrl = IndexConfig.IconTheme.Dark;
  } else {
    if (isSystemDark) {
      avatarUrl = IndexConfig.IconTheme.Dark;
    } else {
      avatarUrl = IndexConfig.IconTheme.Light;
    }
  }
  return avatarUrl;
};

export default getIconUrl;