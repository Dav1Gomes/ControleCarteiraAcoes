const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./usuarios_investimento.db', (err) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }
    console.log('Conectado ao banco de dados SQLite3');
});

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    saldo DOUBLE DEFAULT 0.0,
    Verificacao TEXT
)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de usuários:', err.message);
    } else {
        console.log('Tabela de usuários verificada/criada');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    valor REAL NOT NULL,
    quantidade REAL, 
    valorCompra REAL, 
    valorVenda REAL, 
    tipo TEXT NOT NULL CHECK(tipo IN ('compra', 'venda', 'deposito', 'retirada')),
    empresaId TEXT, 
    data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES usuarios(id)
)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de transações:', err.message);
    } else {
        console.log('Tabela de transações verificada/criada');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS dividendos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    empresaId TEXT NOT NULL,
    valor REAL NOT NULL,
    data TEXT NOT NULL,
    ultimaAtualizacao TEXT DEFAULT NULL, 
    FOREIGN KEY(userId) REFERENCES usuarios(id)
)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de dividendos:', err.message);
    } else {
        console.log('Tabela de dividendos verificada/criada');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS rentabilidade (
    userId INTEGER NOT NULL,
    totalRentabilidade REAL DEFAULT 0,
    dataAtualizacao TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId),
    FOREIGN KEY(userId) REFERENCES usuarios(id)
)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de rentabilidade:', err.message);
    } else {
        console.log('Tabela de rentabilidade verificada/criada');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS historico_saldo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    saldo REAL NOT NULL,
    data TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES usuarios(id)
)`, (err) => {
    if (err) {
        console.error("Erro ao criar tabela de histórico de saldos:", err.message);
    } else {
        console.log("Tabela de histórico de saldos verificada/criada.");
    }
});


db.run(`CREATE TABLE IF NOT EXISTS investimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    empresaId TEXT NOT NULL,
    quantidade REAL NOT NULL,
    valor REAL NOT NULL,
    valorAtual REAL DEFAULT 0.0,
    dataCompra TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES usuarios(id)

)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de investimentos:', err.message);
    } else {
        console.log('Tabela de investimentos verificada/criada');
    }
});


module.exports = db;
