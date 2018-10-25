<template>
    <el-form :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="Usuário">
            <el-input v-model="user.user" placeholder="Digite o seu usuário"></el-input>
        </el-form-item>
        <el-form-item label="Senha">
            <el-input v-model="user.password" placeholder="Digite a sua senha"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">Login</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
  export default {
    data() {
      return {
        user: {
          user: 'admin',
          password: 'password'
        }
      }
    },
    methods: {
      handleSubmit: function (e) {

            // Auth
            this.$auth.login({
                headers:{'Content-Type': 'application/json'},
                data: {username: this.user.user, password: this.user.password},
                success: function () {
                    this.$notify({
                        title: 'Seja bem-vindo ' + this.user.user,
                        message: 'Login efetuado com sucesso!',
                        type: 'success'
                    })
                },
                error: function () {
                    this.$notify.error({
                        title: 'Erro',
                        message: 'Usuário ou senha incorretos!'
                    })
                },
                rememberMe: true,
                redirect: '/signup'
            })
                return false;
        }
    }
  }
</script>