const Curso = require('../models/CursosModel');
const Disciplina = require('../models/DisciplinasModel');
const Estudante = require('../models/EstudantesModel');
const Matricula = require('../models/MatriculasModel');
const Horario = require('../models/HorariosModel');
const Responsavel = require('../models/ResponsaveisModel');
const HorarioEstudante = require('../models/DisciplinasEstudantesModel');
const Registro = require('../models/RegistrosModel');
const Usuario = require('../models/UsuariosModel');
const Ocorrencia = require('../models/OcorrenciasModel');
const OcorrenciaEstudante = require('../models/OcorrenciasEstudantes');
const Advertencia = require('../models/AdvertenciasModel');
const RegistroEstudante = require('../models/RegistrosEstudantes');

exports.cadastros = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  //Super User
  if (codigo_servidor == 'root') {
    res.render('cadastros', { codigo_servidor: 'root', senha: '123456' });
  } else {
    const users = await Usuario.buscaPorCodigo(codigo_servidor);
    const user = users[0];

    if (users[0].cargo != 'Coordenacao')
      return res.render('401', {
        codigo_servidor: user.codigo_servidor,
        senha: user.senha,
      });

    return res.render('cadastros', { codigo_servidor, senha });
  }
};

exports.cadastroCurso = (req, res) => {
  const { codigo_servidor, senha } = req.body;
  return res.render('cadastro_curso', { codigo_servidor, senha });
};
exports.cadastroMatricula = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const cursos = await Curso.buscarCursos();
  const estudantes = await Estudante.buscaEstudantes();
  return res.render('cadastro_matricula', {
    cursos,
    estudantes,
    codigo_servidor,
    senha,
  });
};
exports.cadastroDisciplina = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const cursos = await Curso.buscarCursos();
  return res.render('cadastro_disciplina', { cursos, codigo_servidor, senha });
};
exports.cadastroHorario = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const disciplinas = await Disciplina.buscarDisciplinas();
  const horarios = await Horario.buscaHorarios();
  return res.render('cadastro_horario', {
    disciplinas,
    horarios,
    codigo_servidor,
    senha,
  });
};
exports.cadastroEstudante = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const cursos = await Curso.buscarCursos();
  const responsaveis = await Responsavel.buscaResponsaveis();
  res.render('cadastro_estudante', {
    cursos,
    responsaveis,
    codigo_servidor,
    senha,
  });
};
exports.cadastroResponsavel = (req, res) => {
  const { codigo_servidor, senha } = req.body;
  res.render('cadastro_responsavel', { codigo_servidor, senha });
};
exports.cadastroDisciplinaEstudante = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const estudantes = await Estudante.buscaEstudantes();
  const disciplinas = await Disciplina.buscarDisciplinas();
  res.render('cadastro_disciplinasestudantes', {
    estudantes,
    disciplinas,
    codigo_servidor,
    senha,
  });
};
exports.cadastroRegistro = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const estudantes = await Estudante.buscaEstudantes();
  res.render('cadastro_registro', { estudantes, codigo_servidor, senha });
};
exports.cadastroUsuario = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  res.render('cadastro_usuario', { codigo_servidor, senha });
};
exports.cadastroOcorrencia = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  res.render('cadastro_ocorrencia', { codigo_servidor, senha });
};
exports.cadastroOcorrenciaEstudante = async (req, res) => {
  const { id, codigo_servidor, senha } = req.body;
  const estudantes = await Estudante.buscaEstudantes();
  const ocorrencias = await Ocorrencia.buscarOcorrencias();
  res.render('cadastro_ocorrenciasestudantes', {
    estudantes,
    ocorrencias,
    codigo_servidor,
    senha,
    id,
  });
};

exports.trataPost = async (req, res) => {
  const { codigo_servidor, senha, senha_, relatorio_advertencia } = req.body;
  let id = typeof req.body.id == 'undefined' ? 0 : req.body.id;

  if (req.url == '/cadastro/cursosalvo') {
    Curso.save(req.body);
  } else if (req.url == '/cadastro/disciplinasalvo') {
    Disciplina.save(req.body);
  } else if (req.url == '/cadastro/horariosalvo') {
    Horario.save(req.body);
  } else if (req.url == '/cadastro/matriculasalvo') {
    Matricula.save(req.body);
  } else if (req.url == '/cadastro/estudantesalvo') {
    Estudante.save(req.body, req.file.filename);
  } else if (req.url == '/cadastro/responsavelsalvo') {
    Responsavel.save(req.body);
  } else if (req.url == '/cadastro/horarioestudantesalvo') {
    HorarioEstudante.save(req.body);
  } else if (req.url == '/cadastro/registrosalvo') {
    RegistroEstudante.save(req.body, await Registro.save(req.body));
  } else if (req.url == '/cadastro/usuariosalvo') {
    Usuario.save(req.body);
  } else if (req.url == '/cadastro/ocorrenciasalvo') {
    Ocorrencia.save(req.body);
  } else if (req.url == '/cadastro/ocorrenciaestudantesalvo') {
    if (senha_ == senha) {
      OcorrenciaEstudante.save(req.body);
    } else {
      id = 1;
    }
  } else if (req.url == '/cadastro/advertenciasalvo') {
    if (typeof relatorio_advertencia != 'undefined') {
      OcorrenciaEstudante.updateAprovado(req.body);
      Advertencia.save(req.body);
    } else {
      id = 0;
      OcorrenciaEstudante.updateReprovado(req.body);
      return res.render('salvo', { id, codigo_servidor, senha });
    }
  }
  return res.render('salvo', { id, codigo_servidor, senha });
};
