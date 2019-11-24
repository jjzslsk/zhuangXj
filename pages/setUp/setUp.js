// pages/setUp/setUp.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 重置密码
   */
  // resetPwdTap: function(e) {
  //   wx.navigateTo({
  //     url: '/pages/resetPwd/resetPwd'
  //   })
  // },

  /**
   * 修改手机号
   */
  upPhoneTap: function (e) {
    var type = e.currentTarget.dataset.action
    wx.navigateTo({
      // url: '/pages/upPhone/upPhone'
      url: '/pages/userServe/userServe?type=' + type
    })
  },

  /**
   * 投诉建议
   */
  complaintAdviceTap: function(e) {
    wx.navigateTo({
      url: '/pages/complaintAdvice/complaintAdvice'
    })
  },

    /**
   * 问题解答
   */
  questionTap: function(e) {
    wx.navigateTo({
      url: '/pages/question/question'
    })
  },

  /**
   * 帮助中心
   */
  helpCenterTap: function(e) {
    wx.navigateTo({
      url: '/pages/helpCenter/helpCenter'
    })
  },

  /**
   * 关于装小匠
   */
  aboutZxjTap: function(e) {
    wx.navigateTo({
      url: '/pages/aboutZxj/aboutZxj'
    })
  },

  /**
   * 退出登录
   */
  // outLoginTap: function(e) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要退出当前登录吗?',
  //     success(res) {
  //       if (res.confirm) {
  //         wx.clearStorage();
  //         app.clearUserInfo();
  //         wx.showLoading({ title: '退出登录成功' })
  //         wx.navigateBack({ delta: 1})
  //       } else if (res.cancel) { }
  //     }
  //   })
  // },

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