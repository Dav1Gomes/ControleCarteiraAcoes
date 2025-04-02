import React, { useState } from 'react';
import { registrarDividendo } from '../services/authService';
import RegistrarDividendoView from '../Views/RegistrarDividendoView';

const RegistrarDividendo = ({ route, navigation }) => {
    const { userId, nome } = route.params || {};

    if (!userId) {
        console.error('ID do usuário não foi passado para a tela RegistrarDividendo.');
        navigation.navigate('Servicos');
        return null;
    }

    const [empresaId, setEmpresaId] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');

    const handleRegistrar = async () => {
        if (!empresaId || !valor || !data) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        const formattedData = data.split('-').reverse().join('-');

        try {
            await registrarDividendo(userId, empresaId, parseFloat(valor), formattedData);
            alert('Dividendo registrado com sucesso!');
            setEmpresaId('');
            setValor('');
            setData('');
        } catch (error) {
            console.error('Erro ao registrar dividendo:', error.response?.data || error.message);
            alert(error.response?.data?.error || 'Erro ao registrar dividendo.');
        }
    };

    const onBackPress = () => {
        navigation.navigate('Servicos', { userId, nome });
    };

    return (
        <RegistrarDividendoView
            empresaId={empresaId}
            setEmpresaId={setEmpresaId}
            valor={valor}
            setValor={setValor}
            data={data}
            setData={setData}
            handleRegistrar={handleRegistrar}
            onBackPress={onBackPress}
        />
    );
};

export default RegistrarDividendo;
