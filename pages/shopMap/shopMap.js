// pages/shopMap/shopMap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lat = options.lat
    var lon = options.lon
    var name = options.name
    this.setData({
      latitude: lat,
      longitude: lon,
      markers: [{
        iconPath: '/images/shop/shop_marker.png',
        id: 1,
        latitude: lat,
        longitude: lon,
        width: 50,
        height: 50,
        callout: {
          content: name,
          color: '#259B24',
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#e51c23',
          padding: 10,
          display: 'BYCLICK'
        }
      }]
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