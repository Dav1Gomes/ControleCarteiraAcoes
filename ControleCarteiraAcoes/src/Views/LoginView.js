import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const LoginView = ({ email, setEmail, senha, setSenha, aoEntrar, aoRegistrar }) => {
    return (
        <KeyboardAvoidingView style={estilos.container} behavior="padding">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4839/4839681.png' }} style={estilos.iconeInvestimento} />

            <Text style={estilos.fraseImpacto}>Gerencie seus investimentos com facilidade</Text>

            <View style={estilos.inputContainer}>
                <MaterialCommunityIcons name="email-outline" size={24} color="#8a2be2" style={estilos.icon} />
                <TextInput
                    style={estilos.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#a1a1a1"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={estilos.inputContainer}>
                <MaterialCommunityIcons name="lock-outline" size={24} color="#8a2be2" style={estilos.icon} />
                <TextInput
                    style={estilos.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#a1a1a1"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />
            </View>

            <Pressable
                onPress={aoEntrar}
                style={({ pressed }) => [
                    estilos.botaoEntrar,
                    { backgroundColor: pressed ? '#0ca8eb' : '#8a2be2' }
                ]}
            >
                <FontAwesome name="sign-in" size={20} color="#fff" style={estilos.iconBotao} />
                <Text style={estilos.textoBotao}>Acessar minha carteira</Text>
            </Pressable>

            <Pressable
                onPress={aoRegistrar}
                style={({ pressed }) => [
                    estilos.botaoRegistrar,
                    { backgroundColor: pressed ? '#6a0dad' : '#4b0082' }
                ]}
            >
                <FontAwesome name="user-plus" size={20} color="#fff" style={estilos.iconBotao} />
                <Text style={estilos.textoBotao}>Registrar-se</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    iconeInvestimento: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    fraseImpacto: {
        fontSize: 20,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#8a2be2',
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    botaoEntrar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    botaoRegistrar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    iconBotao: {
        marginRight: 8,
    },
    textoBotao: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginView;
