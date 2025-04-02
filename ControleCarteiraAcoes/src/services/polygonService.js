import axios from 'axios';

const API_URL = 'https://api.polygon.io';
const API_KEY = 'hK8mqvQH_QG5XPTFF4SyvTBOe10DChdM';

export const getEmpresas = async () => {
    try {
        const response = await axios.get(`${API_URL}/v3/reference/tickers`, {
            params: {
                apiKey: API_KEY,
                type: 'CS', 
                market: 'stocks'
            }
        });
        console.log("Estrutura dos dados das empresas:", response.data.results); 
        return response.data.results || [];
    } catch (error) {
        console.error('Erro ao obter lista de ações:', error);
        return [];
    }
};

export const getUltimaCotacao = async (ticker) => {
    try {
        const response = await axios.get(`${API_URL}/v2/aggs/ticker/${ticker}/prev`, {
            params: {
                apiKey: API_KEY
            }
        });
        
        if (response.data && response.data.results && response.data.results.length > 0) {
            return response.data.results[0];
        } else {
            console.warn('Nenhuma cotação disponível para o ticker:', ticker);
            return null; 
        }
    } catch (error) {
        console.error('Erro ao obter cotação:', error);
        return null;
    }
};

export const realizarCompra = async (empresa, valorCompra) => {
    try {
        console.log(`Comprando investimento: ${empresa.symbol} no valor de ${valorCompra}`);
        const sucesso = await storeInvestmentInDatabase('user_id_example', empresa, valorCompra);
        return sucesso;
    } catch (error) {
        console.error('Erro ao realizar a compra:', error);
        return false;
    }
};

export const realizarVenda = async (ativo, valorVenda) => {
    try {
        console.log(`Vendendo investimento: ${ativo.symbol} no valor de ${valorVenda}`);
        return true;  
    } catch (error) {
        console.error('Erro ao realizar a venda:', error);
        return false;
    }
};

export const storeInvestmentInDatabase = async (userId, investment, amount) => {
    try {
        console.log(`Storing investment ${investment.symbol} for user ${userId} with amount ${amount}`);
        return true;  
    } catch (error) {
        console.error('Erro ao armazenar o investimento no banco de dados:', error);
        return false;
    }
};


