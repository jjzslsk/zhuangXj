// pages/licenseImg/licenseImg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[]
  },

  previewImage: function (e) {
    var i = e.currentTarget.dataset.i
    var pickedImgs = this.data.imgList
    wx.previewImage({
      current: pickedImgs[i], // 当前显示图片的http链接
      urls: pickedImgs // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopId = options.shopId
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pParam = 'clientId=' + shopId + '&type=all&userType=6&queryType=shop'
    app.httpsDataGet('/member/getPhoto', pParam,
      function (res) {
        //成功
        var imgList=[]
        for (var i = 0; i < res.pic.length;i++){
          imgList[i]=res.pic[i].pic
        }
        that.setData({
          imgList: imgList
        });
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
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