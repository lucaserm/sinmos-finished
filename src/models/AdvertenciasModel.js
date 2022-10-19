const client = require("../../server");

function Advertencia(body) {
  this.body = body;
}

Advertencia.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO advertencias(descricao, data_advertencia, id_estudantes) VALUES ($1, CURRENT_TIMESTAMP, $2)",
      [body.descricao, body.id_estudantes]
    );
    console.log("Advertência Salva");
  } catch (e) {
    console.log(e);
  }
};

Advertencia.buscaAdvertenciaPorRA = async (body) => {
  try {
    const advertencias = await client.query(
      "SELECT advertencias.* FROM advertencias, estudantes WHERE ra = $1 AND id_estudantes = estudantes.id ORDER BY id",
      [body.ra]
    );
    return advertencias.rows;
  } catch (e) {
    console.log(e);
  }
};

Advertencia.deletePorRA = async (body) => {
  try {
    await client.query("DELETE FROM advertencias WHERE id = $1", [body.id]);
    console.log("Advertência deletada");
  } catch (e) {
    console.log(e);
  }
};

module.exports = Advertencia;
