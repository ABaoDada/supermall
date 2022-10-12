import { request } from "./request";
export function getDetail (iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
export function getRecommend () {
  return request({
    url: '/recommend'
  })
}

//商品信息
export class Goods {
  // 原生JS里面 prototype原型对象里面有个属性叫constructor指向实例对象，所以老师这么用了
  constructor(itemInfo, columns, services) {
    //从数据里找出我们想要的
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.columns = columns;
    this.services = services;
    this.nowPrice = itemInfo.highNowPrice;
  }
}

//商家信息
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

//参数信息
export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}

