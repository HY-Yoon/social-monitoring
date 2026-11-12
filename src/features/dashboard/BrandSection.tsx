import { useState } from "react";
import type { Brand, OrderValue, RateFilterValue } from "../../types/brand";
import { formatInteger } from "../../utils/format";
import BrandList from "./BrandList";
import Panel from "../../components/panel/Panel";
import BrandFilter from "./BrandFilter";
import { changeRateDatas } from "../../utils/changeRate";

const DEFAULT_FILTERS = {
    order: 'volume' as OrderValue,
    rateFilter: 'all' as RateFilterValue,
    searchKeyword: '',
}

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

    const [order, setOrder] = useState(DEFAULT_FILTERS.order);
    const [rateFilter, setRateFilter] = useState(DEFAULT_FILTERS.rateFilter);
    const [searchKeyword, setSearchKeyword] = useState(DEFAULT_FILTERS.searchKeyword);
    const [selectedBrandSeq, setSelectedBrandSeq] = useState<number | null>(null);
    const totalCount = brandList.reduce((acc, brand) => acc + brand.buzzVolume, 0);
    const selectedBrand = brandList.find((b) => b.brandSeq === selectedBrandSeq);
    const processedBrandList = brandList.filter((brand) => {
        // 검색 키워드 필터링(대소문자, 앞뒤 공백 무시)
        const matchesSearchKeyword = brand.brandName.toLowerCase().includes(searchKeyword.trim().toLowerCase());

        // 증감률 필터링
        const { growthType } = changeRateDatas(brand.buzzGrowth);

        const matchesRateFilter = rateFilter === 'all' || 
            rateFilter === growthType;

        return matchesRateFilter && matchesSearchKeyword;
    }).toSorted((a, b) => {
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

    const isFiltered = order !== DEFAULT_FILTERS.order || rateFilter !== DEFAULT_FILTERS.rateFilter || searchKeyword !== DEFAULT_FILTERS.searchKeyword;

    const isNoData = processedBrandList.length === 0 || brandList.length === 0;

    const noDataText = processedBrandList.length === 0 ?  isFiltered ? "검색 조건에 맞는 브랜드가 없습니다" : "등록된 브랜드가 없습니다" : "";

    const handleChangeFilters = (type: string, value: OrderValue | RateFilterValue | string) => {
        if (type === 'order') {
            if(value !== order){
                setSelectedBrandSeq(null);
            }
            setOrder(value as OrderValue);
            return
        } else if (type === 'rateFilter') {
            if(value !== rateFilter){
                setSelectedBrandSeq(null);
            }
            setRateFilter(value as RateFilterValue);
            return
        } else if (type === 'searchKeyword') {
            if(value !== searchKeyword){
                setSelectedBrandSeq(null);
            }
            setSearchKeyword(value as string);
            return
        }

        throw new Error(`Unhandled filter type: ${type}`);
    }    

    const resetFilters = () => {
        setOrder(DEFAULT_FILTERS.order);
        setRateFilter(DEFAULT_FILTERS.rateFilter);
        setSearchKeyword(DEFAULT_FILTERS.searchKeyword);
    }

    return (
        <>
            <BrandFilter 
                order={order} 
                onOrderChange={(value) => handleChangeFilters('order', value)} 
                rateFilter={rateFilter} 
                onRateFilterChange={(value) => handleChangeFilters('rateFilter', value)} 
                searchKeyword={searchKeyword} 
                onSearchKeywordChange={(value) => handleChangeFilters('searchKeyword', value)} 
                onResetFilters={resetFilters} />

            <p>전체 {brandList.length}개 중 {processedBrandList.length}개</p>
            <p>총 언급량 : {formatInteger(totalCount)}건</p>

            

            {selectedBrand ? (
                <p>선택된 브랜드: {selectedBrand.brandName}</p>
            ) : (
                <p>선택된 브랜드 없음</p>
            )}

            <Panel title="브랜드 목록">
                {isNoData ? (
                    <p>{noDataText}</p>
                ) : (
                    <BrandList brandList={processedBrandList} selectedBrandSeq={selectedBrandSeq} onBrandSelect={handleBrandSelect} />
                )}
            </Panel>
        </>
    )
}

export default BrandSection;