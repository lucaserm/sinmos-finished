const Estudante = require("../models/EstudantesModel");
const Responsavel = require("../models/ResponsaveisModel");
const Registro = require("../models/RegistrosModel");
const RegistroEstudante = require("../models/RegistrosEstudantes");
const Advertencia = require("../models/AdvertenciasModel");
const Usuario = require("../models/UsuariosModel");
const OcorrenciaEstudante = require("../models/OcorrenciasEstudantes");

//página de login
exports.login = (req, res) => {
  res.render("login");
};

//gerenciando todos os users
exports.paginaAdm = async (req, res) => {
  //variável para manipulação de páginas
  const users = await Usuario.buscaUsuarios();
  //Super User
  if (req.body.codigo_servidor == "root" && req.body.senha == "123456") {
    let codigo_servidor = "root";
    let senha = "123456";
    res.render("coordenacao", { codigo_servidor, senha });
  } else if (users.length > 0) {
    users.forEach((usuario) => {
      if (
        req.body.codigo_servidor == usuario.codigo_servidor &&
        req.body.senha == usuario.senha
      ) {
        let codigo_servidor = usuario.codigo_servidor;
        let senha = usuario.senha;
        if (usuario.cargo == "Coordenacao") {
          res.render("coordenacao", { codigo_servidor, senha });
        } else if (usuario.cargo == "Portaria") {
          res.render("portaria", { codigo_servidor, senha });
        } else if (usuario.cargo == "Assistencia") {
          res.render("assistencia", { codigo_servidor, senha });
        }
      }
    });
  } else {
    res.render("login");
  }
};

//página para editar dados do estudante
exports.editar = async (req, res) => {
  const estudantes = await Estudante.buscaPorRA(req.body);
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  res.render("editar", { estudantes, codigo_servidor, senha });
};

exports.trataEditado = async (req, res) => {
  const id = req.body.id;
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  if (req.url == "/administracao/editadoEstudante") {
    Estudante.update(req.body);
    return res.render("salvo", { req, id, codigo_servidor, senha });
  } else if (req.url == "/administracao/editadoSaida") {
    Registro.update(req.body);
  } else if (req.url == "/administracao/deleteAdvertencia") {
    Advertencia.deletePorRA(req.body);
    const id = req.body.id;
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    return res.render("delete", { req, id, codigo_servidor, senha });
  }
  res.render("salvoEditado", { req, id, codigo_servidor, senha });
};

//busca responsável e advertências de um estudante específico
exports.responsavel = async (req, res) => {
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  const responsaveis = await Responsavel.buscaResponsavelPorRA(req.body);
  const ocorrencias = await OcorrenciaEstudante.buscarPorRa(req.body);
  const advertencias = await Advertencia.buscaAdvertenciaAprovadas(req.body);
  res.render("responsavel", {
    responsaveis,
    ocorrencias,
    advertencias,
    codigo_servidor,
    senha,
  });
};

exports.saidaEstudante = async (req, res) => {
  const estudantes =
    (!req.body.cpf || !req.body.ra || !req.body.nome) &&
    (req.body.cpf != "" || req.body.ra != "" || req.body.nome != "")
      ? await Estudante.liberacao(req.body)
      : {};
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  let repetir =
    req.body.nome && req.body.nome != ""
      ? await Estudante.buscaPorNome(req.body)
      : [];
  res.render("saidaEstudante", {
    estudantes,
    repetir,
    users,
    codigo_servidor,
    senha,
  });
};

//pega os horários do estudante
exports.horarios = async (req, res) => {
  const horarios =
    (!req.body.cpf || !req.body.ra || !req.body.nome) &&
    (req.body.cpf != "" || req.body.ra != "" || req.body.nome != "")
      ? await Estudante.buscaHorarios(req.body)
      : {};
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  let repetir =
    req.body.nome && req.body.nome != ""
      ? await Estudante.buscaPorNome(req.body)
      : [];
  res.render("horarios", { horarios, repetir, codigo_servidor, senha });
};

//todas as requisições de todos os estudantes
exports.requisicoes = async (req, res) => {
  const registros = await RegistroEstudante.buscar(req.body);
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  res.render("requisicoes", { registros, users, codigo_servidor, senha });
};

exports.advertencias = async (req, res) => {
  const id = req.body.id;
  const opcao = req.body.opcao;
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  let ocorrencias = await OcorrenciaEstudante.buscar();
  if (
    typeof req.body.opcao == "undefined" &&
    typeof req.body.id == "undefined" &&
    typeof req.body.status == "undefined"
  ) {
    res.render("areoTela", { ocorrencias, codigo_servidor, senha });
  } else if (typeof req.body.opcao != "undefined") {
    res.render("advertencias", { ocorrencias, codigo_servidor, senha, opcao });
  } else if (
    typeof req.body.id != "undefined" &&
    req.body.status != "Aprovado"
  ) {
    ocorrencias = await OcorrenciaEstudante.buscarPorID(req.body.id);
    res.render("cadastro_advertencia", {
      ocorrencias,
      codigo_servidor,
      senha,
      id,
    });
  } else {
    const advertencias = await Advertencia.buscaAdvertenciaPorID(id);
    res.render("relatorio", { advertencias, codigo_servidor, senha, id });
  }
};

exports.ocorrencias = async (req, res) => {
  const codigo_servidor = req.body.codigo_servidor;
  const senha = req.body.senha;
  const users = await Usuario.buscaPorCodigo(codigo_servidor);
  const ocorrencias = await OcorrenciaEstudante.buscaPorServidor(users[0].id);
  const ocorrenciasRelacionado =
    await OcorrenciaEstudante.buscaPorServidorRelacionado(
      users[0].nome_usuario
    );
  res.render("ocorrencias", {
    ocorrencias,
    ocorrenciasRelacionado,
    codigo_servidor,
    senha,
  });
};
