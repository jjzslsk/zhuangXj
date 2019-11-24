// pages/myOrder/myOrder.js
const app = getApp();
var goPageAction = ''; //记录跳转页面,用于返回当前页面的时候判断是否要刷新。商品详情：'goodsDetailAction'；物流：'logisticsAction'；评论页面:'eveAction'
var orderStatusObj = {
  allOrder: '', //全部
  waitPay: '0', //待付款
  waitSend: '1', //待发货
  waitReceive: '3', //待收货
  waitEva: '4' //待评价
}

var isInitPage0 = false,
  isInitPage1 = false,
  isInitPage2 = false,
  isInitPage3 = false,
  isInitPage4 = false;

var indexPageAll = 1; //页码从1开始(全部)
var indexPageWaitPay = 1; //页码从1开始(待付款)
var indexPageWaitSend = 1; //页码从1开始(待发货)
var indexPageWaitReceive = 1; //页码从1开始(待收货)
var indexPageWaitEva = 1; //页码从1开始(待评价)
var pageNum = 30; //每页显示的数量
var userId = '';
var orderStatus = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisOrderNo:'',
    // 弹窗
    showModal:false,
    //弹窗选项
    items: [
      { name: 'a', value: '我不想买了', checked: true  },
      { name: 's', value: '信息填写错误', checked: false},
      { name: 'd', value: '卖家缺货', checked: false },
      { name: 'g', value: '其他原因', checked: false },
    ],
    showOthCanReaInput:false,//是否选择了其他
    otherCancelReason:'',
    cancelOrderReason:'',//取消订单理由
    nullImg1:false,//空数据图,显示状态
    nullImg2:false,//空数据图,显示状态
    nullImg3:false,//空数据图,显示状态
    nullImg4:false,//空数据图,显示状态
    nullImg5:false,//空数据图,显示状态
    refreshing0: true,
    nomore0: false, //true已加载完全部，flase正在加载更多数据
    refreshing1: true,
    nomore1: false, //
    refreshing2: true,
    nomore2: false, //
    refreshing3: true,
    nomore3: false, //
    refreshing4: true,
    nomore4: false, //
    currentTab: 0,
    // footerHintAll: '已加载完全部', //全部底部提示语
    // footerHintWaitPay: '已加载完全部', //待付款底部提示语
    // footerHintWaitSend: '已加载完全部', //待发货底部提示语
    // footerHintWaitReceive: '已加载完全部', //待收货底部提示语
    // footerHintWaitEva: '已加载完全部', //待评价底部提示语
    shopGoodsListAll: [],
    shopGoodsListWaitPay: [],
    shopGoodsListWaitSend: [],
    shopGoodsListWaitReceive: [],
    shopGoodsListWaitEva: []
  },

  //弹窗选择
  radioChange: function (e) {
    var cancelOrderReasonTemp = e.detail.value;
    // cancelOrderReason = e.detail.value;
    if (cancelOrderReasonTemp='其他原因'){
      this.setData({
        showOthCanReaInput:true,
        cancelOrderReason:''
      });
    }else{
      this.setData({
        showOthCanReaInput: false,
        cancelOrderReason: cancelOrderReasonTemp
      });
    }
  },

  //监听输入理由
  bindCancelReasonInput:function(e){
    this.setData({
      cancelOrderReason:e.detail.value
    })
  },

  //初始化全局数据
  initGlobalData: function() {
    isInitPage0 = false; //全部
    isInitPage1 = false; //待付款
    isInitPage2 = false; //待发货
    isInitPage3 = false; //待收货
    isInitPage4 = false; //待评价
    indexPageAll = 1; //页码从1开始(全部)
    indexPageWaitPay = 1; //页码从1开始(待付款)
    indexPageWaitSend = 1; //页码从1开始(待发货)
    indexPageWaitReceive = 1; //页码从1开始(待收货)
    indexPageWaitEva = 1; //页码从1开始(待评价)
    pageNum = 30; //每页显示的数量
    userId = '';
    orderStatus = '';
  },

  //初始化全局数据all
  allGlobalData: function () {
    isInitPage0 = false; //全部
    isInitPage1 = false; //待付款
    isInitPage2 = false; //待发货
    isInitPage3 = false; //待收货
    isInitPage4 = false; //待评价
    indexPageAll = 1; //页码从1开始(全部)
    indexPageWaitPay = 1; //页码从1开始(待付款)
    indexPageWaitSend = 1; //页码从1开始(待发货)
    indexPageWaitReceive = 1; //页码从1开始(待收货)
    indexPageWaitEva = 1; //页码从1开始(待评价)
  },

  //支付成功部分变量初始值
  paySuccessIniData: function() {
    isInitPage0 = false; //全部
    isInitPage1 = false; //待付款
    isInitPage2 = false; //待发货
    indexPageAll = 1; //页码从1开始(全部)
    indexPageWaitPay = 1; //页码从1开始(待付款)
    indexPageWaitSend = 1; //页码从1开始(待发货)
  },

  //确认收货成功
  confirmSuccessIniData:function(){
    isInitPage0 = false; //全部
    isInitPage3 = false; //待收货
    isInitPage4 = false; //待付款
    indexPageAll = 1; //页码从1开始(全部)
    indexPageWaitReceive = 1; //页码从1开始(待收货)
    indexPageWaitEva = 1; //页码从1开始(待评价)
  },

  /**评价成功 部分变量初始值*/
  eveScccessIniData: function() {
    isInitPage0 = false; //全部
    isInitPage4 = false; //待付款
    indexPageWaitEva = 1; //页码从1开始(全部)
  },

  //初始化page页面的内容
  initPageData: function(position) {
    if (position == 0) {
      //待付款
      // this.setData({
      //   refreshing1: true,
      //   refreshing2: true,
      //   refreshing3: true,
      //   refreshing4: true
      // });
      orderStatus = orderStatusObj.allOrder;
      if (!isInitPage0) {
        indexPageAll = 1;
        isInitPage0 = true;
        // wx.showLoading();
        this.httpsData(true);
      }
    } else if (position == 1) {
      //待付款
      // this.setData({
      //   refreshing0: false,
      //   refreshing2: false,
      //   refreshing3: false,
      //   refreshing4: false
      // });
      orderStatus = orderStatusObj.waitPay;
      if (!isInitPage1) {
        indexPageWaitPay = 1;
        isInitPage1 = true;
        // wx.showLoading();
        this.httpsData(true);
      }
    } else if (position == 2) {
      //待发货
      // this.setData({
      //   refreshing0: false,
      //   refreshing1: false,
      //   refreshing3: false,
      //   refreshing4: false
      // });
      orderStatus = orderStatusObj.waitSend;
      if (!isInitPage2) {
        indexPageWaitSend = 1;
        isInitPage2 = true;
        // wx.showLoading();
        this.httpsData(true);
      }
    } else if (position == 3) {
      //待收货 
      // this.setData({
      //   refreshing0: false,
      //   refreshing1: false,
      //   refreshing2: false,
      //   refreshing4: false
      // });
      orderStatus = orderStatusObj.waitReceive;
      if (!isInitPage3) {
        indexPageWaitReceive = 1;
        isInitPage3 = true;
        // wx.showLoading();
        this.httpsData(true);
      }
    } else if (position == 4) {
      //待评价
      // this.setData({
      //   refreshing0: false,
      //   refreshing1: false,
      //   refreshing2: false,
      //   refreshing3: false
      // });
      orderStatus = orderStatusObj.waitEva;
      if (!isInitPage4) {
        indexPageWaitEva = 1;
        isInitPage4 = true;
        // wx.showLoading();
        this.httpsData(true);
      }
    }
  },

  /**
   * 滑动切换
   */
  swiperTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.initPageData(e.detail.current);
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

  /**下拉刷新监听函数 */
  myOnPullRefresh: function() {
    var currentTab = this.data.currentTab;
    if (currentTab == 0) {
      //全部
      indexPageAll = 1;
      this.setData({
        refreshing0: false
      });
    } else if (currentTab == 1) {
      //待付款
      indexPageWaitPay = 1;
      this.setData({
        refreshing1: false
      });
    } else if (currentTab == 2) {
      //待发货
      indexPageWaitSend = 1;
      this.setData({
        refreshing2: false
      });
    } else if (currentTab == 3) {
      //待收货
      indexPageWaitReceive = 1;
      this.setData({
        refreshing3: false
      });
    } else if (currentTab == 4) {
      //待评价
      indexPageWaitEva = 1;
      this.setData({
        refreshing4: false
      });
    }
    this.httpsData(true);

  },

  /**加载更多监听函数 */
  myOnLoadmore: function() {
    var that = this;
    var currentTab = this.data.currentTab;
    if (currentTab == 0) {
      //全部
      indexPageAll++;
    } else if (currentTab == 1) {
      //待付款
      indexPageWaitPay++;
    } else if (currentTab == 2) {
      //待发货
      indexPageWaitSend++;
    } else if (currentTab == 3) {
      //待收货
      indexPageWaitReceive++;
    } else if (currentTab == 4) {
      //待评价
      indexPageWaitEva++;
    }
    this.httpsData(false);
  },

  /**
   * 通过tab获取页码
   */
  getIndexPageByTab: function(position) {
    var that = this;
    var indexPage = 1;
    if (position == 0) {
      //全部
      indexPage = indexPageAll;
    } else if (position == 1) {
      //待付款
      indexPage = indexPageWaitPay;
    } else if (position == 2) {
      //待发货
      indexPage = indexPageWaitSend;
    } else if (position == 3) {
      //待收货
      indexPage = indexPageWaitReceive;
    } else if (position == 4) {
      //待评价
      indexPage = indexPageWaitEva;
    }
    return indexPage;
  },

  /**
   * 请求数据异常，回滚页码
   */
  errBackIndex: function(position, indexPage) {
    var that = this;
    //回滚页码
    if (indexPage > 1) {
      indexPage--;
    }
    if (position == 0) {
      //全部
      indexPageAll = indexPage;
    } else if (position == 1) {
      //待付款
      indexPageWaitPay = indexPage;
    } else if (position == 2) {
      //待发货
      indexPageWaitSend = indexPage;
    } else if (position == 3) {
      //待收货
      indexPageWaitReceive = indexPage;
    } else if (position == 4) {
      //待评价
      indexPageWaitEva = indexPage;
    }
  },

  /**
   * 刷新数据
   */
  refreshData: function(position, data, isRefresh) {
    var that = this;
    var isNomore = data.length < pageNum ? true : false;
    if (position == 0) {
      //全部
      var tempDataAll = [];
      if (isRefresh) {
        tempDataAll = data;
      } else {
        tempDataAll = that.data.shopGoodsListAll.concat(data);
      }
      that.setData({
        refreshing0: true,
        nomore0: isNomore,
        shopGoodsListAll: tempDataAll
      });
    } else if (position == 1) {
      //待付款
      var tempDataWaitPay = [];
      if (isRefresh) {
        tempDataWaitPay = data;
      } else {
        tempDataWaitPay = that.data.shopGoodsListWaitPay.concat(data);
      }
      that.setData({
        refreshing1: true,
        nomore1: isNomore,
        shopGoodsListWaitPay: tempDataWaitPay
      });
    } else if (position == 2) {
      //待发货
      var tempDataWaitSend = [];
      if (isRefresh) {
        tempDataWaitSend = data;
      } else {
        tempDataWaitSend = that.data.shopGoodsListWaitSend.concat(data);
      }
      that.setData({
        refreshing2: true,
        nomore2: isNomore,
        shopGoodsListWaitSend: tempDataWaitSend
      });
    } else if (position == 3) {
      //待收货
      var tempDataWaitReceive = [];
      if (isRefresh) {
        tempDataWaitReceive = data;
      } else {
        tempDataWaitReceive = that.data.shopGoodsListWaitReceive.concat(data);
      }
      that.setData({
        refreshing3: true,
        nomore3: isNomore,
        shopGoodsListWaitReceive: tempDataWaitReceive
      });
    } else if (position == 4) {
      //待评价
      var tempDataWaitEva = [];
      if (isRefresh) {
        tempDataWaitEva = data;
      } else {
        tempDataWaitEva = that.data.shopGoodsListWaitEva.concat(data);
      }
      that.setData({
        refreshing4: true,
        nomore4: isNomore,
        shopGoodsListWaitEva: tempDataWaitEva
      });
    }
  },

  /**
   * 请求数据
   */
  httpsData: function(isRefresh) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var currentTab = this.data.currentTab;
    var indexPage = this.getIndexPageByTab(currentTab);
    var param = 'userId=' + userId + '&orderStatus=' + orderStatus + '&startPage=' + indexPage + '&recordSize=' + pageNum;
    app.httpsDataGet('/order/getOrderList', param,
      function(res) {
        //成功
        wx.hideLoading()
        switch(orderStatus){//无订单状态图
          case '':
              if(res.data.length == 0){
                that.setData({
                  nullImg1:true
                });
              }else{
                that.setData({
                  nullImg1:false
                });
              }
              break;
          case "0":
              if(res.data.length == 0){
                that.setData({
                  nullImg2:true
                });
              }else{
                that.setData({
                  nullImg2:false
                });
              }
              break;
          case "1":
              if(res.data.length == 0){
                that.setData({
                  nullImg3:true
                });
              }else{
                that.setData({
                  nullImg3:false
                });
              }
              break;
          case "3":
              if(res.data.length == 0){
                that.setData({
                  nullImg4:true
                });
              }else{
                that.setData({
                  nullImg4:false
                });
              }
              break;
          case "4":
              if(res.data.length == 0){
                that.setData({
                  nullImg5:true
                });
              }else{
                that.setData({
                  nullImg5:false
                });
              }
              break;
          default:
              break;
      }
        
        that.refreshData(currentTab, res.data, isRefresh);
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
        that.errBackIndex(currentTab, indexPage);
      }
    )
  },

  /**
   * 订单详情
   */
  cardItemTap:function(e){
    var orderinfo = e.currentTarget.dataset.orderinfo;
    goPageAction = 'orderDetailAction';
    wx.setStorage({
      key: 'order_info',
      data: JSON.stringify(orderinfo)
    })
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail'
    })
  },

  /**
   * 进入商品详情
   */
  goodsItemTap: function(e) {
    var id = e.currentTarget.dataset.id;
    goPageAction = 'goodsDetailAction';
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  modalCancel(){},

  /**
   * 取消订单
   */
  modalConfirm(){ 
    var that = this;
    var cancelOrderReason = this.data.cancelOrderReason;
    if (cancelOrderReason == undefined || cancelOrderReason == null || cancelOrderReason==''){
      wx.showToast({title: '请选择或填写取消理由',icon: 'none',duration: 2000})
      return;
    }
    var orderNo = that.data.thisOrderNo;
    var param = 'orderNo=' + orderNo + '&clientId=' + +userId + '&cancelReason=' + cancelOrderReason;
    app.httpsDataGet('/order/cancelOrder', param,
      function(res) {
        //成功
        if (isInitPage0) {
          isInitPage0 = false
        };
        if (isInitPage1) {
          isInitPage1 = false
        };
        var currentTab = that.data.currentTab;
        that.initPageData(currentTab);
        //成功
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      },
      function(returnFrom, res) {
        //失败
      }
    )
  },

  /**
   * 取消订单弹窗
   */
  cancelOrder: function(e) {
    var that = this;
    that.setData ({
      showModal:true,
      thisOrderNo:e.currentTarget.dataset.id
    })
  },

  /**
   * 立即付款
   */
  payNow: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.no;
    var bodyStr = e.currentTarget.dataset.name;
    var amount = e.currentTarget.dataset.amount;//订单总价
    wx.showModal({
      title: '提示',
      content: "立即付款",
      showCancel: true,
      success: res => { 
        if (res.confirm) {
          that.payDialog.showPayDialog(orderId, orderNo, amount, bodyStr,'', function(ret) {
            if (ret == 'confirm') {
              //支付成功，切换到代发货页签
              that.paySuccessIniData();
              var currentTab = 2;
              that.setData({
                currentTab: currentTab,
              });
              that.initPageData(currentTab);
            }
          });
        }
      }
    })
  },

  /**
   * 提醒发货
   */
  remindDelivery: function(e) {
    var orderNo = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: "提醒发货",
      showCancel: true,
      success: res => {
        if (res.confirm) {
          var param = 'orderNo=' + orderNo + '&clientId=' + +userId;
          app.httpsDataGet('/order/remind', param,
            function (res) {
              //成功
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            },
            function (returnFrom, res) {
              //失败
            }
          );
        }
      }
    })
  },

  /**
   * 查看物流
   */
  checkLogistics: function(e) {
    var logstid = e.currentTarget.dataset.logstid; //物流单号
    var unitcode = e.currentTarget.dataset.unitcode; //物流公司编码
    var unitname = e.currentTarget.dataset.unitname; //物流公司名称
    wx.navigateTo({
      url: '/pages/checkLogistics/checkLogistics?com=' + unitcode + '&num=' + logstid + '&comName=' + unitname
    })
  },

  /**
   * 确认收货
   */
  confirmGoods: function(e) {
    var that=this;
    var orderNo = e.currentTarget.dataset.id; 
    wx.showModal({
      title: '提示',
      content: "确认收货",
      showCancel: true,
      success: res => {
        if (res.confirm) {
         // that.smsCheckDialog.showSmsCheckDialog('确认收货',6, function (isSuccess,phone,smsCode) {
            //if (isSuccess) {
              //var param = 'orderNo=' + orderNo + '&clientId=' + +userId + '&phone=' + phone + '&verifyCode=' + smsCode;
              var param = 'orderNo=' + orderNo + '&clientId=' + +userId;
              wx.showLoading();
              app.httpsDataGet('/order/confirmOrder', param,
                function (res) {
                  //成功
                  wx.hideLoading();
                  that.confirmSuccessIniData();
                  var currentTab = 4;
                  that.setData({
                    currentTab: currentTab,
                  });
                  that.initPageData(currentTab);
                },
                function (returnFrom, res) {
                  //失败
                  wx.hideLoading();
                }
              );
            //}
         // });
        } else if (res.cancel) {
          
        }
      }
    })
  },

  /**
   * 评价
   */
  orderEva: function(e) {
    var orderNo = e.currentTarget.dataset.orderid;
    var goodsList = e.currentTarget.dataset.goodslist;
    wx.setStorage({
      key: 'eve_goods_list',
      data: JSON.stringify(goodsList)
    })
    goPageAction = 'eveAction';
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderId=' + orderNo
    })
  },

  //申请售后
  afterSalesTap:function(e){
    // var orderId = e.currentTarget.dataset.id;
    // var orderNo = e.currentTarget.dataset.no;
    // goPageAction = 'afterSalesAction';
    // wx.navigateTo({
    //   url: '/pages/returnGoods/returnGoods?orderId=' + orderId + '&orderNo=' + orderNo
    // })
    var orderId = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.no;
    var shopCartFlag = e.currentTarget.dataset.shopcartflag;
    var goodslist = e.currentTarget.dataset.goodslist;
    var shopName = e.currentTarget.dataset.shopname;
    
    var orderInfo={};
    orderInfo.orderId = orderId;
    orderInfo.orderNo = orderNo;
    orderInfo.shopName = shopName;
    orderInfo.shopCartFlag = shopCartFlag;
    orderInfo.orderItem = goodslist;
    wx.setStorage({
      key: 'rtn_goods_list',
      data: JSON.stringify(orderInfo)
    })
    goPageAction = 'afterSalesAction';
    wx.navigateTo({
      url: '/pages/returnGoodsList/returnGoodsList?action=myOrderAction'
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initGlobalData();
    var currentTab = options.currentType; //0全部/退款售后；1待付款；2待发货；3待收货4待评价
    userId = app.globalData.userId;
    this.setData({
      currentTab: currentTab,
    });
    this.initPageData(currentTab);

    var reasonList = this.data.items;
    for (var index in reasonList){
      if(reasonList[index].checked){
        this.setData({
          cancelOrderReason:reasonList[index].value
        });
        break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得payDialog组件
    this.payDialog = this.selectComponent("#payDialog"); 
    this.smsCheckDialog = this.selectComponent("#smsCheckDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (goPageAction == 'eveAction') {
      wx.getStorage({
        key: 'return_code',
        success(res) {
          var returnCode = res.data;
          if (returnCode == 1) {
            that.eveScccessIniData();
            var currentTab = that.data.currentTab;
            that.initPageData(currentTab);
          }
          //清除缓存
          wx.removeStorage({
            key: 'return_code',
            success(res) {}
          })
        }
      });
    }
    else if (goPageAction == 'orderDetailAction') {
      wx.getStorage({
        key: 'return_code',
        success(res) {
          var returnCode = res.data;
          if (returnCode == 1) {
            that.paySuccessIniData();
            that.confirmSuccessIniData();
            var currentTab = that.data.currentTab;
            that.initPageData(currentTab);
          }
          //清除缓存
          wx.removeStorage({
            key: 'return_code',
            success(res) { }
          })
        }
      });
    }
    else if (goPageAction == 'afterSalesAction') {
      wx.getStorage({
        key: 'return_code',
        success(res) {
          var returnCode = res.data;
          if (returnCode == 1) {
            that.allGlobalData();
            var currentTab = that.data.currentTab;
            that.initPageData(currentTab);
          }
          //清除缓存
          wx.removeStorage({
            key: 'return_code',
            success(res) { }
          })
        }
      });
    }
    goPageAction = '';
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