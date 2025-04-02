const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");
const { getDividendos } = require("./services/polygonService");
const cron = require("node-cron");
const app = express();
const axios = require("axios");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = '12345123451234512345';

app.use(cors());
app.use(bodyParser.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
          return res.status(403).json({ message: "Token inválido." });
      }
      req.user = user;
      next();
  });
}

app.post("/api/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(senha, 10);

      const query = "INSERT INTO usuarios (nome, email, senha, saldo) VALUES (?, ?, ?, ?)";
      const initialSaldo = 0.0;

      db.run(query, [nome, email, hashedPassword, initialSaldo], function (err) {
          if (err) {
              console.error("Erro ao registrar usuário:", err.message);
              return res.status(500).json({ error: "Erro ao registrar o usuário." });
          }
          res.status(201).json({ message: "Registro bem-sucedido!" });
      });
  } catch (error) {
      console.error("Erro ao registrar usuário:", error.message);
      res.status(500).json({ error: "Erro interno ao registrar o usuário." });
  }
});

app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ?";

  db.get(query, [email], async (err, row) => {
      if (err) {
          console.error("Erro ao buscar usuário:", err.message);
          return res.status(500).json({ error: "Erro interno ao buscar usuário." });
      }

      if (!row || !(await bcrypt.compare(senha, row.senha))) {
          return res.status(401).json({ error: "Email ou senha incorretos!" });
      }

      const token = jwt.sign({ id: row.id, nome: row.nome, email: row.email }, SECRET_KEY, {
          expiresIn: "1h",
      });

      res.status(200).json({
          message: "Login bem-sucedido!",
          token,
          userId: row.id,
          nome: row.nome,
      });
  });
});


app.get("/api/user-data", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Acesso autorizado!",
    user: req.user,
  });
});

module.exports = app;

app.get("/api/saldo/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT saldo FROM usuarios WHERE id = ?";

  db.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ saldo: row ? row.saldo : 0 });
  });
});

app.get("/api/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT nome, email, saldo FROM usuarios WHERE id = ?";

  db.get(query, [userId], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (row) {
          res.json({
              nome: row.nome,
              email: row.email,
              saldo: row.saldo !== null ? row.saldo : 0,
          });
      } else {
          res.status(404).json({ error: "Usuário não encontrado." });
      }
  });
});

app.post("/api/deposito", authenticateToken, (req, res) => {
  const { userId, valor } = req.body;
  const query = "UPDATE usuarios SET saldo = saldo + ? WHERE id = ?";

  db.run(query, [valor, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const transacaoQuery =
      "INSERT INTO transacoes (userId, valor, tipo) VALUES (?, ?, ?)";
    db.run(transacaoQuery, [userId, valor, "deposito"], (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Erro ao registrar transação de depósito." });

      db.get("SELECT saldo FROM usuarios WHERE id = ?", [userId], (err, row) => {
        if (err)
          return res.status(500).json({ error: "Erro ao buscar saldo atualizado." });

        res.json({ message: "Depósito realizado com sucesso!", saldo: row.saldo });
      });
    });
  });
});

app.post("/api/retirada", authenticateToken, (req, res) => {
  const { userId, valor } = req.body;

  db.get("SELECT saldo FROM usuarios WHERE id = ?", [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row && row.saldo >= valor) {
      const query = "UPDATE usuarios SET saldo = saldo - ? WHERE id = ?";
      db.run(query, [valor, userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const transacaoQuery =
          "INSERT INTO transacoes (userId, valor, tipo) VALUES (?, ?, ?)";
        db.run(transacaoQuery, [userId, valor, "retirada"], (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Erro ao registrar transação de retirada." });

          db.get("SELECT saldo FROM usuarios WHERE id = ?", [userId], (err, row) => {
            if (err)
              return res.status(500).json({ error: "Erro ao buscar saldo atualizado." });

            const historicoQuery = `
              INSERT INTO historico_saldo (userId, saldo, data)
              VALUES (?, ?, datetime('now'))
            `;
            db.run(historicoQuery, [userId, row.saldo], (err) => {
              if (err) {
                console.error("Erro ao registrar histórico de saldo:", err.message);
                return res
                  .status(500)
                  .json({ error: "Erro ao registrar histórico de saldo." });
              }
              res.json({
                message: "Retirada realizada com sucesso!",
                saldo: row.saldo,
              });
            });
          });
        });
      });
    } else {
      res.status(400).json({ error: "Saldo insuficiente para retirada." });
    }
  });
});

