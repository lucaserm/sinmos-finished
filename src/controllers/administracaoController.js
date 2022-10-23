const Estudante = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel');
const Registro = require('../models/RegistrosModel');
const Advertencia = require('../models/AdvertenciasModel');
const Usuarios = require('../models/UsuariosModel');

//página de login
exports.login = (req, res) => {
    res.render('login');
};

//gerenciando todos os users 
exports.paginaAdm = async(req, res) => {
    //variável para manipulação de páginas
    const users = await Usuarios.buscaUsuarios();
    //Super User
    let user = 'root'; 
    let senha = '123456'
    const estudantes = await Estudante.buscaEstudantes();
    if(req.body.codigo_servidor == 'root' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('coordenacao', { estudantes, user, senha } );
    }
    if(users.length > 0){
        users.forEach( usuario => {
            //Coordenação
            if (req.body.codigo_servidor == usuario.codigo_servidor && req.body.senha == usuario.senha){
                let user = usuario.codigo_servidor;
                let senha = usuario.senha;
                if(usuario.cargo == 'Coordenacao'){
                    res.render('coordenacao', { estudantes, user, senha } );
                } else if(usuario.cargo == 'Portaria'){
                    res.render('portaria', { estudantes, user, senha });
                } else if(usuario.cargo == 'Assistencia'){
                    res.render('assistencia', { estudantes, user, senha });
                }
            }
        });
    }
    res.render('login')
};

//página para editar dados do estudante
exports.editar = async(req, res) => {
    const estudantes = await Estudante.buscaPorRA(req.body);
    const user = req.body.user;
    const senha = req.body.senha;
    res.render('editar', { estudantes, user, senha });
}

//página para liberar o estudante
exports.editarSaidaEstudante = async(req, res) => {
    
    const { lerQR } = require('./../middlewares/middleware');

    const estudantes =
    // se cpf não está vazio, pesquisa pelo cpf 
    req.body.cpf != '' ? await Estudante.liberacao(req.body, 'null') :
    // se ra não está vazio, pesquisa pelo ra 
    req.body.ra != '' ? await Estudante.liberacao(req.body, 'null') :
    // se nome não está vazio, pesquisa pelo nome 
    req.body.nome != '' ? await Estudante.liberacao(req.body, 'null') :
    //se a imagem não está vazia
    typeof req.file != 'undefined' ? await Estudante.liberacao('null', await lerQR(req.file.filename)) : {};
    const id = req.body.id;
    const user = req.body.user;
    const senha = req.body.senha;
    res.render('saidaEstudante', { estudantes, id, user, senha });
}

exports.trataEditado = async(req, res) => {
    const id = req.body.id;
    const user = req.body.user;
    const senha = req.body.senha; 
    if(req.url == '/administracao/editadoEstudante'){
        Estudante.update(req.body);
        return res.render('salvo', { req, id, user, senha })
    }else if(req.url == '/administracao/editadoSaida'){
        Registro.update(req.body);
    }else if(req.url == '/administracao/deleteAdvertencia'){
        Advertencia.deletePorRA(req.body);
        const id = req.body.id;
        const user = req.body.user;
        const senha = req.body.senha; 
        return res.render('delete', { req, id, user, senha })
    }
    res.render('salvoEditado', { req, id, user, senha })
}


//busca responsável e advertências de um estudante específico
exports.responsavel = async(req, res) => {
    const user = req.body.user;
    const senha = req.body.senha;

    const responsaveis = await Responsavel.buscaResponsavelPorRA(req.body);
    const advertencias = await Advertencia.buscaAdvertenciaPorRA(req.body);
    res.render('responsavel', { responsaveis, advertencias, user, senha });
}

//pega os horários do estudante
exports.horarios = async(req, res) => {
    const horarios = 
        // se cpf não está vazio, pesquisa pelo cpf 
        req.body.cpf != '' ? await Estudante.buscaHorarios(req.body, 'null') :
        // se ra não está vazio, pesquisa pelo ra 
        req.body.ra != '' ? await Estudante.buscaHorarios(req.body, 'null') :
        // se nome não está vazio, pesquisa pelo nome 
        req.body.nome != '' ? await Estudante.buscaHorarios(req.body, 'null') :
        //se a imagem não está vazia
        //typeof req.file == 'undefined' ? await Estudante.buscaHorariosPorRA('null', req.file.filename) : {};
        {};
    const user = req.body.user;
    const senha = req.body.senha;
    
    res.render('horarios', { horarios, user, senha });
}

//todas as requisições de todos os estudantes
exports.requisicoes = async(req, res) => {
    const registros = await Registro.buscaRegistros();
    const user = req.body.user;
    const senha = req.body.senha;
    res.render('requisicoes', { registros, user, senha });
}
