import React, { useState, useEffect } from 'react';

const SpotPricesDisplay = () => {
  const [spotPrices, setSpotPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const fetchLatestPrices = async () => {
      try {
        const response = await fetch('/v1/latest-prices.json');
        const { prices } = await response.json();
        setSpotPrices(prices);
      } catch (error) {
        console.error('Error fetching spot prices:', error);
      }
    };

    const fetchCurrentPrice = async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');

      const params = `date=${year}-${month}-${day}&hour=${hour}`;
      try {
        const response = await fetch(`/v1/price.json?${params}`);
        const data = await response.json();
        setCurrentPrice(data.price);
      } catch (error) {
        console.error('Error fetching current price:', error);
      }
    };

    fetchLatestPrices();
    fetchCurrentPrice();
  }, []);

  return (
    <div className="container">
      {currentPrice !== null && (
        <div className="current-price-card">
          <p className="current-price-text">Current Hour Price</p>
          <div className="current-price-amount">
            {currentPrice.toFixed(2)} snt/kWh
          </div>
        </div>
      )}

      <h1>Latest Spot Prices</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 price-header price-column">Price (snt/kWh)</th>
            </tr>
          </thead>
          <tbody>
            {spotPrices.map((price, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  {new Date(price.startDate).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-2 border price-cell">
                  {price.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpotPricesDisplay;
