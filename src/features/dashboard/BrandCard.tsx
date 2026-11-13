import ChangeRate from '@/components/change-rate/ChangeRate';
import type { Brand } from '@/types/brand';
import { formatInteger } from '@/utils/format';
import './BrandCard.css';

type BrandCardProps = {
  brand: Brand;
  isSelected: boolean;
  onClick: () => void;
};

const BrandCard = ({ brand, isSelected, onClick }: BrandCardProps) => {
  return (
    <div className={`brand-item ${isSelected ? 'is-active' : ''}`} onClick={onClick}>
      <h3>{brand.brandName}</h3>
      <p>Buzz Volume: {formatInteger(brand.buzzVolume)}건</p>
      <p>
        Buzz Growth: <ChangeRate changeRate={brand.buzzGrowth} unit="%" />
      </p>
    </div>
  );
};

export default BrandCard;
