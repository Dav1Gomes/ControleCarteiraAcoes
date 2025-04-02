import React, { useEffect, useState } from 'react';
import { obterRentabilidadeMensal } from '../services/authService';
import RentabilidadeMensalView from '../Views/RentabilidadeMensalView';

const RentabilidadeMensal = ({ route, navigation }) => {
    const { userId } = route.params || {};

    if (!userId) {
        console.error('ID do usuário não foi passado para a tela Rentabilidade Mensal.');
        navigation.navigate('Servicos');
        return null;
    }

    const [rentabilidade, setRentabilidade] = useState({
        dividendos: 0,
        valorizacaoAtivos: 0,
        lucrosPrejuizos: 0,
        total: 0,
        rentabilidadeDividendos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentabilidade = async () => {
            try {
                const data = await obterRentabilidadeMensal(userId);
                setRentabilidade(data);
            } catch (error) {
                console.error('Erro ao carregar rentabilidade mensal:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentabilidade();
    }, [userId]);

    return (
        <RentabilidadeMensalView
            rentabilidade={rentabilidade}
            loading={loading}
            onBack={() => navigation.navigate('Servicos', { userId, nome: route.params.nome })}
        />
    );
};

export default RentabilidadeMensal;
