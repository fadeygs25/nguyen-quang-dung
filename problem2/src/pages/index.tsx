import React, { useEffect, useState } from "react";
import axios from "axios";
import SwapForm from "../components/SwapForm";

export interface TokenData {
  [key: string]: {
    price: number;
    symbol: string;
  };
}

export default function Home() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  // Lấy dữ liệu token từ API
  useEffect(() => {
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((response) => {
        setTokenData(response.data);
      })
      .catch((error) => console.error("Error fetching token prices:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      {tokenData ? (
        <SwapForm tokenData={tokenData} />
      ) : (
        <div className="text-gray-600 text-lg">Loading token data...</div>
      )}
    </div>
  );
}
