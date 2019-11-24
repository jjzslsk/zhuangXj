// pages/evaluate/evaluate.js
const app = getApp();
var userId='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxAttCount: 4, //最大附件图片数量
    goodsList: [], //评价商品信息
    confirm:false
  },

  /**
   * 商品评分
   */
  onChangeGoodsEva(e) {
    var position = e.currentTarget.dataset.position;
    var index = e.detail.index;
    var upGoodsEvaIndex = "goodsList[" + position + "].goodsEvaIndex";
    this.setData({
      [upGoodsEvaIndex]: index
    })
  },

  /**
   * 服务态度评分
   */
  onChangeServiceEva(e) {
    var position = e.currentTarget.dataset.position;
    var index = e.detail.index;
    var upServiceEvaIndex = "goodsList[" + position + "].serviceEvaIndex";
    this.setData({
      [upServiceEvaIndex]: index
    })
  },

  /**
   * 物流服务评分
   */
  onChangeFlowEva(e) {
    var position = e.currentTarget.dataset.position;
    var index = e.detail.index;
    var upFlowEvaIndex = "goodsList[" + position + "].flowEvaIndex";
    this.setData({
      [upFlowEvaIndex]: index
    })
  },

  /**
   * 监听评论内容输入
   */
  bindDescribeEveInput(e){
    var evaContent = e.detail.value;
    evaContent=app.filterKeyboardEmoji(evaContent);

    var position = e.currentTarget.dataset.position;
    var describeEve = "goodsList[" + position + "].describeEve";
    this.setData({
      [describeEve]: evaContent
    })
  },

  /**
   * 删除附件图片
   */
  delAttImgTap: function(e) {
    var that = this;
    var position = e.currentTarget.dataset.position;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除此附件图片吗?',
      success(res) {
        if (res.confirm) {
          var attImgList = that.data.goodsList[position].attImgList;
          attImgList.splice(index, 1);
          var upAttImgList = "goodsList[" + position + "].attImgList";
          that.setData({
            [upAttImgList]: attImgList
          })
        } else if (res.cancel) {}
      }
    })
  },


  /**
   * 从本地相册选择图片或使用相机拍照。
   */
  chooseAttImage(e) {
    var that = this;
    var position = e.currentTarget.dataset.position;
    var maxAttCount = this.data.maxAttCount;
    var attImgList = this.data.goodsList[position].attImgList;
    var maxCount = maxAttCount - attImgList.length;
    wx.chooseImage({
      count: maxCount, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'], //所选的图片的尺寸
      sourceType: ['album', 'camera'], //选择图片的来源
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        attImgList = attImgList.concat(tempFilePaths)
        var upAttImgList = "goodsList[" + position + "].attImgList";
        that.setData({
          [upAttImgList]: attImgList
        })
      }
    })
  },

  /**
   * 提交评价
   */
  httpsSubmit:function(){
    var param={};
    var shopItemComment=[];//商品评价列表
    var goodsList = this.data.goodsList;
    for (var index in goodsList){
      var goodsObj = goodsList[index];
      var eveObj = {};
      eveObj.shopItemId=goodsObj.shopItemId;//商品id
      eveObj.commentNotes = goodsObj.describeEve;//评价内容
      eveObj.clientId =userId;//用户id
      eveObj.orderNo =goodsObj.orderNo;//订单id
      eveObj.n1StarLevel= goodsObj.goodsEvaIndex; //商品得分
      eveObj.n2StarLevel= goodsObj.serviceEvaIndex; //服务态度得分
      eveObj.n3StarLevel= goodsObj.flowEvaIndex; //物流服务得分
      eveObj.shopId= goodsObj.shopId;//商铺id
      shopItemComment.push(eveObj);
    }
    param.shopItemComment = shopItemComment;
    wx.showLoading();
    //提交评价
    app.httpsDataPost('/shop/createShopItemComment', param, 
      function (ret) {
        //成功
        wx.setStorage({
          key: 'return_code',
          data: '1'
        })
        wx.showModal({
          title: '提示',
          content: ret.msg,
          showCancel: false,
          success: res => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      function (fromAction,ret) {
        //失败 
      }
    );

  },

  /**
   * 提交
   */
  submitBtn: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否提交评价?',
      success(res) {
        if (res.confirm) {
          that.httpsSubmit();
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (!app.checkLoginState()) return;
    userId = app.globalData.userId;

    wx.getStorage({
      key: 'eve_goods_list',
      success(res) {
        var goodsList = JSON.parse(res.data);
        for (var index in goodsList) {
          var goodsObj = goodsList[index];
          goodsObj.goodsEvaIndex = 5; //商品得分
          goodsObj.serviceEvaIndex = 5; //服务态度得分
          goodsObj.flowEvaIndex = 5; //物流服务得分
          goodsObj.describeEve = ''; //评价描述
          goodsObj.attImgList = []; //附件图片
        }
        that.setData({
          goodsList: goodsList
        });
        //清除缓存
        wx.removeStorage({
          key: 'eve_goods_list',
          success(res) {}
        })
      }
    });
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