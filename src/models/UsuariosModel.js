const client = require('../../index');
const bcrypt = require('bcrypt');

class Usuarios {
  constructor(body) {
    this.body = body;
  }

  static async findAll() {
    try {
      const user = await client.query(`SELECT * FROM usuarios ORDER BY id`);
      return user.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async findByCodigo(codigo) {
    try {
      const user = await client.query(
        'SELECT * FROM usuarios WHERE codigo_servidor = $1',
        [codigo],
      );
      return user.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async save(body) {
    const { nome_usuario, senha_usuario, codigo_usuario, cargo } = body;

    try {
      const saltRounds = 2;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(senha_usuario, salt);
      await client.query(`INSERT INTO usuarios VALUES($1, $2, $3, $4)`, [
        nome_usuario,
        hash,
        codigo_usuario,
        cargo,
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Usuarios;
