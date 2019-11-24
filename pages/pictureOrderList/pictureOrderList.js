// pages/pictureOrderList/pictureOrderList.js
const app = getApp();
var userId = '';
var indexPage = 1; //页码从1开始
var pageNum = 30;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    refreshing: true,
    nomore: false, //true已加载完全部，flase正在加载更多数据
  },

  /**跳转到详情 */
  goToDetailTap: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    var shopId = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/pictureOrderDetail/pictureOrderDetail?orderId=' + orderId + '&shopId=' + shopId
    });
  },

  httpsData: function (isRefresh) {
    var that = this;
    if (isRefresh){
      indexPage = 1;
    }else{
      indexPage++;
    }
    // status:0 - 客户拍照下单，1 - 客服已处理(已推送) ，2 - 客户已付款，4 - 客户取消订单，5 - 店主取消订单
    var param = 'clientId='+userId+'&status=0,1,4,5&startPage=' + indexPage + '&recordSize=' + pageNum;
    app.httpsDataGet('/photoOrder/getPhotoOrderList', param,
      function (res) {
        //成功
        wx.hideLoading();
        var data =res.data;
        var tempList = [];
        if (isRefresh) {
          tempList = data;
        } else {
          var tempList = that.data.dataList;
          tempList = tempList.concat(data);
        }
        var isNomore = data.length < pageNum ? true : false;
        that.setData({
          dataList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
        });
      },
      function (res) {
        //失败
      }
    )

  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    this.httpsData(true);
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    this.httpsData(false);
  },

  myOnScroll: function (e) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = app.globalData.userId;
    // userId ='1907081639012578'
    wx.showLoading();
    this.httpsData(true)
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