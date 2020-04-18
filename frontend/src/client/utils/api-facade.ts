import axios from 'axios';
import { UnitRate } from '../../shared/Rates';

export function getRates(currency: string) {
  return axios
    .post(
      `http://0.0.0.0:3010/fin/data`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          currency: currency,
        },
      },
    )
    .then((data) => data.data.data as UnitRate[]);
}
