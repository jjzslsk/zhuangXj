// pages/addBank/addBank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardholder: '',//持卡人
    backTypeCode: '', //银行卡类型编码
    backTypeName:'',//银行卡类型名称
    carNum: '',//卡号
  },

  /**监听变化获取持卡人人 */
  bindInputCardholder: function (e) {
    this.setData({
      cardholder: e.detail.detail.value
    });
  },

  /**选择银行类型 */
  chooseBankType:function(e){

  },

  /**确定添加 */
  submitInfo:function(e){
    var cardholder = this.data.cardholder;//持卡人
    var backTypeCode = this.data.backTypeCode; //银行卡类型编码
    var backTypeName = this.data.backTypeName;//银行卡类型名称
    var carNum = this.data.carNum;//卡号
    if (cardholder == undefined || cardholder == null || cardholder==''){
      wx.showToast({ title: '请输入持卡人', icon: 'none', duration: 2000 })
    }
    else if (backTypeName == undefined || backTypeName == null || backTypeName == '') {
      wx.showToast({ title: '请选择银行卡类型名称', icon: 'none', duration: 2000 })
    }
    else if (carNum == undefined || carNum == null || carNum == '') {
      wx.showToast({ title: '请输入卡号', icon: 'none', duration: 2000 })
    }else{
      
    }
  },

  /**监听变化获取卡号 */
  bindInputCarNum: function (e) {
    var carNum = e.detail.detail.value
    this.setData({
      carNum: carNum
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