<template>
  <div class="goods-item" @click="itemClick">
    <!-- <a :href="goodsItem.link"> -->
    <img :src="showImage" alt="" @load="imageLoad" />

    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">¥{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
    <!-- </a> -->
  </div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    showImage () {
      return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imageLoad () {
      //发射到消息总线（让父组件的父组件也能获得给自定义方法）
      // if (this.$route.path.indexOf('/home') === 0) {
      //   this.$bus.$emit('homeitemImageLoad');
      // } else if (this.$route.path.indexOf('/detail') === 0) {
      //   this.$bus.$emit('detailitemImageLoad');
      // }
      this.$bus.$emit('itemImageLoad');

    },
    itemClick () {
      this.$router.push('/detail/' + this.goodsItem.iid)
    }
  }
}
</script>

<style scoped>
.goods-item {
  position: relative;
  padding-bottom: 40px;
  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>