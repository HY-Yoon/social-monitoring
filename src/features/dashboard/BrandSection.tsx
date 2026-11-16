import { useEffect, useState } from 'react';
import type { Brand, OrderValue, RateFilterValue } from '@/types/brand';
import { formatInteger } from '@/utils/format';
import BrandList from './BrandList';
import Panel from '@/components/panel/Panel';
import BrandFilter from './BrandFilter';
import { getChangeRateInfo } from '@/utils/changeRate';
import { fetchBrands } from '@/services/brandService';

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

type BrandState =
  | { status: 'loading' }
  | { status: 'success'; items: Brand[]; totalCount: number }
  | { status: 'error'; error: string };

const BrandSection = () => {
  const [brandState, setBrandState] = useState<BrandState>({ status: 'loading' });
  const brandList = brandState.status === 'success' ? brandState.items : [];
  const totalCount = brandState.status === 'success' ? brandState.totalCount : 0;

  const isLoading = brandState.status === 'loading';
  const errorMessage = brandState.status === 'error' ? brandState.error : null;

  const [retryCount, setRetryCount] = useState<number>(0);

  const [order, setOrder] = useState(DEFAULT_FILTERS.order);
  const [rateFilter, setRateFilter] = useState(DEFAULT_FILTERS.rateFilter);
  const [searchKeyword, setSearchKeyword] = useState(DEFAULT_FILTERS.searchKeyword);
  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();

  const [selectedBrandSeq, setSelectedBrandSeq] = useState<number | null>(null);
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

  const clearSelection = () => {
    setSelectedBrandSeq(null);
  };

  const handleBrandSelect = (brandSeq: number) => {
    setSelectedBrandSeq((value) => (value === brandSeq ? null : brandSeq));
  };

  const isFiltered =
    order !== DEFAULT_FILTERS.order ||
    rateFilter !== DEFAULT_FILTERS.rateFilter ||
    searchKeyword !== DEFAULT_FILTERS.searchKeyword;

  const isNoData = processedBrandList.length === 0;

  const noDataText =
    totalCount === 0 ? '등록된 브랜드가 없습니다' : '검색 조건에 맞는 브랜드가 없습니다';

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

  const retryGetBrandList = () => {
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getBrandList = async () => {
      setBrandState({ status: 'loading' });

      try {
        const result = await fetchBrands(normalizedSearchKeyword, controller.signal);

        setBrandState({ ...result, status: 'success' });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : '브랜드 목록을 불러오지 못했습니다.';

        setBrandState({ status: 'error', error: errorMessage });
        console.error('브랜드 목록 호출 실패', error);
      }
    };

    getBrandList();

    return () => {
      controller.abort();
    };
  }, [normalizedSearchKeyword, retryCount]);

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
            <button onClick={retryGetBrandList}>다시 시도</button>
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
