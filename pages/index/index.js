//index.js
const app = getApp();
var indexPage=1;//页码从1开始
var pageNum=18;//每页显示的数量
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //遮罩
    currentIndex:null,//记录当前选中数据
    index: 0,//当前索引
    activityHeigth: '180px',
    advertHeigth: '78px',
    locationAddressCode: '',
    locationAddressName: '定位中',
    locationWidth: '20%',
    scrollTop:0,
    imgUrls: [],
    autoplay: true,
    interval: 5000,
    duration: 500,
    classList:[],//推荐分类
    noticeList: [],//文字广告轮播
    activityList: [],
    advertImg: app.globalData.url +'/photo/zxj_shop_icon/advertisingImg/adImg01.jpg',
    remList:[],//推荐商品
    refreshing: true,
    nomore: false,//true已加载完全部，flase正在加载更多数据
    todayTrafficNum:0//进入访问量
  },

  /**搜索 */
  searchTab: function() {
    //跳转搜索
    wx.navigateTo({
      url: '/pages/search/search?tab=0&action=0'
    })
  },

  /**选择定位 */
  chooseLocationTap: function() {
    wx.navigateTo({
      url: '/pages/chooseLocation/chooseLocation?locationCode=' + this.data.locationAddressCode + '&locationName=' + this.data.locationAddressName
    })
  },

  /**
   * 获取轮播图
   */
  httpsCarouselImg: function() {
    var that = this;
    var param = 'type=Article_WHEEL&baiduMapNo=' + app.globalData.curCityCode;
    app.httpsDataGet('/shop/getPhoto', param,
      function(res) {
        //成功
        that.setData({
          imgUrls: res.pic
        });

      },
      function(res) {
        //失败
      }
    )
  },


  /**
   * 获取推荐的分类
   */
  httpsMainClass:function(){
    var that = this;
    var param = 'classParentId=1&shopId=1&tzStatus=1';
    app.httpsDataGet('/shop/getItemClass', param,
      function (res) {
        var dataList = res.data;
        //成功
        var moreClass = {};
        moreClass.classAllNo = 'more_class';
        moreClass.classIcon = app.globalData.url + '/photo/zxj_shop_icon/homeNav/more_icon.png';
        moreClass.className = '更多分类';
        moreClass.itemClassId = 'more_class';
        dataList.push(moreClass)

        var totalCount = dataList.length;//获取类别数量
        var typePageNum=8;//类别每页8个
        var intNum = parseInt(totalCount / typePageNum);//取整
        var remNum = totalCount % typePageNum;//取余

        var typeList=[];
        var startPosition = 0,endPosition=0;
        for (var i=0; i < intNum; i++) {
          startPosition = i * typePageNum;
          endPosition = (i + 1) * typePageNum;
          var newary = dataList.slice(startPosition, endPosition);
          typeList.push(newary);
        }

        if (remNum>0){
          startPosition = endPosition,
          endPosition = app.accAdd(endPosition, remNum);
          var newary = dataList.slice(startPosition, endPosition);
          typeList.push(newary);
        }

        that.setData({
          classList: typeList
        })
      },
      function (res) {
        //失败
      }
    )
  },

  /**
   * 获取公告轮播
   */
  httpsNoticeCarousel:function(){
    var that = this;
    var param = 'type=Article_WORD&baiduMapNo=' + app.globalData.curCityCode;
    app.httpsDataGet('/shop/getWheelWord', param,
      function (res) {
        //成功
        that.setData({
          noticeList: res.data
        });
      },
      function (res) {
        //失败
      }
    )
  },

  /**获取今日访问量 */
  getTodayTrafficHttps: function () {
    var that = this;
    var param = 'counterName=todayVisit';
    app.httpsDataGet('/shop/getShopHomePageCount', param,
      function (res) {
        //成功
        var todayTrafficNum = res.data == undefined ? 0 : res.data;
        that.setData({
          todayTrafficNum: todayTrafficNum
        });

      },
      function (returnFrom, res) {
        //失败
      }
    )
  },

  /**
   * 获取活动图
   */
  httpsActivityImg: function() {
    var that = this;
    var param = 'type=Article_ACTIVE&baiduMapNo=' + app.globalData.curCityCode;
    app.httpsDataGet('/shop/getPhoto', param,
      function(res) {
        //成功
        that.setData({
          activityList: res.pic
        });
      },
      function(res) {
        //失败
      }
    )
  },

  /**
   * 获取商品推荐
   * classAllNo   分类编码。
   * itemName（非必填）   商品名称（搜索过滤用）。
   * sortName（非必填）  排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
   * sortType（非必填）  排序类型，其值为 DESC 或 ASC， 即倒序或正序。
   * tzStatus 获取推荐商品使用
   * startPage（必填）   起始页，传1就是显示第1页，传2就是显示第2页。
   * recordSize（非必填，默认30）  1页显示的记录数。
   * isRefresh 是下拉刷新还是上拉加载，true刷新 false加载
   */
  httpsRecGoods: function (isRefresh){
    var that = this;
    if (isRefresh){
      this.setData({
        refreshing: false
      });
      indexPage=1;
    } else{
      indexPage++;
    }
    var param = 'classAllNo=&itemName=&sortName=&sortType=&tzStatus=1&startPage=' + indexPage + '&recordSize=' + pageNum + '&lon=' + app.globalData.longitude + '&lat=' + app.globalData.latitude + '&baiduMapNo=' + app.globalData.curCityCode;
    app.httpsDataGet('/shop/getShopItemList', param,
      function (res) {
        //成功
        var tempList = [];
        if (isRefresh) {
          tempList = res.data;
        } else {
          var tempList = that.data.remList;
          tempList = tempList.concat(res.data);
        }
        var isNomore = res.data.length < pageNum ? true : false;
        that.setData({
          remList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
        });
      },
      function (returnFrom, res) {
        //失败
        if (indexPage > 1) {
          indexPage--;
        }
      }
    )
  },

  /**点击分类入口*/
  classTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var allno = e.currentTarget.dataset.allno;
    if (id == 'more_class') {
      //更多
      wx.switchTab({
        url: '/pages/classList/classList'
      })
    } else {
      wx.navigateTo({
        url: '/pages/goodsList/goodsList?classId=' + id + '&classAllNo=' + allno + '&searchKey='
      })
    }
  },

  /**跳转活动到搞活动的相关页面 */
  goActivityPage: function(id, type,weburl) {
    //// 0、店铺；1、商品详情；2、weburl
    if (type == 0) {
      //店铺
      wx.navigateTo({
        url: '/pages/shopDetail/shopDetail?shopId=' + id
      })
    } else if (type == 1) {
      //商品详情
      wx.navigateTo({
        url: '/pages/goodsDetail/goodsDetail?id=' + id
      })
    }else if (type == 2) {
      //weburl
      wx.navigateTo({
        url: '/pages/activityWeb/activityWeb?url=' + weburl
      })
    }
  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    this.httpsRecGoods(true);
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    this.httpsRecGoods(false);
  },

  /**点击轮播图*/
  carouselTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var weburl = e.currentTarget.dataset.weburl;
    this.goActivityPage(id, type, weburl);
  },

  /**点击活动入口*/
  activityTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var weburl = e.currentTarget.dataset.weburl;
    this.goActivityPage(id, type, weburl);
  },

  /**点击推荐列表item入口*/
  renListItemTab: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  shadeIcon: function(e) {
        this.setData({
            currentIndex:e.currentTarget.dataset.index
          })   
    },

    butClick (e){
      this.setData({
        currentIndex:null
      })
      wx.navigateTo({
        url: '/pages/shopList/shopList?searchKey=' + e.currentTarget.dataset.shopname
        // url: '/pages/goodsList/goodsList?classId=&classAllNo=&searchKey=' + '开关'
      })
    },

    shadeClick(e){
      this.setData({
        currentIndex:null
      })  
    },

  /** 找工人*/
  openFindWorker: function(e) {
    // wx.navigateTo({
    //   url: '/pages/findWorker/findWorker'
    // })

    wx.navigateToMiniProgram({
      appId: app.globalData.lwApp_id,//要打开的小程序 appId
      path: '',//打开的页面路径，如果为空则打开首页
      extraData: {},//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
      envVersion: 'develop',//要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。(开发版:develop,体验版:trial,正式版:release)
      success(res) {
        // 打开成功
      },
      fail(res){
        // 打开失败
      }
    })
  },

  /**
   * 文字轮播点击事件
   */
  noticelTab:function(e){
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var weburl = e.currentTarget.dataset.weburl;
    this.goActivityPage(weburl, type, weburl);
  },

  /**点击广告图*/
  advertTap:function(e){
    wx.navigateTo({
      url: '/pages/myShop/myShop'
    })
  },

  /**刷新定位结果显示宽度 */
  locationRefreshWidth: function() {
    //计算view宽度
    var than = this;
    var query = wx.createSelectorQuery();
    query.select('#location').boundingClientRect(function(rect) {
      than.setData({
        locationWidth: rect.width + 'px'
      })
    }).exec();

  },

  //刷新数据
  refreshData:function(){
    //请求获取轮播图
    this.httpsCarouselImg();
    //获取推荐分类
    this.httpsMainClass();
    //获取公告轮播
    this.httpsNoticeCarousel();
    //获取今日访问量
    this.getTodayTrafficHttps();
    //请求获取活动图
    this.httpsActivityImg();
    //获取商品推荐
    this.httpsRecGoods(true);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var beenRefresh=false;
    wx.showLoading();
    app.getLocation(
      function (isSuccess, msg){
        //获取缓存区域地址回调
        if (isSuccess) {
          that.setData({
            locationAddressCode: app.globalData.curCityCode,
            locationAddressName: app.globalData.curCity
          });
        } 
      },
      function (code, msg) {
        //自动定位得到区域地址结果回调
        if (code==1) {
          //定位成功，使用新地址
          that.setData({
            locationAddressCode: app.globalData.curCityCode,
            locationAddressName: app.globalData.curCity
          });
        } 
        else if (code==-1){
          //定位失败，并且缓存中没有区域地址
          that.setData({
            locationAddressCode: '',
            locationAddressName: msg
          })
        }
        beenRefresh = true;
        that.locationRefreshWidth();
        that.refreshData();
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#activity_area').boundingClientRect(function (rect) {
      var activityHeigth = rect.width * 0.48;
      that.setData({
        activityHeigth: activityHeigth + 'px'
      })
    }).exec();

    query.select('#advert_area').boundingClientRect(function (rect) {
      var advertHeigth = rect.width * 0.21;
      that.setData({
        advertHeigth: advertHeigth + 'px'
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 控制滚动
    // this.setData({
    //   scrollTop:0
    // });
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