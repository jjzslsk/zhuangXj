// pages/resetPwd/resetPwd.js
const app = getApp();
var countdownSmsCode;
var totalTime = 30;

Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    phoneCur: '', //当前手机号
    smsCode: '', //验证码
    newPwd: '', //新密码
    againNewPwd: '', //确认新密码
    disabledSmsCode: true, //是否屏幕获取验证码点击事件
    smsCodeHint: '获取验证码', //按键提示
  },

  /**
   * 监听输入当前手机号码
   */
  bindPhoneInput: function(e) {
    this.setData({
      phoneCur: e.detail.value,
      disabledSmsCode: !app.checkPhone(e.detail.value)
    })
  },


  /**
   * 监听输入新密码
   */
  bindNewPwdInput: function(e) {
    this.setData({
      newPwd: e.detail.value
    })
  },

  /**
   * 监听输入确认密码
   */
  bindAgainNewPwdInput: function(e) {
    this.setData({
      againNewPwd: e.detail.value
    })
  },

  /**
   * 监听输入验证码
   */
  bindSmsCodeInput: function(e) {
    this.setData({
      smsCode: e.detail.value
    })
  },

  /**
   * 开始计时
   */
  startCountDown: function() {
    var that = this;
    countdownSmsCode = setTimeout(function() {
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
  getSmsCodeTap: function(e) {
    var that=this;
    if (this.data.disabledSmsCode) return;
    if (this.data.phoneCur == '') {
      wx.showModal({
        title: '提示',
        content: '请输入当前手机号码',
        showCancel: false,
        success: res => {}
      })
      return;
    }
    that.setData({
      disabledSmsCode: true
    });
    var param = 'phone=' + this.data.phoneCur + '&type=3';//type:1注册，2登录，3修改密码，4信息变更
    app.httpsDataGet('/user/getSmsVerify', param,
      function (res) {
        //成功
        totalTime = 30;
        that.setData({
          smsCodeHint: totalTime + '秒后重发'
        });
        that.startCountDown();
      },
      function (returnFrom,res) {
        //失败
        wx.hideLoading()
        that.setData({
          disabledSmsCode: false
        });
      }
    )
    
  },

  /**
   * 提交
   */
  submitTap: function(e) {
    var phoneCur = this.data.phoneCur; //当前手机号
    var smsCode = this.data.smsCode; //验证码
    var newPwd = this.data.newPwd; //新密码
    var againNewPwd = this.data.againNewPwd; //确认新密码
    if (phoneCur == null || phoneCur == '' || phoneCur == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入当前手机号码',
        showCancel: false,
        success: res => {}
      })
    } else if (smsCode == null || smsCode == '' || smsCode == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
        success: res => {}
      })
    } else if (newPwd == null || newPwd == '' || newPwd == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入新密码',
        showCancel: false,
        success: res => {}
      })
      return;
    } else if (againNewPwd == null || againNewPwd == '' || againNewPwd == undefined) {
      wx.showModal({
        title: '提示',
        content: '请再次输入新密码',
        showCancel: false,
        success: res => {}
      })
    } else if (newPwd != againNewPwd) {
      wx.showModal({
        title: '提示',
        content: '输入的两次密码不一致',
        showCancel: false,
        success: res => {}
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '提交',
        showCancel: false,
        success: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    clearTimeout(countdownSmsCode)
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