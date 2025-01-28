import SwapForm from "../components/SwapForm";

export interface TokenData {
  [key: string]: {
    price: number;
    symbol: string;
  };
}

export default function Home() {


  return (
    <>
      <SwapForm />
    </>
  );
}
