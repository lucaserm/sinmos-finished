// Obtém o horário atual
const agora = new Date();
const horaAtual = agora.getHours();
const minutoAtual = agora.getMinutes();

// Define uma função para verificar se um horário está em breve
function isEmBreve(hora, minuto) {
    const diferencaMinutos = (hora * 60 + minuto) - (horaAtual * 60 + minutoAtual);
    return diferencaMinutos >= 0 && diferencaMinutos <= 15; // Considerando "em breve" como até 15 minutos no futuro
}

isEmBreve(20, 20)
