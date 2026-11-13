import './ChangeRate.css';
import { getChangeRateInfo } from '../../utils/changeRate';

type ChangeRateProps = {
  changeRate: number;
  unit?: string;
};

const ChangeRate = ({ changeRate, unit }: ChangeRateProps) => {
  const { changeIcon, growthType, displayRate } = getChangeRateInfo(changeRate);

  const isNeutral = growthType === 'neutral';

  return (
    <span className={`is-${growthType} change-rate`}>
      <span>{isNeutral ? '-' : `${changeIcon}${displayRate}`}</span>

      {unit && !isNeutral && <span>{unit}</span>}
    </span>
  );
};

export default ChangeRate;
