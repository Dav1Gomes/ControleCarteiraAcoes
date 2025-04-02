import React from 'react';
import ServicosView from '../Views/ServicosView';

const Servicos = ({ navigation, route }) => {
    const { userId } = route.params || {};

    if (!userId) {
        console.error('ID do usuário não foi passado para a tela de Serviços.');
        navigation.navigate('Home');
        return null;
    }

    const onRegistrarDividendoPress = () => {
        navigation.navigate('RegistrarDividendo', { userId, nome: route.params.nome });
    };

    const onRentabilidadePress = () => {
        navigation.navigate('RentabilidadeMensal', { userId, nome: route.params.nome });
    };

    const onBackPress = () => {
        navigation.navigate('Home', { userId, nome: route.params.nome });
    };

    return (
        <ServicosView
            onRegistrarDividendoPress={onRegistrarDividendoPress}
            onRentabilidadePress={onRentabilidadePress}
            onBackPress={onBackPress}
        />
    );
};

export default Servicos;
