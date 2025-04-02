import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ServicosView = ({ onRegistrarDividendoPress, onRentabilidadePress, onBackPress }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Serviços</Text>

        <TouchableOpacity style={styles.button} onPress={onRegistrarDividendoPress}>
            <MaterialCommunityIcons name="cash-plus" size={24} color="#FFF" style={styles.icon} />
            <Text style={styles.buttonText}>Registrar Dividendo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onRentabilidadePress}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#FFF" style={styles.icon} />
            <Text style={styles.buttonText}>Rentabilidade Mensal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
            <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        paddingTop: 120,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF0000', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 30,
        backgroundColor: '#3e3e3e', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default ServicosView;
