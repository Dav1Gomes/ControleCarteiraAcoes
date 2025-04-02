import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const DashboardView = ({ pieData, lineData, resumo, navigation }) => {
  const hasLineData =
    lineData &&
    Array.isArray(lineData.datasets) &&
    lineData.datasets[0] &&
    Array.isArray(lineData.datasets[0].data) &&
    lineData.datasets[0].data.length > 0;

  const formattedLineData = {
    ...lineData,
    labels: lineData.labels.map((label, index, arr) => {
      if (
        index === 0 ||
        index === arr.length - 1 ||
        index === Math.floor(arr.length / 2)
      ) {
        return label.split(" ")[0];
      }
      return "";
    }),
  };

  const predefinedColors = [
    "#8a2be2",
    "#007BFF",
    "#28A745",
    "#FF0000",
    "#FFC107",
    "#FF7F50",
    "#FF69B4",
  ];

  const updatedPieData = pieData.map((item, index) => ({
    ...item,
    color: predefinedColors[index % predefinedColors.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Dashboard</Text>

        <Text style={styles.sectionTitle}>Distribuição de Investimentos</Text>
        {updatedPieData.length > 0 ? (
          <PieChart
            data={updatedPieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.errorText}>
            Nenhum dado disponível para o gráfico.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Evolução do Saldo</Text>
        {hasLineData ? (
          <LineChart
            data={formattedLineData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        ) : (
          <Text style={styles.errorText}>
            Nenhum dado disponível para o gráfico.
          </Text>
        )}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Saldo Total: R$ {resumo.saldoTotal}
          </Text>
          <Text style={styles.summaryText}>
            Total Investido: R$ {resumo.totalInvestido}
          </Text>
          <Text style={styles.summaryText}>
            Rentabilidade: R$ {resumo.rentabilidade}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.footerButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 70,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: "90%",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerButton: {
    backgroundColor: "#8a2be2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardView;
