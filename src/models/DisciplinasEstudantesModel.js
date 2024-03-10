const client = require('../../index');

class DisciplinaEstudante {
  constructor(body) {
    this.body = body;
  }
}

DisciplinaEstudante.save = async (body) => {
  try {
    await client.query(
      'INSERT INTO disciplinasestudantes(id_estudantes, id_disciplinas) VALUES($1, $2)',
      [body.id_estudantes, body.id_disciplinas],
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = DisciplinaEstudante;
