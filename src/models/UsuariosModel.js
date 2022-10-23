const client = require('../../server')

function Usuarios(body){
  this.body = body;
}

Usuarios.buscaUsuarios = async() => {
  try{
    const user = await client.query(`SELECT * FROM Usuarios ORDER BY id`)
    return user.rows;
  }catch(e){
    console.log(e);
  }
}

module.exports = Usuarios;