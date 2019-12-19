// pages/orderDetail/orderDetail.js
const app = getApp();
var utilMd5 = require('../../utils/md5.js'); 
var userId = '';
var orderStatus = '';
var cancelOrderReason = '';//取消订单理由
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,// 弹窗
    //弹窗选项
    items: [
      { name: 'a', value: '我不想买了', checked: true },
      { name: 's', value: '信息填写错误', checked: false },
      { name: 'd', value: '卖家缺货', checked: false },
      { name: 'g', value: '其他原因', checked: false },
    ],
    logisticsInfo:false,
    dataInfo: {}
  },

  /**跳转到商店 */
  goShopTap: function (e) {
    //店铺
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?shopId=' + id
    })
  },

  /**
  * 进入商品详情
  */
  goodsItemTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  //弹窗选择
  radioChange: function (e) {
    cancelOrderReason = e.detail.value;
  },

  modalCancel: function (e) {
    this.setData({
      showModal:false
    });
  },

  //聊一聊
  chatTap:function(e){
    var param = 'orderId=&otherPayId=' + this.data.dataInfo.shopId + '&otherPayName=' + this.data.dataInfo.shopName + '&otherPayAva=' + this.data.dataInfo.shopLogo;
    wx.navigateTo({
      url: '/pages/chat/chat?' + param
    })
  },

  /**
   * 取消订单
   */
  modalConfirm: function (e) {
    var that = this;
    this.setData({
      showModal: false
    });
    var orderNo = that.data.dataInfo.orderNo;
    var param = 'orderNo=' + orderNo + '&clientId=' + +userId + '&cancelReason=' + cancelOrderReason;
    app.httpsDataGet('/order/cancelOrder', param,
      function (res) {
        //成功
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        var orderStatus = "dataInfo.orderStatus";
        that.setData({
          [orderStatus]: 6,
        });
        wx.setStorage({
          key: 'return_code',
          data: '1'
        })
      },
      function (returnFrom, res) {
        //失败
      }
    )
  },

  /**
   * 取消订单弹窗
   */
  cancelOrder: function (e) {
    var that = this;
    that.setData({
      showModal: true
    })
  },

  /**
   * 立即付款
   */
  payNow: function (e) {
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
          that.payDialog.showPayDialog(orderId, orderNo, amount, bodyStr, '',function (ret) {
            if (ret == 'confirm') {
              var orderStatus = "dataInfo.orderStatus";
              that.setData({
                [orderStatus]: 1,
              });
              wx.setStorage({
                key: 'return_code',
                data: '1'
              })
              wx.showToast({ title: '支付成功,等待发货', icon: 'none', duration: 2000 })
            }
          });
        }
      }
    })
  },

  /**
   * 提醒发货
   */
  remindDelivery: function (e) {
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
  checkLogistics: function (e) {
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
  confirmGoods: function (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: "确认收货",
      showCancel: true,
      success: res => {
        if (res.confirm) {

          //that.smsCheckDialog.showSmsCheckDialog('确认收货',6, function (isSuccess,phone,smsCode) {
           // if (isSuccess) {
              //var param = 'orderNo=' + orderNo + '&clientId=' + +userId + '&phone=' + phone + '&verifyCode=' + smsCode;
              var param = 'orderNo=' + orderNo + '&clientId=' + +userId ;
              wx.showLoading();
              app.httpsDataGet('/order/confirmOrder', param,
                function (res) {
                  //成功
                  wx.hideLoading();
                  var orderStatus = "dataInfo.orderStatus";
                  that.setData({
                    [orderStatus]: 4,
                  });
                  wx.setStorage({
                    key: 'return_code',
                    data: '1'
                  })
                  wx.showToast({ title: '确认收货成功', icon: 'none', duration: 2000 })
                },
                function (returnFrom, res) {
                  //失败
                  wx.hideLoading();
                }
              );
           // }else{
              
           // }
          //});
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 评价
   */
  orderEva: function (e) {
    var orderNo = e.currentTarget.dataset.orderid;
    var goodsList = e.currentTarget.dataset.goodslist;
    wx.setStorage({
      key: 'eve_goods_list',
      data: JSON.stringify(goodsList)
    })
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderId=' + orderNo
    })
  },

  //申请售后
  afterSalesTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.no;
    var shopCartFlag = e.currentTarget.dataset.shopcartflag;
    var goodslist = e.currentTarget.dataset.goodslist;
    var shopName = e.currentTarget.dataset.shopname;
    var shopPhone = e.currentTarget.dataset.shopphone;


    var orderInfo = {};
    orderInfo.orderId = orderId;
    orderInfo.orderNo = orderNo;
    orderInfo.shopName = shopName;
    orderInfo.shopPhone = shopPhone;
    orderInfo.shopCartFlag = shopCartFlag;
    orderInfo.orderItem = goodslist;
    wx.setStorage({
      key: 'rtn_goods_list',
      data: JSON.stringify(orderInfo)
    })
    wx.navigateTo({
      url: '/pages/returnGoodsList/returnGoodsList?action=orderDetailAction'
    })
  },

  /**
   * 查询物流信息
   * com 物流公司编号
   * num 物流单号
   */
  httpsLogisticsData: function (com, num) {
    var that = this;
    var param = "{\"com\":\"" + com + "\",\"num\":\"" + num + "\"}";
    var customer = app.globalData.realTimeCustomer;
    var key = app.globalData.realTimeKey;
    var md5Str = utilMd5(param + key + customer);
    var sign = md5Str.toUpperCase();
    var paramStr = "customer=" + customer + "&sign=" + sign + "&param=" + param;
    wx.showLoading();
    wx.request({
      url: app.globalData.wlUrl + '?' + paramStr,
      method: 'post',
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      success: res => {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var obj = res.data;
          if (obj.message = 'ok') {
            if (obj.data != undefined && obj.data.length>0){
              that.setData({
                logisticsInfo: obj.data[0]
              });
            }
          } else {
            wx.showToast({
              title: obj.message,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '请求失败(' + res.statusCode + ')',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        //请求接口失败
        wx.hideLoading()
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = app.globalData.userId;
    var that = this;
    wx.getStorage({
      key: 'order_info',
      success(res) {
        var orderInfo = JSON.parse(res.data);
        that.setData({
          dataInfo: orderInfo
        });
        var com = orderInfo.goodsCode;//物流公司编号
        var num = orderInfo.goodsNo;//物流单号
        that.httpsLogisticsData(com, num);
        //清除缓存
        wx.removeStorage({
          key: 'order_info',
          success(res) { }
        })
      }
    });
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得payDialog组件
    this.payDialog = this.selectComponent("#payDialog");
    this.smsCheckDialog = this.selectComponent("#smsCheckDialog");
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