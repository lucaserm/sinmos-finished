const client = require('../../index');

class Disciplina {
  static async save(body) {
    try {
      const {select, nome_disciplina, turma, semestre } = body;
      await client.query(
        'INSERT INTO disciplinas(id_cursos, nome_disciplina, turma, semestre) VALUES($1, $2, $3, $4);',
        [select, nome_disciplina, turma, semestre],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const disciplinas = await client.query(
        `
        SELECT disciplinas.*
        FROM disciplinas 
        ORDER BY id`,
      );
      return disciplinas.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = Disciplina;
