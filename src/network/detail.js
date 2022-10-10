import { request } from "./request";
export function getDetail (iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
export class GoodsInfo {
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