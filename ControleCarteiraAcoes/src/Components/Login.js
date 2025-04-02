import React, { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginView from "../Views/LoginView";
import { realizarLogin } from "../services/authService";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const aoEntrar = async () => {
        if (!email || !senha) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        try {
            const resposta = await realizarLogin(email, senha);

            if (resposta.sucesso) {
                await AsyncStorage.setItem("token", resposta.token); 
                await AsyncStorage.setItem("userId", resposta.userId.toString());

                navigation.navigate("Home", { userId: resposta.userId, nome: resposta.nome });
            } else {
                Alert.alert("Erro", resposta.mensagem || "Credenciais inválidas");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar fazer login");
        }
    };

    const aoRegistrar = () => {
        navigation.navigate("Register");
    };

    return (
        <LoginView
            email={email}
            setEmail={setEmail}
            senha={senha}
            setSenha={setSenha}
            aoEntrar={aoEntrar}
            aoRegistrar={aoRegistrar}
        />
    );
};

export default Login;
