import ezFetch from 'ez-fetch'

// onst associados_API = 'http://localhost:8080/api/associados'
// const usuarios_API = 'http://localhost:8080/api/usuarios'
// const pagamentos_API = 'http://localhost:8080/api/pagamentos'

const associados_API = 'http://18.231.117.28:8080/api/associados'
const ASSOCIADO_API = 'http://18.231.117.28:8080/api/associado'
const usuarios_API = 'http://18.231.117.28:8080/api/usuarios'
const pagamentos_API = 'http://18.231.117.28:8080/api/pagamentos'

export default {
  getAssociados() {
    return ezFetch.get(associados_API)
  },
  getAssociadoById(cpf) {
    return ezFetch.get(`${ASSOCIADO_API}/${cpf}`)
  },
  getUsuarios() {
    return ezFetch.get(usuarios_API)
  },
  getPagamentos() {
    return ezFetch.get(pagamentos_API)
  }

}
