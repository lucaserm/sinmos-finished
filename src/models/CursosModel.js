const client = require("../../index");

class Curso {
  constructor(body) {
    this.body = body;
  }
}

Curso.buscarCursos = async () => {
  try {
    const cursos = await client.query(
      "SELECT * FROM Cursos ORDER BY nome_curso"
    );
    return cursos.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Curso.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO cursos(nome_curso, periodo_cursos) VALUES($1, $2);",
      [body.nome_curso, body.periodo]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Curso;
