const client = require('../../index');

class Matricula {
  static async save(body) {
    try {
      const { ano_matricula, id_estudantes, id_cursos } = body;
      await client.query(
        'INSERT INTO Matriculas(ano_matricula, id_estudantes, id_cursos) VALUES ($1, $2, $3)',
        [ano_matricula, id_estudantes, id_cursos],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = Matricula;
