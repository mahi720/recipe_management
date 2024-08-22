const axios = require('axios');

exports.makeRequest = async (api_url, params) => {
  const api_call = await axios.get(api_url, { params });
  return api_call.data;
};
