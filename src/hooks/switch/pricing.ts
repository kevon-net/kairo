import { SwitchPricing } from '@/types/enums';
import { useState } from 'react';

export const useSwitchPricing = () => {
  const [period, setPeriod] = useState<SwitchPricing>(SwitchPricing.ANNUALLY);

  return {
    period,
    setPeriod,
  };
};
