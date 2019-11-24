// pages/me/me.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,//微信用户信息
    balance:0.00,
    goodsCollectCount:0,//商品收藏数量
    shopCollectCount: 0,//商铺收藏数量
    footprintCount:0,//足迹
    orderTypeList: [{
        id: 'wait_pay',
        position:1,
        name: '待付款',
        icon: '/images/orderTypeIcon/wait_pay.png'
      },
      {
        id: 'wait_issue',
        position: 2,
        name: '待发货',
        icon: '/images/orderTypeIcon/wait_issue.png'
      },
      {
        id: 'wait_sign',
        position: 3,
        name: '待收货',
        icon: '/images/orderTypeIcon/wait_sign.png'
      },
      {
        id: 'wait_eva',
        position: 4,
        name: '待评价',
        icon: '/images/orderTypeIcon/wait_eva.png'
      },
      {
        id: 'picture_order',
        position: 5,
        name: '拍照单',
        icon: '/images/orderTypeIcon/picture_order.png'
      }
      // ,
      // {
      //   id: '006',
      //   position: 6,
      //   name: '退款/售后',
      //   icon: '/images/orderTypeIcon/after_sales.png'
      // }
    ],
    orderTip:{},
    addressDef: {},
    //基本信息
    baseInfoList:[
      { id: 'zgrWeChat', name: '用户中心', icon: app.globalData.url +'/zhuangXJ/images/me/individual_icon.png' },
      { id: 'distribution', name: '我的团队', icon: app.globalData.url +'/zhuangXJ/images/me/Distribution_icon.png' },
      { id: 'commission', name: '我的佣金', icon: app.globalData.url +'/zhuangXJ/images/me/post_icon.png' },
      { id: 'myWallet', name: '我的明细', icon: app.globalData.url +'/zhuangXJ/images/me/wallet_icon.png' }
    ],
    //增值服务
    valAddSerList:[
      { id: 'wykd', name: '我要开店', icon: app.globalData.url +'/zhuangXJ/images/me/wykd.png' },
      { id: 'league', name: '我做工匠', icon: app.globalData.url +'/zhuangXJ/images/me/wzgj_icon.png' },
      { id: 'shopCar', name: '购物车', icon: app.globalData.url +'/zhuangXJ/images/me/shopping_icon.png' },
      { id: 'addressMag', name: '收货地址', icon: app.globalData.url +'/zhuangXJ/images/me/address_icon.png' },
      { id: 'chatSer', name: '客服中心', icon: app.globalData.url +'/zhuangXJ/images/me/bbs_icon1.png' },
      { id: 'helpCenter', name: '常见问题', icon: app.globalData.url +'/zhuangXJ/images/me/help_icon.png' },
      { id: 'suggest', name: '投诉建议', icon: app.globalData.url + '/zhuangXJ/images/me/toushu_icon.png' },
      { id: 'collect', name: '我的收藏', icon: app.globalData.url + '/zhuangXJ/images/me/collect_icon.png' },
      { id: 'myProject', name: '我的工地', icon: app.globalData.url +'/zhuangXJ/images/me/project_icon.png' },
      { id: 'calendar', name: '黄历', icon: app.globalData.url +'/zhuangXJ/images/me/calendar_icon.png'},
      { id: 'jsq', name: '计算器', icon: app.globalData.url +'/zhuangXJ/images/me/jsq.png' },
      { id: 'coupon', name: '优惠券', icon: app.globalData.url +'/zhuangXJ/images/me/coupon_icon.png' },
      { id: 'present', name: '礼品', icon: app.globalData.url +'/zhuangXJ/images/me/present_icon.png' },
      { id: 'shop', name: '店铺', icon: app.globalData.url +'/zhuangXJ/images/me/shop_icon.png' },
      { id: 'zxnote', name: '装修日记', icon: app.globalData.url +'/zhuangXJ/images/me/zxnote2_icon.png' },
      { id: 'credit', name: '装修信贷', icon: app.globalData.url +'/zhuangXJ/images/me/credit_icon.png' }
    ]

  },

  /**去登录 */
  loginTap:function(e){
    var userInfo = this.data.userInfo;
    if (userInfo == null || userInfo == ''){
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone'
      })
    }
  },

  /**充值/提现 */
  withdrawTopUpTap:function(e){
    if (!this.checkLogin()) return;
    var balance = this.data.balance;
    wx.navigateTo({
      url: '/pages/balance/balance?balance=' + balance
    })
  },



  /**验证码登录状态 */
  checkLogin:function(){
    var resule = true;
    if (this.data.userInfo == null || this.data.userInfo == ''){
      resule=false;
      wx.showModal({
        title: '尚未登录',
        content: '请先登录在操作',
        showCancel: false,
        success: res => { }
      })
    }
    return resule;
  },

  /**
   * 跳转到设置中心页面
   */
  setUpTap:function(e){
    if (!this.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/setUp/setUp'
    })
  },

  //跳转到我的收藏列表
  goMyCollectList:function(e){
    var action = e.currentTarget.dataset.action;
    if (!this.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/myCollect/myCollect?action=' + action
    })
  },

  goTrack(){
    wx.navigateTo({
      url: '/pages/search/search?tab=0&action=0'
    })
  },

  /**查看全部订单 */
  selOrderAllTap: function (e) {
    if (!this.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?currentType=0'
    })
  },

  /**点击订单状态入口 */
  orderTypeTab: function (e) {
    if (!this.checkLogin()) return;
    var id = e.currentTarget.dataset.id;
    var currentType = e.currentTarget.dataset.current;
    if (id =='picture_order'){
      //拍照单
      wx.navigateTo({
        url: '/pages/pictureOrderList/pictureOrderList'
      });
    }else{
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?currentType=' + currentType
      })
    }
  },

  /**绑定账号 */
  bindAccountTap: function (e) {
    wx.navigateTo({
      url: '/pages/bindAccount/bindAccount?action=0'
    })
  },

  /**基本信息 */
  baseInfoTap: function (e) {
    if (!this.checkLogin()) return;
    var type = e.currentTarget.dataset.action
    wx.navigateTo({
      url: '/pages/userServe/userServe?type=' + type
    })
  },

  /**增值服务 */
  valAddSerTap: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id =='wykd'){
      //我要开店
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/myShop/myShop' 
      })
    }
    else if (id == 'league'){
      //我做工匠
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/myWorker/myWorker'
      })
    }
    else if (id == 'shopCar') {
      //购物车
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/shopCar2/shopCar2'
      })
    }
    else if (id == 'addressMag') {
      //收货地址
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/addressMg/addressMg?action=0'
      })
    }
    // else if (id == 'myProject') {
    //   //我的工地
    //   if (!this.checkLogin()) return;
    //   wx.navigateTo({
    //     url: '/pages/project/project'
    //   })
    // }
    else if (id == 'chatSer') {
      //客户服务
      // if (!this.checkLogin()) return;
      // var param = 'orderId=&otherPayId=' + app.customerService.id + '&otherPayName=' + app.customerService.name + '&otherPayAva=' + app.customerService.avatar
      // wx.navigateTo({
      //   url: '/pages/chat/chat?' + param
      // })
    }
    else if (id == 'helpCenter') {
      //帮助中心
      wx.navigateTo({
        url: '/pages/help/help'
      })
    }
    else if (id == 'suggest') {
      //投诉建议
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/suggest/suggest'
      })
    }
    else if (id == 'collect') {
      //我的收藏
      if (!this.checkLogin()) return;
      wx.navigateTo({
        url: '/pages/myCollect/myCollect?action=0'
      })
    }
    else if (id == 'myProject') {
      //我的工地
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'calendar') {
      //黄历
      wx.showToast({title: '功能内测期，敬请期待！',icon: 'none',duration: 2000})
    }
    else if (id == 'jsq') {
      //计算器
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'coupon') {
      //优惠券
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'present') {
      //礼品
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'shop') {
      //店铺
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'zxnote') {
      //装修日记
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }
    else if (id == 'credit') {
      //装修信贷
      wx.showToast({ title: '功能内测期，敬请期待！', icon: 'none', duration: 2000 })
    }


  },

  //获取收藏数量
  getCollectCount:function(){
    var that=this;
    var param = 'CLIENT_ID=' + app.globalData.userId;
    app.httpsGetDatByPlatform('getFavCount', 'map', param,
      function (res) {
        //成功
        that.setData({
          goodsCollectCount: res.msg.FAV_SHOP_ITEM_TOTAL,//商品收藏数量
          shopCollectCount: res.msg.FAV_SHOP_TOTAL,//商铺收藏数量
        });
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
      });

  },

  /**获取订单数量 */
  getOrderNumHttps:function(){
    if (app.globalData.userId == null || app.globalData.userId == '') return;
    var that = this;
    // wx.showLoading()
    var param = 'clientId=' + app.globalData.userId + '&openId=' + app.globalData.openId + '&from=2' ;
    app.httpsDataGet('/order/getMyOrderInfo', param,
      function (res) {
        //成功
        var data = res.data;
        var tipObj = {};
        tipObj.wait_pay = Number(data.DAIZHIFU) >= 99 ? '99...' : data.DAIZHIFU;
        tipObj.wait_issue = Number(data.DAIFAHUO) >= 99 ? '99...' : data.DAIFAHUO;
        tipObj.wait_sign = Number(data.DAISHOUHUO) >= 99 ? '99...' : data.DAISHOUHUO;
        tipObj.wait_eva = Number(data.YISHOUHUO) >= 99 ? '99...' : data.YISHOUHUO;
        tipObj.picture_order = Number(data.PAIZHAO) >= 99 ? '99...' : data.PAIZHAO;
        that.setData({
          orderTip: tipObj
        });
      },
      function (returnFrom, res) {
        //失败
      }
    );
  },



  refreshData: function () {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    });
    //获取余额
    app.getAccountBalance(function (res) {
      that.setData({
        balance: res
      });
    });
    //获取默认地址
    // app.getUserDefAddress(function (ret) {
    //   if (ret == null) return;
    //   var addressInfoTemp = {};
    //   addressInfoTemp.id = ret.CLIENT_ADDRESS_ID;
    //   addressInfoTemp.userName = ret.CLIENT_NAME;
    //   addressInfoTemp.phone = ret.CLIENT_PHONE;
    //   addressInfoTemp.address = ret.CLIENT_ADDRESS;
    //   addressInfoTemp.cityName = ret.CLIENT_CITY;
    //   addressInfoTemp.postcode = ret.CLIENT_MAILBOX;
    //   that.setData({
    //     addressDef: addressInfoTemp
    //   });
    // });
    this.getCollectCount();
    this.getOrderNumHttps();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo==''){
      app.wxLogin().then(function (res) {
        that.refreshData();
      })
    } else{
      that.refreshData();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})