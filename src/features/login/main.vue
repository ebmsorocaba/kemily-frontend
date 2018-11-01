<template lang="pug">
  v-container.my-login(fluid fill-height)
    v-toolbar(
      color="light-green"
      flat
      dark
      fixed
      app
      dense
    )
    v-layout(justify-center align-center)
      v-flex.text-xs-center(xs12 lg6)
        v-layout(row wrap)
          v-flex(xs12)
            v-card.my-login__card
              v-card-title.my-login__card-title(primary-title)
                v-avatar(:size="250")
                  img(src='~/@/assets/images/ebm_290.png' alt='Logo')

              v-card-text
                v-form
                  v-text-field(
                    label='Usuário'
                    v-model='credentials.usuario'
                    required
                  )
                  v-text-field(
                    label='Senha'
                    hint='At least 8 characters'
                    v-model='credentials.senha'
                    min='8'
                    :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                    :append-icon-cb='() => (passwordHidden = !passwordHidden)'
                    :type="passwordHidden ? 'password' : 'text'"
                    counter=''
                  )

              v-card-actions.my-login__card-actions
                v-btn(
                  :loading="loading"
                  @click="login()"
                  block
                  color='light-green'
                  dark
                ) Entrar
</template>

<script>
import auth from '@/auth/helpers'


export default {
  name: 'LoginPage',

  data () {
    return {
      passwordHidden: true,
      credentials: {
        usuario: 'teste',
        senha: 'teste'
      },
      error: '',
      loading: false
    }
  },

  methods: {
    login () {
      this.loading = true

      const credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }

      //auth.login(credentials, 'home', ({isSuccess, data, errorMessage}) => {
      auth.fakeLogin(credentials, 'home')
        .then((data) => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .my-login
    background-color: $app-primary
    background-image: url(https://images.pexels.com/photos/240040/pexels-photo-240040.jpeg); //retirado de https://www.pexels.com/photo/bright-daylight-environment-forest-240040/
    background-size: cover;                                                                  //Imagem com direito de uso livre 

    &__logo
      max-width: 46px
      padding-left: 12px
      padding-top: 4px

    &__logo-name

      img
        max-width: 150px
        width: 100%

    &__subheading
      color: white
      padding-top: 10px
      padding-bottom: 20px

    &__card
      max-width: 300px
      margin: 0 auto

    &__card-title
      justify-content: center

    &__card-actions
      justify-content: center

</style>
