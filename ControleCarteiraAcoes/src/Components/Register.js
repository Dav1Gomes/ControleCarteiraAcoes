import React, { useState } from 'react';
import { Alert } from 'react-native';
import RegisterView from '../Views/RegisterView';
import { adicionarUsuario } from '../services/authService';

const Register = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const aoRegistrar = async () => {
        if (!nome || !email || !senha) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        try {
            const resposta = await adicionarUsuario(nome, email, senha);

            if (resposta.sucesso) {
                Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert('Erro', resposta.mensagem || 'Erro ao tentar registrar o usuário');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar o usuário');
        }
    };

    const aoVoltar = () => {
        navigation.navigate('Login');
    };

    return (
        <RegisterView 
            nome={nome} 
            setNome={setNome} 
            email={email} 
            setEmail={setEmail} 
            senha={senha} 
            setSenha={setSenha} 
            aoRegistrar={aoRegistrar} 
            aoVoltar={aoVoltar} 
        />
    );
};

export default Register;
