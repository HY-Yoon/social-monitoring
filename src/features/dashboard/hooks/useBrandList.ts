import useDebounce from '@/hooks/useDebounce';
import { fetchBrands } from '@/services/brandService';
import type { Brand } from '@/types/brand';
import { useEffect, useState } from 'react';

type BrandState =
  | { status: 'loading' }
  | { status: 'success'; items: Brand[]; totalCount: number }
  | { status: 'error'; error: string };

type BrandListType = {
  brandList: Brand[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => void;
};

const useBrandList = (searchKeyword: string): BrandListType => {
  const [brandState, setBrandState] = useState<BrandState>({ status: 'loading' });

  const brandList = brandState.status === 'success' ? brandState.items : [];
  const totalCount = brandState.status === 'success' ? brandState.totalCount : 0;

  const isLoading = brandState.status === 'loading';
  const errorMessage = brandState.status === 'error' ? brandState.error : null;

  const [retryCount, setRetryCount] = useState<number>(0);

  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();

  const debouncedKeyword = useDebounce(normalizedSearchKeyword, 500);

  const retryGetBrandList = () => {
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getBrandList = async () => {
      setBrandState({ status: 'loading' });

      try {
        const result = await fetchBrands(debouncedKeyword, controller.signal);

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
  }, [debouncedKeyword, retryCount]);

  return {
    brandList,
    totalCount,
    isLoading,
    errorMessage,
    retry: retryGetBrandList,
  };
};

export default useBrandList;
