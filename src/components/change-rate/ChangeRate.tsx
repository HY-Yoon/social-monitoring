import './ChangeRate.css';
import { getChangeRateInfo } from '@/utils/changeRate';

type ChangeRateProps = {
  changeRate: number;
  unit?: string;
};

const ChangeRate = ({ changeRate, unit }: ChangeRateProps) => {
  const { changeIcon, growthType, displayRate } = getChangeRateInfo(changeRate);

  const isUnchanged = growthType === 'unchanged';

  return (
    <span className={`is-${growthType} change-rate`}>
      <span>{isUnchanged ? '-' : `${changeIcon}${displayRate}`}</span>

      {unit && !isUnchanged && <span>{unit}</span>}
    </span>
  );
};

export default ChangeRate;
