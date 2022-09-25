const Curso = require('../models/CursosModel');
const Disciplina = require('../models/DisciplinasModel');
const Estudante = require('../models/EstudantesModel');
const Matricula = require('../models/MatriculasModel');
const Horario = require('../models/HorariosModel');
const Responsavel = require('../models/ResponsaveisModel');
const HorarioEstudante = require('../models/HorariosEstudantesModel');
const Registro = require('../models/RegistrosModel');

exports.cadastros = (req, res) => {
    res.render('cadastros');
};

exports.cadastroCurso = (req, res) => {
    res.render('cadastro_curso');
};
exports.cadastroMatricula = async(req, res) => {
    const cursos = await Curso.buscarCursos();
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_matricula', { cursos, estudantes });
}
exports.cadastroDisciplina = async(req, res) => {
    const cursos = await Curso.buscarCursos();
    res.render('cadastro_disciplina', { cursos });
};
exports.cadastroHorario = async(req, res) => {
    const disciplinas = await Disciplina.buscarDisciplinas();
    res.render('cadastro_horario', { disciplinas });
};
exports.cadastroEstudante = async(req, res) => {
    const cursos = await Curso.buscarCursos();
    const responsaveis = await Responsavel.buscaResponsaveis();
    res.render('cadastro_estudante', { cursos, responsaveis });
};
exports.cadastroResponsavel = (req, res) => {
    res.render('cadastro_responsavel');
};
exports.cadastroHorarioEstudante = async(req,res) => {
    const estudantes = await Estudante.buscaEstudantes();
    const horarios = await Horario.buscaHorarios();
    res.render('cadastro_horariosestudantes', { estudantes, horarios });
}
exports.cadastroRegistro = async(req, res) => {
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_registros', { estudantes });
}


exports.trataPost = async(req, res) => {
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
        Registro.save(req.body);
    }
    const id = req.body.id;
    res.render('salvo', {req, id});
    return;
};
