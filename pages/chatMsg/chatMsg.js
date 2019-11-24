// pages/chatMsg/chatMsg.js
const app = getApp();
const { $Message } = require('../../dist/base/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgDataList:[]
  },

  /**item点击事件 */
  msgItemTap:function(e){
    var position = e.currentTarget.dataset.position;
    var obj = e.currentTarget.dataset.obj;
    var unreadCount = "msgDataList[" + position + "].otherPayInfo.unreadCount";
    //修改选择状态
    this.setData({
      [unreadCount]: 0
    });
    var orderId = obj.orderId == undefined ? '' : obj.orderId;
    var otherPayId =  obj.otherPayId;
    var otherPayName =  obj.otherPayName;
    var avatar = obj.avatar == undefined ? '' : obj.avatar;
    app.upChatUnreadCount(otherPayId);
    var param = 'orderId=' + orderId + '&otherPayId=' + otherPayId + '&otherPayName=' + otherPayName + '&otherPayAva=' + avatar;
    wx.navigateTo({
      url: '/pages/chat/chat?' + param
    })
  },

  /**删除 */
  itemDelTab: function (e) {
    var that = this;
    var position = e.currentTarget.dataset.position;
    var otherpayid = e.currentTarget.dataset.otherpayid;
    var msgDataList = this.data.msgDataList;
    app.removeChatMsgItem(otherpayid, function(isSuccess){
      if (isSuccess) {
        var msgDataListTemp =[];
        for (var index in msgDataList){
          if (index != position){
            msgDataListTemp.push(msgDataList[index]);
          }
        }
        that.setData({
          msgDataList: msgDataListTemp
        });
      }
    });
  },

  refreshData:function(){
    var that = this;
    //第一次加载的时候刷新数据
    var chatMsgList = app.readChatMsgList();
    that.setData({
      msgDataList: chatMsgList
    });
    //获取监听，之后有信息发过来执行数据刷新
    app.getOnchatMsgCal(function(){
      var chatMsgList = app.readChatMsgList();
      that.setData({
        msgDataList: chatMsgList
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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