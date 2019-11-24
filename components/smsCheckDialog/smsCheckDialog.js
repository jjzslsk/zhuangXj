// components/smsCheckDialog/smsCheckDialog.js
const scdPay = getApp();
var countCheckSmsCode;
var totalTimeScd = 30;
var smsType;//type:1注册，2登录，3修改密码，4信息变更,5余额支付,6确认收货
var scdfunCalSuc;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    scdTitle:'获取验证码',
    showSmsDialog: false,//显示获取验证码弹框
    smsCheckPhone: '',
    smsCheckCode: '',//短信验证码
    disabledSmsCheckCode: false, //是否屏幕获取验证码点击事件
    smsCheckCodeHint: '获取验证码', //按键提示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showSmsCheckDialog(title,type,funCal){
      var that = this;
      smsType=type;
      scdfunCalSuc = funCal;
      that.setData({
        scdTitle:title,
        showSmsDialog:true,
        smsCheckPhone: scdPay.globalData.phone,
        smsCheckCode: '',
        disabledSmsCheckCode: false,
        smsCheckCodeHint: '获取验证码'
      })
    },
    /**
   * 开始计时
   */
    startCountDownSmsCd: function () {
      var than = this;
      countCheckSmsCode = setTimeout(function () {
        totalTimeScd--;
        if (totalTimeScd < 1) {
          than.setData({ 
            disabledSmsCheckCode: false,
            smsCheckCodeHint: '重新获取',
          });
          clearTimeout(countCheckSmsCode)
        } else {
          than.setData({
            smsCheckCodeHint: totalTimeScd + '秒后重发'
          });
          than.startCountDownSmsCd();
        }
      }, 1000);
    },

    /**
     * 获取短信验证码
     */
    getSmsCodeTapCd: function (e) {
      var that = this;
      if (!scdPay.checkPhone(this.data.smsCheckPhone)) {
        wx.showToast({ title: '手机号格式不正确', icon: 'none', duration: 2000 })
        return;
      }
      if (smsType == undefined || smsType == null || smsType==''){
        wx.showToast({ title: '请求短信类型错误(' + smsType+')', icon: 'none', duration: 2000 })
        return;
      }
      if (this.data.disabledSmsCheckCode) return;

      totalTimeScd = 30;
      that.setData({
        disabledSmsCheckCode: true,
        smsCheckCodeHint: totalTimeScd + '秒后重发'
      });

      var param = 'phone=' + that.data.smsCheckPhone + '&type=' + smsType + '&openId=' + scdPay.globalData.openId + '&from=2'; 
      scdPay.httpsDataGet('/user/getSmsVerify', param,
        function (res) {
          //成功
          totalTimeScd = 30;
          that.setData({
            disabledSmsCheckCode: true,
            smsCheckCodeHint: totalTimeScd + '秒后重发'
          });
          that.startCountDownSmsCd();
        },
        function (returnFrom, res) {
          //失败
        }
      )
    },

    /**
   * 监听输入验证码
   */
    bindSmsCodeInputCd: function (e) {
      this.setData({
        smsCheckCode: e.detail.value
      })
    },

    /**确认 */
    handleOkCd: function () {
      if (this.data.smsCheckPhone == undefined || this.data.smsCheckPhone == null || this.data.smsCheckPhone==''){
        wx.showToast({ title: '获取不到绑定的手机号', icon: 'none', duration: 2000 })
      }
      else if (!scdPay.checkPhone(this.data.smsCheckPhone)) {
        wx.showToast({ title: '手机号格式不正确', icon: 'none', duration: 2000 })
      }
      else if (this.data.smsCheckCode == undefined || this.data.smsCheckCode == null || this.data.smsCheckCode == '') {
        wx.showToast({ title: '请输入验证码', icon: 'none', duration: 2000 })
      }
      else if (this.data.smsCheckCode.length < 4){
        wx.showToast({ title: '请输入4位数验证码', icon: 'none', duration: 2000 })
      }else{
        this.setData({
          showSmsDialog: false
        });
        clearTimeout(countCheckSmsCode);
        scdfunCalSuc(true, this.data.smsCheckPhone, this.data.smsCheckCode);
      }

    },

    /**取消 */
    handleCloseCd() {
      clearTimeout(countCheckSmsCode)
      this.setData({
        showSmsDialog: false
      });
      scdfunCalSuc(false, '', '');
    },

  }
})
