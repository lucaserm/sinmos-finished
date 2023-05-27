const client = require("../../index");

class Disciplina {
  constructor(body) {
    this.body = body;
  }
}

Disciplina.buscarDisciplinas = async () => {
  const disciplinas = await client.query(
    `
    SELECT disciplinas.*
    FROM disciplinas 
    ORDER BY id`
  );

  return disciplinas.rows;
};

Disciplina.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO disciplinas(id_cursos, nome_disciplina, turma, semestre) VALUES($1, $2, $3, $4);",
      [body.select, body.nome_disciplina, body.turma, body.semestre]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Disciplina;
