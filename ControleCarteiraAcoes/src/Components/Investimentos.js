import React, { useState, useEffect } from "react";
import { buscarSaldoAtualizado, comprarInvestimento } from "../services/authService";
import { getUltimaCotacao } from "../services/polygonService";
import InvestimentosView from "../Views/InvestimentosView";

const TAXA_CONVERSAO = 5.8;

const Investimentos = ({ route, navigation }) => {
    const { empresa, userId } = route.params;
    const [cotacoes, setCotacoes] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [loadingSaldo, setLoadingSaldo] = useState(true);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(1); 

    useEffect(() => {
        const fetchSaldo = async () => {
            try {
                const data = await buscarSaldoAtualizado(userId);
                setSaldo(data.saldo);
                setLoadingSaldo(false);
            } catch (error) {
                console.error("Erro ao buscar saldo:", error.message);
                setLoadingSaldo(false);
            }
        };

        const fetchInvestimentos = async () => {
            setLoading(true);
            const data = await getUltimaCotacao(empresa.ticker);
            if (data) {
                const cotacaoComConversao = {
                    ...data,
                    precoEmReais: (data.c * TAXA_CONVERSAO).toFixed(2),
                };
                setCotacoes([cotacaoComConversao]);
            } else {
                setCotacoes([]);
            }
            setLoading(false);
        };

        fetchSaldo();
        fetchInvestimentos();
    }, [empresa, userId]);

    const handleQuantidadeChange = (valor) => {
        const valorNumerico = valor.replace(/[^0-9]/g, "");
        setQuantidade(valorNumerico ? parseInt(valorNumerico, 10) : "");
    };

    const handleComprar = async () => {
        if (!quantidade || quantidade <= 0) {
            alert("Por favor, insira uma quantidade válida.");
            return;
        }

        const valorCompraReais = quantidade * cotacoes[0]?.precoEmReais;

        if (valorCompraReais > saldo) {
            alert("Saldo insuficiente para realizar a compra.");
            return;
        }

        try {
            await comprarInvestimento(userId, empresa.ticker, quantidade, valorCompraReais);
            alert(`Compra realizada com sucesso!`);
            setSaldo(saldo - valorCompraReais);
            setQuantidade(1); 
        } catch (error) {
            alert("Erro ao realizar a compra.");
            console.error(error.message);
        }
    };

    return (
        <InvestimentosView
            empresa={empresa}
            cotacoes={cotacoes}
            saldo={saldo}
            quantidade={quantidade}
            loading={loading}
            loadingSaldo={loadingSaldo}
            onQuantidadeChange={handleQuantidadeChange}
            onComprar={handleComprar}
            navigation={navigation}
        />
    );
};

export default Investimentos;
