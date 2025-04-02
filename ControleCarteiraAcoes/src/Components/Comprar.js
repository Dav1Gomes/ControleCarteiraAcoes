import React, { useEffect, useState } from "react";
import { Alert } from "react-native"; 
import { getEmpresas } from "../services/polygonService";
import ComprarView from "../Views/ComprarView";

const Comprar = ({ navigation, route }) => {
  const { userId } = route.params;
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresasData = await getEmpresas(); 
        setEmpresas(empresasData || []);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error.message);
        Alert.alert("Erro", "Não foi possível carregar as empresas.");
        navigation.navigate("Login"); 
      }
    };
    fetchEmpresas();
  }, []);

  const onVerInvestimentos = (empresa) => {
    navigation.navigate("Investimentos", { empresa, userId });
  };

  return (
    <ComprarView
      empresas={empresas}
      onVerInvestimentos={onVerInvestimentos}
      navigation={navigation}
    />
  );
};

export default Comprar;
