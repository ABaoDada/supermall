import axios from 'axios';

export function request (config) {
  //1.创建实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 5000
  })

  //2.axios拦截器 use():两个参数（以函数），一个成功，一个失败
  //2-1：//请求拦截：拿到的是config
  instance.interceptors.request.use(config => {
    // console.log(config);
    //拦截器作用：
    //1.比如config中的一些信息不符合服务器的要求

    //2.比如每次发送网络请求时，都希望界面显示一个请求的图标

    //3.比如某些网络请求（比如登录(token)）必须携带一些特殊的信息


    //拦截完后要放行
    return config   //再将config拦截下来后，应该要用return还回去
  }, err => {
    // console.log(err);
  });

  //2-2响应拦截:拿到的是result（结果）
  instance.interceptors.response.use(res => {
    // console.log(res);
    //拦截完要返还
    return res.data   //返回数据
  }, err => {
    // console.log(err);
  });


  //3.发送真正的网络请求
  //axios(config)本身就是一个Promise因此直接返回
  return instance(config)
}

