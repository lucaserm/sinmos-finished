const Estudante = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel');
const Registro = require('../models/RegistrosModel');
const RegistroEstudante = require('../models/RegistrosEstudantes');
const Advertencia = require('../models/AdvertenciasModel');
const Usuario = require('../models/UsuariosModel');
const OcorrenciaEstudante = require('../models/OcorrenciasEstudantes');

//página de login
exports.login = (req, res) => {
  return res.render('login', { error: false });
};

exports.paginaAdm = async (req, res) => {
  //Variável para manipulação de páginas
  const { codigo_servidor, senha } = req.body;
  const users = await Usuario.buscaUsuarios();
  //Super User
  if (codigo_servidor == 'root' && senha == '123456') {
    return res.render('coordenacao', {
      codigo_servidor: 'root',
      senha: '123456',
    });
  }

  const user = users.find((user) => {
    if (codigo_servidor == user.codigo_servidor && senha == user.senha)
      return user;
  });

  if (!user) return res.render('login', { error: true });

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
  const estudantes = await Estudante.buscaPorRA(req.body);
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
    Registro.update(req.body);
    return res.render('salvoEditado', { id, codigo_servidor, senha });
  }

  if (req.url == '/administracao/deleteAdvertencia') {
    Advertencia.deletePorRA(req.body);
    return res.render('delete', { id, codigo_servidor, senha });
  }
};

//busca responsável e advertências de um estudante específico
exports.responsavel = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const responsaveis = await Responsavel.buscaResponsavelPorRA(req.body);
  const ocorrencias = await OcorrenciaEstudante.buscarPorRa(req.body);
  const advertencias = await Advertencia.buscaAdvertenciaAprovadas(req.body);
  return res.render('responsavel', {
    responsaveis,
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
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  const repetir =
    nome && nome != '' ? await Estudante.buscaPorNome(req.body) : [];
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
      ? await Estudante.buscaHorarios(req.body)
      : {};
  const repetir =
    nome && nome != '' ? await Estudante.buscaPorNome(req.body) : [];
  return res.render('horarios', { horarios, repetir, codigo_servidor, senha });
};

//todas as requisições de todos os estudantes
exports.requisicoes = async (req, res) => {
  const { codigo_servidor, senha } = req.body;
  const registros = await RegistroEstudante.buscar(req.body);
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  return res.render('requisicoes', {
    registros,
    users,
    codigo_servidor,
    senha,
  });
};

exports.advertencias = async (req, res) => {
  const { id, opcao, codigo_servidor, senha, status } = req.body;

  const ocorrencias = await OcorrenciaEstudante.buscar();
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
    ocorrencias = await OcorrenciaEstudante.buscarPorID(id);
    return res.render('cadastro_advertencia', {
      ocorrencias,
      codigo_servidor,
      senha,
      id,
    });
  } else {
    const advertencias = await Advertencia.buscaAdvertenciaPorID(id);
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
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  const ocorrencias = await OcorrenciaEstudante.buscaPorServidor(users[0].id);
  const ocorrenciasRelacionado =
    await OcorrenciaEstudante.buscaPorServidorRelacionado(
      users[0].nome_usuario,
    );
  return res.render('ocorrencias', {
    ocorrencias,
    ocorrenciasRelacionado,
    codigo_servidor,
    senha,
  });
};
