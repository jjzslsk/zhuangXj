// pages/goodsEvaList/goodsEvaList.js
const app = getApp();
var goodsId='';//商品id
var startPosition = 1;//查询起始位置
var pageNum = 10;//每页显示的数量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    n1StarLevel: '',
    n2StarLevel: '',
    n3StarLevel: '',
    favourable:'',//好评
    favourableRate: '',//好评率
    favourableRateinfo:'',//好评率
    favourableRateData:'',//好评率 无%号
    middle :'',//中评
    middleRate:'',//中评率
    middleRateinfo:'',//中评率
    negative:'',//差评
    negativeRate:'',//差评率
    negativeRateinfo:'',//差评率
    deliveryRate:'',//配送评价
    serviceTotal:'',//服务评价
    refreshing: true,
    nomore: false, //true已加载完全部，flase正在加载更多数据
    attHeight: '80px',
    goodsEvaList: [],
    classNums:null,
  },

  /**
   * 查看附件图片
   */
  selAttImgTab: function(e) {
    var evaPosition = e.currentTarget.dataset.evaindex;
    var attImgPosition = e.currentTarget.dataset.attimgindex;
    var goodsEva = this.data.goodsEvaList[evaPosition];
    // var queryBean = JSON.stringify(goodsEva);
    // //把对象放到缓存中
    // wx.setStorage({
    //   key: "sel_bit_img",
    //   data: queryBean
    // })
    // wx.navigateTo({
    //   url: '/pages/selBigImg/selBigImg?indexCur=' + attImgPosition
    // })
    var imgUrls = [];
    imgUrls.push(goodsEva);
    wx.previewImage({
      current: imgUrls[attImgPosition], // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })
  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    startPosition=1;
    this.httpsData(true);
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    startPosition = startPosition + 1;
    this.httpsData(false);
  },

  // 点击关键字
  evalistBtn(e){
    var that = this;
    startPosition = 1;//查询起始位置
    pageNum = 10;//每页显示的数量
    
    
    var param = 'shopItemId=' + goodsId + '&keyword=' + encodeURI(e.currentTarget.dataset.keyword) + '&startPage=' + startPosition + '&recordSize=' + pageNum;
    app.httpsDataGet('/shop/getShopItemComment', param,
      function (res) {
        if(res.status){
        var goodsEvaListTemp = [];
        var retObj =res.data;
        goodsEvaListTemp = res.data;
          //时间格式调整
        for(var item in goodsEvaListTemp){
          goodsEvaListTemp[item].COMMENT_DATE1 = goodsEvaListTemp[item].COMMENT_DATE1.substr(0,10);
        }

          that.setData({
            goodsEvaList: goodsEvaListTemp
          });


        var isNomore = retObj.length < pageNum ? true : false;
        that.setData({
          refreshing: isNomore,
          nomore: isNomore,
        });


        }
        //成功
      },
      function (res) {
        //失败
        wx.hideLoading()
        if (startPosition > pageNum){
          startPosition = startPosition - pageNum;
        }
      }
    )
  },

  /**
   * 请求获取数据
   */
  httpsData: function (isRefresh) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var param = 'shopItemId=' + goodsId + '&startPage=' + startPosition + '&recordSize=' + pageNum;
    app.httpsDataGet('/shop/getShopItemComment', param,
      function (res) {
        //成功
        var retObj =res.data;
        var goodsEvaListTemp = [];
        if (isRefresh){
          goodsEvaListTemp = retObj;
        } else{
          goodsEvaListTemp = that.data.goodsEvaList.concat(retObj);
        }
        
        //时间格式调整
        for(var item in goodsEvaListTemp){
          goodsEvaListTemp[item].COMMENT_DATE1 = goodsEvaListTemp[item].COMMENT_DATE1.substr(0,10);
        }

        var isNomore = retObj.length < pageNum ? true : false;
        that.setData({
          refreshing: isNomore,
          nomore: isNomore,
          goodsEvaList: goodsEvaListTemp
        });
      },
      function (returnFrom, res) {
        //失败
        wx.hideLoading();
        if (startPosition > pageNum){
          startPosition = startPosition - pageNum;
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //计算图片的高度,让图片的高等于宽
    // var query = wx.createSelectorQuery();
    // var that = this;
    // query.select('.eva-img-item').boundingClientRect(function(rect) { 
    //   that.setData({
    //     attHeight: rect.width + 'px'
    //   })
    // }).exec();
    goodsId=options.goodsId;
    this.setData({
      classNums: options.classNums,
      n1StarLevel: options.n1StarLevel,
      n2StarLevel: options.n2StarLevel,
      n3StarLevel: options.n3StarLevel,
    favourable:options.favourable,
    favourableRate:options.favourableRate,
    middle:options.middle,
    middleRate:options.middleRate,
    negativeRate:options.negativeRate,
    negative:options.negative,
    deliveryRate:parseInt(options.deliveryRate.replace("%",""), 10),//配送速度取整
    serviceTotal:options.serviceTotal,
    favourableRateData:parseInt(options.favourableRate.replace("%",""), 10), //好评取整
    })
    startPosition=1;
    wx.showLoading();
    this.httpsData(true);

    for(var i=0;i<1;i++){//取第一个数
      this.setData({
        negativeRateinfo:this.data.negativeRate.charAt(i)/2,//取5星
        middleRateinfo: this.data.middleRate.charAt(i) / 2,//取5星
        favourableRateinfo: this.data.favourableRate.charAt(i)/2,//取5星
      })
    }
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