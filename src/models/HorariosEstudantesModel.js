const client = require('../../server');

function HorarioEstudante(body){
  this.body = body;
}

HorarioEstudante.save = async(body) => {
  try{
    await client.query('INSERT INTO horariosestudantes(id_estudantes, id_horarios) VALUES($1, $2)', [body.id_estudantes, body.id_horarios])
  }catch(e){
    console.log(`Houve um erro ${e}`)
  }
} 

module.exports = HorarioEstudante;