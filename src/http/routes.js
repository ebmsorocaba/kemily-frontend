/**
 * Every route becomes a chunk, loaded only when used.
 * Reduces size of initial App load.
 */
const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/features/login/main.vue'),
    title: 'Login',
    layout: 'PublicLayout',
    isPublic: true
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/features/home/main.vue'),
    title: 'Pagina Inicial',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/listar_associados',
    name: 'listarAssociados',
    component: () => import(/* webpackChunkName: "listarAssociados" */ '@/features/listarAssociados/main.vue'),
    title: 'Gerenciar Associados',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/listar_usuarios',
    name: 'listarUsuarios',
    component: () => import(/* webpackChunkName: "listarUsuarios" */ '@/features/listarUsuarios/main.vue'),
    title: 'Gerenciar Usuários',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/listar_pagamentos',
    name: 'listarPagamentos',
    component: () => import(/* webpackChunkName: "listarPagamentos" */ '@/features/listarPagamentos/main.vue'),
    title: 'Gerenciar Pagamentos',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/criar_usuario',
    name: 'criarUsuario',
    component: () => import(/* webpackChunkName: "criarUsuário" */ '@/features/criarUsuario/main.vue'),
    title: 'Adicionar novo Usuário',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/criar_associado',
    name: 'criarAssociado',
    component: () => import(/* webpackChunkName: "criarAssociado" */ '@/features/criarAssociado/main.vue'),
    title: 'Adicionar novo Associado',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/reset_senha',
    name: 'resetSenha',
    component: () => import(/* webpackChunkName: "resetSenha" */ '@/features/resetSenha/main.vue'),
    title: 'Redefinir Senha',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/relatorio_pagamento',
    name: 'relatorioPagamentos',
    component: () => import(/* webpackChunkName: "relatorioPagamentos" */ '@/features/relatorioPagamentos/main.vue'),
    title: 'Relatório de Pagamentos',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    path: '/minha_conta',
    name: 'contaUsuario',
    component: () => import(/* webpackChunkName: "contaUsuario" */ '@/features/contaUsuario/main.vue'),
    title: 'Minha Conta',
    layout: 'DefaultLayout',
    isPublic: false
  }
]

export default routes
