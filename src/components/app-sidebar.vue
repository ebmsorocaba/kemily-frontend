<template lang="pug">
  v-navigation-drawer.my-sidebar(
    v-model="isActive"
    app
    touchless
    dark
  )
    v-layout(justify-center wrap)
      img.my-sidebar__backdrop(src='~/@/assets/images/ebm_290.png' id='ebm')
    
    v-divider
    v-list(dark)
      v-list-group(prepend-icon='person')
        v-list-tile(slot="activator" ripple)
          v-list-tile-content
            v-list-tile-title {{ $store.state.auth.user.name }}
        v-list-tile(ripple :to="{ name: 'contaUsuario' }")
          v-list-tile-action
            v-icon account_box
          v-list-tile-content
            v-list-tile-title Minha Conta
    v-divider

    v-list(dark)
      v-list-tile(ripple :to="{ name: 'listarUsuarios' }")
        v-list-tile-action
          v-icon verified_user
        v-list-tile-content
          v-list-tile-title Gerenciar Usuários

      

      v-list-tile(ripple :to="{ name: 'listarAssociados' }")
        v-list-tile-action
          v-icon people
        v-list-tile-content
          v-list-tile-title Gerenciar Associados

      v-list-tile(ripple :to="{ name: 'listarPagamentos' }")
        v-list-tile-action
          v-icon attach_money
        v-list-tile-content
          v-list-tile-title Gerenciar Pagamentos

      v-list-tile(ripple :to="{ name: 'relatorioPagamentos' }")
        v-list-tile-action
          v-icon bar_chart
        v-list-tile-content
          v-list-tile-title Relatório de Pagamentos 

      v-divider
      v-list-tile(@click="logout()" ripple)
        v-list-tile-action
          v-icon exit_to_app
        v-list-tile-content
          v-list-tile-title Log Out
      v-divider
</template>

<script>
import auth from '@/auth/helpers'

export default {
  name: 'AppSidebar',

  computed: {
    isActive: {
      get () {
        return this.$store.state.common.sidebar.visible
      },
      set (val) {
        this.$store.dispatch('common/updateSidebar', { visible: val })
      }
    }
  },

  methods: {
    logout () {
      auth.logout()
    }
  }
}
</script>

<style lang="stylus">
  .my-sidebar
    z-index: 8

  #ebm {
      padding-top: 20px
      padding-bottom: 20px
      height: 200px
      border-radius: 100%;
  }

</style>
