import axios from 'axios'

export default axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: 'http://18.231.117.28:8080/api',
  headers: {
    'Content-type': 'application/json'
  }
})
