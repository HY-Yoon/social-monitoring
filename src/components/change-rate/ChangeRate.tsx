import { formatDecimal } from "../../utils/format";
import './ChangeRate.css';

export const ChangeRate = ({ changeRate, unit }: { changeRate: number; unit?: string }) => {
    const formattedRate = changeRate.toFixed(1);
    const displayRate = formatDecimal(changeRate, 1);
    const growthType = formattedRate === '0.0' ? 'neutral' : changeRate < 0 ? 'negative':'positive'   ;
    const changeIcon = growthType === 'positive' ? '▲' : growthType === 'negative' ? '▼' : '';

    return (
        <span className={`is-${growthType} change-rate`} >
            <span>
                {changeIcon}{displayRate !== '0.0' ? displayRate : '-'}
            </span>

            { unit && displayRate !== '0.0' && <span>{unit}</span>}
        </span>
    )
    
}
