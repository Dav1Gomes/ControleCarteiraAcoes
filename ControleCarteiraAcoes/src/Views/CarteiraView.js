import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CarteiraView = ({
  dadosUsuario,
  investimentos,
  totalInvestimentos,
  onHistoricoPress,
  onDashboardPress,
  onDividendosRentPress,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira</Text>
      <Text style={styles.label}>{dadosUsuario.nome}</Text>
      <Text style={styles.label}>{dadosUsuario.email}</Text>
      <Text style={styles.saldo}>
        Saldo: R${" "}
        {dadosUsuario.saldo !== null && dadosUsuario.saldo !== undefined
          ? dadosUsuario.saldo.toFixed(2).toLocaleString("pt-BR")
          : "0,00"}
      </Text>
      <Text style={styles.label}>
        Total de Investimentos: {totalInvestimentos}
      </Text>

      <TouchableOpacity style={styles.button} onPress={onHistoricoPress}>
        <MaterialCommunityIcons
          name="history"
          size={24}
          color="#FFF"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onDashboardPress}>
        <MaterialCommunityIcons
          name="view-dashboard"
          size={24}
          color="#FFF"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>DashBoard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onDividendosRentPress}>
        <MaterialCommunityIcons
          name="cash-multiple"
          size={24}
          color="#FFF"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Dividendos e Rentabilidade</Text>
      </TouchableOpacity>

      <Text style={styles.investimentosTitle}>Detalhes dos Investimentos:</Text>
      <FlatList
        data={investimentos}
        keyExtractor={(item) => `investimento-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.investimentoItem}>
            <Text style={styles.investimentoText}>
              Empresa: {item.empresaId}
            </Text>
            <Text style={styles.investimentoText}>
              Quantidade: {item.quantidade}
            </Text>
            <Text style={styles.investimentoText}>
              Valor Atual do Mercado: R${" "}
              {item.valorAtual !== undefined
                ? item.valorAtual.toFixed(2).toLocaleString("pt-BR")
                : "0,00"}
            </Text>
            <Text style={styles.investimentoText}>
              Valor Total: R${" "}
              {item.valorAtual && item.quantidade
                ? (item.valorAtual * item.quantidade)
                    .toFixed(2)
                    .toLocaleString("pt-BR")
                : "0,00"}
            </Text>
          </View>
        )}
      />

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
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 80,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  saldo: {
    fontSize: 24,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  investimentosTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  investimentoItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  investimentoText: {
    fontSize: 14,
    color: "#333",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3e3e3e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default CarteiraView;
