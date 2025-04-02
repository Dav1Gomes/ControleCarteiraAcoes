import React from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MovimentacaoView = ({
    saldoAtual,
    valorDeposito,
    setValorDeposito,
    valorRetirada,
    setValorRetirada,
    aoDepositar,
    aoRetirar,
    mensagemSucesso,
    navigation,
}) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {mensagemSucesso ? (
                <Animated.View style={styles.sucessoContainer}>
                    <MaterialCommunityIcons name="check-circle-outline" size={24} color="#28a745" />
                    <Text style={styles.sucessoTexto}>{mensagemSucesso}</Text>
                </Animated.View>
            ) : null}

            <Text style={styles.saldoAtual}>Saldo Atual: R$ {saldoAtual.toFixed(2)}</Text>

            <Text style={styles.sectionTitle}>Depositar Saldo</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="cash-plus" size={24} color="#E5C100" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Digite o valor para depósito"
                    value={valorDeposito}
                    onChangeText={setValorDeposito}
                    keyboardType="numeric"
                    placeholderTextColor="#a1a1a1"
                />
            </View>

            <Pressable
                onPress={aoDepositar}
                style={({ pressed }) => [
                    styles.botaoDepositar,
                    { backgroundColor: pressed ? '#50C878' : '#E5C100' },
                ]}
            >
                <MaterialCommunityIcons name="bank" size={20} color="#ffffff" />
                <Text style={styles.botaoTexto}>Depositar</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Retirar Saldo</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="cash-minus" size={24} color="#E5C100" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Digite o valor para retirada"
                    value={valorRetirada}
                    onChangeText={setValorRetirada}
                    keyboardType="numeric"
                    placeholderTextColor="#a1a1a1"
                />
            </View>

            <Pressable
                onPress={aoRetirar}
                style={({ pressed }) => [
                    styles.botaoRetirar,
                    { backgroundColor: pressed ? '#FF0000' : '#E5C100' },
                ]}
            >
                <MaterialCommunityIcons name="cash-remove" size={20} color="#ffffff" />
                <Text style={styles.botaoTexto}>Retirar</Text>
            </Pressable>

            <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                    styles.botaoVoltar,
                    { backgroundColor: pressed ? '#8a2be2' : '#3e3e3e' },
                ]}
            >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#ffffff" />
                <Text style={styles.textoBotaoVoltar}>Voltar</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    sucessoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d4edda',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        width: '90%',
        justifyContent: 'center',
    },
    sucessoTexto: {
        color: '#155724',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    saldoAtual: {
        fontSize: 22,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5C100',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        width: '90%',
        backgroundColor: '#fff',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 8,
        color: '#000',
    },
    botaoDepositar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 20,
        width: '90%',
    },
    botaoRetirar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        width: '90%',
    },
    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        width: '90%',
    },
    textoBotaoVoltar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default MovimentacaoView;
