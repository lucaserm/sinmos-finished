const client = require("../../server");

class Advertencia{
  constructor(body){
    this.body = body;
  }
}

Advertencia.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO advertencias(descricao, data_advertencia, id_estudantes) VALUES ($1, CURRENT_TIMESTAMP, $2)",
      [body.descricao_advertencia, body.id]
    );
    console.log("Advertência Salva");
  } catch (e) {
    console.log(e);
  }
};

Advertencia.buscaAdvertenciaPorRA = async (body) => {
  try {
    const advertencias = await client.query(
      "SELECT advertencias.* FROM advertencias, ocorrenciasestudantes WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id AND ocorrenciasestudantes.status = 'Finalizado' ORDER BY id"
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
