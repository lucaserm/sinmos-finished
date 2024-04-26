const client = require('../../index');

class Horario {
  static async save(body) {
    const {
      id_disciplinas,
      periodo,
      dia_semana,
      tempo_inicio,
      tempo_fim
    } = body;
    try {
      await client.query(
        'INSERT INTO horarios(id_disciplinas, periodo_horarios, dia_semana, tempo_inicio, tempo_fim) VALUES($1, $2, $3, $4, $5)',
        [
          id_disciplinas,
          periodo,
          dia_semana,
          tempo_inicio,
          tempo_fim,
        ],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const horarios = await client.query(`
      SELECT * FROM horarios ORDER BY id
      `);
      return horarios.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByDisciplinas() {
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
  }
}

module.exports = Horario;
