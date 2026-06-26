import { Rental } from '@/types';
import { rentalsEn } from './rentals.en';
import { rentalsZhCN } from './rentals.zh-CN';

export function getRentals(locale: string): Rental[] {
  switch (locale) {
    case 'zh-CN':
      return rentalsZhCN;
    case 'en':
    default:
      return rentalsEn;
  }
}
