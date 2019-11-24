// pages/upPhone/upPhone.js

var countdownSmsCodeCur;
var totalTimeCur = 30;
var countdownSmsCodeNext;
var totalTimeNext = 30;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneCur: '', //当前手机号
    smsCodeCur: '', //验证码
    phoneNext: '', //新的手机号
    smsCodeNext: '', //新验证码
    disabledSmsCodeCur: false, //是否屏幕获取验证码点击事件
    smsCodeHintCur: '获取验证码', //按键提示
    disabledSmsCodeNext: false, //是否屏幕获取验证码点击事件
    smsCodeHintNext: '获取验证码', //按键提示
    isNext: false, //是否流入下一步
  },

  /**
   * 监听第一步输入当前手机号码
   */
  bindPhoneInputCur: function(e) {
    this.setData({
      phoneCur: e.detail.value
    })
  },


  /**
   * 监听第一步输入验证码
   */
  bindSmsCodeInputCur: function(e) {
    this.setData({
      smsCodeCur: e.detail.value
    })
  },

  /**
   * 第一步开始计时
   */
  startCountDownCur: function() {
    var than = this;
    countdownSmsCodeCur = setTimeout(function() {
      totalTimeCur--;
      if (totalTimeCur < 1) {
        than.setData({
          disabledSmsCodeCur: false,
          smsCodeHintCur: '重新获取',
        });
        clearTimeout(countdownSmsCodeCur)
      } else {
        than.setData({
          smsCodeHintCur: totalTimeCur + '秒后重发'
        });
        than.startCountDownCur();
      }
    }, 1000);
  },

  /**
   * 获取第一步短信验证码
   */
  getSmsCodeTapCur: function(e) {
    if (this.data.phoneCur == '') {
      wx.showModal({
        title: '提示',
        content: '请输入当前手机号码',
        showCancel: false,
        success: res => {}
      })
      return;
    }
    totalTimeCur = 30;
    this.setData({
      disabledSmsCodeCur: true,
      smsCodeHintCur: totalTimeCur + '秒后重发'
    });
    this.startCountDownCur();
  },

  /**
   * 下一步
   */
  nextTap: function(e) {
    var phoneCur = this.data.phoneCur; //当前手机号
    var smsCodeCur = this.data.smsCodeCur; //验证码
    if (phoneCur == null || phoneCur == '' || phoneCur == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入当前手机号码',
        showCancel: false,
        success: res => {}
      })
    } else if (smsCodeCur == null || smsCodeCur == '' || smsCodeCur == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
        success: res => {}
      })
    } else {
      //进入下一步
      clearTimeout(countdownSmsCodeCur)
      this.setData({
        isNext: true
      });

    }
  },


  /**
   * 监听第二步输入当前手机号码
   */
  bindPhoneInputNext: function(e) {
    this.setData({
      phoneNext: e.detail.value
    })
  },


  /**
   * 监听第二步输入验证码
   */
  bindSmsCodeInputNext: function(e) {
    this.setData({
      smsCodeNext: e.detail.value
    })
  },

  /**
   * 第二步开始计时
   */
  startCountDownNext: function() {
    var than = this;
    countdownSmsCodeNext = setTimeout(function() {
      totalTimeNext--;
      if (totalTimeNext < 1) {
        than.setData({
          disabledSmsCodeNext: false,
          smsCodeHintNext: '重新获取',
        });
        clearTimeout(countdownSmsCodeNext)
      } else {
        than.setData({
          smsCodeHintNext: totalTimeNext + '秒后重发'
        });
        than.startCountDownNext();
      }
    }, 1000);
  },

  /**
   * 获取第二步短信验证码
   */
  getSmsCodeTapNext: function(e) {
    if (this.data.phoneNext == '') {
      wx.showModal({
        title: '提示',
        content: '请输入新手机号码',
        showCancel: false,
        success: res => {}
      })
      return;
    }
    totalTimeNext = 30;
    this.setData({
      disabledSmsCodeNext: true,
      smsCodeHintNext: totalTimeNext + '秒后重发'
    });
    this.startCountDownNext();
  },


  /**
   * 提交
   */
  submitTap: function(e) {

    var phoneCur = this.data.phoneCur; //当前手机号
    var smsCodeCur = this.data.smsCodeCur; //验证码

    var phoneNext = this.data.phoneNext; //新手机号
    var smsCodeNext = this.data.smsCodeNext; //新验证码

    if (phoneCur == null || phoneCur == '' || phoneCur == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入当前手机号码',
        showCancel: false,
        success: res => {}
      })
    } else if (smsCodeCur == null || smsCodeCur == '' || smsCodeCur == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
        success: res => {}
      })
    } else if (phoneNext == null || phoneNext == '' || phoneNext == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入新手机号',
        showCancel: false,
        success: res => {}
      })
    } else if (smsCodeNext == null || smsCodeNext == '' || smsCodeNext == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入新手机号的验证码',
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
    clearTimeout(countdownSmsCodeCur)
    clearTimeout(countdownSmsCodeNext)
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