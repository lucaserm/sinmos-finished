const client = require('../../index');

class Advertencia {
  static async save(body) {
    try {
      const { id, relatorio_advertencia } = body;
      await client.query(
        `INSERT INTO advertencias(relatorio_advertencia, data_resolucao, id_ocorrenciasestudantes) 
          VALUES ($1, CURRENT_TIMESTAMP, $2)`,
        [relatorio_advertencia, id],
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async findByRA(body) {
    try {
      const { ra } = body;
      const advertencias = await client.query(
        `
        SELECT advertencias.* 
        FROM advertencias, ocorrenciasestudantes, estudantes
        WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id 
        AND ocorrenciasestudantes.status = 'Aprovado'
        AND id_estudantes = estudantes.id
        and ra = ${ra}
        ORDER BY id`,
      );
      return advertencias.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async findByID(body) {
    try {
      const { id } = body;
      const advertencias = await client.query(
        `
        SELECT nome_estudante, nome_usuario, descricao_ocorrencia, relatorio_advertencia, data_resolucao, data_ocorrencia, nome_usuario_relacionado 
        FROM advertencias, ocorrenciasestudantes, usuarios, estudantes, ocorrencias
        WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id 
        AND id_usuarios = usuarios.id 
        AND id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND id_ocorrenciasestudantes = ${id}`,
      );
      return advertencias.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async findApproved(ra) {
    try {
      const advertencias = await client.query(
        `
        SELECT id_ocorrenciasestudantes, descricao_ocorrencia, data_resolucao , relatorio_advertencia
        FROM advertencias, ocorrenciasestudantes, estudantes, ocorrencias
        WHERE id_ocorrenciasestudantes = ocorrenciasestudantes.id
        AND id_estudantes = estudantes.id
        AND id_ocorrencias = ocorrencias.id
        AND ra = ${ra}`,
      );

      return advertencias.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async findByOcorrencia(body) {
    try {
      const { id } = body;
      await client.query(
        `
          SELECT nome_usuario, nome_usuario_relacionado, nome_estudante, descricao_ocorrencia, data_ocorrencia, relatorio_advertencia, data_resolucao
          FROM ocorrenciasestudantes, ocorrencias, estudantes, usuarios, advertencias
          WHERE id_estudantes = estudantes.id
          AND id_ocorrencias = ocorrencias.id
          AND id_usuarios = usuarios.id 
          WHERE id_ocorrenciasestudantes = ${id}
        `,
      );
    } catch (e) {
      console.log(e);
    }
  }
}


module.exports = Advertencia;
