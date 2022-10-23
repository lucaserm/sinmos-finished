const express = require('express');
const multer = require('multer');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const cadastroController = require('./src/controllers/cadastroController'); 
const administracaoController = require('./src/controllers/administracaoController');

//Rota da home 
route.get('/', homeController.paginaInicial);
//Qual cadastro
route.post('/cadastro', cadastroController.cadastros);
// Cadastros
route.post('/cadastro/curso', cadastroController.cadastroCurso);
route.post('/cadastro/matricula', cadastroController.cadastroMatricula);
route.post('/cadastro/disciplina', cadastroController.cadastroDisciplina);
route.post('/cadastro/horario', cadastroController.cadastroHorario);
route.post('/cadastro/estudante', cadastroController.cadastroEstudante);
route.post('/cadastro/responsavel', cadastroController.cadastroResponsavel);
route.post('/cadastro/horarioestudante', cadastroController.cadastroHorarioEstudante);
route.post('/cadastro/registro', cadastroController.cadastroRegistro);
//Salvando
route.post('/cadastro/cursosalvo', cadastroController.trataPost);
route.post('/cadastro/disciplinasalvo', cadastroController.trataPost);
route.post('/cadastro/horariosalvo', cadastroController.trataPost);
route.post('/cadastro/matriculasalvo', cadastroController.trataPost);
// Configuração de armazenamento de imagens
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/img/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];
        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');
        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});
let upload = multer({ storage });
route.post('/cadastro/estudantesalvo', upload.single('avatar'), cadastroController.trataPost);
route.post('/cadastro/responsavelsalvo', cadastroController.trataPost);
route.post('/cadastro/horarioestudantesalvo', cadastroController.trataPost);
route.post('/cadastro/registrosalvo', cadastroController.trataPost);
route.post('/cadastro/ocorrenciasalvo', cadastroController.trataPost);

//Rotas do administrador
//Login do Administrador
route.get('/administracao/login', administracaoController.login);
//Horários de todos os alunos cadastrados
route.post('/administracao/paginainicial', administracaoController.paginaAdm);
// Configuração de armazenamento de imagens
route.post('/administracao/horarios', administracaoController.horarios);
route.post('/administracao/requisicoes', administracaoController.requisicoes);
route.post('/administracao/responsavel', administracaoController.responsavel);
route.post('/administracao/editar', administracaoController.editar);
storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/img/crachas/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];
        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');
        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});
upload = multer({ storage });
route.post('/administracao/saidaEstudante', upload.single('avatar'), administracaoController.editarSaidaEstudante);
route.post('/administracao/editadoEstudante', administracaoController.trataEditado);
route.post('/administracao/editadoSaida', administracaoController.trataEditado);
route.post('/administracao/deleteAdvertencia', administracaoController.trataEditado);

module.exports = route;
