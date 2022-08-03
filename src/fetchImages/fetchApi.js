import axios from 'axios';
import { API_KEY, BASE_URL } from 'constants/constants';

const instance = axios.create({
  baseURL: BASE_URL,
});

export const getImages = async (searchQuery, page) => {
  const response = await instance.get('/', {
    params: {
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: 12,
      q: searchQuery,
      page,
    },
  });

  return response.data;
};
