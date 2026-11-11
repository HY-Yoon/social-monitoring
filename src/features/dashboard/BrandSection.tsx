import { useState } from "react";
import Panel from "../../components/panel/Panel";
import type { Brand } from "../../types/brand";
import { formatInteger } from "../../utils/format";
import BrandList from "./BrandList";

type OrderOption = {
    value: 'volume' | 'growth' | 'name';
    label: string;
};

const orderOptions: OrderOption[] = [
    { value: 'volume', label: '언급량순' },
    { value: 'growth', label: '증감률순' },
    { value: 'name', label: '이름순' },
];


const brandList:Brand[] = [
    { brandSeq: 1, brandName: "Example Brand", buzzVolume: 1000, buzzGrowth: 10 }, 
    { brandSeq: 2, brandName: "Another Brand", buzzVolume: 2000, buzzGrowth: 25.4 }, 
    { brandSeq: 3, brandName: "Third Brand", buzzVolume: 3000, buzzGrowth: -0.04 }, 
    { brandSeq: 4, brandName: "Fourth Brand", buzzVolume: 4000, buzzGrowth: -85.652 }, 
    { brandSeq: 5, brandName: "Fifth Brand", buzzVolume: 5000, buzzGrowth: 0 },
    { brandSeq: 6, brandName: "Sixth Brand", buzzVolume: 6000, buzzGrowth: -0.05 },
    { brandSeq: 7, brandName: "Seventh Brand", buzzVolume: 7000, buzzGrowth: 1234.56 }
];

const BrandSection = () => {

    const [order, setOrder] = useState(orderOptions[0].value);
    const [selectedBrandSeq, setSelectedBrandSeq] = useState<number | null>(null);
    const totalCount = brandList.reduce((acc, brand) => acc + brand.buzzVolume, 0);
    const selectedBrand = brandList.find((b) => b.brandSeq === selectedBrandSeq);


    const sortedBrandList = brandList.toSorted((a, b) => {
        switch (order) {
            case 'volume':
            return b.buzzVolume - a.buzzVolume;
            case 'growth':
            return b.buzzGrowth - a.buzzGrowth;
            case 'name':
            return a.brandName.localeCompare(b.brandName);
            default:
                const exhaustiveCheck: never = order;
                throw new Error(`Unhandled order option: ${exhaustiveCheck}`);
        }
    });

    const handleBrandSelect = (brandSeq: number) => {
        setSelectedBrandSeq(selectedBrandSeq === brandSeq ? null : brandSeq);
    }

    const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(event.target.value as OrderOption['value']);
    }

    return (
        <>
            <p>총 언급량 : {formatInteger(totalCount)}건</p>

            <select value={order} onChange={handleOrderChange}>
                {orderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {selectedBrand ? (
                <p>선택된 브랜드: {selectedBrand.brandName}</p>
            ) : (
                <p>선택된 브랜드 없음</p>
            )}

            <Panel title="브랜드 목록">
                <BrandList brandList={sortedBrandList} selectedBrandSeq={selectedBrandSeq} onBrandSelect={handleBrandSelect} />
            </Panel>
        </>
    )
}

export default BrandSection;