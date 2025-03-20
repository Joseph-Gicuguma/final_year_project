import { API_BASE_URL } from '~/api/config';

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/endpoint`);
  return response.json();
}; 