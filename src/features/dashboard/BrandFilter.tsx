import './BrandFilter.css';
import type { OrderValue, RateFilterValue } from '@/types/brand';

type OrderOption = {
  value: OrderValue;
  label: string;
};

type RateFilterOption = {
  value: RateFilterValue;
  label: string;
};

type BrandFilterProps = {
  order: OrderValue;
  onOrderChange: (order: OrderValue) => void;
  rateFilter: RateFilterValue;
  onRateFilterChange: (filter: RateFilterValue) => void;
  searchKeyword: string;
  onSearchKeywordChange: (keyword: string) => void;
  onResetFilters: () => void;
};

const orderOptions: OrderOption[] = [
  { value: 'volume', label: '언급량순' },
  { value: 'growth', label: '증감률순' },
  { value: 'name', label: '이름순' },
];

const rateFilterOptions: RateFilterOption[] = [
  { value: 'all', label: '전체' },
  { value: 'positive', label: '증가' },
  { value: 'negative', label: '감소' },
  { value: 'neutral', label: '변화없음' },
];

const BrandFilter = ({
  order,
  onOrderChange,
  rateFilter,
  onRateFilterChange,
  searchKeyword,
  onSearchKeywordChange,
  onResetFilters,
}: BrandFilterProps) => {
  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onOrderChange(event.target.value as OrderValue);
  };

  const handleRateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onRateFilterChange(event.target.value as RateFilterValue);
  };

  const handleSearchKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchKeywordChange(event.target.value);
  };

  return (
    <div className="brand-filter">
      <select value={order} onChange={handleOrderChange}>
        {orderOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select value={rateFilter} onChange={handleRateFilterChange}>
        {rateFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="브랜드 검색..."
        value={searchKeyword}
        onChange={handleSearchKeywordChange}
      />
      <button onClick={onResetFilters}>필터 초기화</button>
    </div>
  );
};

export default BrandFilter;
