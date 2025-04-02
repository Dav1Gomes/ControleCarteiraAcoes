import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://carteiraacoes.onrender.com/api";

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const adicionarUsuario = async (nome, email, senha) => {
    try {
        const resposta = await axios.post(`${API_URL}/register`, { nome, email, senha });
        return { sucesso: true, mensagem: resposta.data.message };
    } catch (error) {
        console.error("Erro ao registrar usuário:", error.response?.data || error.message);
        return { sucesso: false, mensagem: error.response?.data?.error || "Erro ao registrar usuário." };
    }
};

export const realizarLogin = async (email, senha) => {
    try {
        const resposta = await axios.post(`${API_URL}/login`, { email, senha });
        if (resposta.data.token) {
            return {
                sucesso: true,
                token: resposta.data.token,
                userId: resposta.data.userId,
                nome: resposta.data.nome,
            };
        }
        return { sucesso: false, mensagem: "Credenciais inválidas." };
    } catch (error) {
        console.error("Erro ao fazer login:", error.response?.data || error.message);
        return { sucesso: false, mensagem: error.response?.data?.error || "Erro ao fazer login." };
    }
};

export const getUsuarioDados = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/user/${userId}`, config);
        return resposta.data;
    } catch (error) {
        console.error("Erro ao obter dados do usuário:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao obter dados do usuário.");
    }
};

export const buscarInvestimentos = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/investimentos/${userId}`, config);
        return resposta.data.investimentos || []; 
    } catch (error) {
        console.error("Erro ao buscar investimentos:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao buscar investimentos.");
    }
};

export const realizarDeposito = async (userId, valor) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/deposito`,
            { userId, valor },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao depositar:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao depositar.");
    }
};

export const realizarRetirada = async (userId, valor) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/retirada`,
            { userId, valor },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao retirar:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao realizar retirada.");
    }
};

export const buscarHistorico = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/historico/${userId}`, config);
        return resposta.data;
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao buscar histórico.");
    }
};

export const calcularRentabilidade = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/rentabilidade/${userId}`, config);
        return resposta.data.rentabilidadeMensal;
    } catch (error) {
        console.error("Erro ao calcular rentabilidade:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao calcular rentabilidade.");
    }
};

export const atualizarPrecos = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/atualizar-precos`,
            { userId },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao atualizar preços:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao atualizar preços.");
    }
};

export const buscarDividendos = async (userId) => {
    try {
        const config = await getAuthHeader();
        const response = await axios.get(`${API_URL}/dividendos/${userId}`, config);

        const dividendos = response.data?.dividendos || [];

        const totalDividendos = dividendos.reduce((sum, dividendo) => sum + dividendo.valor, 0);
        const rentabilidadeDividendos = totalDividendos * 0.04; 

        return {
            dividendos,
            totalDividendos,
            rentabilidadeDividendos,
        };
    } catch (error) {
        console.error("Erro ao buscar dividendos:", error.response?.data || error.message);

        return {
            dividendos: [],
            totalDividendos: 0,
            rentabilidadeDividendos: 0,
        };
    }
};


export const buscarSaldo = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/saldo/${userId}`, config);
        return resposta.data.saldo;
    } catch (error) {
        console.error("Erro ao buscar saldo:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao buscar saldo.");
    }
};

export const comprarInvestimento = async (userId, empresaId, quantidade, valorTotal) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/comprar`,
            { userId, empresaId, quantidade, valorTotal },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao realizar compra de investimento:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao realizar compra.");
    };
};

export const buscarSaldoAtualizado = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/saldo/${userId}`, config);
        return resposta.data;
    } catch (error) {
        console.error("Erro ao buscar saldo atualizado:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao buscar saldo.");
    }
};

export const registrarDividendo = async (userId, empresaId, valor, data) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/dividendo`,
            { userId, empresaId, valor, data },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao registrar dividendo:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao registrar dividendo.");
    }
};


export const obterRentabilidadeMensal = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/rentabilidade/${userId}`, config);
        return resposta.data.rentabilidadeMensal;
    } catch (error) {
        console.error("Erro ao obter rentabilidade mensal:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao obter rentabilidade mensal.");
    }
};

export const realizarVenda = async (userId, investimentoId, quantidade, valorVenda) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.post(
            `${API_URL}/vender`,
            { userId, investimentoId, quantidade, valorVenda },
            config
        );
        return resposta.data;
    } catch (error) {
        console.error("Erro ao realizar venda:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao realizar venda.");
    }
};

export const buscarHistoricoSaldo = async (userId) => {
    try {
        const config = await getAuthHeader();
        const resposta = await axios.get(`${API_URL}/historico_saldo/${userId}`, config);
        return resposta.data;
    } catch (error) {
        console.error("Erro ao buscar histórico de saldos:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Erro ao buscar histórico de saldos.");
    }
};

export const verificarSaldoCliente = async (userId) => {
    try {
      const config = await getAuthHeader();
      const resposta = await axios.get(`${API_URL}/verificar-saldo/${userId}`, config);
      return resposta.data.saldo;
    } catch (error) {
      console.error("Erro ao verificar saldo do cliente:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao verificar saldo do cliente.");
    }
  };
  