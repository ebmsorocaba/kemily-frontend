import axios from 'axios'

export default axios.create({
  baseURL: 'http://18.231.117.28:8080/api',
  headers: {
    'Content-type': 'application/json'
  }
})
