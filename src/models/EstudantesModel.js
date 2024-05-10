const client = require('../../index');

class Estudante {
  static async save(body, filename) {
    const { nome_estudante, email_institucional, cpf, ra, id_responsaveis } =
      body;

    filename = '/assets/img/' + filename;

    try {
      await client.query(
        'INSERT INTO estudantes(nome_estudante, email_institucional, cpf, ra, foto, id_responsaveis) VALUES($1,$2,$3,$4,$5,$6)',
        [
          nome_estudante,
          email_institucional,
          cpf,
          ra,
          filename,
          id_responsaveis,
        ],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findAll() {
    try {
      const estudantes = await client.query(
        `SELECT * FROM estudantes ORDER BY id`,
      );
      return estudantes.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByRA(body) {
    try {
      const { ra } = body;
      const estudantes = await client.query(
        `SELECT * FROM estudantes WHERE ra = '${ra}' ORDER BY id`,
      );
      return estudantes.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByCPF(body) {
    try {
      const { cpf } = body;
      const estudantes = await client.query(
        `SELECT * FROM estudantes WHERE cpf = ${cpf} ORDER BY id`,
      );
      return estudantes.rows;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findByName(body) {
    try {
      let { nome } = body;
      nome = String(nome).trim();
      nome = nome.replace(' ', '%');
      const estudantes = await client.query(
        `
        SELECT *
        FROM estudantes
        WHERE upper(nome_estudante) LIKE upper('%${nome}%')
        ORDER BY estudantes.id
        `,
      );
      return estudantes.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async update(body) {
    try {
      await client.query(
        'UPDATE estudantes SET nome_estudante = $1, cpf = $2, ra = $3 WHERE ra = $4',
        [body.nome_estudante, body.cpf, body.ra, body.ra2],
      );
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async liberacao(body) {
    try {
      let query = `
        SELECT estudantes.id, estudantes.ra, estudantes.cpf, estudantes.nome_estudante, estudantes.foto, horarios.periodo_horarios, horarios.dia_semana, horarios.tempo_inicio, horarios.tempo_fim
        FROM estudantes
        JOIN disciplinasestudantes ON estudantes.id = disciplinasestudantes.id
        JOIN disciplinas ON disciplinasestudantes.id_disciplinas = disciplinas.id
        JOIN horarios ON disciplinas.id = horarios.id_disciplinas 
        WHERE 1=1     
      `;

      let params = [];
      if (body.nome) {
        query += ` AND upper(nome_estudante) LIKE upper($${params.push(
          '%' + body.nome.trim() + '%',
        )}) `;
      }
      if (body.cpf) {
        query += ` AND cpf = $${params.push(body.cpf.trim())} `;
      }
      if (body.ra) {
        query += ` AND ra = $${params.push(body.ra.trim())} `;
      }

      query += 'ORDER BY periodo_horarios';

      const { rows: estudantes } = await client.query(query, params);

      // Verifica se há estudantes
      if (estudantes.length === 0) {
        return [null, { aula: 'Estudante não encontrado' }];
      }

      const status = [estudantes, { aula: '' }];

      let listaMatutino = [
        'Matutino',
        { hora: 7, minuto: 0 },
        { hora: 7, minuto: 45 },
        { hora: 8, minuto: 30 },
        { hora: 9, minuto: 15 },
        { hora: 10, minuto: 20 },
        { hora: 11, minuto: 5 },
        { hora: 11, minuto: 50 },
      ];
      let listaVespertino = [
        'Vespertino',
        { hora: 13, minuto: 0 },
        { hora: 13, minuto: 45 },
        { hora: 14, minuto: 30 },
        { hora: 15, minuto: 15 },
        { hora: 16, minuto: 20 },
        { hora: 17, minuto: 5 },
        { hora: 17, minuto: 50 },
      ];
      let listaNoturno = [
        'Noturno',
        { hora: 19, minuto: 0 },
        { hora: 19, minuto: 45 },
        { hora: 20, minuto: 30 },
        { hora: 21, minuto: 15 },
        { hora: 22, minuto: 20 },
        { hora: 23, minuto: 5 },
        { hora: 23, minuto: 50 },
      ];

      let listas = [listaMatutino, listaVespertino, listaNoturno];

      let diaSemana = [
        'Segunda-Feira',
        'Terça-Feira',
        'Quarta-Feira',
        'Quinta-Feira',
        'Sexta-Feira',
      ];

      // Percorre a lista de estudantes
      estudantes.forEach((estudante) => {
        const diaSemanaAtual = diaDaSemana(estudante);
        if (
          diaSemanaAtual !== -1 &&
          estudante.dia_semana === diaSemana[diaSemanaAtual]
        ) {
          const turnoAtual = listas.findIndex(
            (lista) => lista[0] === estudante.periodo_horarios,
          );
          if (turnoAtual !== -1) {
            const agora = new Date();
            if (estudanteEmAula(estudante, agora, listas[turnoAtual])) {
              return (status[1].aula = 'Estudante em aula!');
            } else if (
              isEmBreve(listas[turnoAtual], estudante.tempo_inicio, agora)
            ) {
              return (status[1].aula = 'Aula em Breve!');
            } else {
              return (status[1].aula = 'Estudante sem aula!');
            }
          }
        }
      });

      // Função para determinar o dia da semana
      function diaDaSemana(estudante) {
        const diaAtual = new Date().getDay();
        return diaSemana.indexOf(estudante.dia_semana) + 1 === diaAtual
          ? diaAtual - 1
          : -1;
      }

      // Função para verificar se o estudante está em aula
      function estudanteEmAula(estudante, agora, listaHorarios) {
        const horaAtualMinutos = agora.getHours() * 60 + agora.getMinutes();

        const horaInicioMinutos =
          listaHorarios[estudante.tempo_inicio].hora * 60;
        const minutosHoraInicio =
          horaInicioMinutos + listaHorarios[estudante.tempo_inicio].minuto;

        const horaTerminoMinutos =
          listaHorarios[estudante.tempo_fim + 1].hora * 60;
        const minutosHoraTermino =
          horaTerminoMinutos + listaHorarios[estudante.tempo_fim + 1].minuto;

        return (
          horaAtualMinutos >= minutosHoraInicio &&
          horaAtualMinutos <= minutosHoraTermino
        );
      }

      // Define uma função para verificar se um horário está em breve
      function isEmBreve(listaHorarios, tempo_inicio, diaAtual) {
        const diferencaMinutos =
          listaHorarios[tempo_inicio].hora * 60 +
          listaHorarios[tempo_inicio].minuto -
          (diaAtual.getHours() * 60 + diaAtual.getMinutes());

        return diferencaMinutos >= 0 && diferencaMinutos <= 15; // Considerando "em breve" como até 15 minutos no futuro
      }

      // console.log(status)
      return status;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }

  static async findHorarios(body) {
    try {
      let alunos;

      if (body) {
        let queryString = `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, disciplinasestudantes
          WHERE id_estudantes = estudantes.id 
          AND horarios.id_disciplinas = disciplinas.id
          AND disciplinasestudantes.id_disciplinas = disciplinas.id
        `;

        const queryParams = [];

        if (body.ra !== '') {
          queryString += ' AND ra = $1';
          queryParams.push(String(body.ra).trim());
        } else if (body.cpf !== '') {
          queryString += ' AND cpf = $1';
          queryParams.push(String(body.cpf).trim());
        } else if (body.nome !== '') {
          body.nome = String(body.nome).trim().replace(' ', '%');
          queryString += ' AND upper(nome_estudante) LIKE upper($1)';
          queryParams.push(`%${body.nome}%`);
        }

        queryString += ' ORDER BY periodo_horarios';
        const { rows: estudantes } = await client.query(
          queryString,
          queryParams,
        );
        alunos = estudantes;
      }

      // Definimos um objeto para mapear os dias da semana para números
      const diaSemanaNumero = {
        'Segunda-Feira': 0,
        'Terça-Feira': 1,
        'Quarta-Feira': 2,
        'Quinta-Feira': 3,
        'Sexta-Feira': 4,
      };

      // Definimos um objeto para mapear os períodos horários para números
      const periodoNumero = {
        Matutino: 0,
        Vespertino: 1,
        Noturno: 2,
      };

      let ordem = [];

      // Iteramos sobre os resultados e adicionamos os horários à ordem
      alunos.forEach((horario) => {
        // Verificamos se o dia da semana está definido no mapeamento
        if (diaSemanaNumero.hasOwnProperty(horario.dia_semana)) {
          const diaNumero = diaSemanaNumero[horario.dia_semana];

          // Verificamos se o período horário está definido no mapeamento
          if (periodoNumero.hasOwnProperty(horario.periodo_horarios)) {
            const periodo = periodoNumero[horario.periodo_horarios];

            // Iteramos sobre os tempos de início
            for (let i = 1; i < 7; i++) {
              if (horario.tempo_inicio == i) {
                ordem.push(horario);
                break; // Saímos do loop assim que encontramos um horário válido
              }
            }
          }
        }
      });
      return ordem;
    } catch (e) {
      console.log(`Houve um erro ${e}`);
    }
  }
}

module.exports = Estudante;
