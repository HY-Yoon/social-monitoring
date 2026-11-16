import type { Brand } from '@/types/brand';

const brandList: Brand[] = [
  { brandSeq: 1, brandName: 'Apple', buzzVolume: 1000, buzzGrowth: 10 },
  { brandSeq: 2, brandName: 'Apple Watch', buzzVolume: 2000, buzzGrowth: 25.4 },
  { brandSeq: 3, brandName: 'Samsung', buzzVolume: 3000, buzzGrowth: -0.04 },
  { brandSeq: 4, brandName: 'Samsung Galaxy', buzzVolume: 4000, buzzGrowth: -85.652 },
  { brandSeq: 5, brandName: 'Google', buzzVolume: 5000, buzzGrowth: 0 },
  { brandSeq: 6, brandName: 'Google Pixel', buzzVolume: 6000, buzzGrowth: -0.05 },
  { brandSeq: 7, brandName: 'New Balance', buzzVolume: 7000, buzzGrowth: 1234.56 },
];

const fetchBrands = (keyword: string, signal: AbortSignal): Promise<Brand[]> => {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('요청된 작업이 중단되었습니다.', 'AbortError'));
      return;
    }

    const delay =
      keyword === 'a' ? 1500 : keyword === 'ab' ? 300 : Math.floor(Math.random() * 1201) + 300;

    const timeoutId = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);

      if (keyword === 'error') {
        reject(new Error('브랜드 검색에 실패했습니다.'));
        return;
      }

      const filteredBrands = brandList.filter((brand) =>
        brand.brandName.toLowerCase().includes(keyword),
      );

      resolve(filteredBrands);
    }, delay);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new DOMException('요청된 작업이 중단되었습니다.', 'AbortError'));
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
};

export { fetchBrands };
