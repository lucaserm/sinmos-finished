const client = require('../../index');

class Responsavel {
  constructor(body) {
    this.body = body;
  }

  static async save(body) {
    try {
      const { nome_responsavel, email_responsavel, telefone_responsavel } =
        body;
      await client.query(
        'INSERT INTO responsaveis(nome_responsavel, email_responsavel, telefone_responsavel) VALUES($1, $2, $3)',
        [nome_responsavel, email_responsavel, telefone_responsavel],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const responsaveis = await client.query(
        'SELECT * FROM responsaveis ORDER BY id',
      );
      return responsaveis.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByEstudanteRA(ra) {
    try {
      const responsavel = await client.query(
        `SELECT responsaveis.* FROM estudantes, responsaveis WHERE estudantes.ra = '${ra}' AND id_responsaveis = responsaveis.id ORDER BY id`,
      );
      let responsavelRA = [responsavel.rows, ra];
      return responsavelRA;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = Responsavel;
