<template>
  <v-app id="kemily">
    <v-navigation-drawer 
      class="green lighten-1"
      dark
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
      
        <v-list-group
        prepend-icon="account_circle"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Usuários</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="{name: 'CriarUsuario'}" >
          <v-list-tile-content>
            <v-list-tile-title>Novo</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile :to="{name: 'ListarUsuarios'}" >
          <v-list-tile-content>
            <v-list-tile-title>Gerenciar</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>build</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile :to="{name: 'ResetSenha'}" >
          <v-list-tile-content>
            <v-list-tile-title>Reset de Senha</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>vpn_key</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        </v-list-group>

        <v-list-group
        prepend-icon="supervised_user_circle"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Associados</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="{name: 'CriarAssociado'}" >
          <v-list-tile-content>
            <v-list-tile-title>Novo</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile :to="{name: 'ListarAssociados'}" >
          <v-list-tile-content>
            <v-list-tile-title>Gerenciar</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>build</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        </v-list-group>
      <!-- Começo AFONSO -->
        <v-list-group
        prepend-icon="supervised_user_circle"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Pagamentos</v-list-tile-title>
        </v-list-tile>

          <v-list-tile :to="{name: 'ListarPagamentos'}" >
          <v-list-tile-content>
            <v-list-tile-title>Gerenciar</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>build</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        </v-list-group>
      <!-- Termino AFONSO -->  

      </v-list>
    </v-navigation-drawer>
    
    <v-toolbar app fixed clipped-left dark="">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Kemily</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>

          <router-view></router-view>

        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed dark="" >
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
  })
};
</script>
  props: {
    source: String
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: fff;
  margin-top: 60px;
}
</style>
