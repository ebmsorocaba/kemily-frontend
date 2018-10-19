import ezFetch from 'ez-fetch'

const associados_API = 'http://localhost:8080/api/associados'
const usuarios_API = 'http://localhost:8080/api/usuario'
const pagamentos_API = 'http://localhost:8080/api/pagamento'

export default{
  getAssociados () {
    return ezFetch.get(associados_API)
  },
  getUsuarios () {
    return ezFetch.get(usuarios_API)
  },
  getPagamentos () {
    return ezFetch.get(pagamentos_API)
  }

}
