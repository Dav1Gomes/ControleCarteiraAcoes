import React, { useEffect, useState } from "react";
import { buscarHistorico } from "../services/authService";
import HistoricoView from "../Views/HistoricoView";

const Historico = ({ route, navigation }) => {
    const { userId } = route.params || {};
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistorico = async () => {
            try {
                const data = await buscarHistorico(userId);

                const depositosRetiradas = data.historico.filter(item =>
                    item.tipo === "deposito" || item.tipo === "retirada"
                );

                const comprasVendas = data.historico.filter(item =>
                    item.tipo === "compra" || item.tipo === "venda"
                );

                setHistorico({
                    depositosRetiradas,
                    comprasVendas,
                });
            } catch (error) {
                console.error("Erro ao carregar o histórico:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, [userId]);

    const onBackPress = () => {
        navigation.goBack();
    };

    return (
        <HistoricoView
            historico={historico}
            loading={loading}
            onBackPress={onBackPress}
        />
    );
};

export default Historico;
