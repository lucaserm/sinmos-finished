const client = require("../../server");
const Usuario = require('../models/UsuariosModel');

function OcorrenciaEstudante(body) {
  this.body = body;
}

OcorrenciaEstudante.save = async (body) => {
  try {
    const user = await Usuario.buscaPorCodigo(body.user);
    await client.query(
      "INSERT INTO ocorrenciasestudantes VALUES($1, $2, $3, CURRENT_TIMESTAMP, $4)",
      [user[0].id, body.id_estudantes, body.id_ocorrencia, body.nome_usuario_relacionado]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
}

OcorrenciaEstudante.buscarPorRa = async (body) => {
  try {
    const ocorrencias = await client.query(
      `
      SELECT nome_usuario, nome_usuario_relacionado, descricao_ocorrencia, data_ocorrencia
      FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
      WHERE id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_usuarios = usuarios.id
      AND ra = $1
      ORDER BY ocorrenciasestudantes.id
      `,
      [body.ra]
    );
    return ocorrencias.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};



module.exports = OcorrenciaEstudante;