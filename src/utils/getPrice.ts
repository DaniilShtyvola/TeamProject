import axios from 'axios';

const getPrice = async (number: string) => {
  try {
    const response = await axios.post('https://cors-anywhere.herokuapp.com/https://auto.ria.com/bff/average-price/public/data', {
      langId: 4,
      period: 365,
      params: {
        omniId: number,
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    const data = response.data;

    const UAH = parseInt(data.statisticData[0].price.UAH);

    const formattedUAH = UAH.toLocaleString('ru-RU');

    return formattedUAH;
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
};

export default getPrice;