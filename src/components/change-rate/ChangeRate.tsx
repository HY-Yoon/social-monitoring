import clsx from 'clsx';
import { getChangeRateInfo } from '@/utils/changeRate';
import type { GrowthType } from '@/types/brand';

const growthTypeClass: Record<GrowthType, string | null> = {
  increase: 'text-increase',
  decrease: 'text-decrease',
  unchanged: null,
};

type ChangeRateProps = {
  changeRate: number;
  unit?: string;
};

const ChangeRate = ({ changeRate, unit }: ChangeRateProps) => {
  const { changeIcon, growthType, displayRate } = getChangeRateInfo(changeRate);

  const isUnchanged = growthType === 'unchanged';

  return (
    <span className={clsx('inline-flex items-center', growthTypeClass[growthType])}>
      <span>{isUnchanged ? '-' : `${changeIcon}${displayRate}`}</span>

      {unit && !isUnchanged && <span>{unit}</span>}
    </span>
  );
};

export default ChangeRate;
