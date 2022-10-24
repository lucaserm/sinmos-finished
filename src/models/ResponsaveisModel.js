const client = require("../../server");

class Responsavel{
  constructor(body) {
    this.body = body;
  }
}

Responsavel.save = async (body) => {
  try {
    await client.query(
      "INSERT INTO responsaveis(nome_responsavel, email_responsavel, telefone_responsavel) VALUES($1, $2, $3)",
      [body.nome_responsavel, body.email_responsavel, body.telefone_responsavel]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};
Responsavel.buscaResponsaveis = async () => {
  try {
    const responsaveis = await client.query(
      "SELECT * FROM responsaveis ORDER BY id"
    );
    return responsaveis.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};
Responsavel.buscaResponsavelPorRA = async (body) => {
  try {
    const responsavel = await client.query(
      "SELECT responsaveis.* FROM estudantes, responsaveis WHERE estudantes.ra = $1 AND id_responsaveis = responsaveis.id ORDER BY id",
      [body.ra]
    );
    let responsavelRA = [responsavel.rows, body.ra];
    return responsavelRA;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Responsavel;
