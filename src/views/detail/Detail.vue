<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad=" imageLoad"></detail-goods-info>
      <detail-param-info :param-info="parmInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar"
import DetailSwiper from "./childComps/DetailSwiper"
import DetailBaseInfo from "./childComps/DetailBaseInfo"
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'


import Scroll from "components/common/scroll/Scroll"
import GoodsList from "components/content/goods/GoodsList"
import BackTop from 'components/content/backTop/BackTop'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "network/detail"

import { itemListenerMixin } from "../../common/mixin"
//防抖
import { debounce } from "../../common/utils";
//常量
import { BACKTOP_DISTANCE } from "../../common/const"


export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
  },
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      parmInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
    }
  },
  mixins: [itemListenerMixin],
  created () {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);

      const data = res.result
      //1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      //2.创建商品信息对象-获取商品信息  =>detail.js
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)


      //3.创建商家信息对象-获取商家信息
      this.shop = new Shop(data.shopInfo)

      //4.保存商品详情数据
      this.detailInfo = data.detailInfo

      //5.获取参数信息
      this.parmInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }


      //1.第一次获取，值不对，
      //原因：this.$refs.params.$el压根没有渲染
      // this.themeTopYs = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs);

      // this.$nextTick(() => {
      //2.第二次获取，值不对
      //原因：图片没有计算在内
      //根据最新的数据，对应的DOM是已经被渲染出来
      //但是图片依然没有加载完（即获取到的offsetTop不包含图片）
      // this.themeTopYs = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs);
      // })

    })


    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    //4.给getThenmeTopY赋值(对给this.getThemeTopY的赋值操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs);
    }, 500)


  },
  mounted () {

  },
  deactivated () {
    //2.取消全局事件的监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },


  methods: {
    imageLoad () {
      // this.$refs.scroll.refresh()
      const refresh = debounce(this.$refs.scroll.refresh, 200);
      refresh();
      this.getThemeTopY()
    },
    titleClick (index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)

    },
    contentScroll (position) {
      const positionY = -position.y
      //  2.positionY和主题中的值对比
      //[ 0 , 7938 , 9120 , 9452, 非常大的值]
      //positionY在 0 和 7938 之间 index = 0
      //positionY在 =7938 和 9120 之间 index = 1
      //positionY在 =9120 和 9452 之间 index = 2
      //positionY在 >=9452 之间 index = 3

      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        //this.currentIndex != i  用来判断当前位置是否还在原来的区间，避免重复打印
        if (this.currentIndex != i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
        //   // if (this.currentIndex != i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i == length - 1 && positionY >= this.themeTopYs[i]))) {
        //   //   this.currentIndex = i
        //   //   this.$refs.nav.currentIndex = this.currentIndex
        //   // }
      }
      // for (let i = length; i > 0; i--) {
      //   if (positionY >= this.themeTopYs[i]) {
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = this.currentIndex
      //     break
      //   }
      // }

      //3.是否显示回到顶部

      this.isShowBackTop = -position.y > BACKTOP_DISTANCE
    },

    backTop () {
      //  this.$refs.scroll : scroll组件对象
      //  this.$refs.scroll.scroll  :  scroll组件对象data里的的scroll
      //scrollTo(x, y,移动时间（毫秒）) 自定义方法在Scroll.vue
      this.$refs.scroll.scrollTo(0, 0);
    },

    //监听购物车点击
    addToCart () {
      // console.log("uhbabxua");
      //1.获取购物车中需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.lowNowPrice
      product.iid = this.iid

      //2.将商品添加到购物车里
    }

  }
}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  /* background-color: #fff; */
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
  overflow: hidden;
}
</style>