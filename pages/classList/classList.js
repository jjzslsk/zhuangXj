// pages/classList/classList.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    footerHintLeft:'已加载完全部',
    footerHintRight:'已加载完全部',
    firstClassList: [], //一级分类(左边分类)
    secondClassList: [], //二级分类
    curFirstClass: {
      itemClassId: '',
      className: ''
    }
  },
  /**跳转搜索页面 */
  searchTab: function() {
    //跳转搜索
    wx.navigateTo({
      url: '/pages/search/search?tab=1&action=0'
    })
  },

  /**请求获取下一节点的类别 */
  getHttpNextClass:function(fid){
    var than = this;
    //请求获取二级分类(右边)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      secondClassList:[],
      footerHintRight: '正在加载...'
    });
    var param = 'classParentId=' + fid;
    app.httpsDataGet('/shop/getItemClass', param,
      function (res) {
        //成功
        than.setData({
          secondClassList: res.data,
          footerHintRight:'已加载完全部',
        });
      },
      function (res) {
        //失败
        wx.hideLoading()
        than.setData({ footerHintRight: '加载失败,请检查网络!' });
      }
    )
  },

  /**左边分类点击事件 */
  firstClassTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    if (this.data.curFirstClass.itemClassId == id) return; //防止重复请求 
    this.setData({
      curFirstClass: {
        itemClassId: id,
        className: name
      },
    })
    this.getHttpNextClass(id);
  },
  /**右边分类点击事件 */
  secondClassTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var allno = e.currentTarget.dataset.allno;
    wx.navigateTo({
      url: '/pages/goodsList/goodsList?classId=' + id + '&classAllNo=' + allno+ '&searchKey='
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var than = this;
    than.setData({
    });
    wx.showLoading({
      title: '加载中',
    })
    this.setData({ footerHintLeft:'正在加载...'})
    var param = 'classParentId=1'; //根结点ID为1
    app.httpsDataGet('/shop/getItemClass', param,
      function(res) {
        //成功
        than.setData({
          firstClassList: res.data,
          curFirstClass: res.data[0],
          footerHintLeft:'已加载完全部',
        });
        than.getHttpNextClass(res.data[0].itemClassId);
      },
      function(returnFrom,res) {
        //失败
        wx.hideLoading()
        than.setData({ 
          footerHintLeft: '加载失败,请检查网络!', 
          footerHintRight: '加载失败,请检查网络!'
        });
      }
    )
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