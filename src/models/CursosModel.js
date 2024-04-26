const client = require('../../index');

class Curso {
  static async save(body) {
    try {
      const { nome_curso, periodo } = body;
      await client.query(
        'INSERT INTO cursos(nome_curso, periodo_cursos) VALUES($1, $2);',
        [nome_curso, periodo],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const cursos = await client.query(
        'SELECT * FROM Cursos ORDER BY nome_curso',
      );
      return cursos.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = Curso;
