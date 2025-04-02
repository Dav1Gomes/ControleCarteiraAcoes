const axios = require('axios');

const POLYGON_API_KEY = 'hK8mqvQH_QG5XPTFF4SyvTBOe10DChdM';

const getDividendos = async (empresaId) => {
    try {
        const response = await axios.get(
            `https://api.polygon.io/v3/reference/dividends/${empresaId}?apiKey=${POLYGON_API_KEY}`
        );
        return response.data.results || [];
    } catch (error) {
        console.error('Erro ao buscar dividendos:', error.message);
        return [];
    }
};

module.exports = { getDividendos };
