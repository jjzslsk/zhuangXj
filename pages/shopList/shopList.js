// pages/shopList/shopList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isListType: true, //列表类型true,瀑布类型false
    searchKey: '',
    current: 'tab1',
    currentFilter: 'tab1',
    sortType: 'DESC',
    sortName: 'TOTAL_SALES_NUMBER',
    shopList:[],
    refreshing: true,
    nomore: false,
  },

  initList: function () {
    
  },
  /**
   * 跳转搜索
   */
  searchTab: function () {
    var searchKey = this.data.searchKey;
    wx.navigateTo({
      url: '/pages/search/search?tab=2&action=1&searchKey=' + searchKey
    })
  },

  /**
   * 切换列表类型
   */
  layoutTypeTab: function () {
    var isListType = this.data.isListType;
    this.setData({
      isListType: !isListType
    });
  },

  /**
   * 列表点击事件
   */
  itemtap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  /**tab点击事件 */
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    var sortName ='TOTAL_SALES_NUMBER'
    if (detail.key == 'tab1')
      sortName = 'TOTAL_SALES_NUMBER';
    else if (detail.key == 'tab2')
      sortName = 'TOTAL_SALES_NUMBER';
    else if (detail.key == 'tab3')
      sortName = 'TOTAL_SALES_NUMBER';
    else if (detail.key == 'tab4')
      sortName = 'TOTAL_SALES_NUMBER';

    this.setData({
      sortName: sortName
    });

    this.httpsData(true);

  },

  openShopDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/shopDetail/shopDetail?shopId='+id
    })
  },

  openShopDetail2: function (e) {
    wx.redirectTo({
      url: '/pages/shopDetail/shopDetail'
    })
  },

  /**
  * 外部调用开始搜索
  */
  searchPublic: function () {
    wx.showLoading();
    this.httpsData(true);
  },

  httpsData: function (isRefresh) {
    wx.showLoading({
      title: '加载中',
    })
    var than = this;
    var param = 'shopClassId=&startPage=1&recordSize=30&needShopItem=1&shopName=' + this.data.searchKey + '&sortName=' + this.data.sortName + '&sortType=' + this.data.sortType
    app.httpsDataGet('/shop/getShopList', param,
      function (res) {
        var tempList = [];
        if (isRefresh) {
          tempList = res.data;
        } else {
          tempList = that.data.shopList;
          tempList = tempList.concat(res.data);
        }
        //成功&needShopItem=1
        wx.hideLoading()

        than.setData({
          shopList: tempList
        });
      },
      function (res) {
        //失败
        wx.hideLoading()
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    this.setData({
      searchKey: options.searchKey
    });
    this.httpsData(true);
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