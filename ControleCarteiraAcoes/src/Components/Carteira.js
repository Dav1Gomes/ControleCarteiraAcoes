import React, { useEffect, useState } from "react";
import { getUsuarioDados, buscarInvestimentos } from "../services/authService";
import CarteiraView from "../Views/CarteiraView";

const Carteira = ({ navigation, route }) => {
    const { userId, nome } = route.params || {};
    const [dadosUsuario, setDadosUsuario] = useState({
        nome: "",
        email: "",
        saldo: 0,
    });
    const [investimentos, setInvestimentos] = useState([]);
    const [totalInvestimentos, setTotalInvestimentos] = useState(0);

    const fetchDadosUsuario = async () => {
        try {
            const data = await getUsuarioDados(userId);
            setDadosUsuario(data);
        } catch (error) {
            console.error("Erro ao carregar os dados do usuário:", error.message);
            navigation.navigate("Login");
        }
    };

    const fetchInvestimentos = async () => {
        try {
            const investimentos = await buscarInvestimentos(userId);
            setInvestimentos(
                investimentos.map((investimento) => ({
                    ...investimento,
                    quantidade: investimento.quantidade || 0,
                })) || []
            );

            const total = investimentos.reduce(
                (acc, item) => acc + (item.quantidade || 0),
                0
            );
            setTotalInvestimentos(total); 
        } catch (error) {
            console.error("Erro ao buscar investimentos:", error.message);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.error(
                "ID do usuário não encontrado. Redirecionando para o login."
            );
            navigation.navigate("Login");
            return;
        }

        fetchDadosUsuario();
        fetchInvestimentos();
    }, [userId]);

    const onHistoricoPress = () => {
        navigation.navigate("Historico", { userId });
    };

    const onDashboardPress = () => {
        navigation.navigate("Dashboard", { userId });
    };

    const onDividendosRentPress = () => {
        navigation.navigate("DividendosRentabilidade", { userId });
    };

    const onBackPress = () => {
        navigation.navigate("Home", { userId, nome });
    };

    return (
        <CarteiraView
            dadosUsuario={dadosUsuario}
            investimentos={investimentos}
            totalInvestimentos={totalInvestimentos}
            onHistoricoPress={onHistoricoPress}
            onDashboardPress={onDashboardPress}
            onDividendosRentPress={onDividendosRentPress}
            onBackPress={onBackPress}
        />
    );
};

export default Carteira;
