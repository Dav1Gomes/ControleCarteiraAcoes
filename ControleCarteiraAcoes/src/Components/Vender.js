import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { buscarInvestimentos, buscarSaldo, realizarVenda } from '../services/authService';
import VenderInvestimentoView from '../Views/VenderInvestimentoView';

const Vender = ({ navigation, route }) => {
    const { userId } = route.params;
    const [ativos, setAtivos] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quantidades, setQuantidades] = useState({}); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ativos = await buscarInvestimentos(userId);
                const saldo = await buscarSaldo(userId);

                setAtivos(ativos || []);
                setSaldo(saldo);

                const quantidadesIniciais = {};
                ativos.forEach((ativo) => {
                    quantidadesIniciais[ativo.id] = 1;
                });
                setQuantidades(quantidadesIniciais);
            } catch (error) {
                console.error("Erro ao buscar dados:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const onQuantidadeChange = (ativoId, quantidade) => {
        setQuantidades((prev) => ({
            ...prev,
            [ativoId]: parseInt(quantidade) > 0 ? parseInt(quantidade) : "", 
        }));
    };

    const onVenderInvestimento = (ativo) => {
        const quantidade = quantidades[ativo.id] || 0;

        if (quantidade > ativo.quantidade) {
            Alert.alert("Erro", "Você não pode vender mais do que possui.");
            return;
        }

        const valorTotalVenda = ativo.valor * quantidade; 
        Alert.alert(
            "Confirmar Venda",
            `Deseja vender ${quantidade} de ${ativo.empresaId} por R$${valorTotalVenda.toFixed(2)}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: () => handleVenda(ativo, quantidade) },
            ]
        );
    };

    const handleVenda = async (ativo, quantidadeVenda) => {
        try {
            const valorVenda = ativo.valor * quantidadeVenda;

            const data = await realizarVenda(userId, ativo.id, quantidadeVenda, valorVenda);

            setSaldo(data.saldo); 
            const atualizado = ativos.map((a) =>
                a.id === ativo.id
                    ? { ...a, quantidade: a.quantidade - quantidadeVenda }
                    : a
            );
            setAtivos(atualizado.filter((a) => a.quantidade > 0)); 

            alert('Venda realizada com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar venda:', error.message);
            alert('Erro ao realizar a venda. Tente novamente.');
        }
    };

    return (
        <VenderInvestimentoView
            ativos={ativos}
            saldo={saldo}
            quantidades={quantidades} 
            onQuantidadeChange={onQuantidadeChange} 
            onVenderInvestimento={onVenderInvestimento}
            navigation={navigation}
            loading={loading}
        />
    );
};

export default Vender;
