<template>
	<div id="home">
		<nav-bar class="home-nav">
			<div slot="center">购物街</div>
		</nav-bar>
		<tab-control
			:titles="['流行', '新款', '精选']"
			@tabClick="tabClick"
			ref="tabControl1"
			class="tab-control"
			v-show="isTabFixed"
		>
		</tab-control>
		<!-- 滚动 -->
		<scroll
			class="content"
			ref="scroll"
			:probe-type="3"
			@scroll="contentScroll"
			:pull-up-load="true"
			@pullingUp="loadMore"
		>
			<home-swiper
				:banners="banners"
				@swiperImageLoad="swiperImageLoad"
			></home-swiper>
			<recommend-view :recommend="recommends"></recommend-view>
			<feature-view></feature-view>
			<tab-control
				:titles="['流行', '新款', '精选']"
				@tabClick="tabClick"
				ref="tabControl2"
				v-show="!isTabFixed"
			>
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
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
//公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

//导入
import { getHomeMultidata, getHomeGoods } from "network/home";
//防抖
import { debounce } from "../../common/utils";

export default {
	name: "Home",
	data () {
		return {
			banners: [],
			recommends: [],
			goods: {
				pop: { page: 0, list: [] },
				new: { page: 0, list: [] },
				sell: { page: 0, list: [] },
			},
			currentType: "pop",
			isShowBackTop: false,
			//吸顶
			tabOffsetTop: 0,
			isTabFixed: false,
			//保存页面scrollY
			saveY: 0,
		};
	},
	computed: {
		showGoods () {
			return this.goods[this.currentType].list;
		},
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
		this.getHomeMultidata();
		//2.请求商品数据
		this.getHomeGoods("pop");
		this.getHomeGoods("new");
		this.getHomeGoods("sell");
	},
	mounted () {
		//3.监听GoodsListItem的加载事件

		//①先防抖
		const refresh = debounce(this.$refs.scroll.refresh, 200);
		//图片加载事件监听
		this.$bus.$on("itemImageLoad", () => {
			// this.$refs.scroll && this.$refs.scroll.refresh();
			refresh();
		});
	},

	//4.切换页面时，保存页面原来的位置
	//App.vue中加<keep-alive>,才能使用activated，deactivated
	activated () {
		// (X坐标，Y坐标，时间)
		this.$refs.scroll.scrollTo(0, this.saveY, 0)
		this.$refs.scroll.refresh();
	},
	deactivated () {
		this.saveY = this.$refs.scroll.getScrollY()
	},

	// destroyed () {
	// 	console.log("home销毁");
	// },
	methods: {
		/* 事件监听相关方法 */

		//监听点击['流行','新款','精选']"
		tabClick (index) {
			switch (index) {
				case 0:
					this.currentType = "pop";
					break;
				case 1:
					this.currentType = "new";
					break;
				case 2:
					this.currentType = "sell";
					break;
			}
			this.$refs.tabControl1.currentIndex = index
			this.$refs.tabControl2.currentIndex = index
			// this.currentType = Object.keys(this.goods)[index]
		},

		backClick () {
			//  this.$refs.scroll : scroll组件对象
			//  this.$refs.scroll.scroll  :  scroll组件对象data里的的scroll
			//scrollTo(x, y,移动时间（毫秒）) 自定义方法在Scroll.vue
			this.$refs.scroll.scrollTo(0, 0);
		},

		contentScroll (position) {
			// console.log(position);
			//1.判断返回顶部是否显示
			// position.y <= -1000 ? this.isShowBackTop = true : this.isShowBackTop = false
			this.isShowBackTop = position.y <= -1000;

			//2.决定tabControl是否吸顶（position:fixed）
			// position.y <= -(this.tabOffsetTop) ? this.isTabFixed = true : this.isTabFixed = false
			this.isTabFixed = position.y <= -this.tabOffsetTop;
		},

		//加载更多
		loadMore () {
			// console.log("加载更多");
			this.getHomeGoods(this.currentType);
			this.$refs.scroll.scroll.refresh();
		},
		//2.获取tabControl的offsetTop
		//所有的组件都有一个属性$el：用于获取组件中的元素
		swiperImageLoad () {
			this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
		},
		/* 
			网络请求相关方法
		*/
		getHomeMultidata () {
			getHomeMultidata().then((res) => {
				console.log(res);
				this.banners = res.data.banner.list;
				this.recommends = res.data.recommend.list;
				//this:  箭头函数的this指向外层的作用域
				//       而created的this指向当前组件实例，即Home实例
			});
		},
		getHomeGoods (type) {
			const page = this.goods[type].page + 1;
			getHomeGoods(type, page).then((res) => {
				console.log(res);

				//解构：将数组里的数据依次拿出来，放到新数组里面
				//   ... 表示将原来的数组变成字符串，即[a,b,c] 将括号去掉；变成a,b,c;再push进新数组
				//不然就变成[[a,b,c]],将数组[a,b,c]整体push
				this.goods[type].list.push(...res.data.list);
				//改变goods里的page
				this.goods[type].page += 1;

				//  this.$refs.scroll :  scroll组件对象
				// this.$refs.scroll.scroll 代表scroll组件对象中data的scroll(sceoll.vue里的data)
				// this.$refs.scroll.scroll.finishPullUp()  //
				//完成上拉加载动作
				//完成后才嫩进行下一次加载更多
				this.$refs.scroll.finishPullUp(); //sceoll.vue里的finishPullUp() 方法
			});
		},
	},
};
</script>

<style scoped>
#home {
	height: 100vh;
	/* padding-top: 44px; */
}

.home-nav {
	background-color: var(--color-tint);
	color: #fff;
	position: relative;
	/* position: fixed;
	left: 0;
	top: 0;
	right: 0;*/
	z-index: 9;
}

/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

.tab-control {
	position: relative;
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
