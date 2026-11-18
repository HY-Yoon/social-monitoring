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
        'flex w-3xs cursor-pointer items-center gap-2 rounded-card border border-card-border p-4',
        isSelected ? 'bg-card-active' : 'bg-card-background hover:bg-card-hover',
      )}
      onClick={onClick}
    >
      <h3>{brand.brandName}</h3>
      <p>Buzz Volume: {formatInteger(brand.buzzVolume)}건</p>
      <p>
        Buzz Growth: <ChangeRate changeRate={brand.buzzGrowth} unit="%" />
      </p>
    </button>
  );
};

export default BrandCard;
