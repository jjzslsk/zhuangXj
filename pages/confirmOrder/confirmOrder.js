// pages/confirmOrder/confirmOrder.js
const app = getApp();
var action = 0; //0商品下单，1从购物车下单
var userId = '';
var allowSubmit=true;//是否允许提交
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney: 0.00, //合计金额
    addressInfo: { //收货地址
      takeName: '',
      takePhone: '',
      address: '',
      cityName: '',
      postcode: ''
    },
    goodsList: [], //商品列表
    remark:''//备注
  },

  /**
   * 选择地址
   */
  chooseAddressTab: function(e) {
    wx.navigateTo({
      url: '/pages/addressMg/addressMg?action=1'
    })
  },

  bindRemarkInput:function(e){
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 提交下单
   */
  submitOrder: function (e) {
    var that = this;
    var goodsList = this.data.goodsList;
    var addressInfo = this.data.addressInfo;
    if (addressInfo.address == null || addressInfo.address == '' || addressInfo.address == undefined) {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        showCancel: false,
        success: res => {}
      })
    } else {
      var param = {};
      if (action == 0) {
        //商品直接下单
        param.clientId = userId; //用户id
        param.clientAddress = addressInfo.address; //地址
        param.clientCity = addressInfo.cityName; //城市
        param.clientMailbox = addressInfo.postcode; //邮编
        param.clientName = addressInfo.takeName; //收货人
        param.clientPhone = addressInfo.takePhone; //联系号码
        param.shopItemId = goodsList[0].goodsId; //商品id
        param.itemNumber = goodsList[0].buyNum; //商品购买数量
        param.shopItemSpecAttr = goodsList[0].shopItemSpecAttr; //商品规格
        param.itemPrice = goodsList[0].price; //商品价格
        param.imgUrl = goodsList[0].imgUrl;
      } else {
        //从购物车进来下单
        var shopCartIdList = '';
        for (var index in goodsList) {
          shopCartIdList = shopCartIdList + goodsList[index].shopCartId;
          if (index < goodsList.length - 1) {
            shopCartIdList = shopCartIdList + ',' 
          }
        }
        param.clientId = userId; //用户id
        param.clientAddress = addressInfo.address; //地址
        param.clientCity = addressInfo.cityName; //城市
        param.clientMailbox = addressInfo.postcode; //邮编
        param.clientName = addressInfo.takeName; //收货人
        param.clientPhone = addressInfo.takePhone; //联系号码
        param.shopCartId = shopCartIdList;

        param.shopItemId = goodsList[0].goodsId; //商品id
        param.itemNumber = goodsList[0].buyNum; //商品购买数量
        param.shopItemSpecAttr = goodsList[0].shopItemSpecAttr; //商品规格
        param.itemPrice = goodsList[0].price; //商品价格
        param.imgUrl = goodsList[0].imgUrl;
      }
      param.memo = that.data.remark;//备注
      if (!allowSubmit) return;
      allowSubmit=false;
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
          allowSubmit = true;
        }
      );
    }
  },

  /**
   * 检查是否用户登录状态
   */
  checkLoginState: function() {
    if (!app.checkLoginState()) {
      wx.showModal({
        title: '尚未登录',
        content: '请先登录在操作',
        showCancel: false,
        success: res => {
          wx.switchTab({
            url: '/pages/me/me'
          })
        }
      })
      return false;
    } else {
      return true;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    allowSubmit = true;
    if (!this.checkLoginState()) return;
    userId = app.globalData.userId;
    action = options.action;
    var that = this;
    wx.getStorage({
      key: 'goods_list',
      success(res) {
        var goodsList = JSON.parse(res.data);
        var totalMoney = 0;
        for (var index in goodsList) {
          var xfMoney = (Number(goodsList[index].price) * Number(goodsList[index].buyNum)).toFixed(2);
          totalMoney = app.accAdd(totalMoney,xfMoney);
          totalMoney = app.accAdd(totalMoney, Number(goodsList[index].postageAmnt));
        }
        that.setData({
          goodsList: goodsList,
          totalMoney: totalMoney.toFixed(2)
        })
        //清除缓存
        wx.removeStorage({
          key: 'goods_list',
          success(res) {}
        })
      }
    });
    app.getUserDefAddress(function(ret) {
      if (ret == null) return;
      var addressInfoTemp = {};
      addressInfoTemp.takeName = ret.CLIENT_NAME;
      addressInfoTemp.takePhone = ret.CLIENT_PHONE;
      addressInfoTemp.address = ret.CLIENT_ADDRESS;
      addressInfoTemp.cityName = ret.CLIENT_CITY;
      addressInfoTemp.postcode = ret.CLIENT_MAILBOX;
      that.setData({
        addressInfo: addressInfoTemp
      });
    });
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