// components/SwapForm.tsx
import { useEffect, useState, useMemo, SyntheticEvent } from 'react';
import { FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

interface TokenPrice {
  currency: string;
  price: number;
  date?: string;
}

const SwapForm = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [sourceToken, setSourceToken] = useState<string>('');
  const [targetToken, setTargetToken] = useState<string>('');
  const [sourceAmount, setSourceAmount] = useState<string>('');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data: TokenPrice[] = await response.json();

        const validPrices = data.filter((item): item is TokenPrice => !!item.price);
        const priceMap = validPrices.reduce((acc, curr) => ({
          ...acc,
          [curr.currency]: curr.price
        }), {} as Record<string, number>);

        setPrices(priceMap);
        setAvailableTokens(validPrices.map(item => item.currency));

        if (validPrices.length >= 2) {
          setSourceToken(validPrices[0].currency);
          setTargetToken(validPrices[1].currency);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  const exchangeRate = useMemo<number>(() => {
    if (!sourceToken || !targetToken) return 0;
    const sourcePrice = prices[sourceToken];
    const targetPrice = prices[targetToken];
    return sourcePrice / targetPrice;
  }, [sourceToken, targetToken, prices]);

  const targetAmount = useMemo<string>(() => {
    if (!sourceAmount || isNaN(Number(sourceAmount)) || exchangeRate === 0) return '';
    return (Number(sourceAmount) * exchangeRate).toFixed(6);
  }, [sourceAmount, exchangeRate]);

  const handleSourceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setSourceAmount(value);
    }
  };

  const handleTokenSelect = (token: string, isSource: boolean) => {
    if (isSource) {
      setSourceToken(token);
      setIsSourceModalOpen(false);
    } else {
      setTargetToken(token);
      setIsTargetModalOpen(false);
    }
  };

  const swapTokens = () => {
    const temp = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const isValid = Number(sourceAmount) > 0 && sourceToken !== targetToken && exchangeRate;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Swap Tokens</h1>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <input
              type="text"
              value={sourceAmount}
              onChange={handleSourceAmountChange}
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl outline-none"
            />
            <button
              type="button"
              onClick={() => setIsSourceModalOpen(true)}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm hover:bg-gray-100"
            >
              {sourceToken && (
                <img
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${sourceToken}.svg`}
                  alt={sourceToken}
                  className="w-6 h-6"
                />
              )}
              <span className="font-medium">{sourceToken || 'Select'}</span>
              <FiChevronDown className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <button
            type="button"
            onClick={swapTokens}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
          >
          </button>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <input
              type="text"
              value={targetAmount}
              readOnly
              className="flex-1 bg-transparent text-xl outline-none text-gray-600"
            />
            <button
              type="button"
              onClick={() => setIsTargetModalOpen(true)}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm hover:bg-gray-100"
            >
              {targetToken && (
                <img
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${targetToken}.svg`}
                  alt={targetToken}
                  className="w-6 h-6"
                />
              )}
              <span className="font-medium">{targetToken || 'Select'}</span>
              <FiChevronDown className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-sm text-gray-500 mb-4">
            {exchangeRate ? (
              `1 ${sourceToken} ≈ ${exchangeRate.toFixed(6)} ${targetToken}`
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <FiAlertCircle /> No exchange rate available
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isLoading ? (
              <ImSpinner8 className="animate-spin mx-auto" />
            ) : (
              'Swap Now'
            )}
          </button>
        </div>
      </div>

      {(isSourceModalOpen || isTargetModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-xs p-4">
            <h3 className="font-medium mb-4">Select Token</h3>
            <div className="space-y-2">
              {availableTokens.map(token => (
                <button
                  key={token}
                  onClick={() => handleTokenSelect(token, isSourceModalOpen)}
                  disabled={(isSourceModalOpen && token === targetToken) || (isTargetModalOpen && token === sourceToken)}
                  className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`}
                    alt={token}
                    className="w-6 h-6"
                  />
                  <span className="font-medium">{token}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsSourceModalOpen(false);
                setIsTargetModalOpen(false);
              }}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SwapForm;