const Estudante = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel');
const Registro = require('../models/RegistrosModel');
const Advertencia = require('../models/AdvertenciasModel');

//página de login
exports.login = (req, res) => {
    res.render('administrador');
};

//gerenciando todos os users 
exports.paginaAdm = async(req, res) => {
    //variável para manipulação de páginas
    const user = req.body.user;
    //Super User
    if(req.body.user == 'root' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('teste', { estudantes, user } );
    }
    //Coordenação
    else if (req.body.user == 'coordenacao' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('estudantes', { estudantes, user } );
      //Portaria
    } else if (req.body.user == 'portaria' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('portaria', { estudantes, user });
    }
    else{
        //caso o usuário e/ou a senha estejam errados vai para a página inicial
        res.render('index');
    }
};

//página para editar dados do estudante
exports.editar = async(req, res) => {
    const estudantes = await Estudante.buscaPorRA(req.body);
    const user = req.body.user;
    res.render('editar', { estudantes, user });
}

//página para liberar o estudante
exports.editarSaidaEstudante = async(req, res) => {
    const estudantes = await Estudante.liberacaoPorRA(req.body);
    const id = req.body.id;
    const user = req.body.user;
    res.render('editarSaidaEstudante', { estudantes, id, user });
}

exports.trataEditado = async(req, res) => {
    if(req.url == '/administracao/editadoEstudante'){
        Estudante.update(req.body);
    }else if(req.url == '/administracao/editadoSaida'){
        Registro.update(req.body);
    }
    const id = req.body.id;
    const user = req.body.user; 
    res.render('salvoEditado', { req, id, user })
}

//busca responsável e advertências de um estudante específico
exports.responsavel = async(req, res) => {
    const user = req.body.user;
    const responsaveis = await Responsavel.buscaResponsavelPorRA(req.body);
    const advertencias = await Advertencia.buscaAdvertenciaPorRA(req.body);
    res.render('responsavel', { responsaveis, advertencias, user });
}

//pega os horários do estudante
exports.horarios = async(req, res) => {
    // se ambos os campos estiverem vazios, horarios recebe nulo
    const horarios = req.body.ra == '' && typeof req.file == 'undefined' ? {} :
        //se só o ra não está vazio, busca por ra
        req.body.ra != '' ? await Estudante.buscaHorariosPorRA(req.body, 'null') :
        //se está vazio, busca pela imagem
        {};
        // await Estudante.buscaHorariosPorRA('null', req.file.filename);
    const user = req.body.user;
    console.log(req.file);
    res.render('horarios', { horarios, user });
}

//todas as requisições de todos os estudantes
exports.requisicoes = async(req, res) => {
    const registros = await Registro.buscaRegistros();
    const user = req.body.user;
    res.render('requisicoes', { registros, user });
}
