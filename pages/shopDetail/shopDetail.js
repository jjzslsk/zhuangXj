// pages/goodsList/goodsList.js
const app = getApp()
const utilJs = require('../../utils/util.js');
var goodsId='';//商品id
var startPosition = 1;//查询起始位置
var pageNum = 10;//每页显示的数量
var userId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0,
    distance:'',
    shopInfo:'',
    shopId:'',
    isLike:false,
    isCollect:false,
    showProductInfo: true, //列表类型true,瀑布类型false
    shopLogo:'',
    searchKey: '',
    current: 'tab1',
    currentFilter: 'tab1',
    sortType: 'DESC',
    sortName: 'UNREAL_NUM',
    remList: [],
    classifyList: [],
    curFirstClass: {
      itemClassId: '',
      itemClassNo: '',
      className: ''
    },
    refreshing: true,
    nomore: false, //true已加载完全部，flase正在加载更多数据
    indexPage:1,
    pageNum: 10,
    certImgs:[],
    placeImgs: [],
    qualiImgs:[],

    pickedImgs: [],
    compressImgs: [],
    compressImgsIndex: 0,
    uploadedImgs: [],
    uploadedImgIndex: 0,
    deliveryInfo:'',
    saleInfo:''
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  
  /**
   * 拨打电话
   */
  callPhoneTap: function (e) {
    var phoneNum = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: phoneNum //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 跳转搜索
   */
  searchTab: function () {
    wx.navigateTo({
      url: '/pages/search/search?tab=2&action=0'
    })
  },

  openLicenseImg: function () {
    wx.navigateTo({
      url: '/pages/licenseImg/licenseImg?shopId=' + this.data.shopId
    })
  },

  showShopMap: function () {
    // wx.navigateTo({
    //   url: '/pages/shopMap/shopMap?lat=' + this.data.shopInfo.shopLatTx + '&lon=' + this.data.shopInfo.shopLongTx + '&name=' + this.data.shopInfo.shopName
    // })
    utilJs.openMapLocation(this.data.shopInfo.shopLatTx, this.data.shopInfo.shopLongTx, this.data.shopInfo.shopName, this.data.shopInfo.shopAddress, 18);

  },

  /**
   * 切换列表类型
   */
  layoutTypeTab: function () {
    var showProductInfo = this.data.showProductInfo;
    this.setData({
      showProductInfo: !showProductInfo
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

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    this.setData({ indexPage: 1 });
    this.httpsData(true)
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    var indexPage = this.data.indexPage + 1;
    this.setData({ indexPage: indexPage });
    this.httpsData(false);
  },

    /**下拉刷新监听函数 */
    evaPullRefresh: function () {
      startPosition=1;
      this.httpsData(true);
    },
  
    /**加载更多监听函数 */
    evaLoadmore: function () {
      startPosition = startPosition + 1;
      var that = this;
      var param = 'shopId=' + goodsId + '&startPage=' + startPosition + '&recordSize=' + pageNum + '&lon=' + app.globalData.longitude + '&lat=' + app.globalData.latitude;
      app.httpsDataGet('/shop/getShopItemComment', param,
        function (res) {
          //成功
          var retObj =res.data;
          var goodsEvaListTemp = [];
          if (isRefresh){
            goodsEvaListTemp = retObj;
          } else{
            goodsEvaListTemp = that.data.goodsEvaList.concat(retObj);
          }
          
          //时间格式调整
          for(var item in goodsEvaListTemp){
            if (goodsEvaListTemp[item].COMMENT_DATE1) {
              goodsEvaListTemp[item].COMMENT_DATE1 = goodsEvaListTemp[item].COMMENT_DATE1.substr(0, 10);
            }else {return}
          }
  
          var isNomore = retObj.length < pageNum ? true : false;
          that.setData({
            refreshing: isNomore,
            nomore: isNomore,
            goodsEvaList: goodsEvaListTemp
          });
        },
        function (returnFrom, res) {
          //失败
          wx.hideLoading();
          if (startPosition > pageNum){
            startPosition = startPosition - pageNum;
          }
        }
      );
      


    },




  myOnScroll: function (e) {

  },

  httpsData: function (isRefresh) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var shopId = this.data.shopId  
    
    var goodsParam = 'shopId=' + shopId + '&classAllNo=' + this.data.curFirstClass.itemClassNo + '&sortName=' + this.data.sortName + '&sortType=' + this.data.sortType + '&startPage=' + this.data.indexPage + '&recordSize=' + this.data.pageNum;	

    if (this.data.curFirstClass.itemClassNo == 'all'){
      goodsParam = 'shopId=' + shopId + '&sortName=' + this.data.sortName + '&sortType=' + this.data.sortType + '&startPage=' + this.data.indexPage + '&recordSize=' + this.data.pageNum + '&lon=' + app.globalData.longitude + '&lat=' + app.globalData.latitude;	
    }
    app.httpsDataGet('/shop/getShopItemList', goodsParam,
      function (res) {		
        //成功
        var tempList = [];
        if (isRefresh) {
          tempList = res.data;
        } else {
          tempList = that.data.remList;
          tempList = tempList.concat(res.data);
        }

        try{  
          tempList.forEach(function(item,index){  
              if (index==0) {  
                  that.setData({
                    distance:item.distance
                  })
                  forEach.break=new Error("");  
              }
          });}catch(e){}


        //var newData = tempList.sort(that.compare('itemPrice'))
        var isNomore = res.data.length < that.data.pageNum ? true : false;
        wx.hideLoading()
        that.setData({
          remList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
        });
        wx.hideLoading()
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
  },

  /**
   * 店铺收藏
   */
  likeShop: function (e) {
    if (!app.checkLoginState()) return;
    userId = app.globalData.userId;

    var that = this;
    var isCollect = this.data.isCollect;
    var dataSet;
    var param;
    if (isCollect) {
      //取消收藏
      dataSet = 'clientDelFav';
      param = 'CLIENT_ID=' + userId + '&FAV_ID=' + this.data.shopId;
    } else {
      //添加收藏
      dataSet = 'clientFav';
      param = 'CLIENT_ID=' + userId + '&FAV_ID=' + this.data.shopId + '&FAV_TYPE=0';//FAV_TYPE 0商铺；1商品
    }
    wx.showLoading({
      title: '加载中',
    })
    app.httpsPlatformClass(dataSet, param,
      function (res) {
        //成功
        wx.hideLoading();
        that.setData({
          isCollect: !isCollect,
        });
        if (isCollect) {
          wx.showToast({ title: '取消收藏成功', icon: 'none', duration: 1000 });
        } else {
          wx.showToast({ title: '添加收藏成功', icon: 'none', duration: 1000 });
        }
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    );

    // var that = this;
    // var param = 'shopId=' + this.data.shopId + '&userId=' + app.globalData.userId;
    // param={}
    // param.shopId = this.data.shopId
    // param.userId = app.globalData.userId
    // app.httpsDataPost('/shop/shopFavAdd', param,
    //   function (res) {
    //     //成功
    //     that.setData({
    //       isLike: true
    //     });
    //   },
    //   function (res) {
    //     //失败
    //     wx.hideLoading()

    //   }
    // )
  },

  /**左边分类点击事件 */
  firstClassTab: function (e) {
    var id = e.currentTarget.dataset.id;
    var no = e.currentTarget.dataset.no;
    var name = e.currentTarget.dataset.name;
    if (this.data.curFirstClass.itemClassId == id) return; //防止重复请求 
    this.setData({
      scrollTop:0,
      curFirstClass: {
        itemClassId: id,
        itemClassNo: no,
        className: name
      },
    })
    this.getHttpGoodsList();
  },
  getHttpGoodsList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.setData({
      indexPage: 1,
    });
    var shopId = this.data.shopId
    var goodsParam = 'shopId=' + shopId + '&classAllNo=' + this.data.curFirstClass.itemClassNo + '&sortName=' + this.data.sortName + '&sortType=' + this.data.sortType +'&startPage=' + this.data.indexPage + '&recordSize=' + this.data.pageNum;
    
    if (this.data.curFirstClass.itemClassNo == 'all') {
      goodsParam = 'shopId=' + shopId + '&sortName=' + this.data.sortName + '&sortType=' + this.data.sortType + '&startPage=' + this.data.indexPage + '&recordSize=' + this.data.pageNum;
    }
    
    app.httpsDataGet('/shop/getShopItemList', goodsParam,
      function (res) {			
        //成功	
        //var newData = res.data.sort(that.compare('itemPrice'))
        var isNomore = res.data.length < that.data.pageNum ? true : false;
        wx.hideLoading()
        that.setData({
          remList: res.data,
          refreshing: isNomore,
          nomore: isNomore,
        });
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
  },

  compare:function(property){
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },

  compare2: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },

  sortList: function (type) {
    var that = this;
    var dataList = this.data.remList;
    var newData;
    if (type=='DESC')
      newData = dataList.sort(this.compare2('itemPrice'))
    else
      newData = dataList.sort(this.compare('itemPrice'))
    that.setData({
      remList: newData
    });
  },

  /**tab点击事件 */
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  /**tab点击事件 */
  handleFilterChange({
    detail
  }) {
    var current = this.data.currentFilter;
    var sortType = '';
    if (current == detail.key) {
      sortType = this.data.sortType == 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.setData({
        currentFilter: detail.key
      });
      sortType = 'ASC';
    }
    var sortName
    if (detail.key=='tab1')
      sortName = 'UNREAL_NUM';
    else
      sortName='ITEM_PRICE';
      
    this.setData({
      sortType: sortType,
      sortName:sortName
    });

    //this.sortList(sortType)
    this.getHttpGoodsList();
  },

  shopEvalList(isRefresh){
    var that = this;
    var param = 'shopId=' + that.data.shopId + '&startPage=' + startPosition + '&recordSize=' + '30';
    that.httpsDataGet('/shop/getShopItemComment', param,
      function (res) {
        //成功
        var retObj =res.data;
        var goodsEvaListTemp = [];
        if (isRefresh){
          goodsEvaListTemp = retObj;
        } else{
          goodsEvaListTemp = that.data.goodsEvaList.concat(retObj);
        }

        //时间格式调整
        for (var item in goodsEvaListTemp) {
          if (goodsEvaListTemp[item].COMMENT_DATE1) {
            goodsEvaListTemp[item].COMMENT_DATE1 = goodsEvaListTemp[item].COMMENT_DATE1.substr(0, 10);
          } else { return }
        }

        var isNomore = retObj.length < pageNum ? true : false;
        that.setData({
          refreshing: isNomore,
          nomore: isNomore,
          goodsEvaList: goodsEvaListTemp
        });
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
        if (startPosition > pageNum){
          startPosition = startPosition - pageNum;
        }
      }
    );
  },

    /**
   * get请求
   * actionUrl :请求接口入口
   * param 请求参数
   * call_success 请求成功回调
   * call_fail 请求失败回调
   */
  httpsDataGet: function(actionUrl, param, call_success, call_fail) {
    var url = app.globalData.url + '/ws' + actionUrl + '?' + param;
    url = encodeURI(url);
    wx.request({
      url: url,
      method: 'get',
      dataType: 'json',
      header: {
        'content-type': 'text/plain;charset=utf-8'
      },
      success: res => {
        wx.hideLoading()
        if (res.statusCode == 200) {
          var resultData = res.data;
          //判断返回来的数据resultData是json对象还是json字符串
          if (typeof resultData == 'object' && resultData) {
            //如果是json对象,不用做处理
          } else {
            //如果是json字符串，则需要处理成json对象
            resultData = JSON.parse(resultData);
          }
          if (resultData.status) {
            typeof call_success == "function" && call_success(resultData)
          } else {
            wx.showModal({
              title: '提示',
              // content: resultData.msg + '(' + resultData.code + ')',
              content: resultData.msg,
              showCancel: false,
            })
            typeof call_fail == "function" && call_fail(0, resultData)
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败(' + res.statusCode + ')',
            showCancel: false,
          })
        }

      },
      fail: res => {
        //请求接口失败
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '请求失败(' + res.errMsg + ')',
          showCancel: false,
        })
        typeof call_fail == "function" && call_fail(1, res)
      },
    })
  },

  previewImage: function (e) {
    var i = e.currentTarget.dataset.i
    var type = e.currentTarget.dataset.type
    var pickedImgs
    if(type=='cert')
      pickedImgs = this.data.certImgs
    if (type == 'place')
      pickedImgs = this.data.placeImgs
    if (type == 'quali')
      pickedImgs = this.data.qualiImgs

    wx.previewImage({
      current: pickedImgs[i], // 当前显示图片的http链接
      urls: pickedImgs // 需要预览的图片http链接列表
    })
  },

  picOrderTap: function (e) {   
    if (this.data.shopInfo.photoOrderFlag=='1'){
      if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == '') {
        wx.showModal({
          title: '提示',
          content: '您未登录，请先登录再操作。是否前往登录？',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/bindPhone/bindPhone'
              })
            }
          }
        })
        return
      }
      wx.navigateTo({
        url: '/pages/shopPicOrder/shopPicOrder?shopId=' + this.data.shopId
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '该店铺未开启拍照下单功能',
        showCancel:false,
        success(res) {
          if (res.confirm) {
           
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopId = options.shopId;
    var clientId = app.globalData.userId;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.setData({
      shopInfo: '',
      shopId: shopId,
    });
    var param = 'shopId=' + shopId + '&clientId=' + clientId + '&from=4';
    app.httpsDataGet('/shop/getShopInfo', param,
      function (res) {
        wx.hideLoading()
        var isCollect=false;
        if (res.data.favStatus=='1')
          isCollect = true;
        
        var shopLogo = '';
        if (res.data.shopLogo)
          shopLogo = res.data.shopLogo;
        //成功      
        that.setData({
          shopInfo: res.data,
          isCollect: isCollect,
          shopLogo: shopLogo,
        });
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
    var classParam = 'classParentId=1&shopId=' + shopId;
    app.httpsDataGet('/shop/getItemClass', classParam,
      function (res) {		
        //成功
        if (res.data.length>0){
          var classifyList = res.data
          var allClass={
            itemClassId: 'all',
            classAllNo: 'all',
            className: '全部商品'
          }
          classifyList.unshift(allClass)			
          that.setData({
            classifyList: classifyList,
            curFirstClass: {
              itemClassId: classifyList[0].itemClassId,
              itemClassNo: classifyList[0].classAllNo,
              className: classifyList[0].className
            }
          });
          that.httpsData(true);
        that.shopEvalList(true)

        }else {
          that.setData({
            refreshing: true,
            nomore: true
          });
          wx.showModal({
            title: '提示',
            content: '商家未上传商品请耐心等待',
            showCancel: false,
          })
        }
      },
      function (res) {
        //失败
        wx.hideLoading()

      },
    )

    var pParam = 'clientId=' + shopId + '&type=all&userType=6&queryType=shop';
    app.httpsDataGet('/member/getPhoto', pParam,
      function (res) {
        //成功
        var certImgs = []
        var placeImgs = []
        var qualiImgs = []
        for (var i = 0; i < res.pic.length; i++) {
          if (res.pic[i].attFkName =='6_client_cert')
            certImgs.push(res.pic[i].pic)
          else if (res.pic[i].attFkName == '6_client_place')
            placeImgs.push(res.pic[i].pic)
          else if (res.pic[i].attFkName == '6_client_quali')
            qualiImgs.push(res.pic[i].pic)
        }
        that.setData({
          certImgs: certImgs,
          placeImgs: placeImgs,
          qualiImgs: qualiImgs
        });
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )

    var aParam1 = 'shopId=' + shopId + '&type=Article_shopAPP_Delivery';
    app.httpsDataGet('/shop/getShopArticleList', aParam1,
      function (res) {     
        if (res.status){
          if (res.data.length > 0) {
            that.setData({
              deliveryInfo:res.data[0]
            });
          }
        }
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )

    var aParam2 = 'shopId=' + shopId + '&type=Article_shopAPP_Post_Sale';
    app.httpsDataGet('/shop/getShopArticleList', aParam2,
      function (res) {       
        if (res.status) {
          if (res.data.length>0){
            that.setData({
              saleInfo: res.data[0]
            });
          }
        }
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
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