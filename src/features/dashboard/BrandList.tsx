import type { Brand } from "../../types/brand";
import { ChangeRate } from "../../components/change-rate/ChangeRate";
import { formatInteger } from "../../utils/format";

export const BrandList = ({ brandList }: { brandList: Brand[] }) => {
    return (
        <div className="brand-list">
            {brandList.length > 0 ? brandList.map((brand) => (
                <div key={brand.brandSeq} className="brand-item">
                    <h3>{brand.brandName}</h3>
                    <p>Buzz Volume: {formatInteger(brand.buzzVolume)}건</p>
                    <p>Buzz Growth: <ChangeRate changeRate={brand.buzzGrowth} unit="%" /></p>
                </div>
                 
            )) : (
                <p>등록된 브랜드가 없습니다</p>
            )}

           
        </div>
    )
}   