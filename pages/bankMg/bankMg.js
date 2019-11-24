// pages/bankMg/bankMg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList:[
      { id: 'bank001', bankLogo: '/images/bank/logo/abc_logo.png', bankName: '中国农业银行', bankType: '储蓄卡', bankNum: '1234567882564171', bgColor:'#57bfa3'},
      { id: 'bank002', bankLogo: '', bankName: '其他银行', bankType: '储蓄卡', bankNum: '12345678825642705', bgColor: '#259b24' }
    ]
  },

  /**
   * 添加银行卡
   */
  goAddBack:function(e){
    wx.navigateTo({
      url: '/pages/addBank/addBank'
    })
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