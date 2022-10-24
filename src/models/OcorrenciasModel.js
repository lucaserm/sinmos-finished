const client = require('../../server');

class Ocorrencia{
  constructor(body){
    this.body = body;
  }
}

Ocorrencia.save = async(body) => {
  try{
    await client.query('INSERT INTO ocorrencias VALUES ($1)', [body.descricao_ocorrencia]);
    console.log('Ocorrência Salva');
  }catch(e){
    console.log(e);
  }
}

Ocorrencia.buscarOcorrencias = async() =>{
  try {
    const ocorrencias = await client.query('SELECT * FROM ocorrencias');
    return ocorrencias.rows;
  } catch (e) {
    console.log(e)
  }
}

module.exports = Ocorrencia;