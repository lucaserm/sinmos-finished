const client = require("../../server");

class RegistroEstudante{
  constructor(body) {
    this.body = body;
  }
}

RegistroEstudante.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO RegistroEstudantes(id_estudantes, id_registros) VALUES($1, $2)",
      [body.id_estudantes, body.id_registros]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = RegistroEstudante;