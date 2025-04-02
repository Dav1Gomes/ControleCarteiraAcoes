import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const InvestimentosView = ({
    empresa,
    cotacoes,
    saldo,
    quantidade,
    loading,
    loadingSaldo,
    onQuantidadeChange,
    onComprar,
    navigation,
}) => {
    const handleComprarClick = () => {
        const valorCompraReais = quantidade * cotacoes[0]?.precoEmReais;
        Alert.alert(
            "Confirmar Compra",
            `Deseja comprar ${quantidade} de ${empresa.name} por R$${valorCompraReais.toFixed(2)}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Comprar",
                    onPress: onComprar,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Investimentos para {empresa.name}</Text>
            <Text style={styles.saldo}>
                {loadingSaldo ? "Carregando saldo..." : `Saldo atual: R$${saldo.toFixed(2)}`}
            </Text>
            {loading ? (
                <ActivityIndicator size="large" color="#8a2be2" />
            ) : (
                cotacoes.length > 0 ? (
                    cotacoes.map((cotacao, index) => (
                        <View key={`${empresa.ticker}-${index}`} style={styles.investimentoContainer}>
                            <Text style={styles.investimentoNome}>{empresa.name}</Text>
                            <Text style={styles.investimentoPreco}>Preço: ${cotacao.c.toFixed(2)}</Text>
                            <Text style={styles.investimentoPrecoReal}>
                                Preço em Real: R$ {cotacao.precoEmReais}
                            </Text>

                            <TextInput
                                style={styles.quantidadeInput}
                                keyboardType="numeric"
                                placeholder="Quantidade"
                                value={quantidade.toString()}
                                onChangeText={onQuantidadeChange}
                            />

                            <Text style={styles.total}>
                                Total: R$ {(quantidade * cotacao.precoEmReais).toFixed(2)}
                            </Text>

                            <TouchableOpacity
                                style={styles.botaoComprar}
                                onPress={handleComprarClick}
                            >
                                <Text style={styles.botaoTexto}>Comprar</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyMessage}>Nenhum investimento disponível para esta empresa.</Text>
                )
            )}

            <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left-circle" size={24} color="#FFF" />
                <Text style={styles.voltarButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        paddingTop: 100,
    },
    saldo: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    investimentoContainer: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    investimentoNome: {
        fontSize: 16,
        fontWeight: "bold",
    },
    investimentoPreco: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    investimentoPrecoReal: {
        fontSize: 14,
        color: "#0ca8eb",
        marginBottom: 5,
    },
    quantidadeInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 8,
        marginVertical: 10,
        width: "100%",
    },
    total: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#0ca8eb",
    },
    botaoComprar: {
        backgroundColor: "#388E3C",
        paddingVertical: 10,
        borderRadius: 5,
    },
    botaoTexto: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    voltarButton: {
        marginTop: 20,
        backgroundColor: "#424242",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    voltarButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    emptyMessage: {
        textAlign: "center",
        fontSize: 16,
        color: "#888",
    },
});

export default InvestimentosView;
