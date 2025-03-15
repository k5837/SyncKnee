import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'

Vue.use(Vuex)
// 初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
 username: window.sessionStorage.getItem('username'),
 token: window.sessionStorage.getItem('token')
}
const mutations = {
 //将token保存到sessionStorage里，token表示登陆状态
 SET_TOKEN: (state, data) => {
 state.token = data
 window.sessionStorage.setItem('token', data) 
 },
 //获取用户名
 GET_USERNAME: (state, data) => {
 // 把用户名存起来
 state.username = data
 window.sessionStorage.setItem('username', data)
 },
 //登出
 LOGOUT: (state) => {
 // 登出的时候要清除token
 state.token = null
 state.username = null
//  window.sessionStorage.removeItem('token')
 window.sessionStorage.removeItem('username')
 }
}

const actions = {
}
export default new Vuex.Store({
 state,
 mutations,
 actions,
 modules: {
    tab
  }
})