const client = require('../../index');

class Ocorrencia {
  static async save(body) {
    try {
      const { descricao_ocorrencia } = body;
      await client.query('INSERT INTO ocorrencias VALUES ($1)', [
        descricao_ocorrencia,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  static async findAll() {
    try {
      const ocorrencias = await client.query('SELECT * FROM ocorrencias');
      return ocorrencias.rows;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Ocorrencia;
