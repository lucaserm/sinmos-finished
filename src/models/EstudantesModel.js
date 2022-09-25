const client = require("../../server")

function Estudante(body){
  this.body = body;
}

Estudante.save = async (body) => {
  try{
    let foto = 'link.com'; 
    await client.query('INSERT INTO estudantes(nome_estudante, cpf, ra, foto, id_responsaveis, id_cursos) VALUES($1,$2,$3,$4,$5,$6)', [body.nome_estudante, body.cpf, body.ra, foto,body.id_responsaveis, body.id_cursos]);
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}

Estudante.salvarSaida = async (body) => {
  try{
    let horario = await client.query('SELECT CURRENT_TIMESTAMP');
    if(body.liberacao == 'on'){
      await client.query('UPDATE estudantes SET saida_anormal = $1', [horario]);
    }
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
    return estudantes.rows;
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
    SELECT ra, cpf, nome_estudante, nome_disciplina, horarios.periodo, dia_semana, tempo_inicio, tempo_fim
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

Estudante.liberacaoPorRA = async (body) => {
  try{
    const estudantes = await client.query(`
    SELECT ra, cpf, nome_estudante, nome_disciplina, horarios.periodo, dia_semana, tempo_inicio, tempo_fim
    FROM estudantes, horarios, disciplinas, horariosestudantes
    WHERE ra = $1 
    AND id_estudantes = estudantes.id
    AND id_horarios = horarios.id
    AND id_disciplinas = disciplinas.id
    `, [body.ra]);
    
    const hoje = new Date();
    let status = [estudantes.rows, { aula: 'Estudante sem aula!' }];
    let listaMatutino = [
    { hora: 07, minuto: 00 }, 
    { hora: 07, minuto: 45 }, 
    { hora: 08, minuto: 30 },
    { hora: 09, minuto: 15 },
    { hora: 10, minuto: 20 },
    { hora: 11, minuto: 05 },
    { hora: 11, minuto: 50 }];
    let listaVespertino = [
    { hora: 13, minuto: 00 }, 
    { hora: 13, minuto: 45 }, 
    { hora: 14, minuto: 30 },
    { hora: 15, minuto: 15 },
    { hora: 16, minuto: 20 },
    { hora: 17, minuto: 05 },
    { hora: 17, minuto: 50 }];

    estudantes.rows.forEach( estudante => {
      if(hoje.getDay() == 1 && estudante.dia_semana == 'Segunda-Feira'){
        if(estudante.periodo == 'Matutino'){
          if(hoje.getHours() - listaMatutino[estudante.tempo_fim-1].hora <= 0){
            if(hoje.getMinutes() - listaVespertino[estudante.tempo_fim-1].minuto <= 0){
              status = [estudantes.rows, { aula: 'Estudante em aula!' }];
            }
          }
        }else{
          if(hoje.getHours() - listaVespertino[estudante.tempo_fim-1].hora <= 0){
            if(hoje.getMinutes() - listaVespertino[estudante.tempo_fim-1].minuto <= 0){
              status = [estudantes.rows, { aula: 'Estudante em aula!' }];
            }
          }
        }
      } 

    });

    console.log(hoje.toLocaleTimeString())
    return status;
  }catch(e){
    console.log(`Houve um erro ${e}`);
  }
}



module.exports = Estudante;