app.post("/api/registrar-saldo", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  try {
    const querySaldo = "SELECT saldo FROM usuarios WHERE id = ?";
    const userRow = await new Promise((resolve, reject) => {
      db.get(querySaldo, [userId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!userRow) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const insertQuery = `
      INSERT INTO historico_saldo (userId, saldo, data)
      VALUES (?, ?, datetime('now'))
    `;
    db.run(insertQuery, [userId, userRow.saldo], (err) => {
      if (err) {
        console.error("Erro ao registrar saldo no histórico:", err.message);
        return res.status(500).json({ error: "Erro ao registrar saldo." });
      }

      res.status(201).json({ message: "Saldo registrado com sucesso!" });
    });
  } catch (error) {
    console.error("Erro ao registrar saldo no histórico:", error.message);
    res.status(500).json({ error: "Erro ao registrar saldo." });
  }
});

app.get("/api/historico_saldo/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT saldo, data
    FROM historico_saldo
    WHERE userId = ?
    ORDER BY data ASC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico de saldos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar histórico de saldos." });
    }

    res.json(rows.map((row) => ({
      saldo: parseFloat(row.saldo || 0),
      data: row.data,
    })));
  });
});

app.post("/api/comprar", authenticateToken, async (req, res) => {
  const { userId, empresaId, quantidade, valorTotal } = req.body;

  if (!userId || !empresaId || !quantidade || !valorTotal) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const userQuery = "SELECT saldo FROM usuarios WHERE id = ?";
    const userRow = await new Promise((resolve, reject) => {
      db.get(userQuery, [userId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!userRow || userRow.saldo < valorTotal) {
      return res.status(400).json({ error: "Saldo insuficiente para compra." });
    }

    const existingInvestQuery = "SELECT quantidade FROM investimentos WHERE userId = ? AND empresaId = ?";
    const existingInvest = await new Promise((resolve, reject) => {
      db.get(existingInvestQuery, [userId, empresaId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${empresaId}/prev`,
      { params: { apiKey: "hK8mqvQH_QG5XPTFF4SyvTBOe10DChdM" } }
    );
    const valorAtual = response.data.results?.[0]?.c || 0;

    if (valorAtual === 0) {
      return res
        .status(400)
        .json({ error: "Erro ao obter o valor atual do ativo." });
    }

    if (existingInvest) {
      const updateQuantityQuery = "UPDATE investimentos SET quantidade = quantidade + ?, valorAtual = ? WHERE userId = ? AND empresaId = ?";
      await new Promise((resolve, reject) => {
        db.run(updateQuantityQuery, [quantidade, valorAtual, userId, empresaId], (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } else {
      const insertInvestQuery = `
        INSERT INTO investimentos (userId, empresaId, quantidade, valor, valorAtual)
        VALUES (?, ?, ?, ?, ?)
      `;
      await new Promise((resolve, reject) => {
        db.run(
          insertInvestQuery,
          [userId, empresaId, quantidade, valorTotal, valorAtual],
          function (err) {
            if (err) reject(err);
            resolve(this.lastID);
          }
        );
      });
    }

    const updateSaldoQuery = "UPDATE usuarios SET saldo = saldo - ? WHERE id = ?";
    await new Promise((resolve, reject) => {
      db.run(updateSaldoQuery, [valorTotal, userId], (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    const insertTransacaoQuery = `
      INSERT INTO transacoes (userId, tipo, empresaId, quantidade, valorCompra, valor, data)
      VALUES (?, 'compra', ?, ?, ?, ?, datetime('now'))
    `;
    db.run(insertTransacaoQuery, [userId, empresaId, quantidade, valorAtual, valorTotal], (err) => {
      if (err) {
        console.error("Erro ao registrar transação de compra:", err.message);
      }
    });

    res
      .status(201)
      .json({ message: "Compra realizada com sucesso!", quantidade, valorAtual });
  } catch (error) {
    console.error("Erro ao processar compra:", error.message);
    res.status(500).json({ error: "Erro ao processar a compra." });
  }
});

app.post("/api/vender", authenticateToken, (req, res) => {
  const { userId, investimentoId, quantidade, valorVenda } = req.body;

  db.get("SELECT saldo FROM usuarios WHERE id = ?", [userId], (err, userRow) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar saldo do cliente." });
    }

    db.get(
      "SELECT quantidade, valor, empresaId FROM investimentos WHERE id = ? AND userId = ?",
      [investimentoId, userId],
      (err, investRow) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erro ao buscar investimento." });
        }

        if (investRow) {
          if (investRow.quantidade >= quantidade) {
            const novaQuantidade = investRow.quantidade - quantidade;
            const valorTotalVenda = quantidade * valorVenda;

            if (novaQuantidade > 0) {
              db.run("UPDATE investimentos SET quantidade = ? WHERE id = ?", [
                novaQuantidade,
                investimentoId,
              ]);
            } else {
              db.run("DELETE FROM investimentos WHERE id = ?", [investimentoId]);
            }

            const novoSaldo = userRow.saldo + valorTotalVenda;

            db.run("UPDATE usuarios SET saldo = ? WHERE id = ?", [novoSaldo, userId], function (err) {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Erro ao atualizar saldo." });
              }

              const insertTransacaoQuery = `
                INSERT INTO transacoes (userId, tipo, empresaId, quantidade, valorVenda, valor, data)
                VALUES (?, 'venda', ?, ?, ?, ?, datetime('now'))
              `;
              db.run(
                insertTransacaoQuery,
                [userId, investRow.empresaId, quantidade, valorVenda, valorTotalVenda],
                (err) => {
                  if (err) {
                    console.error("Erro ao registrar transação de venda:", err.message);
                  }
                }
              );

              res.json({
                message: "Venda realizada com sucesso!",
                quantidadeRestante: novaQuantidade,
                saldo: novoSaldo,
              });
            });
          } else {
            res.status(400).json({ error: "Quantidade insuficiente para venda." });
          }
        } else {
          res.status(404).json({ error: "Investimento não encontrado." });
        }
      }
    );
  });
});


app.get("/api/investimentos/:userId", authenticateToken, (req, res) => {
  const userId = req.params.userId;

  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Acesso não autorizado." });
  }

  const query = `
        SELECT id, empresaId, quantidade, valor, valorAtual
        FROM investimentos
        WHERE userId = ?
    `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar investimentos." });
    }

    res.json({ investimentos: rows });
  });
});

app.get("/api/historico/:userId", authenticateToken, (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Acesso não autorizado." });
  }

  const query = `
      SELECT tipo, valor, quantidade, empresaId, data
      FROM transacoes
      WHERE userId = ?
      ORDER BY data DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico de transações:", err.message);
      return res
        .status(500)
        .json({ error: "Erro ao buscar histórico de transações." });
    }
    res.json({ historico: rows });
  });
});

app.get("/api/historico_saldo/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT saldo, data
      FROM historico_saldo
      WHERE userId = ?
      ORDER BY datetime(data) ASC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico de saldos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar histórico de saldos." });
    }

    const sanitizedRows = rows.filter(
      (row) => row.saldo !== null && !isNaN(parseFloat(row.saldo)) && row.data
    );

    res.json(
      sanitizedRows.map((row) => ({
        saldo: parseFloat(row.saldo || 0),
        data: row.data,
      }))
    );
  });
});

