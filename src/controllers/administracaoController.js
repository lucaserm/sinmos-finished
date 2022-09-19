const Estudantes = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel')

exports.login = (req, res) => {
    res.render('administrador');
};

exports.paginaAdm = async(req, res) => {
    if(req.body.nome_acesso !== 'root' && req.body.senha !== '123456'){
        res.render('index');
    }else{
        const estudantes = await Estudantes.buscaEstudantes();
        res.render('estudantes', { estudantes } );
    }
};

exports.editar = async(req, res) => {
    const estudantes = await Estudantes.buscaPorRA(req.body);
    res.render('editar', { estudantes });
}

exports.editado = async(req, res) => {
    Estudantes.update(req.body);
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