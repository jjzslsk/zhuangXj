// pages/balance/balance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:'0.00'
  },

  /**充值 */
  topUpTap: function (e) {
    var balance = this.data.balance;
    wx.navigateTo({
      url: '/pages/withdrawTopUp/withdrawTopUp?action=0&balance=' + balance
    })
  },

  /**提现 */
  withdrawTap:function(e){
    var balance = this.data.balance;
    wx.navigateTo({
      url: '/pages/withdrawTopUp/withdrawTopUp?action=1&balance=' + balance
    })
  },

  refreshData:function(){
    var that = this;
    //获取余额
    wx.showLoading();
    app.getAccountBalance(function (res) {
      wx.hideLoading();
      that.setData({
        balance: res
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var balance = options.balance;
    // this.setData({
    //   balance: balance 
    // });
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
    var that = this;
    if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == '') {
      app.wxLogin().then(function (res) {
        that.refreshData();
      })
    } else {
      that.refreshData();
    }
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