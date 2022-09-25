const Estudante = require('../models/EstudantesModel');
const Responsavel = require('../models/ResponsaveisModel');
const Registro = require('../models/RegistrosModel');
const Advertencia = require('../models/AdvertenciasModel');

exports.login = (req, res) => {
    res.render('administrador');
};

exports.paginaAdm = async(req, res) => {
    //Super ADM
    if(req.body.nome_acesso == 'root' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('estudantes', { estudantes } );
    }
    //Coordenação
    else if (req.body.nome_acesso == 'coordenacao' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('estudantes', { estudantes } );
      //Portaria
    } else if (req.body.nome_acesso == 'portaria' && req.body.senha == '123456'){
        const estudantes = await Estudante.buscaEstudantes();
        res.render('portaria', { estudantes });
    }
    else{
        res.render('index');
    }
};

exports.editar = async(req, res) => {
    const estudantes = await Estudante.buscaPorRA(req.body);
    res.render('editar', { estudantes });
}

exports.editarSaidaEstudante = async(req, res) => {
    const estudantes = await Estudante.liberacaoPorRA(req.body);
    const id = req.body.id;
    res.render('editarSaidaEstudante', { estudantes, id });
}

exports.trataEditado = async(req, res) => {
    if(req.url == '/administracao/editadoEstudante'){
        Estudante.update(req.body);
    }else if(req.url == '/administracao/editadoSaida'){
        Registro.update(req.body);
    }
    const id = req.body.id;
    res.render('salvo', {req, id})
}

exports.responsavel = async(req, res) => {
    const responsaveis = await Responsavel.buscaResponsavelPorRA(req.body);
    const advertencias = await Advertencia.buscaAdvertenciaPorRA(req.body);
    res.render('responsavel', { responsaveis, advertencias });
}

exports.horarios = async(req, res) => {
    const horarios = await Estudante.buscaHorariosPorRA(req.body);
    res.render('horarios', { horarios })
}

exports.requisicoes = async(req, res) => {
    const registros = await Registro.buscaRegistros();
    res.render('requisicoes', { registros });
}
