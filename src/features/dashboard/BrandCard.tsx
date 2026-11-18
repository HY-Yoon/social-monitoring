import ChangeRate from '@/components/change-rate/ChangeRate';
import type { Brand } from '@/types/brand';
import { formatInteger } from '@/utils/format';
import clsx from 'clsx';

type BrandCardProps = {
  brand: Brand;
  isSelected: boolean;
  onClick: () => void;
};

const BrandCard = ({ brand, isSelected, onClick }: BrandCardProps) => {
  return (
    <button
      className={clsx(
        'flex w-2xl cursor-pointer items-center gap-2 rounded-card border border-card-border p-4',
        isSelected ? 'bg-card-active' : 'bg-card hover:bg-card-hover',
      )}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <strong>{brand.brandName}</strong>
      <span>Buzz Volume: {formatInteger(brand.buzzVolume)}건</span>
      <span>
        Buzz Growth: <ChangeRate changeRate={brand.buzzGrowth} unit="%" />
      </span>
    </button>
  );
};

export default BrandCard;
