export type Brand = {
  brandSeq : number,
  brandName : string,
  buzzVolume: number,
  buzzGrowth: number,
}

export type OrderValue = 'volume' | 'growth' | 'name';

export type RateFilterValue = 'all' | 'positive' | 'negative' | 'neutral';