app.get("/api/investimentos/count/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT COUNT(*) as total FROM investimentos WHERE userId = ?";

  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao contar investimentos." });
    }
    res.json({ total: row.total });
  });
});

app.get("/api/investimentos/transacoes/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT tipo, empresaId, valor, data
    FROM transacoes
    WHERE userId = ? AND (tipo = 'compra' OR tipo = 'venda')
    ORDER BY data DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar transações de investimentos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar transações." });
    }

    res.json({ transacoes: rows });
  });
});

app.post("/api/dividendo", async (req, res) => {
  const { userId, empresaId, valor, data } = req.body;

  if (!userId || !empresaId || !valor || !data) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const rentabilidade = valor * 0.04; 

  const insertDividendoQuery = `
      INSERT INTO dividendos (userId, empresaId, valor, data, ultimaAtualizacao)
      VALUES (?, ?, ?, ?, datetime('now'))
  `;

  db.run(insertDividendoQuery, [userId, empresaId, valor, data], function (err) {
      if (err) {
          console.error("Erro ao registrar dividendo:", err.message);
          return res.status(500).json({ error: "Erro ao registrar dividendo." });
      }

      const updateSaldoQuery = `
          UPDATE usuarios 
          SET saldo = saldo + ? 
          WHERE id = ?
      `;

      db.run(updateSaldoQuery, [rentabilidade, userId], (err) => {
          if (err) {
              console.error("Erro ao atualizar saldo:", err.message);
              return res.status(500).json({ error: "Erro ao atualizar saldo do cliente." });
          }

          res.status(201).json({
              message: "Dividendo registrado com sucesso!",
              id: this.lastID,
              rentabilidade: rentabilidade.toFixed(2),
          });
      });
  });
});

