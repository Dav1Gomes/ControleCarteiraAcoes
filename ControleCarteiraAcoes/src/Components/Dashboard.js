import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DashboardView from "../Views/DashboardView";
import {
  buscarHistoricoSaldo,
  buscarInvestimentos,
  buscarDividendos,
  buscarSaldo,
} from "../services/authService";

const Dashboard = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{ data: [], strokeWidth: 2 }],
  });
  const [resumo, setResumo] = useState({
    saldoTotal: "0,00",
    totalInvestido: "0,00",
    rentabilidade: "0.00",
  });

  const atualizarGraficoSaldo = async () => {
    try {
      const historico = await buscarHistoricoSaldo(userId);
      const labels = historico.map((item) =>
        new Date(item.data).toLocaleString("pt-BR")
      );
      const data = historico.map((item) => parseFloat(item.saldo) || 0);

      setLineData({
        labels,
        datasets: [{ data, strokeWidth: 2 }],
      });
    } catch (error) {
      console.error("Erro ao atualizar o gráfico de saldo:", error.message);
      setLineData({
        labels: [],
        datasets: [{ data: [], strokeWidth: 2 }],
      });
    }
  };

  const atualizarGraficoPizza = async () => {
    try {
      const investimentos = await buscarInvestimentos(userId);

      if (investimentos && investimentos.length > 0) {
        const groupedInvestments = investimentos.reduce((acc, item) => {
          acc[item.empresaId] = (acc[item.empresaId] || 0) + item.quantidade;
          return acc;
        }, {});

        const pieData = Object.keys(groupedInvestments).map((key) => ({
          name: key,
          value: groupedInvestments[key],
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          legendFontColor: "#333",
          legendFontSize: 14,
        }));

        setPieData(pieData);
      } else {
        setPieData([]);
      }
    } catch (error) {
      console.error(
        "Erro ao buscar dados para o gráfico de pizza:",
        error.message
      );
      setPieData([]);
    }
  };

  const atualizarResumoFinanceiro = async () => {
    try {
      const investimentos = await buscarInvestimentos(userId);
      const totalInvestido = investimentos.reduce(
        (sum, investimento) => sum + (investimento.valor || 0),
        0
      );

      const { rentabilidadeDividendos } = await buscarDividendos(userId);

      const saldo = await buscarSaldo(userId);

      const saldoTotal = (saldo + rentabilidadeDividendos).toFixed(2);

      setResumo({
        saldoTotal,
        totalInvestido: totalInvestido.toFixed(2),
        rentabilidade: rentabilidadeDividendos.toFixed(2),
      });
    } catch (error) {
      console.error("Erro ao buscar dados do resumo:", error.message);
      setResumo({
        saldoTotal: "0,00",
        totalInvestido: "0,00",
        rentabilidade: "0.00",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const atualizarDados = async () => {
        await Promise.all([
          atualizarGraficoSaldo(),
          atualizarGraficoPizza(),
          atualizarResumoFinanceiro(),
        ]);
      };

      atualizarDados();
    }, [userId])
  );

  return (
    <DashboardView
      pieData={pieData}
      lineData={lineData}
      resumo={resumo}
      navigation={navigation}
    />
  );
};

export default Dashboard;
