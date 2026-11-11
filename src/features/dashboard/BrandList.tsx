import type { Brand } from "../../types/brand";
import BrandCard from "./BrandCard";
import './BrandList.css';

type BrandListProps = {
    brandList: Brand[];
    selectedBrand: number | null;
    onBrandSelect: (brandSeq: number) => void;
};

const BrandList = ({ brandList, selectedBrand, onBrandSelect }: BrandListProps) => {
    return (
        <div className="brand-list">
            {brandList.length > 0 ? brandList.map((brand) => (
                 <BrandCard 
                     key={brand.brandSeq} 
                     brand={brand} 
                     isSelected={selectedBrand === brand.brandSeq}
                     onClick={() => onBrandSelect(brand.brandSeq)}
                 />
            )) : (
                <p>등록된 브랜드가 없습니다</p>
            )}

           
        </div>
    )
}   

export default BrandList;

