import { POP, NEW, SELL } from "./const";
import { debounce } from "./utils";


export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null,

    }
  },
  mounted () {
    //3.监听GoodsListItem的加载事件

    //①先防抖
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    //图片加载事件监听
    //保存监听事件
    this.itemImgListener = () => {
      // this.$refs.scroll && this.$refs.scroll.refresh();
      refresh();
    }
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    console.log("混入");
  },

}



export const backTopMixin = {
  data: function () {
    return {
      showBackTop: false
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      // console.log(this.currentType);
    }
  }
}
