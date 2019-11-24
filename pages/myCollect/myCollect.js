// pages/myCollect/myCollect.js
const app = getApp();
var userId = '';
var indexPageGoods = 1; //页码从1开始(商品)
var indexPageShop = 1; //页码从1开始(商铺)
var pageNum = 30; //每页显示的数量
var isFirstGoods = true;
var isFirstShop = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    refreshingGoods: true,
    nomoreGoods: false, //true已加载完全部，flase正在加载更多数据
    refreshingShop: true,
    nomoreShop: false,
    goodsCollectList: [], //商品收藏列表
    shopCollectList: [] //商铺收藏列表
  },

  /**
   * 滑动切换
   */
  swiperTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.refreshPageData(e.detail.current);
  },

  refreshPageData: function(position) {
    if (position == 0) {
      //商品页签
      if (isFirstGoods) {
        //刷新数据
        wx.showLoading({
          title: '加载中',
        })
        this.getGoodsCollectList();
      }
    } else {
      //商铺页签
      if (isFirstShop) {
        //刷新数据
        wx.showLoading({
          title: '加载中',
        })
        this.getShopCollectList();
      }
    }
  },

  /**
   * 点击切换
   */
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 商品列表点击事件
   */
  goodsItemtap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },


  /**
   * 商品列表点击事件
   */
  shopItemtap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?shopId=' + id
    })
  },

  /**商品收藏下拉刷新监听函数 */
  goodsOnPullRefresh: function() {
    this.setData({ refreshingGoods: false,});
    this.getGoodsCollectList();
  },

  /**商品收藏加载更多监听函数 */
  goodsOnLoadmore: function() {

  },

  /**商铺收藏下拉刷新监听函数 */
  shopOnPullRefresh: function() {
    this.setData({refreshingShop: false});
    this.getShopCollectList();
  },

  /**商铺收藏加载更多监听函数 */
  shopOnLoadmore: function() {

  },

  //获取商品收藏列表
  getGoodsCollectList: function() {
    var that = this;
    var param = 'CLIENT_ID=' + userId;
    app.httpsGetDatByPlatform('getFavShopItemList', 'list', param,
      function(res) {
        //成功
        isFirstGoods = false;
        that.setData({
          goodsCollectList: res.msg,
          refreshingGoods:true,
          nomoreGoods: true,
        });
        wx.hideLoading()
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      });
  },

  //获取商铺收藏列表
  getShopCollectList: function() {
    var that = this;
    var param = 'CLIENT_ID=' + userId;
    app.httpsGetDatByPlatform('getFavShopList', 'list', param,
      function(res) {
        //成功
        isFirstShop = false;
        that.setData({
          shopCollectList: res.msg,
          refreshingShop: true,
          nomoreShop: true,
        });
        wx.hideLoading()
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userId =  app.globalData.userId;
    this.setData({
      currentTab: options.action,
    });
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
    isFirstGoods = true;
    isFirstShop = true;
    this.refreshPageData(this.data.currentTab);
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