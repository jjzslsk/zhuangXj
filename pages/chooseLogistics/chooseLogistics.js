// pages/chooseLogistics/chooseLogistics.js
  const app = getApp();
  var cities = [];
  var jsonData = require('../../data/logistics.js');
  var utilMd5 = require('../../utils/md5.js');
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchFocus:false,
      hot:'hot',
      hotList: [],//热门物流城市
      toView: 'A',
      cities: [],
      searchKey:''
  },

    /**模糊检索列表 */
    filterSearch: function (_search){
    var reg = new RegExp(_search, 'ig');
    var citiesTemp = cities;
    //es6 filter过滤匹配，有则返回当前，无则返回所有
    return citiesTemp.filter(function (e) {
      //匹配所有字段
      //return Object.keys(e).some(function(key) {
      //   return e[key].match(reg);
      //})
      //匹配某个字段
      return e.name.match(reg);
    })
  },

  /**监听搜索框的输入焦点焦点 */
  searchInputFocus: function (e) { },

  /**监听搜索框的失去焦点 */
  searchBlurFocus: function (e) { },

  /**监听搜索框输入内容 */
  searchKeyInput: function (e) {
    var _search = e.detail.value.trim();
    var citiesObj;
    if (_search) {
      //不区分大小写处理
      citiesObj = this.filterSearch(_search);
    } else {
      citiesObj = cities;
    }
    this.refreshData(citiesObj, _search);
  },

  /**
   * 选择地址
   */
  itemAddressTap: function (e) {
    var locationObj = e.currentTarget.dataset;
    var code = locationObj.code;
    var name = locationObj.name;
    var isOpen = locationObj.isopen;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      logisticsCode: code,
      logisticsName : name,
    });
    wx.navigateBack({ delta: 1 })
  },

  /**
   * 点击右边字母赛选
   */
  onChange(e) {
    var pinyin = e.detail.current;
    this.setData({
      toView: pinyin
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this;
    var addressObj = jsonData.data;
    cities = addressObj.logisticsList;
    this.setData({
      hotList: addressObj.hotList
    })
  },


  refreshData: function (citiesObj, searchKeyStr) {
    var hot = this.data.hot;
    let storeCity = new Array(28);
    const words = [ hot, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z","#"];
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    })
    citiesObj.forEach((item) => {
      let firstName = item.pinyin.substring(0, 1);
      let index = words.indexOf(firstName) == -1 ? 27 : words.indexOf(firstName);
      if (storeCity[index] != undefined && storeCity[index].list != undefined) {
        storeCity[index].list.push({
          code: item.code,
          name: item.name,
          key: firstName,
          isOpen: item.isOpen
        });
      }
    })
    this.data.cities = storeCity;
    this.setData({
      cities: this.data.cities,
      searchKey: searchKeyStr
    })
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading();
    this.refreshData(cities, '');
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