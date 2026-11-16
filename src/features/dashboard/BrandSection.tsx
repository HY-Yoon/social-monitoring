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
  { status: 'loading' } | { status: 'success'; data: Brand[] } | { status: 'error'; error: string };

let abortController: AbortController | null = null;

const BrandSection = () => {
  const [brandState, setBrandState] = useState<BrandState>({ status: 'success', data: [] });
  const brandList = brandState.status === 'success' ? brandState.data : [];

  const isLoading = brandState.status === 'loading';
  const error = brandState.status === 'error' ? brandState.error : null;

  const [retryCount, setRetryCount] = useState<number>(0);

  const [order, setOrder] = useState(DEFAULT_FILTERS.order);
  const [rateFilter, setRateFilter] = useState(DEFAULT_FILTERS.rateFilter);
  const [searchKeyword, setSearchKeyword] = useState(DEFAULT_FILTERS.searchKeyword);
  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();

  const [selectedBrandSeq, setSelectedBrandSeq] = useState<number | null>(null);
  const totalCount = brandList.reduce((acc, brand) => acc + brand.buzzVolume, 0);
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

  const noDataText = isLoading
    ? '로딩중...'
    : error
      ? error
      : !isFiltered && brandList.length === 0
        ? '등록된 브랜드가 없습니다'
        : '검색 조건에 맞는 브랜드가 없습니다';

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

  const getBrandList = async () => {
    setBrandState({ status: 'loading' });

    abortController?.abort();

    const controller = new AbortController();
    abortController = controller;

    try {
      const result = await fetchBrands(normalizedSearchKeyword, controller.signal);

      setBrandState({ status: 'success', data: result });
    } catch (_error) {
      if (_error instanceof DOMException && _error.name === 'AbortError') {
        return;
      }

      const errorMessage =
        _error instanceof Error ? _error.message : '브랜드 목록을 불러오지 못했습니다.';

      setBrandState({ status: 'error', error: errorMessage });
      console.error('브랜드 목록 호출 실패', _error);
    }
  };

  const retryGetBrandList = () => {
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    getBrandList();
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
        전체 {brandList.length}개 중 {processedBrandList.length}개
      </p>
      <p>총 언급량 : {formatInteger(totalCount)}건</p>

      {selectedBrand ? <p>선택된 브랜드: {selectedBrand.brandName}</p> : <p>선택된 브랜드 없음</p>}

      <Panel title="브랜드 목록">
        {isNoData ? (
          <>
            <p>{noDataText}</p>
            {error && <button onClick={retryGetBrandList}>다시시도</button>}
          </>
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
