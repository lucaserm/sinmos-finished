const client = require("../../index");

class Usuarios {
  constructor(body) {
    this.body = body;
  }
}

Usuarios.buscaUsuarios = async () => {
  try {
    const user = await client.query(`SELECT * FROM usuarios ORDER BY id`);
    return user.rows;
  } catch (e) {
    console.log(e);
  }
};

Usuarios.buscaPorCodigo = async (codigo) => {
  try {
    const user = await client.query(
      "SELECT * FROM usuarios WHERE codigo_servidor = $1",
      [codigo]
    );
    return user.rows;
  } catch (e) {
    console.log(e);
  }
};

Usuarios.save = async (body) => {
  try {
    await client.query(`INSERT INTO usuarios VALUES($1, $2, $3, $4)`, [
      body.nome_usuario,
      body.senha,
      body.codigo_servido,
      body.cargo,
    ]);
  } catch (e) {
    console.log(e);
  }
};

module.exports = Usuarios;
