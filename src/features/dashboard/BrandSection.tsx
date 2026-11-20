import { useState } from 'react';
import type { OrderValue, RateFilterValue } from '@/types/brand';
import { formatInteger } from '@/utils/format';
import BrandList from './BrandList';
import Panel from '@/components/panel/Panel';
import BrandFilter from './BrandFilter';
import { getChangeRateInfo } from '@/utils/changeRate';
import useBrandList from './hooks/useBrandList';

type BrandFilters = {
  order: OrderValue;
  rateFilter: RateFilterValue;
  searchKeyword: string;
};

const DEFAULT_FILTERS: BrandFilters = {
  order: 'volume',
  rateFilter: 'all',
  searchKeyword: '',
};

const BrandSection = () => {
  // state
  const [searchKeyword, setSearchKeyword] = useState(DEFAULT_FILTERS.searchKeyword);
  const [order, setOrder] = useState(DEFAULT_FILTERS.order);
  const [rateFilter, setRateFilter] = useState(DEFAULT_FILTERS.rateFilter);
  const [selectedBrandSeq, setSelectedBrandSeq] = useState<number | null>(null);

  // hook
  const { brandList, totalCount, isLoading, errorMessage, retry } = useBrandList(searchKeyword);

  // 파생값
  const totalVolume = brandList.reduce((acc, brand) => acc + brand.buzzVolume, 0);
  const selectedBrand = brandList.find((b) => b.brandSeq === selectedBrandSeq);
  const processedBrandList = brandList
    .filter((brand) => {
      // 증감률 필터링
      const { growthType } = getChangeRateInfo(brand.buzzGrowth);

      const matchesRateFilter = rateFilter === 'all' || rateFilter === growthType;

      return matchesRateFilter;
    })
    .toSorted((a, b) => {
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

  const isFiltered =
    order !== DEFAULT_FILTERS.order ||
    rateFilter !== DEFAULT_FILTERS.rateFilter ||
    searchKeyword !== DEFAULT_FILTERS.searchKeyword;

  const isNoData = processedBrandList.length === 0;

  const noDataText =
    totalCount === 0 ? '등록된 브랜드가 없습니다' : '검색 조건에 맞는 브랜드가 없습니다';

  const clearSelection = () => {
    setSelectedBrandSeq(null);
  };

  const handleBrandSelect = (brandSeq: number) => {
    setSelectedBrandSeq((value) => (value === brandSeq ? null : brandSeq));
  };

  const handleOrderChange = (value: OrderValue) => {
    if (value !== order) {
      clearSelection();
    }

    setOrder(value);
  };

  const handleRateFilterChange = (value: RateFilterValue) => {
    if (value !== rateFilter) {
      clearSelection();
    }

    setRateFilter(value);
  };

  const handleSearchKeywordChange = (value: string) => {
    if (value !== searchKeyword) {
      clearSelection();
    }

    setSearchKeyword(value);
  };

  const resetFilters = () => {
    if (isFiltered) {
      clearSelection();
    }

    setOrder(DEFAULT_FILTERS.order);
    setRateFilter(DEFAULT_FILTERS.rateFilter);
    setSearchKeyword(DEFAULT_FILTERS.searchKeyword);
  };

  return (
    <>
      <BrandFilter
        order={order}
        onOrderChange={handleOrderChange}
        rateFilter={rateFilter}
        onRateFilterChange={handleRateFilterChange}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={handleSearchKeywordChange}
        onResetFilters={resetFilters}
      />

      <p>
        전체 {totalCount}개 중 {processedBrandList.length}개
      </p>
      <p>총 언급량 : {formatInteger(totalVolume)}건</p>

      {selectedBrand ? <p>선택된 브랜드: {selectedBrand.brandName}</p> : <p>선택된 브랜드 없음</p>}

      <Panel title="브랜드 목록">
        {isLoading ? (
          <p>로딩중...</p>
        ) : errorMessage ? (
          <>
            <p>{errorMessage}</p>
            <button onClick={retry}>다시 시도</button>
          </>
        ) : isNoData ? (
          <p>{noDataText}</p>
        ) : (
          <BrandList
            brandList={processedBrandList}
            selectedBrandSeq={selectedBrandSeq}
            onBrandSelect={handleBrandSelect}
          />
        )}
      </Panel>
    </>
  );
};

export default BrandSection;
