import clsx from 'clsx';
import { getChangeRateInfo } from '@/utils/changeRate';

type ChangeRateProps = {
  changeRate: number;
  unit?: string;
};

const ChangeRate = ({ changeRate, unit }: ChangeRateProps) => {
  const { changeIcon, growthType, displayRate } = getChangeRateInfo(changeRate);

  const isUnchanged = growthType === 'unchanged';

  const growthTypeClass = {
    increase: 'text-increase',
    decrease: 'text-decrease',
    unchanged: null,
  };

  return (
    <span className={clsx('inline-flex items-center', growthTypeClass[growthType])}>
      <span>{isUnchanged ? '-' : `${changeIcon}${displayRate}`}</span>

      {unit && !isUnchanged && <span>{unit}</span>}
    </span>
  );
};

export default ChangeRate;
