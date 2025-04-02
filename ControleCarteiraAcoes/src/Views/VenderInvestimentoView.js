import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VenderInvestimentoView = ({
    ativos,
    saldo,
    quantidades,
    onQuantidadeChange,
    onVenderInvestimento,
    navigation,
    loading,
}) => {
    const renderAtivo = ({ item }) => (
        <View style={styles.investimentoContainer}>
            <Text style={styles.investimentoNome}>{item.empresaId || 'Nome não disponível'}</Text>
            <Text style={styles.investimentoPreco}>Preço (Dólar): ${item.valorAtual?.toFixed(2) || 'N/A'}</Text>
            <Text style={[styles.precoReais, { color: '#0ca8eb' }]}>
                Preço (Reais): R$ {item.valor?.toFixed(2) || 'N/A'}
            </Text>
            <Text>Quantidade Disponível: {item.quantidade}</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantidade a Vender:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Digite a quantidade"
                    value={quantidades[item.id]?.toString() || ""}
                    onChangeText={(text) => onQuantidadeChange(item.id, text)}
                />
            </View>

            <Text style={styles.total}>
                Valor Total: R$ {(item.valor * (quantidades[item.id] || 0)).toFixed(2)}
            </Text>

            <TouchableOpacity
                style={styles.botaoVender}
                onPress={() => onVenderInvestimento(item)}
            >
                <Text style={styles.botaoTexto}>Vender</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View>
            <Text style={styles.title}>Investimentos Disponíveis</Text>
            <Text style={styles.saldo}>
                Saldo atual: R$ {saldo ? saldo.toFixed(2) : '0.00'}
            </Text>
        </View>
    );

    const renderFooter = () => (
        <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left-circle" size={24} color="#FFF" />
            <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={ativos}
            renderItem={renderAtivo}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
                !loading && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyMessage}>
                            Nenhum investimento disponível no momento.
                        </Text>
                    </View>
                )
            }
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        paddingTop: 100,
    },
    saldo: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    investimentoContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    investimentoNome: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    investimentoPreco: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    precoReais: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    total: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0ca8eb',
    },
    botaoVender: {
        backgroundColor: '#da6b00',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    voltarButton: {
        marginTop: 20,
        backgroundColor: '#424242',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voltarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
});

export default VenderInvestimentoView;
