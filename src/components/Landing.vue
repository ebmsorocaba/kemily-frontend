<template>
  <div class="landing">
    <v-btn :to="{name: 'ListarAssociados'}" color="info">Gerenciar Associados</v-btn>
    <v-btn :to="{name: 'ListarUsuarios'}" color="info">Gerenciar Usuarios</v-btn>
  </div>
</template>

<script>
export default {
  name: 'landing',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
