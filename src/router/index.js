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
      path: '/login',
      component: Login,
      meta: {auth: false}
    },
    {
      path: '/listar_associados',
      name: 'ListarAssociados',
      component: ListarAssociados,
      meta: {auth: true}
    },
    {
      path: '/listar_usuarios',
      name: 'ListarUsuarios',
      component: ListarUsuarios,
      meta: {auth: true}
    },
    {
      path: '/listar_pagamentos',
      name: 'ListarPagamentos',
      component: ListarPagamentos,
      meta: {auth: true}
    },
    {
      path: '/criar_usuario',
      name: 'CriarUsuario',
      component: CriarUsuario,
      meta: {auth: true}
    },
    {
      path: '/criar_associado',
      name: 'CriarAssociado',
      component: CriarAssociado,
      meta: {auth: true}
    },
    {
      path: '/reset_senha',
      name: 'ResetSenha',
      component: ResetSenha,
      meta: {auth: true}
    }
  ]
})
