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
        'p-4 rounded-card flex items-center gap-2 border border-card-border w-3xs cursor-pointer',
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
