const client = require("../../server");
const Usuario = require('../models/UsuariosModel');

class OcorrenciaEstudante{
  constructor(body) {
    this.body = body;
  }
}

OcorrenciaEstudante.save = async (body) => {
  try {
    const user = await Usuario.buscaPorCodigo(body.codigo_servidor);
    let tempo = await client.query("SELECT CURRENT_TIMESTAMP");
    tempo = tempo.rows;
    await client.query(
      "INSERT INTO ocorrenciasestudantes VALUES($1, $2, $3, $4, $5, $6)",
      [user[0].id, body.id_ocorrencias, body.id_estudantes, tempo[0].current_timestamp, body.nome_usuario_relacionado, body.status]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
}

OcorrenciaEstudante.updateAprovado = async (body) => {
  try {
    await client.query(
      `UPDATE ocorrenciasestudantes SET status = 'Finalizado' WHERE id = ${body.id}`
    );
    console.log('Status Aprovado')
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
}

OcorrenciaEstudante.updateReprovado = async (body) => {
  try {
    await client.query(
      `UPDATE ocorrenciasestudantes SET status = 'Reprovado' WHERE id = ${body.id}`
    );
    console.log('Status Reprovado')
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
}

OcorrenciaEstudante.buscar = async () => {
  try {
    const ocorrencias = await client.query(
      `
      SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ra, ocorrenciasestudantes.id
      FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
      WHERE id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_usuarios = usuarios.id
      ORDER BY ocorrenciasestudantes.id
      `
    );
    return ocorrencias.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

OcorrenciaEstudante.buscarPorID = async (id) => {
  try {
    const ocorrencias = await client.query(
      `
      SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ra
      FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
      WHERE id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_usuarios = usuarios.id
      AND ocorrenciasestudantes.id = $1
      `, [id]
    );
    return ocorrencias.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

OcorrenciaEstudante.buscarPorRa = async (body) => {
  try {
    const ocorrencias = await client.query(
      `
      SELECT nome_usuario, nome_usuario_relacionado, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ocorrenciasestudantes.id
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

OcorrenciaEstudante.buscaPorServidor = async(codigo) => {
  try {
    const ocorrencias = await client.query(
      `
      SELECT codigo_servidor, nome_usuario_relacionado, ra, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ocorrenciasestudantes.id
      FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
      WHERE id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_usuarios = usuarios.id
      AND codigo_servidor = $1 or nome_usuario_relacionado = nome_usuario
      ORDER BY ocorrenciasestudantes.id
      `,
      [codigo]
    );
    return ocorrencias.rows;
  } catch (e) {
    console.log(e);
  }
}


module.exports = OcorrenciaEstudante;