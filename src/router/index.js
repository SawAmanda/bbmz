import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Home from '@/components/home/Home'
import ApplyTask from '@/components/ApplyTask/index'
import ShareArea from '@/components/ShareArea/ShareArea'
import Dynamictocenter from '@/components/Dynamictocenter/index'
import Centertoregister from '@/components/Centertoregister/index'
import Centertotrade from '@/components/Centertotrade/index'
import Tradetocenter from '@/components/Tradetocenter/index'
import Buypoint from '@/components/Buypoint/index'
import Sailpoint from '@/components/Sailpoint/index'
import Teaminfo from '@/components/Teaminfo/index'
import Sailtable from '@/components/Sailtable/index'
import Buytable from '@/components/Buytable/index'
import Servicecenter from '@/components/Servicecenter/index'
import Numbermangement from '@/components/Numbermangement/index'
import Upgrademembership from '@/components/Upgrademembership/index'
import Registernumber from '@/components/Registernumber/index'
import Centerpoint from '@/components/Centerpoint/index'
import Dynamicpoint from '@/components/Dynamicpoint/index'
import Taskpoint from '@/components/Taskpoint/index'
import Tradepoint from '@/components/Tradepoint/index'
import Safetycenter from '@/components/Safetycenter/index'
import Noticedetail from '@/components/common/noticedetail'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/index/home',
          name: 'home',
          component: Home
        },
        {
          path: '/index/applyTask',
          name: 'applyTask',
          component: ApplyTask
        },
        {
          path: '/index/shareArea',
          name: 'shareArea',
          component: ShareArea
        },
        {
          path: '/index/dynamictocenter',
          name: 'dynamictocenter',
          component: Dynamictocenter
        },
        {
          path: '/index/centertoregister',
          name: 'centertoregister',
          component: Centertoregister
        },
        {
          path: '/index/centertotrade',
          name: 'centertotrade',
          component: Centertotrade
        },
        {
          path: '/index/tradetocenter',
          name: 'tradetocenter',
          component: Tradetocenter
        },
        {
          path: '/index/buypoint',
          name: 'buypoint',
          component: Buypoint
        },
        {
          path: '/index/sailpoint',
          name: 'sailpoint',
          component: Sailpoint
        },
        {
          path: '/index/teaminfo',
          name: 'teaminfo',
          component: Teaminfo
        },
        {
          path: '/index/sailtable',
          name: 'sailtable',
          component: Sailtable
        },
        {
          path: '/index/buytable',
          name: 'buytable',
          component: Buytable
        },
        {
          path: '/index/servicecenter',
          name: 'servicecenter',
          component: Servicecenter
        },
        {
          path: '/index/numbermangement',
          name: 'numbermangement',
          component: Numbermangement
        },
        {
          path: '/index/upgrademembership',
          name: 'upgrademembership',
          component: Upgrademembership
        },
        {
          path: '/index/registernumber',
          name: 'registernumber',
          component: Registernumber
        },
        {
          path: '/index/centerpoint',
          name: 'centerpoint',
          component: Centerpoint
        },
        {
          path: '/index/dynamicpoint',
          name: 'dynamicpoint',
          component: Dynamicpoint
        },
        {
          path: '/index/taskpoint',
          name: 'taskpoint',
          component: Taskpoint
        },
        {
          path: '/index/tradepoint',
          name: 'tradepoint',
          component: Tradepoint
        },
        {
          path: '/index/safetycenter',
          name: 'safetycenter',
          component: Safetycenter
        },
        {
          path: '/index/noticedetail/:id',
          name: 'Noticedetail',
          component: Noticedetail
        } 
      ]
    }
  ]
})
