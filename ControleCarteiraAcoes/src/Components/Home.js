import React, { useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeView from "../Views/HomeView";

const Home = ({ navigation, route }) => {
    const { nome, userId } = route.params || {};

    useEffect(() => {
        console.log("Parâmetros recebidos na Home:", { nome, userId });
        if (!userId) {
            Alert.alert("Erro", "Você precisa estar logado para acessar esta tela.");
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }]
            });
        }
    }, [userId]);

    const handleLogout = async () => {
        await AsyncStorage.clear(); 
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
        });
    };

    return (
        <HomeView 
            nome={nome}
            onNavigateToMovimentacao={() => navigation.navigate("Movimentacao", { userId })}
            onNavigateToComprar={() => navigation.navigate("Comprar", { userId })}
            onNavigateToVender={() => navigation.navigate("Vender", { userId })}
            onNavigateToServicos={() => navigation.navigate("Servicos", { userId, nome })}
            onNavigateToCarteira={() => navigation.navigate("Carteira", { userId, nome })}
            onLogout={handleLogout}
        />
    );
};

export default Home;
