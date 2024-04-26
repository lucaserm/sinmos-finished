const client = require('../../index');

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

  static async findByCodigo() {
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

  static async save() {
    const { nome_usuario, senha, codigo_servidor, cargo } = body;
    try {
      await client.query(`INSERT INTO usuarios VALUES($1, $2, $3, $4)`, [
        nome_usuario,
        senha,
        codigo_servidor,
        cargo,
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Usuarios;
