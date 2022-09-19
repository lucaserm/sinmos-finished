const client = require("../../server");

function Responsavel(body) {
  this.body = body;
}

Responsavel.save = async(body) =>{
  try{
    await client.query('INSERT INTO responsaveis(nome_responsavel, email_responsavel) VALUES($1, $2)', [body.nome_responsavel, body.email_responsavel]);
  }catch (e){
    console.log(`Houve um erro ${e}`);
  }
}

Responsavel.buscaResponsaveis = async () => {
  try {
    const responsaveis = await client.query('SELECT * FROM responsaveis');
    return responsaveis.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Responsavel.buscaResponsavelPorID = async (body) => {
  try {
    const ra = [body.ra];
    const responsavel = await client.query(
      "SELECT responsaveis.id, nome_responsavel, email_responsavel FROM estudantes, responsaveis WHERE estudantes.ra = $1 AND id_responsaveis = responsaveis.id",
      ra
    );
    return responsavel.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Responsavel;
