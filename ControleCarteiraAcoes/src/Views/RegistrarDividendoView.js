import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegistrarDividendoView = ({
    empresaId,
    setEmpresaId,
    valor,
    setValor,
    data,
    setData,
    handleRegistrar,
    onBackPress,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Dividendo</Text>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="domain" size={20} color="#FF0000" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="ID da Empresa"
                    value={empresaId}
                    onChangeText={setEmpresaId}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="cash" size={20} color="#FF0000" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Valor"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={setValor}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="calendar" size={20} color="#FF0000" style={styles.icon} />
                <TextInputMask
                    style={styles.input}
                    type={'custom'}
                    options={{
                        mask: '99-99-9999',
                    }}
                    placeholder="Data (DD-MM-YYYY)"
                    value={data}
                    onChangeText={setData}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegistrar}>
                <MaterialCommunityIcons name="check" size={20} color="#FFF" style={styles.icon} />
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Voltar</Text>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF0000',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3e3e3e',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
    },
});

export default RegistrarDividendoView;
