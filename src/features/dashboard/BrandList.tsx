import type { Brand } from "../../types/brand";
import BrandCard from "./BrandCard";
import './BrandList.css';

type BrandListProps = {
    brandList: Brand[];
    selectedBrandSeq: number | null;
    onBrandSelect: (brandSeq: number) => void;
};

const BrandList = ({ brandList, selectedBrandSeq, onBrandSelect }: BrandListProps) => {
    return (
        <div className="brand-list">
            {brandList.map((brand) => (
                <BrandCard 
                    key={brand.brandSeq} 
                    brand={brand} 
                    isSelected={selectedBrandSeq === brand.brandSeq}
                    onClick={() => onBrandSelect(brand.brandSeq)}
                />
            ))}
        </div>
    )
}   

export default BrandList;

