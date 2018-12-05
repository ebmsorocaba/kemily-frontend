import ezFetch from 'ez-fetch'

const API = 'http://18.231.117.28:8080/api';
//const API = 'http://localhost:8080/';

const ASSOCIADOS = '/associados'
const ASSOCIADO = '/associado'
const USUARIOS = '/usuarios'
const PAGAMENTOS = '/pagamentos'
const RELATORIO = '/relatoriopagamentos'

export default {
  getAssociados() {
    return ezFetch.get(`${API}/${ASSOCIADOS}`);
  },
  getAssociadoById(cpf) {
    return ezFetch.get(`${API}/${ASSOCIADO}/${cpf}`)
  },
  getUsuarios() {
    return ezFetch.get(`${API}/${USUARIOS}`)
  },
  getPagamentos() {
    return ezFetch.get(`${API}/${PAGAMENTOS}`)
  },
  getRelatorio(dataInicio, dataFim) {
    return ezFetch.get(`${API}/${RELATORIO}/?dataInicio=${dataInicio}&dataFim=${dataFim}`)
  }

}
