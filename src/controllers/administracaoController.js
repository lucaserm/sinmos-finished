const Estudante = require('../models/EstudantesModel');
const Registro = require('../models/RegistrosModel');
const RegistroEstudante = require('../models/RegistrosEstudantes');
const Advertencia = require('../models/AdvertenciasModel');
const Usuario = require('../models/UsuariosModel');
const OcorrenciaEstudante = require('../models/OcorrenciasEstudantes');
const bcrypt = require('bcrypt');
//página de login
exports.login = (req, res) => {
  return res.render('login', { error: false });
};

exports.paginaAdm = async (req, res) => {
  //Variável para manipulação de páginas
  let { codigo_servidor, senha } = req.body;
  //Super User
  if (codigo_servidor == 'root' && senha == '123456') {
    return res.render('coordenacao', {
      codigo_servidor: 'root',
      senha: '123456',
    });
  }

  const userBD = await Usuario.findByCodigo(codigo_servidor);
  const user = userBD[0];
  const isSenhaValid = await bcrypt.compare(senha, user.senha);

  if (!user || !isSenhaValid) return res.render('login', { error: true });

  codigo_servidor = user.codigo_servidor;
  senha = user.senha;

  if (user.cargo == 'Coordenacao') {
    return res.render('coordenacao', { codigo_servidor, senha });
  } else if (user.cargo == 'Portaria') {
    return res.render('portaria', { codigo_servidor, senha });
  } else if (user.cargo == 'Assistencia') {
    return res.render('assistencia', { codigo_servidor, senha });
  }
};

//página para editar dados do estudante
exports.editar = async (req, res) => {
  const estudantes = await Estudante.findByRA(req.body);
  const { codigo_servidor, senha } = req.body;
  res.render('editar', { estudantes, codigo_servidor, senha });
};

exports.trataEditado = async (req, res) => {
  const { id, codigo_servidor, senha } = req.body;

  if (req.url == '/administracao/editadoEstudante') {
    Estudante.update(req.body);
    return res.render('salvo', { id, codigo_servidor, senha });
  }

  if (req.url == '/administracao/editadoSaida') {
    if (req.body.id > 0) Registro.update(req.body);
    return res.render('salvoEditado', { id, codigo_servidor, senha });
  }
};

//busca responsável e advertências de um estudante específico
exports.responsavel = async (req, res) => {
  const { ra, codigo_servidor, senha } = req.body;
  const estudante = await Estudante.findByRA(ra);
  const ocorrencias = await OcorrenciaEstudante.findByRA(ra);
  const advertencias = await Advertencia.findApproved(ra);
  return res.render('responsavel', {
    estudante,
    ocorrencias,
    advertencias,
    codigo_servidor,
    senha,
  });
};

exports.saidaEstudante = async (req, res) => {
  const { codigo_servidor, senha, cpf, ra, nome } = req.body;

  const estudantes =
    (!cpf || !ra || !nome) && (cpf != '' || ra != '' || nome != '')
      ? await Estudante.liberacao(req.body)
      : {};
  const users = await Usuario.findByCodigo(codigo_servidor);
  const repetir =
    nome && nome != '' ? await Estudante.findByName(req.body) : [];
  return res.render('saidaEstudante', {
    estudantes,
    repetir,
    users,
    codigo_servidor,
    senha,
  });
};

//pega os horários do estudante
exports.horarios = async (req, res) => {
  const { codigo_servidor, senha, cpf, ra, nome } = req.body;

  const horarios =
    (!cpf || !ra || !nome) && (cpf != '' || ra != '' || nome != '')
      ? await Estudante.findHorarios(req.body)
      : {};
  const repetir =
    nome && nome != '' ? await Estudante.findByName(req.body) : [];
  return res.render('horarios', { horarios, repetir, codigo_servidor, senha });
};

//todas as requisições de todos os estudantes
exports.requisicoes = async (req, res) => {
  const { ra, codigo_servidor, senha } = req.body;
  const registros = await RegistroEstudante.findByRA(ra);
  const users = await Usuario.findByCodigo(codigo_servidor);
  return res.render('requisicoes', {
    registros,
    users,
    codigo_servidor,
    senha,
  });
};

exports.advertencias = async (req, res) => {
  const { id, opcao, codigo_servidor, senha, status } = req.body;

  const ocorrencias = await OcorrenciaEstudante.findAll();
  if (
    typeof opcao == 'undefined' &&
    typeof id == 'undefined' &&
    typeof status == 'undefined'
  ) {
    return res.render('areoTela', { ocorrencias, codigo_servidor, senha });
  } else if (typeof opcao != 'undefined') {
    return res.render('advertencias', {
      ocorrencias,
      codigo_servidor,
      senha,
      opcao,
    });
  } else if (typeof id != 'undefined' && status != 'Aprovado') {
    ocorrencias = await OcorrenciaEstudante.findByID(id);
    return res.render('cadastro_advertencia', {
      ocorrencias,
      codigo_servidor,
      senha,
      id,
    });
  } else {
    const advertencias = await Advertencia.findByID(id);
    return res.render('relatorio', {
      advertencias,
      codigo_servidor,
      senha,
      id,
    });
  }
};

exports.ocorrencias = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const users = await Usuario.findByCodigo(codigo_servidor);
  const ocorrencias = await OcorrenciaEstudante.findByCodigoServidor(
    users[0].id,
  );
  const ocorrenciasRelacionado =
    await OcorrenciaEstudante.findByRelatedServidor(users[0].nome_usuario);
  return res.render('ocorrencias', {
    ocorrencias,
    ocorrenciasRelacionado,
    codigo_servidor,
    senha,
  });
};
