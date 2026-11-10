import { formatDecimal } from "../../utils/format";
import './ChangeRate.css';

export const ChangeRate = ({ changeRate, unit }: { changeRate: number; unit?: string }) => {
    const roundedRate = Number(changeRate.toFixed(1));
    const displayRate = formatDecimal(changeRate);
    const growthType = roundedRate === 0 ? 'neutral' : changeRate < 0 ? 'negative':'positive'   ;
    const changeIcon = growthType === 'positive' ? '▲' : growthType === 'negative' ? '▼' : '';

    return (
        <span className={`is-${growthType} change-rate`} >
            <span>
                {changeIcon}{roundedRate !== 0 ? displayRate : '-'}
            </span>

            { unit && roundedRate !== 0 && <span>{unit}</span>}
        </span>
    )
    
}
