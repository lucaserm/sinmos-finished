const client = require("../../server")

function Estudante(body){
  this.body = body;
}

Estudante.save = async (body) => {
  try{
    await client.query('INSERT INTO estudantes(nome_estudante, cpf, ra, foto, id_responsaveis, id_cursos) VALUES($1,$2,$3,link.com,$4,$5)', [body.nome_estudante, body.cpf, body.ra, body.id_responsaveis, body.id_cursos]);
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}

Estudante.update = async(body) => {
  try{
    await client.query('UPDATE estudantes SET nome_estudante = $1, cpf = $2, ra = $3 WHERE ra = $4', [body.nome_estudante, body.cpf, body.ra, body.ra2]);
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}

Estudante.buscaPorRA = async(body) => {
  try{
    const estudante = await client.query(`SELECT * FROM estudantes WHERE ra = $1`, [body.ra]);
    return estudante.rows;
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}

Estudante.buscaEstudantes = async () => {
  try{
    const estudantes = await client.query(`SELECT * FROM estudantes ORDER BY id`);
    return estudantes.rows;
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}

Estudante.buscaHorariosPorRA = async (body) => {
  try{
    const estudantes = await client.query(`
    SELECT ra, nome_estudante, nome_disciplina, horarios.periodo, dia_semana, tempo_inicio, tempo_fim
    FROM estudantes, horarios, disciplinas, horariosestudantes
    WHERE ra = $1 
    AND id_estudantes = estudantes.id
    AND id_horarios = horarios.id
    AND id_disciplinas = disciplinas.id
    `, [body.ra]);
    return estudantes.rows;
  }catch(e){
    console.log(`Houve um erro ${e}`)
  }
}

module.exports = Estudante;