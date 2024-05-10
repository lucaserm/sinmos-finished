const client = require('../../index');
const Usuario = require('../models/UsuariosModel');

class OcorrenciaEstudante {
  static async save() {
    try {
      const {
        codigo_servidor,
        id_ocorrencias,
        id_estudantes,
        nome_usuario_relacionado,
        status,
      } = body;
      const user = await Usuario.findByCodigo(codigo_servidor)[0];
      await client.query(
        'INSERT INTO ocorrenciasestudantes VALUES($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)',
        [
          user.id,
          id_ocorrencias,
          id_estudantes,
          nome_usuario_relacionado,
          status,
        ],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const ocorrencias = await client.query(
        `
      SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ra, ocorrenciasestudantes.id
      FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
      WHERE id_estudantes = estudantes.id
      AND id_ocorrencias = ocorrencias.id
      AND id_usuarios = usuarios.id
      ORDER BY ocorrenciasestudantes.id
      `,
      );
      return ocorrencias.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByID(id) {
    try {
      const ocorrencias = await client.query(
        `
        SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ra
        FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
        WHERE id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_usuarios = usuarios.id
        AND ocorrenciasestudantes.id = ${id}
        `,
      );
      return ocorrencias.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByRA(ra) {
    try {
      const ocorrencias = await client.query(
        `
        SELECT nome_usuario, nome_usuario_relacionado, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ocorrenciasestudantes.id
        FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
        WHERE id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_usuarios = usuarios.id
        AND ra = '${ra}'
        ORDER BY ocorrenciasestudantes.id
        `,
      );
      return ocorrencias.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByCodigoServidor(codigo) {
    try {
      const ocorrencias = await client.query(
        `
        SELECT ocorrenciasestudantes.id codigo_servidor, nome_usuario_relacionado, ra, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ocorrenciasestudantes.id
        FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
        WHERE id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_usuarios = usuarios.id
        AND id_usuarios = ${codigo}
        ORDER BY ocorrenciasestudantes.id
        `,
      );
      return ocorrencias.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async findByRelatedServidor(nome) {
    try {
      const ocorrencias = await client.query(
        `
        SELECT ocorrenciasestudantes.id codigo_servidor, nome_usuario, ra, nome_estudante, descricao_ocorrencia, data_ocorrencia, ocorrenciasestudantes.status, ocorrenciasestudantes.id
        FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios
        WHERE id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_usuarios = usuarios.id
        AND nome_usuario_relacionado = ${nome}
        ORDER BY ocorrenciasestudantes.id
        `,
      );
      return ocorrencias.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async updateApproved(body) {
    try {
      const { id } = body;
      await client.query(
        `UPDATE ocorrenciasestudantes SET status = 'Aprovado' WHERE id = ${id}`,
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async updateRepproved(body) {
    try {
      const { id } = body;
      await client.query(
        `UPDATE ocorrenciasestudantes SET status = 'Reprovado' WHERE id = ${id}`,
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = OcorrenciaEstudante;
