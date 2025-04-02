import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DividendosRentabilidadeView = ({ dividendos, onBackPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dividendos e Rentabilidade</Text>
      <FlatList
        data={dividendos}
        keyExtractor={(item, index) => `dividendo-${index}`}
        renderItem={({ item }) => (
          <View style={styles.dividendoItem}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="domain" size={20} color="#007BFF" style={styles.icon} />
              <Text style={styles.dividendoText}>
                Empresa: <Text style={styles.highlight}>{item.empresaId}</Text>
              </Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="cash" size={20} color="#28A745" style={styles.icon} />
              <Text style={styles.dividendoText}>
                Valor: R$ <Text style={styles.highlight}>{item.valor.toFixed(2).toLocaleString("pt-BR")}</Text>
              </Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#FFC107" style={styles.icon} />
              <Text style={styles.dividendoText}>
                Rentabilidade: R$ <Text style={styles.highlight}>
                  {(item.valor * 0.04).toFixed(2).toLocaleString("pt-BR")}
                </Text>
              </Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar" size={20} color="#FF0000" style={styles.icon} />
              <Text style={styles.dividendoText}>
                Data: <Text style={styles.highlight}>{new Date(item.data).toLocaleDateString("pt-BR")}</Text>
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum dividendo registrado no momento.</Text>
        }
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
    color: "#333",
  },
  dividendoItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  dividendoText: {
    fontSize: 14,
    color: "#555",
  },
  highlight: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3e3e3e",
    paddingVertical: 12,
    paddingHorizontal: 20,
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

export default DividendosRentabilidadeView;
