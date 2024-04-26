const client = require('../../index');

class DisciplinaEstudante {
  static async save(body) {
    try {
      const { id_estudantes, id_disciplinas } = body;
      await client.query(
        'INSERT INTO disciplinasestudantes(id_estudantes, id_disciplinas) VALUES($1, $2)',
        [id_estudantes, id_disciplinas],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = DisciplinaEstudante;
