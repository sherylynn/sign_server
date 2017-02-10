var API = {
  //host: 'http://mh.kenx.cn:3000',
  //host:'http://10.0.2.2:3000',//苹果的地址不一定相同,不能使用10.0.2.2:3000
  //host:'http://192.168.0.249:3000',
  host:'http://192.168.0.249:3000',
  login: '/user/login',
  loginByToken: '/user/login/token',
  getUser: '/user/get',
  getkankanList:'/kankan/getList',
  getkankan:'kankan/get',
  createUser: '/user/create',
  getMessage: '/message/get',
  addMessage: '/message/add',
  getMakeup: '/makeup/get',
  addMakeup: '/makeup/add',
  updatePassword: '/user/password/update',
  deleteUser: '/user/delete',
  db: '/db/users'
};
export {
  API
}