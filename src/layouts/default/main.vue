<template lang="pug">
  v-app.my-default-layout
    app-sidebar
    app-bar
    v-content(style="padding-top: 48px;")
      transition(name="slide" mode="out-in")
      router-view
    app-footer
    app-dialog
</template>

<script>
import AppBar from '@/components/app-bar'
import AppSidebar from '@/components/app-sidebar'
import AppDialog from '@/components/app-dialog'
import AppFooter from '@/components/app-footer'

export default {
  name: 'DefaultLayout',

  components: { AppBar, AppSidebar, AppDialog, AppFooter },

  methods: {

  }
}
</script>

<style lang="stylus">
</style>
