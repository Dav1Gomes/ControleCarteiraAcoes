import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RentabilidadeMensalView = ({ rentabilidade, loading, onBack }) => {
    const { dividendos, valorizacaoAtivos, lucrosPrejuizos, total, rentabilidadeDividendos } = rentabilidade;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rentabilidade Mensal</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#FF0000" />
            ) : (
                <View style={styles.rentabilidadeContainer}>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="cash-plus" size={20} color="#333" />
                        <Text style={styles.labelTitle}> Dividendos: </Text>
                        R$ {dividendos.toFixed(2)}
                    </Text>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="chart-line" size={20} color="#333" />
                        <Text style={styles.labelTitle}> Valorização dos Ativos: </Text>
                        R$ {valorizacaoAtivos.toFixed(2)}
                    </Text>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="cash" size={20} color="#333" />
                        <Text style={styles.labelTitle}> Rentabilidade dos Dividendos: </Text>
                        R$ {rentabilidadeDividendos.toFixed(2)}
                    </Text>
                    <Text style={[styles.total, styles.lucro]}>
                        Lucro: R$ {total > 0 ? total.toFixed(2) : 0}
                    </Text>
                    <Text style={[styles.total, styles.prejuizo]}>
                        Prejuízo: R$ {total < 0 ? Math.abs(total).toFixed(2) : 0}
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        paddingTop: 120,
    },
    rentabilidadeContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelTitle: {
        fontWeight: 'bold',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    lucro: {
        color: '#0ca8eb',
    },
    prejuizo: {
        color: '#FF0000',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default RentabilidadeMensalView;
