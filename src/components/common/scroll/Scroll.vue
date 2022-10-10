
<!-- 使用这个组件要先设置高度 -->

<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
//插件
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      scroll: null
    }
  },
  mounted () {

    //1.创建scroll实例

    //默认不能实时监听滚动的位置
    //probeType: 侦测e
    //0：不侦测

    //1：当 probeType 为 1 的时候，会非实时（每隔 momentumLimitTime 毫秒）派发scroll 事件；
    //2：手指滚动过程中检测；手指离开后因为惯性的滚动不检测
    //3：手指离开后因为惯性的滚动检测，只要滚动都侦测
    //document.querySelector('.wrapper')没有this.$refs.wrapper好
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      click: true, //允许监听除了按钮之外的点击事件，按钮自带
      pullUpLoad: true,   // 在一次上拉加载动作完成后，可以回调相应函数来获取后台数据
      //即进行网络请求获取下一页的数据
    })



    //监听滚动位置
    this.scroll.on('scroll', (position) => {
      // console.log(position); //位置
      this.$emit('scroll', position)
    })
    //监听上拉加载更多pulingUp
    this.scroll.on('pullingUp', () => {
      console.log("上拉加载更多")
    })

  },
  methods: {
    // time = 300:默认值(没有传时)  
    scrollTo (x, y, time = 300) {
      this.scroll.scrollTo(x, y, time)
    }
  }
}
</script>

<style>

</style>