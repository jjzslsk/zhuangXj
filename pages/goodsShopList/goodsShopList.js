// pages/goodsShopList/goodsShopList.js
const app = getApp();
var classAllNo = '';
var indexPage = 1; //页码从1开始
var pageNum = 30; //每页显示的数量
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nullImg: false,//列表为空显示图
    searchKey: '',
    sortType: 'DESC', //排序类型，其值为 DESC 或 ASC， 即倒序或正序
    sortName: 'LAST_EDIT_DATE', //排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
    current: 'tab1',
    dataList:[],
    refreshing: true,
    nomore: false,//true已加载完全部，flase正在加载更多数据
    // dataList: [{
    //   "type": 0,
    //   "itemNotes": "<p><img src='http://www.zxj888.cn/upload/20190805/1908051801028166.jpg' style=''><img src='http://www.zxj888.cn/upload/20190805/1908051801028167.jpg' style=''><img src='http://www.zxj888.cn/upload/20190805/1908051805028307.jpg' style=''><img src='http://www.zxj888.cn/upload/20190805/1908051805028308.jpg' style=''><br></p>",
    //   "favourable": "0",
    //   "itemSpec": [{
    //     "0": {
    //       "imgUrl": "http://www.zxj888.cn/upload/20190805/1908051824029287.jpg",
    //       "price": "9.00",
    //       "itemSalePrice": "9.00",
    //       "spec": "LX63031 星河灰 300*600",
    //       "selected": true
    //     }
    //   }],
    //   "distance": "23.79",
    //   "salesVolume": 0,
    //   "itemUnit": "片",
    //   "submitDate": "2019-08-05 18:25:04.0",
    //   "shopName": "美佳陶-龙翔尚嘉广西总代理",
    //   "shopClassAllNo": "0109",
    //   "itemName": "厨卫砖系列",
    //   "deliveryMode": "商家配送",
    //   "itemStatus": 2,
    //   "upDate": "2019-08-05 18:25:51.0",
    //   "postageType": "非包邮",
    //   "shopId": 1907251120008835,
    //   "shopItemClassId": 1908051650018304,
    //   "classAllNo": "00100002",
    //   "favourableRate": "0.0%",
    //   "upNumber": 999,
    //   "lastEditDate": "2019-08-05 17:59:20.0",
    //   "commentTotal": "0",
    //   "tzStatus": 0,
    //   "postageAmnt": "0.00",
    //   "storeId": 1907251120008835,
    //   "itemClassId": 1811151718005276,
    //   "shopItemId": 1908051759028019,
    //   "itemPrice": 9,
    //   "itemSalePrice": "9.00",
    //   "shopType": 2,
    //   "shopTypeName": "代理店",
    //   "itemSort": 0
    // }, {
    //   "type": 0,
    //   "itemNotes": "<p><img src='http://www.zxj888.cn/upload/20190805/1908051755027612.jpg' style=''><img src='http://www.zxj888.cn/upload/20190805/1908051755027613.jpg' style=''><img src='http://www.zxj888.cn/upload/20190805/1908051755027622.jpg' style=''><br></p>",
    //   "favourable": "0",
    //   "itemSpec": [{
    //     "0": {
    //       "imgUrl": "http://www.zxj888.cn/upload/20190805/1908051753027611.jpg",
    //       "price": "9.00",
    //       "itemSalePrice": "9.00",
    //       "spec": "LX63030 半城烟沙 300*600",
    //       "selected": true
    //     }
    //   }],
    //   "distance": "23.79",
    //   "salesVolume": 0,
    //   "itemUnit": "片",
    //   "submitDate": "2019-08-05 17:55:54.0",
    //   "shopName": "美佳陶-龙翔尚嘉广西总代理",
    //   "shopClassAllNo": "0110",
    //   "itemName": "厨卫砖系列",
    //   "deliveryMode": "商家配送",
    //   "itemStatus": 2,
    //   "upDate": "2019-08-05 18:13:29.0",
    //   "postageType": "非包邮",
    //   "shopId": 1907251120008835,
    //   "shopItemClassId": 1908051700022307,
    //   "classAllNo": "00100002",
    //   "favourableRate": "0.0%",
    //   "upNumber": 999,
    //   "lastEditDate": "2019-08-05 17:51:45.0",
    //   "commentTotal": "0",
    //   "tzStatus": 0,
    //   "postageAmnt": "0.00",
    //   "storeId": 1907251120008835,
    //   "itemClassId": 1811151718005276,
    //   "shopItemId": 1908051751027368,
    //   "itemPrice": 9,
    //   "itemSalePrice": "9.00",
    //   "shopType": 2,
    //   "shopTypeName": "代理店",
    //   "itemSort": 0
    // }, {
    //   "type": 1,
    //   "shopLogo": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565764922379&di=06725bfed792357f988809242e4d0217&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2Ftupian%2F20120630%2Fyishuhefankaideshuben_652593_small.jpg",
    //   "shopArea": "广西壮族自治区南宁市兴宁区",
    //   "shopYyzzName": "营业执照",
    //   "checkUserId": 1,
    //   "submitDate": "2019-08-05 11:18:59.0",
    //   "shopName": "南宁市卓越墙纸地毯经营部",
    //   "shopYyzzZzjgdm": "92450102MA5MC3CY4C",
    //   "shopApplyIdcard": "452127197109062751",
    //   "shopAddress": "澳华花园27～35号",
    //   "orgId": 1811151205000872,
    //   "shopItem": [{
    //     "itemNotes": "<p>墙纸100平方以内，按成套价格；</p><p>包上门安装。</p><p><br></p><p><img src=\"http://www.zxj888.cn/upload/20190805/1908051230000368.png\" style=\"\"><br></p>",
    //     "shopItemClassId": 1908051156022705,
    //     "itemSpec": [{
    //       "0": {
    //         "imgUrl": "http://www.zxj888.cn/upload/20190805/1908051229000362.png",
    //         "price": "6800.00",
    //         "spec": "墙纸3",
    //         "selected": true
    //       }
    //     }],
    //     "classAllNo": "00110002",
    //     "salesVolume": 0,
    //     "upNumber": 999,
    //     "itemUnit": "套",
    //     "lastEditDate": "2019-08-05 12:28:12.0",
    //     "submitDate": "2019-08-05 12:30:43.0",
    //     "tzStatus": 0,
    //     "postageAmnt": "0.00",
    //     "shopClassAllNo": "0105",
    //     "storeId": 1908051107018550,
    //     "itemClassId": 1811151719005450,
    //     "shopItemId": 1908051228000328,
    //     "itemName": "卓立墙纸 3",
    //     "deliveryMode": "自提",
    //     "itemStatus": 2,
    //     "upDate": "2019-08-05 15:12:45.0",
    //     "itemPrice": 6800,
    //     "postageType": "非包邮",
    //     "shopId": 1908051107018550,
    //     "itemSort": 3
    //   }, {
    //     "itemNotes": "<p>墙布100平方以内，按成套价格；</p><p>包上门安装。</p>",
    //     "shopItemClassId": 1908051156022716,
    //     "itemSpec": [{
    //       "0": {
    //         "imgUrl": "http://www.zxj888.cn/upload/20190805/1908051226000318.png",
    //         "price": "8800.00",
    //         "spec": "墙布1",
    //         "selected": true
    //       }
    //     }, {
    //       "1": {
    //         "price": "8800.00",
    //         "spec": "墙布2",
    //         "selected": false
    //       }
    //     }, {
    //       "2": {
    //         "price": "8800.00",
    //         "spec": "墙布3",
    //         "selected": false
    //       }
    //     }],
    //     "classAllNo": "00110009",
    //     "salesVolume": 0,
    //     "upNumber": 999,
    //     "itemUnit": "套",
    //     "lastEditDate": "2019-08-05 12:21:46.0",
    //     "submitDate": "2019-08-05 12:28:10.0",
    //     "tzStatus": 0,
    //     "postageAmnt": "0.00",
    //     "shopClassAllNo": "0106",
    //     "storeId": 1908051107018550,
    //     "itemClassId": 1904151104001821,
    //     "shopItemId": 1908051221025501,
    //     "itemName": "卓立墙纸 墙布",
    //     "deliveryMode": "自提",
    //     "itemStatus": 2,
    //     "upDate": "2019-08-05 15:12:59.0",
    //     "itemPrice": 8800,
    //     "postageType": "非包邮",
    //     "shopId": 1908051107018550,
    //     "itemSort": 2
    //   }, {
    //     "itemNotes": "<p>墙纸100平方以内，按成套价格；</p><p>包上门安装。</p><p><br></p><p><img src=\"http://www.zxj888.cn/upload/20190805/1908051230000368.png\" style=\"\"><br></p>",
    //     "shopItemClassId": 1908051156022705,
    //     "itemSpec": [{
    //       "0": {
    //         "imgUrl": "http://www.zxj888.cn/upload/20190805/1908051229000362.png",
    //         "price": "6800.00",
    //         "spec": "墙纸3",
    //         "selected": true
    //       }
    //     }],
    //     "classAllNo": "00110002",
    //     "salesVolume": 0,
    //     "upNumber": 999,
    //     "itemUnit": "套",
    //     "lastEditDate": "2019-08-05 12:28:12.0",
    //     "submitDate": "2019-08-05 12:30:43.0",
    //     "tzStatus": 0,
    //     "postageAmnt": "0.00",
    //     "shopClassAllNo": "0105",
    //     "storeId": 1908051107018550,
    //     "itemClassId": 1811151719005450,
    //     "shopItemId": 1908051228000328,
    //     "itemName": "卓立墙纸 3",
    //     "deliveryMode": "自提",
    //     "itemStatus": 2,
    //     "upDate": "2019-08-05 15:12:45.0",
    //     "itemPrice": 6800,
    //     "postageType": "非包邮",
    //     "shopId": 1908051107018550,
    //     "itemSort": 3
    //   }]
    // }],


  },

  /**
   * 跳转搜索
   */
  searchTab: function() {
    var searchKey = this.data.searchKey;
    wx.navigateTo({
      url: '/pages/search/search?tab=0&action=1&searchKey=' + searchKey
    })
  },

  /**
   * 外部调用开始搜索
   */
  searchPublic: function () {
    wx.showLoading();
    this.httpsData(true);
  },

  /**
   * 商品item点击事件
   */
  goodsItemtap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  /**
   * 店铺item点击事件
   */
  shopItemTap:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?shopId=' + id
    })
  },


  httpsData: function(isRefresh) {
    var that = this;
    var searchKey = this.data.searchKey;
    var sortName = this.data.sortName;
    var sortType = this.data.sortType;
    var longitude = app.globalData.longitude;
    var latitude = app.globalData.latitude;

    var param = 'classAllNo=' + classAllNo + '&itemName=' + searchKey + '&sortName=' +
      sortName + '&sortType=' + sortType + '&startPage=' + indexPage + '&recordSize=' + pageNum + '&lon=' + longitude + '&lat=' + latitude;
    app.httpsDataGet('/shop/searchShopItemList', param,
      function (res) {
        wx.hideLoading()
        var tempList = [];
        if (isRefresh) {
          tempList = res.data;
        } else {
          tempList = that.data.dataList;
          tempList = tempList.concat(res.data);
        }
        var isNomore = res.data.length < pageNum ? true : false;
        that.setData({
          dataList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
          nullImg: isNomore
        });

      },
      function (returnFrom, res) {
        if (indexPage > 1) {
          indexPage--;
        }
        that.setData({
          refreshing: true,
          nomore: true,
        });
      }
    )
  },

  /**tab点击事件 */
  handleChange({
    detail
  }) {
    //相同 重复点击TAB
    if (detail.key == this.data.current) {
      //sortType: 'ASC',//排序类型，其值为 DESC 或 ASC， 即倒序或正序
      //searchKey: '',
      //sortName: '',//排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
      var current = this.data.current;
      var sortType = '';
      var sortName = '';
      var salesVolume = ''
      if (current == detail.key) {
        var sortType = this.data.sortType == 'ASC' ? 'DESC' : 'ASC';
        var salesVolume = this.data.sortType == 'DESC' ? 'ASC' : 'DESC'; //按销量
      } else {
        this.setData({
          current: detail.key
        });
        sortType = 'ASC';
        salesVolume = 'DESC' //设置默认按销量高到低
      }
      if (detail.key == 'tab1') {
        sortName = 'LAST_EDIT_DATE'
        //综合排序
      } else if (detail.key == 'tab2') {
        sortName = 'DISTANCE' //预留距离字段,有字段后填入
        //按距离
      } else if (detail.key == 'tab3') {
        sortType = salesVolume; //设置默认按销量高到低
        // sortName = 'SALES_VOLUME'
        sortName = 'UNREAL_NUM'
        //按销量
      } else if (detail.key == 'tab4') {
        //按价格
        sortName = 'ITEM_PRICE'
      }
      // else sortName='ITEM_PRICE';

      this.setData({
        sortType: sortType,
        sortName: sortName,
        refreshing: false
      });
      wx.showLoading({
        title: '加载中',
      })
      this.httpsData(true);
    }
    //不相同 不重复点击TAB
    else {
      var current = this.data.current;
      var sortType = '';
      var sortName = '';
      var salesVolume = ''
      if (current == detail.key) {
        // var sortType = this.data.sortType == 'ASC' ? 'DESC' :'ASC';
        // var salesVolume = this.data.sortType == 'DESC' ? 'ASC' :'DESC';//按销量
      } else {
        this.setData({
          current: detail.key
        });
        sortType = 'ASC';
        salesVolume = 'DESC' //设置默认按销量高到低
      }
      if (detail.key == 'tab1') {
        sortType = 'DESC';
        sortName = 'LAST_EDIT_DATE'
        //综合排序
      } else if (detail.key == 'tab2') {
        sortName = 'DISTANCE' //预留距离字段,有字段后填入
        //按距离
      } else if (detail.key == 'tab3') {
        sortType = salesVolume; //设置默认按销量高到低
        // sortName = 'SALES_VOLUME'
        sortName = 'UNREAL_NUM'
        //按销量
      } else if (detail.key == 'tab4') {
        //按价格
        sortName = 'ITEM_PRICE'
      }
      // else sortName='ITEM_PRICE';

      this.setData({
        sortType: sortType,
        sortName: sortName,
        refreshing: false
      });
      wx.showLoading({
        title: '加载中',
      })
      this.httpsData(true);
    }

  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function() {
    indexPage = 1;
    this.httpsData(true)
  },

  /**加载更多监听函数 */
  myOnLoadmore: function() {
    indexPage = indexPage + 1;
    this.httpsData(false);
  },

  myOnScroll: function(e) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    classAllNo = options.classAllNo
    this.setData({
      searchKey: options.searchKey,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.httpsData(true);
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