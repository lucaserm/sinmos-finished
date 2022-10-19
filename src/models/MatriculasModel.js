const client = require("../../server");

function Matricula(body) {
  this.body = body;
}

Matricula.save = async (body) => {
  await client.query(
    "INSERT INTO Matricula(ano_matricula, id_estudantes, id_cursos) VALUES ($1, $2, $3)",
    [body.ano_matricula, body.id_estudantes, body.id_cursos]
  );
};

module.exports = Matricula;
