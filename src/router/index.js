import Vue from "vue";
import VueRouter from "vue-router";

//1.安装插件
Vue.use(VueRouter)

//懒加载
const Home = () => import('views/home/Home')
const Category = () => import('views/category/Category')
const Cart = () => import('views/cart/Cart')
const Profile = () => import('views/profile/Profile')
const Detail = () => import('views/detail/Detail')

const routes = [
  //默认路径
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: 'Home',
    }
  },
  {
    path: '/cart',
    component: Cart,
    meta: {
      title: 'Cart',
    }
  },
  {
    path: '/category',
    component: Category,
    meta: {
      title: 'Category',
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/detail/:iid',
    component: Detail,
    meta: {
      title: 'Detail'
    }
  },
]

//2.创建路由
const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router