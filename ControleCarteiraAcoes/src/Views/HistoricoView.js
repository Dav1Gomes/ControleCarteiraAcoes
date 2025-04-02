import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HistoricoView = ({ historico, loading, onBackPress }) => {
    const renderDepositoRetirada = ({ item }) => {
        const isDeposito = item.tipo === "deposito";
        const textColor = isDeposito ? "#0ca8eb" : "#FF0000";
        const sinal = isDeposito ? "+" : "-";

        return (
            <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={isDeposito ? "bank-plus" : "bank-minus"}
                        size={24}
                        color={textColor}
                    />
                </View>
                <View>
                    <Text style={[styles.itemTitle, { color: textColor }]}>
                        {isDeposito ? "Depósito" : "Retirada"}
                    </Text>
                    <Text style={[styles.itemDetails, { color: textColor }]}>
                        {sinal} R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.itemDetails}>
                        Data: {new Date(item.data).toLocaleDateString("pt-BR")}
                    </Text>
                </View>
            </View>
        );
    };

    const renderCompraVenda = ({ item }) => {
        const isCompra = item.tipo === "compra";
        const textColor = isCompra ? "#0ca8eb" : "#FF0000";

        return (
            <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={isCompra ? "cart-plus" : "cart-remove"}
                        size={24}
                        color={textColor}
                    />
                </View>
                <View>
                    <Text style={[styles.itemTitle, { color: textColor }]}>
                        {isCompra ? "Compra" : "Venda"}
                    </Text>
                    <Text style={styles.itemDetails}>Empresa: {item.empresaId}</Text>
                    <Text style={styles.itemDetails}>
                        Valor: R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.itemDetails}>
                        Data: {new Date(item.data).toLocaleDateString("pt-BR")}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico</Text>

            {loading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <View style={styles.sectionsContainer}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Depósito/Retirada</Text>
                        <FlatList
                            data={historico.depositosRetiradas}
                            renderItem={renderDepositoRetirada}
                            keyExtractor={(item, index) => `deposito-${index}`}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Compra/Venda de Investimentos</Text>
                        <FlatList
                            data={historico.comprasVendas}
                            renderItem={renderCompraVenda}
                            keyExtractor={(item, index) => `compra-${index}`}
                        />
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        paddingTop: 70,
    },
    sectionsContainer: {
        flex: 1,
        flexDirection: "row",
    },
    section: {
        flex: 0.5, 
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: "#f9f9f9",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    itemDetails: {
        fontSize: 14,
        color: "#555",
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        color: "#999",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3e3e3e",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        justifyContent: "center",
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default HistoricoView;
