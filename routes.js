const express = require('express');
const route = express.Router();
const homesController = require('./src/controllers/homesController');
const cadastroController = require('./src/controllers/cadastroController'); 
const administracaoController = require('./src/controllers/administracaoController');

//Rota da home 
route.get('/', homesController.paginaInicial);
//Qual cadastro
route.get('/cadastro', cadastroController.cadastros);
// Cadastros
route.get('/cadastro/curso', cadastroController.cadastroCurso);
route.get('/cadastro/disciplina', cadastroController.cadastroDisciplina);
route.get('/cadastro/horario', cadastroController.cadastroHorario);
route.get('/cadastro/estudante', cadastroController.cadastroEstudante);
route.get('/cadastro/responsavel', cadastroController.cadastroResponsavel);
//Salvando
route.post('/cadastro/cursosalvo', cadastroController.trataPost);
route.post('/cadastro/disciplinasalvo', cadastroController.trataPost);
route.post('/cadastro/horariosalvo', cadastroController.trataPost);
route.post('/cadastro/estudantesalvo', cadastroController.trataPost);
route.post('/cadastro/responsavelsalvo', cadastroController.trataPost);

//Rotas do administrador
//Login do Administrador
route.get('/administracao/login', administracaoController.login);
//Horários de todos os alunos cadastrados
route.post('/administracao/paginainicial', administracaoController.paginaAdm);
route.post('/administracao/editar', administracaoController.editar);
route.post('/administracao/horarios', administracaoController.horarios);
route.post('/administracao/responsavel', administracaoController.responsavel);
route.post('/administracao/salvo', administracaoController.editado);

module.exports = route;
