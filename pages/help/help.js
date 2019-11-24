// pages/question/question.js
const app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: ''
  },

  httpsData: function() {
    var that = this;
    var param = 'classNo=Article_shop_question';
    wx.showLoading();
    app.httpsDataGet('/worker/getHelp', param,
      function(res) {
        wx.hideLoading();
        var dataList = res.data;
        if (dataList.length>0){
          that.setData({
            title: dataList[0].ARTICLE_TITLE
          });
          WxParse.wxParse('article', 'html', dataList[0].ARTICLE_NOTES, that, 5);
        }
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.httpsData();
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