const client = require("../../server");

class Estudante{
  constructor(body){  
    this.body = body;
  }
}

Estudante.save = async (body, filename) => {
  try {
    filename = "/assets/img/" + filename;
    await client.query(
      "INSERT INTO estudantes(nome_estudante, email_institucional, cpf, ra, foto, id_responsaveis) VALUES($1,$2,$3,$4,$5,$6)",
      [
        body.nome_estudante,
        body.email_institucional,
        body.cpf,
        body.ra,
        filename,
        body.id_responsaveis,
      ]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.salvarSaida = async (body) => {
  try {
    let horario = await client.query("SELECT CURRENT_TIMESTAMP");
    if (body.liberacao == "on") {
      await client.query("UPDATE estudantes SET saida_anormal = $1", [horario]);
    }
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.update = async (body) => {
  try {
    await client.query(
      "UPDATE estudantes SET nome_estudante = $1, cpf = $2, ra = $3 WHERE ra = $4",
      [body.nome_estudante, body.cpf, body.ra, body.ra2]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorRA = async (body) => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes WHERE ra = $1 ORDER BY id`,
      [body.ra]
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorCPF = async (body) => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes WHERE cpf = $1 ORDER BY id`,
      [body.cpf]
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorNome = async(body) => {
  try {
    body.nome = String(body.nome).trim();
    body.nome = body.nome.replace(' ', '%');
    const estudantes = await client.query(
      `
      SELECT *
      FROM estudantes
      WHERE upper(nome_estudante) LIKE upper('%${body.nome}%')
      ORDER BY estudantes.id
      `
    );
    return estudantes.rows;
  } catch (e) {
    console.log(e)
  }
}

Estudante.buscaEstudantes = async () => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes ORDER BY id`
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaHorarios = async (body) => {
  try {
    let estudantes;
    
    if(typeof body == 'object'){
      if (body.ra != '') {
        body.ra = String(body.ra).trim();
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, disciplinasestudantes
          WHERE ra = $1 AND id_estudantes = estudantes.id 
          AND horarios.id_disciplinas = disciplinas.id
          AND disciplinasestudantes.id_disciplinas = disciplinas.id
          ORDER BY periodo_horarios
          `,
            [body.ra]
          );
      }else if(body.cpf != ''){
        body.cpf = String(body.cpf).trim();
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, disciplinasestudantes
          WHERE cpf = $1 AND id_estudantes = estudantes.id 
          AND horarios.id_disciplinas = disciplinas.id
          AND disciplinasestudantes.id_disciplinas = disciplinas.id
          ORDER BY periodo_horarios
          `,
            [body.cpf]
          );
      }else if(body.nome != ''){
        body.nome = String(body.nome).trim();
        body.nome = body.nome.replace(' ', '%');
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, disciplinasestudantes
          WHERE upper(nome_estudante) LIKE upper('%${body.nome}%')
          AND id_estudantes = estudantes.id
          AND horarios.id_disciplinas = disciplinas.id
          AND disciplinasestudantes.id_disciplinas = disciplinas.id
          ORDER BY periodo_horarios
          `
        );
      }
    }

    let ordem = [];
    estudantes.rows.forEach(horario => { 
      if(horario.dia_semana == 'Segunda-Feira'){ 
        if(horario.periodo_horarios == 'Matutino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Vespertino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Noturno'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
      }
    }); 
    estudantes.rows.forEach(horario => { 
      if(horario.dia_semana == 'Terça-Feira'){ 
        if(horario.periodo_horarios == 'Matutino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Vespertino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Noturno'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
      }
    }); 
    estudantes.rows.forEach(horario => { 
      if(horario.dia_semana == 'Quarta-Feira'){ 
        if(horario.periodo_horarios == 'Matutino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Vespertino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Noturno'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
      }
    }); 
    estudantes.rows.forEach(horario => { 
      if(horario.dia_semana == 'Quinta-Feira'){ 
        if(horario.periodo_horarios == 'Matutino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Vespertino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Noturno'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
      }
    }); 
    estudantes.rows.forEach(horario => { 
      if(horario.dia_semana == 'Sexta-Feira'){ 
        if(horario.periodo_horarios == 'Matutino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Vespertino'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
        if(horario.periodo_horarios == 'Noturno'){
        for(let i = 1; i < 7; i++){if(horario.tempo_inicio == i){ ordem.push(horario) }}
        }
      }
    }); 

    return ordem;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.liberacao = async (body) => {
  try {
    let estudantes;
    
    if(typeof body == 'object'){
      if(typeof body.nome != 'undefined'){
        if(body.nome != ''){
        body.nome = String(body.nome).trim();
        body.nome = body.nome.replace(' ', '%');
        estudantes = await client.query(
          `
          SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, disciplinasestudantes
          WHERE upper(nome_estudante) LIKE upper('%${body.nome}%')
          AND id_estudantes = estudantes.id
          AND horarios.id_disciplinas = disciplinas.id
          AND disciplinasestudantes.id_disciplinas = disciplinas.id
          ORDER BY periodo_horarios
          `
        );
        }
      }
      if(typeof body.cpf != 'undefined'){
        if(body.cpf != ''){
          body.cpf =  String(body.cpf).trim();
          estudantes = await client.query(
            `
            SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
            FROM estudantes, horarios, disciplinas, disciplinasestudantes
            WHERE cpf = $1 
            AND id_estudantes = estudantes.id
            AND horarios.id_disciplinas = disciplinas.id
            AND disciplinasestudantes.id_disciplinas = disciplinas.id
            ORDER BY periodo_horarios
            `,
              [body.cpf]
          );
        }
      }
      if (typeof body.ra != 'undefined'){
        if(body.ra != '') {
          body.ra = String(body.ra).trim();
          estudantes = await client.query(
            `
            SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
            FROM estudantes, horarios, disciplinas, disciplinasestudantes
            WHERE ra = $1 
            AND id_estudantes = estudantes.id
            AND horarios.id_disciplinas = disciplinas.id
            AND disciplinasestudantes.id_disciplinas = disciplinas.id
            ORDER BY periodo_horarios
            `, [body.ra]
          );
        }
      }
    }

    
    let status = [estudantes.rows, { aula: "Estudante sem aula!" }];
    let listaMatutino = [
      "Matutino",
      { hora: 07, minuto: 00 },
      { hora: 07, minuto: 45 },
      { hora: 08, minuto: 30 },
      { hora: 09, minuto: 15 },
      { hora: 10, minuto: 20 },
      { hora: 11, minuto: 05 },
      { hora: 11, minuto: 50 },
    ];
    let listaVespertino = [
      "Vespertino",
      { hora: 13, minuto: 00 },
      { hora: 13, minuto: 45 },
      { hora: 14, minuto: 30 },
      { hora: 15, minuto: 15 },
      { hora: 16, minuto: 20 },
      { hora: 17, minuto: 05 },
      { hora: 17, minuto: 50 },
    ];
    let listaNoturno = [
      "Noturno",
      { hora: 19, minuto: 00 },
      { hora: 19, minuto: 45 },
      { hora: 20, minuto: 30 },
      { hora: 21, minuto: 15 },
      { hora: 22, minuto: 20 },
      { hora: 23, minuto: 05 },
      { hora: 23, minuto: 50 },
    ];

    let listas = [listaMatutino, listaVespertino, listaNoturno];

    let diaSemana = [
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
    ];

    const hoje = new Date();
    let verifica_hora = 0;
    let verifica_min = 0;

    estudantes.rows.forEach((estudante) => {
      //Define dia da semana
      if (estudante.dia_semana == diaSemana[diaDaSemana(estudante) - 1]) {
        //Periodo, matutino, vespertino, noturno
        let turno_atual = 0;
        let primeiro_tempo_inicio = [6, 6, 'Inalterado'];

        for(let j = 0; j < 2; j++){
          if(estudante.periodo_horarios == listas[j][0]){
            //se a horaAtual >= hora que aula começa, e, a horaAtual <= hora que aula termina
            if(hoje.getHours() >= listas[j][estudante.tempo_inicio].hora && hoje.getHours() <= listas[j][estudante.tempo_fim + 1].hora) {
              status = estudanteEmAula(estudante.tempo_inicio, estudante.tempo_fim, j);
            }
            if(hoje.getHours() <= listas[j][estudante.tempo_inicio].hora && hoje.getHours() >= listas[j][1].hora){
              status = aulaEmBreve(estudante, turno_atual, primeiro_tempo_inicio);
            }
          }else{
            turno_atual = j;
          }
        }
      }
    });

    function diaDaSemana(estudante){
      for(let i = 1; i < 6; i++){
        if (hoje.getDay() == i && estudante.dia_semana == diaSemana[i - 1]){
          return i;
        }
      }
    }

    function aulaEmBreve(estudante, turno_atual, primeiro_tempo_inicio){
      if(listas[turno_atual][0] == estudante.periodo_horarios){
                  
        primeiro_tempo_inicio = 
          estudante.tempo_inicio < primeiro_tempo_inicio[0] 
          ? [estudante.tempo_inicio, estudante.tempo_fim, 'Alterado']
          : primeiro_tempo_inicio;
        
        if(hoje.getHours() < listas[turno_atual][primeiro_tempo_inicio[0]].hora && verifica_hora == 0 && primeiro_tempo_inicio[2] == 'Alterado'){
          verifica_hora = 1;
          status = [estudantes.rows, { aula: `Aula em breve!` }];
        }

        if(hoje.getHours() == listas[turno_atual][primeiro_tempo_inicio[0]].hora){
          if(hoje.getMinutes() < listas[turno_atual][primeiro_tempo_inicio[0]].minuto && verifica_min == 0 && primeiro_tempo_inicio[2] == 'Alterado'){
            verifica_min = 1;
            status = [estudantes.rows, { aula: `Aula em breve!` }];
          }
        }
      }
      return status;
    }

    function estudanteEmAula(tempo_inicio, tempo_fim, j){
      // hora atual for igual a hora que começa o tempo
      if (hoje.getHours() == listas[j][tempo_inicio].hora) {
        //verifica se os minutos são maiores
        if (hoje.getMinutes() >= listas[j][tempo_inicio].minuto){
          status = [estudantes.rows, { aula: "Estudante em aula!" }];
        }
      }               
      // hora atual for igual a hora que termina o tempo
      if (hoje.getHours() == listas[j][tempo_fim + 1].hora) {
        //verifica se os minutos são menores
        if (hoje.getMinutes() <= listas[j][tempo_fim + 1].minuto){
          status = [estudantes.rows, { aula: "Estudante em aula!" }];
        }
      }

      if(hoje.getHours() > listas[j][tempo_inicio].hora 
      && hoje.getHours() < listas[j][tempo_fim + 1].hora){
        status = [estudantes.rows, { aula: "Estudante em aula!" }];
      }
      return status;
    }

    return status;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Estudante;
