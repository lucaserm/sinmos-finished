const client = require("../../index");

class RegistroEstudante {
  constructor(body) {
    this.body = body;
  }
}

RegistroEstudante.save = async (body, registro) => {
  try {
    await client.query(
      "INSERT INTO RegistrosEstudantes(id_estudantes, id_registros) VALUES($1, $2)",
      [body.id_estudantes, registro[0].id]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

RegistroEstudante.buscar = async (body) => {
  try {
    const registros = await client.query(
      `SELECT registrosestudantes.id, nome_estudante, ra, foto, descricao, dia_liberacao, dia_hora_saida 
      FROM RegistrosEstudantes, estudantes, registros 
      WHERE id_estudantes = estudantes.id 
      AND id_registros = registros.id
      AND ra = $1
      `,
      [body.ra]
    );
    const hoje = new Date();
    let data = hoje.toISOString().substring(0, 10);
    let reg = [registros.rows, data];
    return reg;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = RegistroEstudante;
