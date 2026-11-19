export type Brand = {
  brandSeq: number;
  brandName: string;
  buzzVolume: number;
  buzzGrowth: number;
};

export type OrderValue = 'volume' | 'growth' | 'name';

export type GrowthType = 'increase' | 'decrease' | 'unchanged';

export type RateFilterValue = 'all' | GrowthType;
