const client = require('../../index');

class RegistroEstudante {
  static async save(body, registro) {
    try {
      const { id_estudantes } = body;
      const id = registro[0].id;
      await client.query(
        'INSERT INTO RegistrosEstudantes(id_estudantes, id_registros) VALUES($1, $2)',
        [id_estudantes, id],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByRA(ra) {
    try {
      const registros = await client.query(
        `SELECT registrosestudantes.id, nome_estudante, ra, foto, descricao, dia_liberacao, dia_hora_saida 
        FROM RegistrosEstudantes, estudantes, registros 
        WHERE id_estudantes = estudantes.id 
        AND id_registros = registros.id
        AND ra = '${ra}'
        `,
      );
      const hoje = new Date();
      let data = hoje.toISOString().substring(0, 10);
      let reg = [registros.rows, data];
      return reg;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = RegistroEstudante;
