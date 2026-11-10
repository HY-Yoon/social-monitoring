import './ChangeRate.css';
import { formatDecimal } from '../../utils/format'; 

type ChangeRateProps = {
    changeRate: number;
    unit?: string;
};  

const ChangeRate = ({ changeRate, unit }: ChangeRateProps) => {
    const roundedRate = Number(changeRate.toFixed(1));
    const growthType =
        roundedRate === 0
            ? 'neutral'
            : roundedRate < 0
              ? 'negative'
              : 'positive';

    const changeIcon =
        growthType === 'positive' ? '▲' : growthType === 'negative' ? '▼' : '';

    const isNeutral = growthType === 'neutral';
    const displayRate = formatDecimal(Math.abs(roundedRate));

    return (
        <span className={`is-${growthType} change-rate`}>
            <span>
                {isNeutral ? '-' : `${changeIcon}${displayRate}`}
            </span>

            {unit && !isNeutral && <span>{unit}</span>}
        </span>
    );
};

export default ChangeRate;