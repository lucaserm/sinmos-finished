const Curso = require('../models/CursosModel');
const Disciplina = require('../models/DisciplinasModel');
const Estudante = require('../models/EstudantesModel');
const Matricula = require('../models/MatriculasModel');
const Horario = require('../models/HorariosModel');
const Responsavel = require('../models/ResponsaveisModel');
const HorarioEstudante = require('../models/HorariosEstudantesModel');
const Registro = require('../models/RegistrosModel');

exports.cadastros = (req, res) => {
    const user = req.body.user;
    res.render('cadastros', { user });
};

exports.cadastroCurso = (req, res) => {
    const user = req.body.user;
    res.render('cadastro_curso', { user });
};
exports.cadastroMatricula = async(req, res) => {
    const user = req.body.user;
    const cursos = await Curso.buscarCursos();
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_matricula', { cursos, estudantes, user });
}
exports.cadastroDisciplina = async(req, res) => {
    const user = req.body.user;
    const cursos = await Curso.buscarCursos();
    res.render('cadastro_disciplina', { cursos,user });
};
exports.cadastroHorario = async(req, res) => {
    const user = req.body.user;
    const disciplinas = await Disciplina.buscarDisciplinas();
    res.render('cadastro_horario', { disciplinas, user });
};
exports.cadastroEstudante = async(req, res) => {
    const user = req.body.user;
    const cursos = await Curso.buscarCursos();
    const responsaveis = await Responsavel.buscaResponsaveis();
    res.render('cadastro_estudante', { cursos, responsaveis, user });
};
exports.cadastroResponsavel = (req, res) => {
    const user = req.body.user;
    res.render('cadastro_responsavel', { user });
};
exports.cadastroHorarioEstudante = async(req,res) => {
    const user = req.body.user;
    const estudantes = await Estudante.buscaEstudantes();
    const horarios = await Horario.buscaHorarios();
    res.render('cadastro_horariosestudantes', { estudantes, horarios, user });
}
exports.cadastroRegistro = async(req, res) => {
    const user = req.body.user;
    const estudantes = await Estudante.buscaEstudantes();
    res.render('cadastro_registros', { estudantes, user });
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
    const user = req.body.user;
    const id = req.body.id;
    res.render('salvo', {req, id, user});
    return;
};
