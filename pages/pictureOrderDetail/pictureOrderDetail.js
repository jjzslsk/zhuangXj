// pages/pictureOrderDetail/pictureOrderDetail.js
const app = getApp();
var userId = '';
var orderId = '';
var shopId = '';
var indexPage = 1; //页码从1开始
var pageNum = 10000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    imgList: [],
    baseInfo:{},
    goodsList:[],
    totalPrice: 0.00, //总价(包括邮费)
    totalPostageAmnt:0.00,//邮费
    goodsNumber:'',
    isGoodsNumber:0,
    remark:'',
    handleData:{},
    showPayBtn:false,
    showCancelOrder:false,
  },

  /**预览规格图片 */
  lookSpecTap: function (e) {
    var position = e.currentTarget.dataset.position; 
    var imgUrls = this.data.imgList;
    wx.previewImage({
      current: imgUrls[position], // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })
  },

  /**点击商品列表item,显示商品信息弹框  */
  goodsItemTap:function(e){
    var goodsItem = e.currentTarget.dataset.goodsobj; //商品对象
    this.setData({
      handleData: goodsItem,
      visible: true
    });
  },

  /**关闭商品信息弹框 */
  handleClose() {
    this.setData({
      handleData: {},
      visible: false
    });
  },

  /**删除数量 */
  delNumTap:function(e){
    var position = e.currentTarget.dataset.position; //列表下标
    var buyNum = this.data.goodsList[position].itemNumber; //购买数量
    if (buyNum > 1) {
      buyNum--;
      var upPuyNum = "goodsList[" + position + "].itemNumber";
      this.setData({
        [upPuyNum]: buyNum
      })
      this.calTotalPrice();

      //延时一秒修改购物车
      var orderData = this.data.goodsList[position];
      this.httpsUpShopCart(orderData, buyNum);

    } else {
      wx.showToast({
        title: '已经不能再减了',
        duration: 1000
      })
    }
  },

  /**添加数量 */
  appNumTap: function (e) {
    var position = e.currentTarget.dataset.position; //列表下标
    var buyNum = this.data.goodsList[position].itemNumber; //购买数量
    var upNumber = this.data.goodsList[position].upNumber; //库存
    buyNum++;
    if (buyNum > upNumber) {
      wx.showToast({
        title: '数量不能大于库存:' + upNumber,
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var upPuyNum = "goodsList[" + position + "].itemNumber";
    this.setData({
      [upPuyNum]: buyNum
    })
    this.calTotalPrice();

    //延时一秒修改购物车
    var orderData = this.data.goodsList[position]
    this.httpsUpShopCart(orderData, buyNum);
  },

  bindRemarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },


  /**计算总价 */
  calTotalPrice:function(){
    var goodsList = this.data.goodsList;
    var totalPrice = 0;//总价(包括邮费)
    var totalPostageAmnt=0;//总邮费
    var goodsSum = [];

    for (var index in goodsList) {
      var xfMoney = (Number(goodsList[index].itemSalePrice) * Number(goodsList[index].itemNumber)).toFixed(2);
      totalPrice = app.accAdd(totalPrice, xfMoney);
      var postageAmnt = goodsList[index].postageAmnt == undefined ? 0 : goodsList[index].postageAmnt;
      totalPostageAmnt = app.accAdd(totalPostageAmnt, Number(postageAmnt));
      // totalPrice = app.accAdd(totalPrice, Number(postageAmnt));
      goodsSum.push(goodsList[index].itemNumber)
      this.setData({
        goodsNumber: goodsSum.reduce((a, b) => a + b)
      })
    }
    
    totalPrice = app.accAdd(totalPrice, Number(totalPostageAmnt));
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalPostageAmnt: totalPostageAmnt.toFixed(2),
      isGoodsNumber: this.data.goodsNumber //解决数字统计时闪烁问题
    })

  },

  //更新购买数量
  httpsUpShopCart: function (orderData, goodsNumber) {
    //延时一秒修改购物车
    var param = 'clientId=' + orderData.clientId + '&shopCartId=' + orderData.shopCartId + '&number=' + goodsNumber;
    setTimeout(function () {
      app.httpsDataGet('/order/updateShopCart', param,
        function (res) {
          //成功
        },
      );
    }, 1000);
  },

  /**聊一聊 */
  chatTap:function(e){
    var param = 'orderId=&otherPayId=' + this.data.baseInfo.shopId + '&otherPayName=' + this.data.baseInfo.shopName + '&otherPayAva=' + this.data.baseInfo.shopLogo;
    wx.navigateTo({
      url: '/pages/chat/chat?' + param
    })
  },

  /**取消订单 */
  cancelOrderTap:function(e){
    var param={};
    param.photoOrderId=orderId;
    param.status='4';
    wx.showLoading();
    app.httpsDataPost('/photoOrder/updatePhotoOrder', param,
      function (ret) {
        wx.hideLoading();
        //成功
        if (ret.status){
          wx.showModal({
            title: '温馨提示',
            content: '取消成功',
            showCancel: false,
            success: function (res) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面
              //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
              prevPage.httpsData(true);
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.showToast({
            title: ret.msg + '(' + ret.code+')',
            icon: 'none',
            duration: 2000
          })
        }
      },
      function (err) {
        //失败
        wx.hideLoading();
      }
    );
  },

  /**立即付款*/
  paymentTap:function(e){
    var that = this;
    var baseInfo = this.data.baseInfo;
    var goodsList = this.data.goodsList;

    if (goodsList==undefined || goodsList.length==0){
      wx.showToast({
        title: '暂无购买的商品',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    var param={};
    //从购物车进来下单
    var shopCartIdList = '';
    for (var index in goodsList) {
      shopCartIdList = shopCartIdList + goodsList[index].shopCartId;
      if (index < goodsList.length - 1) {
        shopCartIdList = shopCartIdList + ','
      }
    }

    param.clientId = userId; //用户id
    param.clientAddress = baseInfo.clientDetailAddress.clientAddress; //地址
    param.clientCity = baseInfo.clientDetailAddress.clientCity; //城市
    param.clientMailbox = baseInfo.clientDetailAddress.clientMailbox; //邮编
    param.clientName = baseInfo.clientDetailAddress.clientName; //收货人
    param.clientPhone = baseInfo.clientDetailAddress.clientPhone; //联系号码
    param.shopCartId = shopCartIdList;

    param.shopItemId = goodsList[0].goodsId; //商品id
    param.itemNumber = goodsList[0].itemNumber; //商品购买数量
    param.shopItemSpecAttr = goodsList[0].shopItemSpecAttr; //商品规格
    param.itemPrice = goodsList[0].itemSalePrice; //商品价格
    param.imgUrl = goodsList[0].imgUrl;
    param.memo = that.data.remark;//备注

    wx.showLoading({
      title: '加载中',
    })
    //生成订单
    app.httpsDataPost('/order/createOrder', param,
      function (ret) {
        //成功
        var orderId = ret.data.orderId; //订单id
        var orderNo = ret.data.orderNo; //订单编号
        var goodsList = that.data.goodsList;
        var amount = ret.data.amount;
        var mutiOrderNo = ret.data.mutiOrderNo;
        var bodyStr = '';
        for (var index in goodsList) {
          bodyStr = bodyStr + goodsList[index].itemName;
          if (index < goodsList.length - 1) {
            bodyStr = bodyStr + ',';
          }
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.httpsData(true);
        that.payDialog.showPayDialog(orderId, orderNo, amount, bodyStr, mutiOrderNo, function(ret) {
          var currentType=1;
          if (ret =='confirm'){
            currentType=2;
          }
          wx.redirectTo({
            url: '/pages/myOrder/myOrder?currentType=' + currentType
          })
          
        });
      },
      function(ret) {
        //失败
        wx.hideLoading();
      }
    );

  },

  httpsData: function () {
    var that = this;
    var param = 'photoOrderId=' + orderId;
    wx.showLoading();
    app.httpsDataGet('/photoOrder/getPhotoOrderList', param,
      function (res) {
        //成功
        var dataObj = res.data[0];
        var status = dataObj.status;
        that.setData({
          baseInfo: dataObj,
          imgList: dataObj.imgUrl, 
          showPayBtn: status == 1 ? true : false
        });

        if (status == 4 || status == 5){ //订单被取消
          that.setData({
            showCancelOrder: false
          });
        }else {
          that.setData({
            showCancelOrder: true
          });
        }

        if(status==0){
          wx.hideLoading();
        }else{
          that.httpsDataCar();
        }
      },
      function (res) {
        //失败
      }
    )
  },

  httpsDataCar: function (){
    var that = this;
    var param = 'userId=' + userId + '&startPage=' + indexPage + '&recordSize=' + pageNum + '&photoOrderId=' + orderId;
    app.httpsDataGet('/order/getCartList', param,
      function (res) {
        wx.hideLoading();
        var data = res.data;
        that.setData({
          goodsList: data
        });
        that.calTotalPrice();
      },
      function (returnFrom, res) {
        //失败
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = app.globalData.userId;
    orderId = options.orderId;
    shopId = options.shopId;
    this.httpsData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得payDialog组件
    this.payDialog = this.selectComponent("#payDialog");
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