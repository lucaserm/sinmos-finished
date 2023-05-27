const client = require("../../index");

class Advertencia {
  constructor(body) {
    this.body = body;
  }
}

Advertencia.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO advertencias(relatorio_advertencia, data_resolucao, id_ocorrenciasestudantes) VALUES ($1, CURRENT_TIMESTAMP, $2)",
      [body.relatorio_advertencia, body.id]
    );
  } catch (e) {
    console.log(e);
  }
};

Advertencia.buscaAdvertenciaPorRA = async (body) => {
  try {
    const advertencias = await client.query(
      `
      SELECT advertencias.* 
      FROM advertencias, ocorrenciasestudantes, estudantes
      WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id 
      AND ocorrenciasestudantes.status = 'Aprovado'
      AND id_estudantes = estudantes.id
      and ra = $1
      ORDER BY id`,
      [body.ra]
    );
    return advertencias.rows;
  } catch (e) {
    console.log(e);
  }
};

Advertencia.buscaAdvertenciaPorID = async (id) => {
  try {
    const advertencias = await client.query(
      `
      SELECT nome_estudante, nome_usuario, descricao_ocorrencia, relatorio_advertencia, data_resolucao, data_ocorrencia, nome_usuario_relacionado 
      FROM advertencias, ocorrenciasestudantes, usuarios, estudantes, ocorrencias
      WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id 
      AND id_usuarios = usuarios.id 
      AND id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_ocorrenciasestudantes = ${id}`
    );
    return advertencias.rows;
  } catch (e) {
    console.log(e);
  }
};

Advertencia.buscaAdvertenciaAprovadas = async (body) => {
  try {
    const advertencias = await client.query(
      `
      SELECT id_ocorrenciasestudantes, descricao_ocorrencia, data_resolucao , relatorio_advertencia
      FROM advertencias, ocorrenciasestudantes, estudantes, ocorrencias
      WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id
      AND id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND ra = $1`,
      [body.ra]
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
      `,
      [body.id]
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = Advertencia;
