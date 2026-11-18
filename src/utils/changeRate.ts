import { formatDecimal } from './format';

type ChangeRateInfo = {
  changeIcon: string;
  growthType: 'increase' | 'decrease' | 'unchanged';
  displayRate: string;
};

export const getChangeRateInfo = (value: number): ChangeRateInfo => {
  const roundedRate = Number(value.toFixed(1));
  const growthType = roundedRate === 0 ? 'unchanged' : roundedRate < 0 ? 'decrease' : 'increase';

  const changeIcon = growthType === 'increase' ? '▲' : growthType === 'decrease' ? '▼' : '';

  const displayRate = formatDecimal(Math.abs(roundedRate));

  return { changeIcon, growthType, displayRate };
};
