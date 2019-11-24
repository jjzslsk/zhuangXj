// pages/checkLogistics/checkLogistics.js
var utilMd5 = require('../../utils/md5.js');
// var jsonData = require('../../data/logistics.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verticalCurrent :0,
    logisticsNameOrderNum:'',//快递名称和物流单号
    logisticsInfo: {}
  },

  /**
   * 查询物流信息
   * com 物流公司编号
   * num 物流单号
   */
  httpsData: function (com, num) {
    var that = this;
    var param = "{\"com\":\"" + com + "\",\"num\":\"" + num+"\"}";
    var customer = app.globalData.realTimeCustomer;
    var key = app.globalData.realTimeKey;
    var md5Str = utilMd5(param + key + customer);
    var sign = md5Str.toUpperCase();
    var paramStr = "customer=" + customer + "&sign=" + sign + "&param=" + param;
    wx.showLoading();
    wx.request({
      url: app.globalData.wlUrl + '?' + paramStr,
      method: 'post',
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      success: res => {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var obj = res.data;
          if (obj.message = 'ok') {
            that.setData({
                logisticsInfo: obj
              });
          } else {
            wx.showModal({
              title: '提示',
              content: obj.message,
              showCancel: false,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败(' + res.statusCode + ')',
            showCancel: false,
          })
        }
      },
      fail: res => {
        //请求接口失败
        wx.hideLoading()
        wx.showModal({
          title: '请求失败',
          content: res.errMsg,
          showCancel: false,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var com = options.com == undefined || options.com == 'undefined' ? '' : options.com;
    var num = options.num == undefined || options.num == 'undefined' ? '' : options.num;
    var comName = options.comName == undefined || options.comName == 'undefined' ? '' : options.comName;
    this.setData({
      logisticsNameOrderNum: comName + ':' + num
    })
    this.httpsData(com, num);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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