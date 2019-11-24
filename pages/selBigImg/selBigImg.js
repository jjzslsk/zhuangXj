// pages/selBigImg/selBigImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:false,
    autoplay:false,
    currentPage:0,
    imgList: []
  },

  swiperChange:function(e){
    // event.detail = { current: current, source: source }
    this.setData({
      currentPage: e.detail.current
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this;
    var indexCur = Number(options.indexCur);
    wx.getStorage({
      key: 'sel_bit_img',
      success(res) {
        //从缓存中拿去传过来的对象
        var queryBean = JSON.parse(res.data);
        than.setData({
          currentPage: indexCur,
          imgList: queryBean.attImgList
        });
        //清楚缓存
        wx.removeStorage({
          key: 'sel_bit_img',
          success(res) {}
        })
      }
    })

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