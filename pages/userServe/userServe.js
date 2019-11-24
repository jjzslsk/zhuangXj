// pages/userServe/userServe.js
const app = getApp();
var clientRole = ['行业代表', '服务中心', '县级代理', '市级代理', '省级代理', '工匠', '店铺'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = ''
    var param = ''
    if (options.type == 'mobile') {
      param = 'openId=' + app.globalData.userInfoData.data.openId + '&clientId=' + app.globalData.userInfoData.data.clientId + '&clientAccount=' + app.globalData.userInfoData.data.clientAccount + '&oldPhone=' + app.globalData.userInfoData.data.clientPhone;
      url = app.globalData.gzhurl +'/zxj_company/weixin_gzh/edit_phone.jsp?' + param;
      wx.setNavigationBarTitle({
        title: '修改号码'
      })
    }
    
    else if (options.type == 'zgrWeChat') {
      param = JSON.stringify(app.globalData.userInfoData.data)
      url = app.globalData.gzhurl + '/zxj_company/weixin_gzh/MerberCenter.jsp?json=' + param;
      wx.setNavigationBarTitle({
        title: '用户中心'
      })
    }
    else if (options.type == 'distribution') {
      param = JSON.stringify(app.globalData.userInfoData.data)
      url = app.globalData.gzhurl + '/zxj_company/weixin_gzh/my_team.jsp?clientId=' + app.globalData.userId;
      wx.setNavigationBarTitle({
        title: '我的团队'
      })
    }
    else if (options.type == 'commission') {
      param = JSON.stringify(app.globalData.userInfoData.data)
      url = app.globalData.gzhurl +'/zxj_company/weixin_gzh/my_money.jsp?clientId=' + param;
      wx.setNavigationBarTitle({
        title: '我的佣金'
      })
    }
    else if (options.type == 'myWallet') {
      param = JSON.stringify(app.globalData.userInfoData.data)
      url = app.globalData.gzhurl +'/zxj_company/weixin_gzh/my_details.jsp?json=' + param;
      wx.setNavigationBarTitle({
        title: '我的明细'
      })
    }
    
    else if (options.type == 'openShop') {
      if (app.globalData.level == 9 || app.globalData.level == 6) {
        param = JSON.stringify(app.globalData.userInfoData.data)
        url = app.globalData.gzhurl +'/zxj_company/weixin_gzh/open_shop.jsp?json=' + param;
        wx.setNavigationBarTitle({
          title: '我要开店'
        })
      } else {
        wx.showModal({
          // title: '请另用手机号申请开店',
          content: '您当前已成为:' + clientRole[app.globalData.level],
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    } else if (options.type == 'league') {
      if (app.globalData.level == 9 || app.globalData.level == 6) {
        param = JSON.stringify(app.globalData.userInfoData.data)
        url = app.globalData.gzhurl +'/zxj_company/weixin_gzh/worker.jsp?json=' + param;
        wx.setNavigationBarTitle({
          title: '我做工匠'
        })
      } else {
        wx.showModal({
          // title: '请另用手机号申请工匠',
          content: '您当前已成为:' + clientRole[app.globalData.level],
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }
    this.setData({ url: encodeURI(url) })
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