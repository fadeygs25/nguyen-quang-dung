import React from "react";
import { TokenData } from "../pages";

interface CurrencySelectProps {
  label: string;
  selected: string;
  onChange: (value: string) => void;
  tokenData: TokenData;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  label,
  selected,
  onChange,
  tokenData,
}) => {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        {Object.keys(tokenData).map((token) => (
          <option key={token} value={token}>
           <div className="flex items-center">
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`}
                alt={token}
                className="w-5 h-5 inline-block mr-2"
              />
              {token}
            </div>
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelect;
