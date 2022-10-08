<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <!-- <div :class="{active:isActive}"> -->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
    <!-- <img src="../../assets/img/tabbar/home.svg" alt="">
    <div>首页</div> -->
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },

  computed: {
    isActive () {
      //this.$route.path:当前活跃路由的path;
      //this.path: 所有路由的path,数组
      //用indexOf对两者进行比较,  indexOf(找到一样的字符串)
      //当两者不匹配时则返回-1, 则判断不成立返回false
      //当两者匹配时则返回当前索引0, 0不等于-1,返回true
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle () {
      //解释:首先判断是否处于活跃(this.isActive);若处于活跃,则样式,color:通过父传子,得到App.vue添加的样式;
      //否则返回空  
      return this.isActive ? { color: this.activeColor } : {}
    }
  },
  methods: {
    itemClick () {
      this.$router.push(this.path)
    }
  }
}
</script>

<style>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  margin-top: 3px;
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-bottom: 1px;
}

.active {
  color: blueviolet;
}
</style>