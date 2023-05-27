const client = require("../../index");

class Horario {
  constructor(body) {
    this.body = body;
  }
}

Horario.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO horarios(id_disciplinas, periodo_horarios, dia_semana, tempo_inicio, tempo_fim) VALUES($1, $2, $3, $4, $5)",
      [
        body.id_disciplinas,
        body.periodo,
        body.dia_semana,
        body.tempo_inicio,
        body.tempo_fim,
      ]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Horario.buscaHorariosDiscipinas = async () => {
  try {
    const horarios = await client.query(`
    SELECT horarios.id, nome_disciplina, turma, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
    FROM horarios, disciplinas
    WHERE id_disciplinas = disciplinas.id
    ORDER BY id
    `);
    return horarios.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Horario.buscaHorarios = async () => {
  try {
    const horarios = await client.query(`
    SELECT * FROM horarios ORDER BY id
    `);
    return horarios.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Horario;
