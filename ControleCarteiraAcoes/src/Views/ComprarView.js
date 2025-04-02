import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ComprarView = ({ empresas, onVerInvestimentos, navigation }) => {
    const renderEmpresa = ({ item }) => (
        <View style={styles.empresaContainer}>
            <Text style={styles.empresaNome} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity
                style={styles.botaoVerInvestimentos}
                onPress={() => onVerInvestimentos(item)}
            >
                <MaterialCommunityIcons name="chart-line" size={18} color="#fff" />
                <Text style={styles.botaoTexto}> Ver Investimentos</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Empresas de Investimento</Text>
            <FlatList
                data={empresas}
                renderItem={renderEmpresa}
                keyExtractor={(item, index) => `${item.ticker}-${index}`} 
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>Nenhuma empresa disponível</Text>
                }
            />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.botaoVoltar}
            >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
                <Text style={styles.textoBotaoVoltar}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#000',
        paddingTop: 100,
    },
    empresaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    empresaNome: {
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
        color: '#000',
    },
    botaoVerInvestimentos: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#50C878', 
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3e3e3e', 
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignSelf: 'center',
        width: '90%',
    },
    textoBotaoVoltar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default ComprarView;
