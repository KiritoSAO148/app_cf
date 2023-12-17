import axios from 'axios';
import queryString from 'query-string';
import {dataStorage} from '../handlers/dataStorage';
import Toast from 'react-native-toast-message';

// let IP = '192.168.0.85'; // ot
// let IP = '10.68.1.252'; //ticos
let IP = '192.168.101.101';

const PORT = 5000;
export const host = `http://${IP}:${PORT}`;

// export const host = 'ws://server.freshgreen.io.vn';
const baseURL = `http://${IP}:${PORT}/api/v1`;
// const baseURL = 'https://server.freshgreen.io.vn/api/v1';

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params: any): string => queryString.stringify({params}),
});

axiosClient.interceptors.request.use(
  async (config: any) => {
    const token = await dataStorage.getItem('user');

    return {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Beaber ${token}`,
      },
    };
  },
  (e: any) => {
    return Promise.reject(e);
  },
);
axiosClient.interceptors.response.use(
  (response: any) => {
    // if (response && response.data) return response.data;
    return response;
  },
  error => {
    if (!error.response) {
      return Toast.show({
        type: 'error',
        text1:
          'Kết nối không thành công. Vui lòng kiểm tra kết nối mạng của bạn.',
      });
    }
    throw error.response;
  },
);

export default axiosClient;
