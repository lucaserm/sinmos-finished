const Estudantes = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel')

exports.login = (req, res) => {
    res.render('administrador');
};

exports.paginaAdm = async(req, res) => {
    //Super ADM
    if(req.body.nome_acesso == 'root' && req.body.senha == '123456'){
        const estudantes = await Estudantes.buscaEstudantes();
        res.render('estudantes', { estudantes } );
    }
    //Coordenação
    else if (req.body.nome_acesso == 'coordenacao' && req.body.senha == '123456'){
        const estudantes = await Estudantes.buscaEstudantes();
        res.render('estudantes', { estudantes } );
    } else if (req.body.nome_acesso == 'portaria' && req.body.senha == '123456'){
        const estudantes = await Estudantes.buscaEstudantes();
        res.render('portaria', { estudantes });
    }
    else{
        res.render('index');
    }
};

exports.editar = async(req, res) => {
    const estudantes = await Estudantes.buscaPorRA(req.body);
    res.render('editar', { estudantes });
}

exports.editarSaidaEstudante = async(req, res) => {
    const estudantes = await Estudantes.buscaPorRA(req.body);
    res.render('editarSaidaEstudante', { estudantes });
}

exports.trataEditado = async(req, res) => {
    if(req.url == '/administracao/editadoEstudante'){
        Estudantes.update(req.body);
    }else if(req.url == '/administracao/editadoSaida'){
        Estudantes.salvarSaida(req.body);
    }
    res.render('salvo')
}

exports.responsavel = async(req, res) => {
    const responsaveis = await Responsavel.buscaResponsavelPorID(req.body);
    res.render('responsavel', { responsaveis });
}

exports.horarios = async(req, res) => {
    const horarios = await Estudantes.buscaHorariosPorRA(req.body);
    res.render('horarios', { horarios })
}