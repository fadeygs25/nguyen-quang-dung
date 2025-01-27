import React, { useState } from "react";
import CurrencySelect from "./CurrencySelect";
import { TokenData } from "../pages";

interface SwapFormProps {
  tokenData: TokenData;
}

const SwapForm: React.FC<SwapFormProps> = ({ tokenData }) => {
  const [fromToken, setFromToken] = useState<string>("SWTH");
  const [toToken, setToToken] = useState<string>("ETH");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSwap = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (fromToken === toToken) {
      setError("Source and target tokens must be different.");
      return;
    }

    setError("");
    alert(`Swapped ${amount} ${fromToken} to ${toToken}`);
  };

  const exchangeRate =
    tokenData[fromToken] && tokenData[toToken]
      ? tokenData[toToken].price / tokenData[fromToken].price
      : 0;

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Currency Swap</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <CurrencySelect
          label="From"
          selected={fromToken}
          onChange={setFromToken}
          tokenData={tokenData}
        />
      </div>

      <div className="mb-4">
        <CurrencySelect
          label="To"
          selected={toToken}
          onChange={setToToken}
          tokenData={tokenData}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Enter amount"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Exchange Rate: 1 {fromToken} = {exchangeRate.toFixed(4)} {toToken}
        </p>
      </div>

      <button
        onClick={handleSwap}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Swap
      </button>
    </div>
  );
};

export default SwapForm;
