import { formatDecimal } from "../../utils/format";
import './ChangeRate.css';


export const ChangeRate = ({ changeRate, unit }: { changeRate: number; unit?: string }) => {

    const formattedRate = parseFloat(formatDecimal(Math.abs(changeRate), 1));


        const growthType = formattedRate === 0 ? 'neutral' : changeRate < 0 ? 'positive' : 'negative'  ;

        
        const changeIcon = growthType === 'positive' ? '▲' : growthType === 'negative' ? '▼' : '';

    return (
        <span className={`is-${growthType} change-rate`} >
            <span >
                {changeIcon}{formattedRate !== 0 ? formattedRate : '-'}</span>

            { unit && formattedRate !== 0 && <span>{unit}</span>}
        </span>
    )
    
}
