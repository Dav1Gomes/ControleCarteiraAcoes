import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Components/Login';
import Register from './src/Components/Register';
import Home from './src/Components/Home';
import Movimentacao from './src/Components/Movimentacao';
import Comprar from './src/Components/Comprar';
import Vender from './src/Components/Vender';
import Servicos from './src/Components/Servicos';
import Carteira from './src/Components/Carteira';
import Investimentos from './src/Components/Investimentos';
import Historico from './src/Components/Historico';
import Dashboard from './src/Components/Dashboard';
import RegistrarDividendo from './src/Components/RegistrarDividendo';
import RentabilidadeMensal from './src/Components/RentabilidadeMensal';
import DividendosRentabilidade from './src/Components/DividendosRentabilidade';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="Movimentacao" component={Movimentacao} options={{ headerShown: false }} />
                <Stack.Screen name="Comprar" component={Comprar} options={{ headerShown: false }} />
                <Stack.Screen name="Vender" component={Vender} options={{ headerShown: false }} />
                <Stack.Screen name="Servicos" component={Servicos} options={{ headerShown: false }} />
                <Stack.Screen name="Carteira" component={Carteira} options={{ headerShown: false }} />
                <Stack.Screen name="Investimentos" component={Investimentos} options={{ headerShown: false }} />
                <Stack.Screen name="Historico" component={Historico} options={{ headerShown: false }}/>
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/>
                <Stack.Screen name="RegistrarDividendo" component={RegistrarDividendo} options={{ headerShown: false }}/>
                <Stack.Screen name="RentabilidadeMensal" component={RentabilidadeMensal} options={{ headerShown: false }}/>
                <Stack.Screen name="DividendosRentabilidade" component={DividendosRentabilidade} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
