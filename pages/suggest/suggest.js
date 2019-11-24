// pages/suggest/suggest.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  onInputChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**查看处理结果 */
  selProRes:function(e){
    wx.navigateTo({
      url: '/pages/suggestProRes/suggestProRes'
    })
  },

  /**
   * 拨打电话
   */
  callPhoneTap:function(e){
    var phoneNum = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: phoneNum //仅为示例，并非真实的电话号码
    })
  },

  

  commitSuggest: function (e) {
    var that = this;
    var content = this.data.content;
    if (content == undefined || content == null || content=='') {//判空
      wx.showToast({
        title: '请输入投诉建议内容',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var param = 'CLIENT_ID=' + app.globalData.userId + '&CONTENT=' + content + '&SOURCE_TYPE=商城用户';
    wx.showLoading({
      title: '提交中',
    })
    app.httpsPlatformClass('adviceSave', param,
      function (res) {
        //成功
        wx.hideLoading();
        var resultMsg = res.msg;
        var msgStr='';
        if (typeof resultMsg == 'object' && resultMsg) {
          //如果是json对象,不用做处理
          msgStr=resultMsg.msg;
        } else {
          //如果是json字符串，则需要处理成json对象
          if (resultMsg == '' || resultMsg == null) { } else {
            var objMsg = JSON.parse(resultMsg);
            msgStr=objMsg.msg;
          }
        }

        wx.showModal({
          title: '提示',
          content: msgStr,
          showCancel: false,
          success: res => {
            // wx.navigateBack({delta: 1});
            that.selProRes();
          }
        })
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    );
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