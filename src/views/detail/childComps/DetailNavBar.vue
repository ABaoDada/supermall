<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles" :key="index" :class="{active:index==currentIndex}"
          @click="titleClick(index)" class="title-item">
          <span>{{item}}</span>
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'


export default {
  name: 'DetailNavBar',
  components: {
    NavBar
  },
  data () {
    return {
      titles: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0,
    }
  },
  methods: {
    titleClick (index) {
      this.currentIndex = index;
    },
    backClick () {
      // this.$router.go(-1)
      this.$router.back()

    }
  }
}
</script>

<style scoped>
.back img {
  width: 45%;
  padding-left: 15px;
  vertical-align: middle;
}

.title {
  display: flex;
  font-size: 13px;
}

.title-item {
  flex: 1;
}

.active {
  color: var(--color-high-text);
  /* border-bottom: 2px solid var(--color-tint); */
}
</style>