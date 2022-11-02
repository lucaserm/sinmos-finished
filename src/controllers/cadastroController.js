const Curso = require('../models/CursosModel');
const Disciplina = require('../models/DisciplinasModel');
const Estudante = require('../models/EstudantesModel');
const Matricula = require('../models/MatriculasModel');
const Horario = require('../models/HorariosModel');
const Responsavel = require('../models/ResponsaveisModel');
const HorarioEstudante = require('../models/HorariosEstudantesModel');
const Registro = require('../models/RegistrosModel');
const Usuario = require('../models/UsuariosModel');
const Ocorrencia = require('../models/OcorrenciasModel')
const OcorrenciaEstudante = require('../models/OcorrenciasEstudantes');
const Advertencia = require('../models/AdvertenciasModel');
const RegistroEstudante = require('../models/RegistrosEstudantes');

exports.cadastros = async (req, res) => {
    const users = await Usuario.buscaPorCodigo(req.body.codigo_servidor);
    let codigo_servidor = users[0].codigo_servidor;
    let senha = users[0].senha;
    //Super User
    if(req.body.codigo_servidor == 'root'){
        let codigo_servidor = 'root'; 
        let senha = '123456'
        res.render('cadastros', { codigo_servidor, senha } );
    }
    if(users[0].cargo == 'Coordenacao'){
        res.render('cadastros', { codigo_servidor, senha } );
    } else if(users[0].cargo == 'Portaria'){
        res.render('portaria', { codigo_servidor, senha });
    } else if(users[0].cargo == 'Assistencia'){
        res.render('assistencia', { codigo_servidor, senha });
    }
};

exports.cadastroCurso = (req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    res.render('cadastro_curso', { codigo_servidor, senha });
};
exports.cadastroMatricula = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const cursos = await Curso.buscarCursos();
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_matricula', { cursos, estudantes, codigo_servidor, senha });
}
exports.cadastroDisciplina = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const cursos = await Curso.buscarCursos();
    res.render('cadastro_disciplina', { cursos, codigo_servidor, senha });
};
exports.cadastroHorario = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const disciplinas = await Disciplina.buscarDisciplinasNaoRegistradas();
    const horarios = await Horario.buscaHorarios();
    res.render('cadastro_horario', { disciplinas, horarios, codigo_servidor, senha });
};
exports.cadastroEstudante = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const cursos = await Curso.buscarCursos();
    const responsaveis = await Responsavel.buscaResponsaveis();
    res.render('cadastro_estudante', { cursos, responsaveis, codigo_servidor, senha });
};
exports.cadastroResponsavel = (req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    res.render('cadastro_responsavel', { codigo_servidor, senha });
};
exports.cadastroHorarioEstudante = async(req,res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const estudantes = await Estudante.buscaEstudantes();
    const horarios = await Horario.buscaHorariosDiscipinas();
    res.render('cadastro_horariosestudantes', { estudantes, horarios, codigo_servidor, senha });
}
exports.cadastroRegistro = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_registro', { estudantes, codigo_servidor, senha });
}
exports.cadastroUsuario = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    res.render('cadastro_usuario', { codigo_servidor, senha });
}
exports.cadastroOcorrencia = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    res.render('cadastro_ocorrencia', { codigo_servidor, senha });
}
exports.cadastroOcorrenciaEstudante = async(req, res) => {
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    const estudantes = await Estudante.buscaEstudantes();
    const ocorrencias = await Ocorrencia.buscarOcorrencias();
    const id = req.body.id;
    console.log(req.body.senha)
    res.render('cadastro_ocorrenciasestudantes', { estudantes, ocorrencias, codigo_servidor, senha, id });
}

exports.trataPost = async(req, res) => {
    let id = typeof req.body.id == 'undefined' ? 0 : req.body.id;
    if(req.url == '/cadastro/cursosalvo'){
        Curso.save(req.body);
    }else if(req.url == '/cadastro/disciplinasalvo'){
        Disciplina.save(req.body);
    }else if(req.url == '/cadastro/horariosalvo'){
        Horario.save(req.body);
    }else if(req.url == '/cadastro/matriculasalvo'){
        Matricula.save(req.body);
    }else if(req.url == '/cadastro/estudantesalvo'){
        Estudante.save(req.body, req.file.filename);
    }else if(req.url == '/cadastro/responsavelsalvo'){
        Responsavel.save(req.body);
    }else if(req.url == '/cadastro/horarioestudantesalvo'){
        HorarioEstudante.save(req.body);
    }else if(req.url == '/cadastro/registrosalvo'){
        RegistroEstudante.save(req.body, await Registro.save(req.body));
    }else if(req.url == '/cadastro/usuariosalvo'){
        Usuario.save(req.body);
    }else if(req.url == '/cadastro/ocorrenciasalvo'){
        Ocorrencia.save(req.body);
    }else if(req.url == '/cadastro/ocorrenciaestudantesalvo'){
        if(req.body.senha_ == req.body.senha){
            OcorrenciaEstudante.save(req.body);
        }else{
            id = 1;
        }
    }else if(req.url == '/cadastro/advertenciasalvo'){
        if(typeof req.body.descricao_advertencia != 'undefined'){
            OcorrenciaEstudante.updateAprovado(req.body);
            Advertencia.save(req.body);
        }else{
            id = 0;
            OcorrenciaEstudante.updateReprovado(req.body);
            res.render('salvo', { id, codigo_servidor, senha });
        }
    }
    const codigo_servidor = req.body.codigo_servidor;
    const senha = req.body.senha;
    res.render('salvo', {id, codigo_servidor, senha});
    return;
};
