import { Pricing as SwitchPricing } from '@/enums/switch';
import { Discount } from '@/types/static';
import { useState } from 'react';

export const useSwitchPricing = () => {
  const [period, setPeriod] = useState<SwitchPricing>(SwitchPricing.ANNUALLY);

  const getDiscount = (prices: Discount) =>
    ((prices.initial - prices.current) / prices.initial) * 100;

  return {
    period,
    setPeriod,
    getDiscount,
  };
};
