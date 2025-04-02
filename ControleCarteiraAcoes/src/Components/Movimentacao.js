import React, { useState, useEffect } from "react";
import { realizarDeposito, realizarRetirada, buscarSaldoAtualizado } from "../services/authService";
import MovimentacaoView from "../Views/MovimentacaoView";

const Movimentacao = ({ navigation, route }) => {
    const { userId } = route.params;
    const [valorDeposito, setValorDeposito] = useState("");
    const [valorRetirada, setValorRetirada] = useState("");
    const [saldoAtual, setSaldoAtual] = useState(0);
    const [mensagemSucesso, setMensagemSucesso] = useState("");

    useEffect(() => {
        const fetchSaldoAtual = async () => {
            try {
                const data = await buscarSaldoAtualizado(userId);
                setSaldoAtual(data.saldo);
            } catch (error) {
                console.error("Erro ao buscar saldo:", error.message);
            }
        };
        if (userId) fetchSaldoAtual();
    }, [userId]);

    const exibirMensagemSucesso = (mensagem) => {
        setMensagemSucesso(mensagem);
        setTimeout(() => setMensagemSucesso(""), 3000);
    };

    const aoDepositar = async () => {
        try {
            await realizarDeposito(userId, parseFloat(valorDeposito));
            setValorDeposito("");
            setSaldoAtual(saldoAtual + parseFloat(valorDeposito));
            exibirMensagemSucesso("Depósito realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao depositar:", error.message);
        }
    };

    const aoRetirar = async () => {
        try {
            await realizarRetirada(userId, parseFloat(valorRetirada));
            setValorRetirada("");
            setSaldoAtual(saldoAtual - parseFloat(valorRetirada));
            exibirMensagemSucesso("Retirada realizada com sucesso!");
        } catch (error) {
            console.error("Erro ao retirar:", error.message);
        }
    };

    return (
        <MovimentacaoView
            saldoAtual={saldoAtual}
            valorDeposito={valorDeposito}
            setValorDeposito={setValorDeposito}
            valorRetirada={valorRetirada}
            setValorRetirada={setValorRetirada}
            aoDepositar={aoDepositar}
            aoRetirar={aoRetirar}
            mensagemSucesso={mensagemSucesso}
            navigation={navigation}
        />
    );
};

export default Movimentacao;
