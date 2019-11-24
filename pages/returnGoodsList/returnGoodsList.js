// pages/returnGoodsList/returnGoodsList.js
var action='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {}
  },

  //申请售后
  afterSalesTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.no; 
    var shopCartFlag = e.currentTarget.dataset.shopcartflag;
    var goodsinfo = e.currentTarget.dataset.goodsinfo;

    var orderInfo = {};
    orderInfo.orderId = orderId;
    orderInfo.orderNo = orderNo;
    orderInfo.shopCartFlag = shopCartFlag;
    orderInfo.goodsinfo = goodsinfo;
    wx.setStorage({
      key: 'rtn_goods_info',
      data: JSON.stringify(orderInfo)
    })

    wx.navigateTo({
      url: '/pages/returnGoods/returnGoods'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    action = options.action;
    var that = this;
    wx.getStorage({
      key: 'rtn_goods_list',
      success(res) {
        var orderInfo = JSON.parse(res.data);
        that.setData({
          orderInfo: orderInfo
        });
        //清除缓存
        wx.removeStorage({
          key: 'rtn_goods_list',
          success(res) { }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})