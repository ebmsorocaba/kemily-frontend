import ezFetch from 'ez-fetch'

const associados_API = 'http://52.67.175.164:8080/api/associados'
const usuarios_API = 'http://52.67.175.164:8080/api/usuarios'
const pagamentos_API = 'http://52.67.175.164:8080/api/pagamentos'

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
