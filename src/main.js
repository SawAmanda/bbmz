// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './store/index'


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http = axios
// axios.defaults.baseURL="/api"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data() {
    return {
      host: window.location.origin
    }
  },
  methods: {
    getMe(token) {
      this.$http({
        method: "get",
        url: "/member/member/getMe",
        params: {
          token: token
        }
      }).then(res=>{
        let data = res.data.data
        var userMessage = {
          reg:  data.ust_reg,
          tran: data.ust_tran,
          task: data.ust_task,
          cen:  data.ust_cen,
          dyn:  data.ust_dyn,
          level:  data.level_name,
          username: data.user_name,
          user_level: data.user_level,
          user_id: data.user_id
        }
        /**
         * userMessage 用户信息获取
         * reg ust_reg 注册积分
         * tran ust_tran 交易积分
         * task ust_task 任务积分
         * cen ust_cen 中心积分
         * dyn ust_dyn 动态积分
         * level user_level VIP等级
         * 存入localstorage中供其他页面使用
        */
        window.localStorage.setItem("ust",JSON.stringify(userMessage))
      })
    }
  }
})