app.post("/api/dividendos/automatico", async (req, res) => {
  const { userId, empresaId } = req.body;

  try {
    const dividendos = await getDividendos(empresaId);

    dividendos.forEach((dividendo) => {
      const query = `
                INSERT INTO dividendos (userId, empresaId, valor, data)
                VALUES (?, ?, ?, ?)
            `;
      db.run(
        query,
        [userId, empresaId, dividendo.amount, dividendo.exDate],
        (err) => {
          if (err) {
            console.error("Erro ao registrar dividendo:", err.message);
          }
        }
      );
    });

    res
      .status(201)
      .json({ message: "Dividendos registrados automaticamente com sucesso!" });
  } catch (error) {
    console.error(
      "Erro ao registrar dividendos automaticamente:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erro ao registrar dividendos automaticamente." });
  }
});

app.get("/api/dividendos/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
        SELECT empresaId, valor, data 
        FROM dividendos
        WHERE userId = ?
        ORDER BY data DESC
    `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar dividendos." });
    }

    res.json({ dividendos: rows });
  });
});

app.get("/api/rentabilidade/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Acesso não autorizado." });
  }
  try {
      const dividendosQuery = `
          SELECT SUM(valor) as totalDividendos 
          FROM dividendos 
          WHERE userId = ?
      `;
      const dividendos = await new Promise((resolve, reject) => {
          db.get(dividendosQuery, [userId], (err, row) => {
              if (err) return reject(err);
              resolve(row?.totalDividendos || 0);
          });
      });

      const rentabilidadeDividendos = dividendos * 0.04;

      const valorizacaoAtivosQuery = `
          SELECT SUM(quantidade * valor) as totalInvestido 
          FROM investimentos 
          WHERE userId = ?
      `;
      const valorizacaoAtivos = await new Promise((resolve, reject) => {
          db.get(valorizacaoAtivosQuery, [userId], (err, row) => {
              if (err) return reject(err);
              resolve(-(row?.totalInvestido || 0));
          });
      });

      const lucrosPrejuizosQuery = `
          SELECT SUM((quantidade * valorVenda) - (quantidade * valorCompra)) as totalLucrosPrejuizos
          FROM transacoes
          WHERE userId = ? AND tipo = 'venda'
      `;
      const lucrosPrejuizos = await new Promise((resolve, reject) => {
          db.get(lucrosPrejuizosQuery, [userId], (err, row) => {
              if (err) return reject(err);
              resolve(row?.totalLucrosPrejuizos || 0);
          });
      });

      const total = dividendos + rentabilidadeDividendos + valorizacaoAtivos + lucrosPrejuizos;

      res.json({
          rentabilidadeMensal: {
              dividendos,
              valorizacaoAtivos,
              lucrosPrejuizos,
              rentabilidadeDividendos,
              total,
          },
      });
  } catch (error) {
      console.error("Erro ao calcular rentabilidade mensal:", error.message);
      res.status(500).json({ error: "Erro ao calcular rentabilidade mensal." });
  }
});

app.post("/api/atualizar-precos", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  try {
    const query = "SELECT id, empresaId FROM investimentos WHERE userId = ?";
    const ativos = await new Promise((resolve, reject) => {
      db.all(query, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    for (const ativo of ativos) {
      const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${ativo.empresaId}/prev`,
        { params: { apiKey: "hK8mqvQH_QG5XPTFF4SyvTBOe10DChdM" } }
      );

      const precoAtual = response.data.results?.[0]?.c || 0;

      const updateQuery =
        "UPDATE investimentos SET valorAtual = ? WHERE id = ?";
      db.run(updateQuery, [precoAtual, ativo.id], (err) => {
        if (err) {
          console.error(
            `Erro ao atualizar preço do ativo ${ativo.empresaId}:`,
            err.message
          );
        }
      });
    }

    res.status(200).json({ message: "Preços atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar preços:", error.message);
    res.status(500).json({ error: "Erro ao atualizar preços dos ativos." });
  }
});

