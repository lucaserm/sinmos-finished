const client = require("../../index");

class Matricula {
  constructor(body) {
    this.body = body;
  }
}

Matricula.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO Matriculas(ano_matricula, id_estudantes, id_cursos) VALUES ($1, $2, $3)",
      [body.ano_matricula, body.id_estudantes, body.id_cursos]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Matricula;
