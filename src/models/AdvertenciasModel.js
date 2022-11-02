const client = require("../../server");

class Advertencia{
  constructor(body){
    this.body = body;
  }
}

Advertencia.save = async (body) => {
  try {
    let tempo = await client.query("SELECT CURRENT_TIMESTAMP"); 
    tempo = tempo.rows;
    await client.query(
      "INSERT INTO advertencias(descricao, data_advertencia, id_estudantes) VALUES ($1, $2, $3)",
      [body.relatorio_advertencia, tempo[0].current_timestamp, body.id]
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

Advertencia.buscaPorOcorrencia = async (body) => {
  try {
    await client.query(
      `
        SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, relatorio_advertencia, data_resolucao
        FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios, advertencias
        WHERE id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_usuarios = usuarios.id 
        WHERE id_ocorrenciasestudantes = $1
      `, [body.id]);
  } catch (e) {
    console.log(e);
  }
}

Advertencia.deletePorRA = async (body) => {
  try {
    await client.query("DELETE FROM advertencias WHERE id = $1", [body.id]);
    console.log("Advertência deletada");
  } catch (e) {
    console.log(e);
  }
};

module.exports = Advertencia;