app.get("/api/verificar-saldo/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT saldo FROM usuarios WHERE id = ?";
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error("Erro ao verificar saldo do cliente:", err.message);
      return res.status(500).json({ error: "Erro ao verificar saldo do cliente." });
    }

    if (!row) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ saldo: row.saldo });
  });
});


cron.schedule("*/1 * * * *", async () => {
  try {
      const queryDividendos = `
          SELECT d.id, d.userId, d.valor, d.ultimaAtualizacao 
          FROM dividendos d
          WHERE d.ultimaAtualizacao IS NULL OR d.ultimaAtualizacao < datetime('now', '-5 minutes')
      `;
      const dividendos = await new Promise((resolve, reject) => {
          db.all(queryDividendos, [], (err, rows) => {
              if (err) {
                  console.error("Erro ao buscar dividendos para atualizar:", err.message);
                  return reject(err);
              }
              resolve(rows);
          });
      });

      console.log(`Dividendos para processar: ${dividendos.length}`);

      const rentabilidades = {};

      for (const dividendo of dividendos) {
          try {
              const rentabilidade = dividendo.valor * 0.04;

              rentabilidades[dividendo.userId] =
                  (rentabilidades[dividendo.userId] || 0) + rentabilidade;

              const updateDividendoQuery = `
                  UPDATE dividendos 
                  SET ultimaAtualizacao = datetime('now') 
                  WHERE id = ?
              `;
              await new Promise((resolve, reject) => {
                  db.run(updateDividendoQuery, [dividendo.id], (err) => {
                      if (err) {
                          console.error(`Erro ao atualizar última atualização do dividendo ${dividendo.id}:`, err.message);
                          return reject(err);
                      }
                      resolve();
                  });
              });

              console.log(
                  `Rentabilidade de R$ ${rentabilidade.toFixed(2)} processada para o dividendo ID ${dividendo.id}`
              );
          } catch (error) {
              console.error(`Erro ao processar dividendo ID ${dividendo.id}:`, error.message);
          }
      }

      for (const userId in rentabilidades) {
          try {
              const totalRentabilidade = rentabilidades[userId];
              const updateSaldoQuery = `
                  UPDATE usuarios 
                  SET saldo = saldo + ? 
                  WHERE id = ?
              `;
              await new Promise((resolve, reject) => {
                  db.run(updateSaldoQuery, [totalRentabilidade, userId], (err) => {
                      if (err) {
                          console.error(`Erro ao atualizar saldo para o usuário ${userId}:`, err.message);
                          return reject(err);
                      }
                      resolve();
                  });
              });

              console.log(
                  `Saldo atualizado para o usuário ID ${userId} com rentabilidade total de R$ ${totalRentabilidade.toFixed(2)}`
              );
          } catch (error) {
              console.error(`Erro ao atualizar saldo para o usuário ID ${userId}:`, error.message);
          }
      }

      console.log("Processamento de rentabilidade concluído.");

      const queryUsuarios = "SELECT id, saldo FROM usuarios";
      const usuarios = await new Promise((resolve, reject) => {
          db.all(queryUsuarios, [], (err, rows) => {
              if (err) {
                  console.error("Erro ao buscar usuários para registro de saldo:", err.message);
                  return reject(err);
              }
              resolve(rows);
          });
      });

      console.log(`Usuários para registrar saldo: ${usuarios.length}`);

      for (const usuario of usuarios) {
          try {
              const insertHistoricoSaldoQuery = `
                  INSERT INTO historico_saldo (userId, saldo, data)
                  VALUES (?, ?, datetime('now'))
              `;
              await new Promise((resolve, reject) => {
                  db.run(insertHistoricoSaldoQuery, [usuario.id, usuario.saldo], (err) => {
                      if (err) {
                          console.error(`Erro ao registrar saldo para o usuário ${usuario.id}:`, err.message);
                          return reject(err);
                      }
                      resolve();
                  });
              });

              console.log(`Saldo registrado no histórico para o usuário ID ${usuario.id}: R$ ${usuario.saldo.toFixed(2)}`);
          } catch (error) {
              console.error(`Erro ao registrar saldo para o usuário ID ${usuario.id}:`, error.message);
          }
      }

      console.log("Registro de saldos no histórico concluído.");
  } catch (error) {
      console.error(
          "Erro ao executar tarefa de processamento de rentabilidade e registro de saldo:",
          error.message
      );
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
