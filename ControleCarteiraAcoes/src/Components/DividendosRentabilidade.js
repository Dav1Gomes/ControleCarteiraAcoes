import React, { useEffect, useState } from "react";
import DividendosRentabilidadeView from "../Views/DividendosRentabilidadeView";
import { buscarDividendos } from "../services/authService";

const DividendosRentabilidade = ({ route, navigation }) => {
  const { userId } = route.params || {};
  const [dividendos, setDividendos] = useState([]);

  useEffect(() => {
    const fetchDividendos = async () => {
      try {
        const { dividendos } = await buscarDividendos(userId);
        setDividendos(dividendos);
      } catch (error) {
        console.error("Erro ao carregar dividendos:", error.message);
        navigation.navigate("Login");
      }
    };

    fetchDividendos();
  }, [userId]);

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <DividendosRentabilidadeView
      dividendos={dividendos}
      onBackPress={onBackPress}
    />
  );
};

export default DividendosRentabilidade;
