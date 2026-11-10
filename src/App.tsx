import './App.css'
import { BrandList } from './features/dashboard/BrandList'
import type { Brand } from './types/brand';
import { formatInteger } from './utils/format';


//  const brandList:Brand[] = [];

  const brandList:Brand[] = [
    { brandSeq: 1, brandName: "Example Brand", buzzVolume: 1000, buzzGrowth: 10 }, { brandSeq: 2, brandName: "Another Brand", buzzVolume: 2000, buzzGrowth: 25.4 }, { brandSeq: 3, brandName: "Third Brand", buzzVolume: 3000, buzzGrowth: -0.04 }, { brandSeq: 4, brandName: "Fourth Brand", buzzVolume: 4000, buzzGrowth: -85.652 }, { brandSeq: 5, brandName: "Fifth Brand", buzzVolume: 5000, buzzGrowth: 0 }
  ];



function App() {
  

  const totalCount = brandList.reduce((acc, brand) => acc + brand.buzzVolume, 0);

  return (
    <>
      <p>총 언급량 : {formatInteger(totalCount)}건</p>
      <BrandList brandList={brandList} />
    </>
  )
}

export default App
