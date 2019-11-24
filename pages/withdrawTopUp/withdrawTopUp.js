// pages/reflectTopUp/reflectTopUp.js
const app = getApp()
var action = 0;//0充值;1提现
var countdownSmsCode;
var totalTime = 30;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:0,//0充值,1提现
    typeText:'充值方式',
    amountText:'充值金额',
    promptText:'该卡本次最多可充值¥',
    balance:0,//最大充值/提现金额限制
    singleMinAmount: 0,//单笔最低金额限制
    singleMaxAmount:0,//单笔最高金额限制
    backNum: '', //银行卡号
    backName: '',//银行卡名称
    amount:'',//金额
    submitText:'确定充值',
    isAgreed:false,
    showCodeDialog:false,
    disabledSmsCode: true, //是否屏蔽获取验证码点击事件
    smsCodeHint: '获取验证码', //按键提示
    phone:'',//手机号
    smsCode:''//短信验证码
  },

  moneyInput(e) {
    var money = e.detail.value;
    if (money == undefined || money == null || money == '' || Number(money)<0){
      this.setData({
        amount: '',
      })
      return;
    }
    if (/^(\d?)+(\.\d{0,2})?$/.test(money)) { //正则验证，提现金额小数点后不能大于两位数字
    } else {
      var arr = money.split('.');
      if(arr.length>1){
        var decimal = arr[1];//小数部分
        //小数大于两位，则截取两位小数
        money=arr[0]+'.'+decimal.substring(0,2);
      }
      //money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    var balance = this.data.balance;
    var singleMaxAmount = this.data.singleMaxAmount;
    if (Number(money) > Number(balance)){
      wx.showToast({ title: '余额不足',icon: 'none', duration: 2000 })
    }
    else if (Number(money) > Number(singleMaxAmount)) {
      wx.showToast({ title: '单笔不能超过最大限制￥' + singleMaxAmount, icon: 'none', duration: 2000 })
    }
    this.setData({
      amount: money,
    })
  },

  /**同意协议 */
  agreedTap:function(e){
    var isAgreed = this.data.isAgreed;
    this.setData({
      isAgreed: !isAgreed
    });
  },

  /**查看支付协议 */
  payAgreementTap:function(e){
    wx.navigateTo({
      url: '/pages/agreement/agreement?action=0'
    })
  },

/**显示获取验证码弹框 */
  showVerifyCodeDialog: function () {
    this.setData({
      phone: app.globalData.phone,
      disabledSmsCode: app.globalData.phone.length > 0 ? false : true,
      showCodeDialog: true
    });
  },
  /**关闭获取验证码弹框 */
  closelCodeDialog: function (e) {
    this.setData({
      showCodeDialog: false
    });
  },

  /**获取到验证码进行提现 */
  sumbitCodeDialog: function (e) {
    var amount = this.data.amount;
    var phone = this.data.phone;
    var smsCode = this.data.smsCode;
    if (phone == undefined || phone == null || phone=='') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false,
        success: res => { }
      })
    } else if (smsCode == '' || smsCode.length < 4) {
      wx.showModal({
        title: '提示',
        content: '请输入4位数验证码',
        showCancel: false,
        success: res => { }
      })
    } else {
      this.closelCodeDialog();
      this.createWithdrawDepositOrder(amount, phone, smsCode);
    }

  },

  /**
   * 监听输入验证码
   */
  bindSmsCodeInput: function (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },

  /**
   * 开始计时
   */
  startCountDown: function () {
    var that = this;
    countdownSmsCode = setTimeout(function () {
      totalTime--;
      if (totalTime < 1) {
        that.setData({
          disabledSmsCode: false,
          smsCodeHint: '重新获取',
        });
        clearTimeout(countdownSmsCode)
      } else {
        that.setData({
          smsCodeHint: totalTime + '秒后重发'
        });
        that.startCountDown();
      }
    }, 1000);
  },

  /**
    * 获取短信验证码
    */
  getSmsCodeTap: function (e) {
    var that = this;
    if (this.data.disabledSmsCode) return;
    if (this.data.phone == '') {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
        showCancel: false,
        success: res => { }
      })
      return;
    }
    that.setData({
      disabledSmsCode: true
    });
    var param = 'phone=' + this.data.phone + '&type=5' + '&openId=' + app.globalData.openId + '&from=2'; //type:1注册，2登录，3修改密码，4信息变更
    app.httpsDataGet('/user/getSmsVerify', param,
      function (res) {
        //成功
        totalTime = 30;
        that.setData({
          smsCodeHint: totalTime + '秒后重发'
        });
        that.startCountDown();
      },
      function (returnFrom, res) {
        //失败
        that.setData({
          disabledSmsCode: false
        });
      }
    )
  },


  /**创建提现单 */
  createWithdrawDepositOrder: function (amount, phone, verifyCode) {
    var that = this;
    var balance = this.data.balance;//账户余额
    if (balance == undefined || balance == null || balance == '' || Number(balance) < 0 || Number(amount) > Number(balance)) {
      wx.showToast({ title: '余额不足', icon: 'none', duration: 2000 });
      return;
    }
    var param = {};
    param.clientId = app.globalData.userId;
    param.type = 2;
    param.payment = 3;
    param.amount = amount;
    param.clientPhone = phone;
    param.verifyCode = verifyCode;

    wx.showLoading();
    app.httpsDataPost('/order/createCashOrder', param,
      function (res) {
        //成功
        wx.hideLoading();
        if (res.status) {
          var payOrderId = res.data.orderId;
          var payOrderNo = res.data.orderNo;
          that.startWithdrawHttps(payOrderId, payOrderNo, amount);
        } else{
          wx.showToast({ title: res.msg + '(' + res.code + ')', icon: 'none', duration: 2000 });
        }
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    )

  },
  
  /**
   * 开始提现
   * payOrderId 支付单id
   * payOrderNo 支付单编号
   * amount 提现金额
   */
  startWithdrawHttps:function(payOrderId,payOrderNo,amount){
    var that = this;
    var balance = this.data.balance;//账户余额
    if (balance == undefined || balance == null || balance == '' || Number(balance) < 0 || Number(amount) > Number(balance)) {
      wx.showToast({ title: '余额不足', icon: 'none', duration: 2000 });
      return;
    }
    var openId = app.globalData.openId;
    var param = "PAY_MODE=other&OPEN_ID=" + openId + "&ORDER_ID=" + payOrderId + "&ORDER_NO=" + payOrderNo + "&AMOUNT=" + amount;
    wx.showLoading();
    app.httpsPlatformClass('fkXiPay', param,
      function (res) {
        //成功
        wx.hideLoading();
        var resultObj = res.msg;
        if (typeof resultObj == 'object' && resultObj) {
          //如果是json对象,不用做处理
        } else {
          //如果是json字符串，则需要处理成json对象
          if (resultObj == '' || resultObj == null) { } else {
            resultObj = JSON.parse(resultObj);
          }
        }
        if (resultObj.code==0){
          var balance = that.data.balance;
          var remainMoney = Number(balance) - Number(amount);
          remainMoney = app.accAdd(0, remainMoney);
          that.setData({
            balance: remainMoney
          });

          wx.showModal({
            title: '提示',
            // content: resultObj.msg,
            content: '提现成功！',
            showCancel:false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else{
          wx.showToast({ title: resultObj.msg+ '(' + resultObj.code + ')', icon: 'none', duration: 2000 });
        }

      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    );


  },


  /**确定提交 */
  submitInfo: function (e) {
    var that = this;
    var backNum = this.data.backNum;//银行卡号
    var backName = this.data.backName;//银行卡名称
    var amount = this.data.amount;//金额
    var balance = this.data.balance;//账户余额
    var singleMinAmount = this.data.singleMinAmount;//提现单笔最低限制
    var singleMaxAmount = this.data.singleMaxAmount;//提现单笔最高限制
    var isAgreed = this.data.isAgreed;//同意协议

    // if (backName == undefined || backName == null || backName == '') {
    //   wx.showToast({ title: '请选择银行卡号', icon: 'none', duration: 2000 })
    // }
    if (amount == undefined || amount == null || amount == '') {
      wx.showToast({ title: '请输入金额', icon: 'none', duration: 2000 });
    }
    else if (Number(amount) < Number(singleMinAmount)) {
      wx.showToast({ title: '单笔不能低于￥' + singleMinAmount, icon: 'none', duration: 2000 })
    }
    else if (Number(amount) > Number(singleMaxAmount)) {
      wx.showToast({ title: '单笔不能高于￥' + singleMaxAmount, icon: 'none', duration: 2000 })
    }
    else if (balance == undefined || balance == null || balance == '' || Number(balance) < 0 || Number(amount) > Number(balance)) {
      wx.showToast({ title: '余额不足', icon: 'none', duration: 2000 });
    }
    else if (!isAgreed) {
      wx.showToast({ title: '您未同意支付协议', icon: 'none', duration: 2000 })
    } else {
      if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == '') {
        app.wxLogin().then(function (res) {
          that.showVerifyCodeDialog();
        })
      } else {
        that.showVerifyCodeDialog();
      }
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    action = options.action;
    var balance = options.balance;
    if (action==0){
      //充值
      wx.setNavigationBarTitle({
        title: '余额充值'
      });
      this.setData({
        action: 0,//0充值,1提现
        typeText: '充值方式',
        amountText: '充值金额',
        promptText: '该卡本次最多可充值¥',
        singleMinAmount: 1,
        singleMaxAmount:2000,
        balance:0,
        backNum: '', //银行卡号
        backName: '',//银行卡名称
        amount: '',//金额
        submitText: '确定充值',
        isAgreed: false
      });
    } else{
      //提现
      wx.setNavigationBarTitle({
        title: '余额提现'
      });
      this.setData({
        action: 1,//0充值,1提现
        typeText: '提现到',
        amountText: '提现金额',
        promptText: '可用余额¥',
        singleMinAmount: 0.3,
        singleMaxAmount: 5000,
        balance:balance,
        backNum: '', //银行卡号
        backName: '微信余额',//银行卡名称
        amount: '',//金额
        submitText: '确定提现',
        isAgreed: false
      });
    }
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