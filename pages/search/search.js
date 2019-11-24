// pages/search/search.js
const app = getApp();
var skCountCal;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: 1, //页面来源：0默认，1来自选择页面
    current: 'tab1',
    searchFocus:true,
    searchKey:'',
    recordGoodsShopList: [],
    recordGoodsList: [],
    recordShopList:[],
    searchKeyList:[]
  },

  /**历史记录item点击事件 */
  recordItemTap:function(e){
    var searchKey = e.currentTarget.dataset.key;
    var currentTab = this.data.current;
    if (this.data.action == 1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        searchKey: searchKey
      });
      prevPage.searchPublic();//开始搜索
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (currentTab == 'tab1') {
        wx.redirectTo({
          url: '/pages/goodsShopList/goodsShopList?classId=&classAllNo=&searchKey=' + searchKey
        })
      }
      else if (currentTab =='tab2'){
        wx.redirectTo({
          url: '/pages/goodsList/goodsList?classId=&classAllNo=&searchKey=' + searchKey
        })
      } else{
        wx.redirectTo({
          url: '/pages/shopList/shopList?searchKey=' + searchKey
        })
      }
    }
  },

  /**监听搜索框的输入焦点焦点 */
  searchInputFocus:function(e){ },

  /**监听搜索框的失去焦点 */
  searchBlurFocus: function (e) {},


  matchSearchKey: function () {
    var that = this;
    var currentTab = this.data.current;
    var searchKey = this.data.searchKey;
    if (skCountCal != undefined) {
      clearTimeout(skCountCal)
    }
    if (searchKey == undefined || searchKey == null || searchKey == '') {
      this.setData({
        searchKeyList: []
      });
      return;
    }
    var skType = 'all';//all综合搜索，shopItem搜索商品，shop搜索店铺
    if (currentTab == 'tab1') {
      skType = 'all';
    }
    else if (currentTab == 'tab2') {
      skType = 'shopItem';
    }
    else {
      skType = 'shop';
    }
    skCountCal = setTimeout(function () {
      clearTimeout(skCountCal);
      var param = "type=" + skType + "&itemName=" + searchKey + "&recordSize=10";
      app.httpsDataGet('/shop/searchShopItemByKeyword', param,
        function (res) {
          //成功
          that.setData({
            searchKeyList: res.data
          });
        },
      );
    }, 500);
  },

  /**监听搜索框输入内容 */
  searchKeyInput:function(e) {
    var searchKey = e.detail.value;
    this.setData({
      searchKey: searchKey
    });
    this.matchSearchKey();
  },

  /**键盘搜索按钮 */
  searchFirm:function (e) {
    this.searchTab();
  },

  clearCancel:function (e){
    this.setData({
      searchKey:''
    })
  },

  /**搜索 */
  searchTab:function(e){
    var searchKey = this.data.searchKey;
    if (searchKey == undefined || searchKey == null || searchKey==''){
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var currentTab = this.data.current;
    if (searchKey!=''){
      var checkRet = false;
      if (currentTab == 'tab1') {
        //把商品搜索添加到搜索商品历史记录
        var recordGoodsShopList = this.data.recordGoodsShopList;
        for (var index in recordGoodsShopList) {
          if (recordGoodsShopList[index] == searchKey) {
            checkRet = true;
            break;
          }
        }
        if (!checkRet) {
          recordGoodsShopList.splice(0, 0, searchKey);
          // recordGoodsList.push(searchKey);
          this.setData({ recordGoodsShopList: recordGoodsShopList });
          wx.setStorage({
            key: "record_search_goods_shop",
            data: JSON.stringify(recordGoodsShopList)
          })
        }
      } 
      else if (currentTab=='tab2'){
        //把商品搜索添加到搜索商品历史记录
        var recordGoodsList = this.data.recordGoodsList;
        for (var index in recordGoodsList) {
          if (recordGoodsList[index] == searchKey) {
            checkRet = true;
            break;
          }
        }
        if (!checkRet) {
          recordGoodsList.splice(0, 0, searchKey);
          // recordGoodsList.push(searchKey);
          this.setData({ recordGoodsList: recordGoodsList });
          wx.setStorage({
            key: "record_search_goods",
            data: JSON.stringify(recordGoodsList)
          })
        }
      } else {
        //把店铺搜索添加到搜索店铺历史记录
        var recordShopList = this.data.recordShopList;
        for (var index in recordShopList) {
          if (recordShopList[index] == searchKey) {
            checkRet = true;
            break;
          }
        }
        if (!checkRet) {
          recordShopList.splice(0, 0, searchKey);
          // recordShopList.push(searchKey);
          this.setData({ recordShopList: recordShopList });
          wx.setStorage({
            key: "record_search_shop",
            data: JSON.stringify(recordShopList)
          })
        }
      }
    }


    if (this.data.action == 1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        searchKey: searchKey
      });
      prevPage.searchPublic();//开始搜索
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (currentTab == 'tab1') {
        wx.redirectTo({
          url: '/pages/goodsShopList/goodsShopList?classId=&classAllNo=&searchKey=' + searchKey
        })
      } 
      else if (currentTab=='tab2'){
        wx.redirectTo({
          url: '/pages/goodsList/goodsList?classId=&classAllNo=&searchKey=' + searchKey
        })
      }
       else {
        wx.redirectTo({
          url: '/pages/shopList/shopList?searchKey=' + searchKey
        })
      }
    }
  },

  /**点击模糊匹配的item */
  searchKeyItemTap:function (e) {
    var searchKey = e.currentTarget.dataset.key;
    this.setData({
      searchKey: searchKey
    });
    this.searchTab();
  },

  /**清空搜索记录 */
  clearRecordTap:function(e){
    var currentTab = this.data.current;
    if (currentTab == 'tab1') {
      //清空综合搜索历史记录
      this.setData({
        recordGoodsShopList: []
      })
      wx.removeStorage({
        key: 'record_search_goods_shop',
        success(res) { }
      })
    }
    else if (currentTab=='tab2'){
      //清空商品搜索历史记录
      this.setData({
        recordGoodsList: []
      })
      wx.removeStorage({
        key: 'record_search_goods',
        success(res) { }
      })
    }
    else{
      //清空店铺搜索历史记录
      this.setData({
        recordShopList: []
      })
      wx.removeStorage({
        key: 'record_search_shop',
        success(res) { }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var action = options.action;
    var tab = options.tab;
    var currentTab ='tab1';
    if (tab==0){
      currentTab = 'tab1';
    }
    else if (tab == 1){
      currentTab = 'tab2';
    }
    else{
      currentTab = 'tab3';
    }

    var searchKey = options.searchKey == undefined ? '' : options.searchKey;
    this.setData({
      current: currentTab,
      action: action,
      searchKey:searchKey
    });
    wx.getStorage({
      key: 'record_search_goods_shop',
      success(res) {
        var recordGoodsShopList = JSON.parse(res.data);
        that.setData({ recordGoodsShopList: recordGoodsShopList });
      }
    });
    wx.getStorage({
      key: 'record_search_goods',
      success(res) {
        var recordGoodsList = JSON.parse(res.data);
        that.setData({ recordGoodsList: recordGoodsList});
      }
    });
    wx.getStorage({
      key: 'record_search_shop',
      success(res) {
        var recordShopList = JSON.parse(res.data);
        that.setData({ recordShopList: recordShopList });
      }
    })
  },

  /**tab点击事件 */
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    this.matchSearchKey();
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