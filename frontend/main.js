import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';

function mascara(i, t){
  let v = i.value;
  if(t == "cpf"){
    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";
 }
}