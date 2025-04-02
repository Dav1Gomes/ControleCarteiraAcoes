import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomeView = ({ nome, onNavigateToMovimentacao, onNavigateToComprar, onNavigateToVender, onNavigateToServicos, onNavigateToCarteira, onLogout }) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Seja bem-vindo(a), {nome}!</Text>
            <Text style={styles.motivation}>
                Invista no seu futuro com sabedoria e alcance seus sonhos financeiros.
            </Text>
            <Text style={styles.date}>Hoje é {dataAtual}.</Text>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#E5C100' : '#8a2be2' },
                ]}
                onPress={onNavigateToMovimentacao}
            >
                <MaterialCommunityIcons name="cash-plus" size={24} color="white" />
                <Text style={styles.buttonText}>Depósito/Retirada</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#50c878' : '#8a2be2' },
                ]}
                onPress={onNavigateToComprar}
            >
                <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
                <Text style={styles.buttonText}>Compra de Investimento</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#ffa500' : '#8a2be2' },
                ]}
                onPress={onNavigateToVender}
            >
                <MaterialCommunityIcons name="cart-remove" size={24} color="white" />
                <Text style={styles.buttonText}>Venda de Investimento</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#ff4c4c' : '#8a2be2' },
                ]}
                onPress={onNavigateToServicos}
            >
                <MaterialCommunityIcons name="tools" size={24} color="white" />
                <Text style={styles.buttonText}>Serviços</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#0096FF' : '#8a2be2' },
                ]}
                onPress={onNavigateToCarteira}
            >
                <MaterialCommunityIcons name="wallet" size={24} color="white" />
                <Text style={styles.buttonText}>Carteira do Cliente</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.logoutButton,
                    { backgroundColor: pressed ? '#ff4c4c' : '#4b0082' },
                ]}
                onPress={onLogout}
            >
                <MaterialCommunityIcons name="exit-to-app" size={24} color="white" />
                <Text style={styles.buttonText}>Sair</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8a2be2',
        marginBottom: 10,
    },
    motivation: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    date: {
        fontSize: 14,
        color: '#6a6a6a',
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
        width: '80%',
    },
});

export default HomeView;
