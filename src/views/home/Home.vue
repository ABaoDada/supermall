<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- 滚动 -->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommend="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick">
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 返回顶部 -->
    <!-- .native:让组件也能监听事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView';
//公共组件
import NavBar from 'components/common/navbar/NavBar';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
import Scroll from 'components/common/scroll/Scroll';
import BackTop from 'components/content/backTop/BackTop';


//导入
import { getHomeMultidata, getHomeGoods } from 'network/home'


export default {
  name: 'Home',
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',
      isShowBackTop: false,
    }
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  created () {

    //1.请求多个数据
    //异步操作
    //调用methods里的方法；记得加this
    this.getHomeMultidata()
    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  methods: {
    /* 事件监听相关方法 */

    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;

      }
      // this.currentType = Object.keys(this.goods)[index]
    },

    backClick () {
      //  this.$refs.scroll : scroll组件对象
      //  this.$refs.scroll.scroll  :  scroll组件对象data里的的scroll
      //scrollTo(x, y,移动时间（毫秒）) 自定义方法在Scroll.vue
      this.$refs.scroll.scrollTo(0, 0)

    },

    contentScroll (position) {
      // console.log(position);
      position.y <= -1000 ? this.isShowBackTop = true : this.isShowBackTop = false
    },

    /* 
      网络请求相关方法
    */
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        console.log(res);
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
        //this:  箭头函数的this指向外层的作用域
        //       而created的this指向当前组件实例，即Home实例
      });
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        console.log(res);

        //解构：将数组里的数据依次拿出来，放到新数组里面
        //   ... 表示将原来的数组变成字符串，即[a,b,c] 将括号去掉；变成a,b,c;再push进新数组
        //不然就变成[[a,b,c]],将数组[a,b,c]整体push
        this.goods[type].list.push(...res.data.list)
        //改变goods里的page
        this.goods[type].page += 1
      })
    },


  }
}
</script>

<style scoped>
#home {
  height: 100vh;
  /* padding-top: 44px; */
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9
}

.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/* .content {
  height: calc(100% - 49px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>