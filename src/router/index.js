import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import ListarAssociados from '@/components/ListarAssociados'
import ListarUsuarios from '@/components/ListarUsuarios'
import ListarPagamentos from '@/components/ListarPagamentos'
import CriarUsuario from '@/components/CriarUsuario'
import CriarAssociado from '@/components/CriarAssociado'
import ResetSenha from '@/components/ResetSenha'
import Login from '@/components/Login'

// import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/listar_associados',
      name: 'ListarAssociados',
      component: ListarAssociados
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/listar_usuarios',
      name: 'ListarUsuarios',
      component: ListarUsuarios
    },
    {
      path: '/listar_pagamentos',
      name: 'ListarPagamentos',
      component: ListarPagamentos
    },
    {
      path: '/criar_usuario',
      name: 'CriarUsuario',
      component: CriarUsuario
    },
    {
      path: '/criar_associado',
      name: 'CriarAssociado',
      component: CriarAssociado
    },
    {
      path: '/reset_senha',
      name: 'ResetSenha',
      component: ResetSenha
    },
  ]
})
