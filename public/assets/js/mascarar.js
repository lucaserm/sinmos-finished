function formataCPF(cpf){
  const elementoAlvo = cpf
  const cpfAtual = cpf.value

  let cpfAtualizado;

  cpfAtualizado = cpfAtual.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
    function( regex, arg1, arg2, arg3, arg4 ) {
      return arg1 + '.' + arg2 + '.' + arg3 + '-' + arg4;
  })
  elementoAlvo.value = cpfAtualizado;
}

function formataTelefone(tel){
  const elementoAlvo = tel
  const telAtual = tel.value

  let telAtualizado;

  telAtualizado = telAtual.replace(/(\d{2})(\d{5})(\d{4})/,
    function( regex, arg1, arg2, arg3 ) {
      return '(' + arg1 + ')' + arg2 + '-' + arg3 ;
  })
  elementoAlvo.value = telAtualizado;
}