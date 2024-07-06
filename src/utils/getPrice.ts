import axios from 'axios';

interface PriceData {
  UAH: number;
  USD: number;
}

const getPrice = async (number: string): Promise<PriceData> => {
  try {
    const response = await axios.post('https://auto.ria.com/bff/average-price/public/data', {
      langId: 4,
      period: 365,
      params: {
        omniId: number,
      },
    });

    const data = response.data;

    const UAH = parseInt(data.similarCars[0].price.all.UAH.value.replace(' ', ''), 10);
    const USD = parseInt(data.similarCars[0].price.all.USD.value.replace(' ', ''), 10);

    return {
      UAH,
      USD,
    };
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
};

export default getPrice;