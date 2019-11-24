// pages/goodsList/goodsList.js
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItem:'1',
    isTabItem:'',
    nullImg:false,//列表为空显示图
    indexPage:1,//页码从1开始
    pageNum:30,//每页显示的数量
    sortType:'DESC',//排序类型，其值为 DESC 或 ASC， 即倒序或正序
    searchKey: '',
    classId:'',//分类id
    classAllNo:'',
    sortName: 'LAST_EDIT_DATE',//排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
    current: 'tab1',
    remList: [],
    refreshing: true,
    nomore: false,//true已加载完全部，flase正在加载更多数据
  },

  /**
   * 跳转搜索
   */
  searchTab: function() {
    var searchKey = this.data.searchKey;
    wx.navigateTo({
      url: '/pages/search/search?tab=1&action=1&searchKey=' + searchKey
    })
  },

  /**
   * 列表点击事件
   */
  itemtap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  /**tab点击事件 */
  handleChange({
    detail
  }) {
    //相同 重复点击TAB
    if(detail.key==this.data.current){
          // sortType: 'ASC',//排序类型，其值为 DESC 或 ASC， 即倒序或正序
    //   searchKey: '',
    //       sortName: '',//排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
    var current = this.data.current;
    var sortType = '';
    var sortName = '';
    var salesVolume = ''
    if (current == detail.key) {
      var sortType = this.data.sortType == 'ASC' ? 'DESC' :'ASC';
      var salesVolume = this.data.sortType == 'DESC' ? 'ASC' :'DESC';//按销量
    }else{
      this.setData({
        current: detail.key
      });
      sortType ='ASC';
      salesVolume = 'DESC'//设置默认按销量高到低
    }
    if (detail.key == 'tab1') {
      sortName = 'LAST_EDIT_DATE'
      //综合排序
    }
    else if (detail.key == 'tab2') {
      sortName = 'DISTANCE' //预留距离字段,有字段后填入
      //按距离
    }
    else if (detail.key == 'tab3') {
      sortType = salesVolume;//设置默认按销量高到低
      // sortName = 'SALES_VOLUME'
      sortName = 'UNREAL_NUM'
      //按销量
    }
    else if (detail.key == 'tab4') {
      //按价格
      sortName = 'ITEM_PRICE'
    }
    // else sortName='ITEM_PRICE';

    this.setData({
      sortType: sortType,
      sortName: sortName,
      refreshing:false
    });
    wx.showLoading({
      title: '加载中',
    })
    this.httpsData(true);
    }
    //不相同 不重复点击TAB
    else {
    var current = this.data.current;
    var sortType = '';
    var sortName = '';
    var salesVolume = ''
    if (current == detail.key) {
      // var sortType = this.data.sortType == 'ASC' ? 'DESC' :'ASC';
      // var salesVolume = this.data.sortType == 'DESC' ? 'ASC' :'DESC';//按销量
    }else{
      this.setData({
        current: detail.key
      });
      sortType ='ASC';
      salesVolume = 'DESC'//设置默认按销量高到低
    }
    if (detail.key == 'tab1') {
      sortType ='DESC';
      sortName = 'LAST_EDIT_DATE'
      //综合排序
    }
    else if (detail.key == 'tab2') {
      sortName = 'DISTANCE' //预留距离字段,有字段后填入
      //按距离
    }
    else if (detail.key == 'tab3') {
      sortType = salesVolume;//设置默认按销量高到低
      // sortName = 'SALES_VOLUME'
      sortName = 'UNREAL_NUM'
      //按销量
    }
    else if (detail.key == 'tab4') {
      //按价格
      sortName = 'ITEM_PRICE'
    }
    // else sortName='ITEM_PRICE';

    this.setData({
      sortType: sortType,
      sortName: sortName,
      refreshing:false
    });
    wx.showLoading({
      title: '加载中',
    })
    this.httpsData(true);
    }

  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    this.setData({ indexPage: 1 });
    this.httpsData(true)
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    var indexPage = this.data.indexPage+1;
    this.setData({ indexPage: indexPage});
    this.httpsData(false);
  },

  myOnScroll: function (e) {
    
  },

  //加载提示
  onSwitchChange () {
    if(!value){
      wx.showLoading({
        title: '加载中',
      })
    }
},


  /**
   * 请求获取数据
   * itemClassId   分类ID。
   * itemName（非必填）   商品名称（搜索过滤用）。
   * sortName（非必填）  排序名称，传数据库字段名，暂时不支持按最近地域。 LAST_EDIT_DATE：上货架时间（或最新更新时间）,ITEM_PRICE：商品价格。
   * sortType（非必填）  排序类型，其值为 DESC 或 ASC， 即倒序或正序。（已经从页面的data中获取了）
   * startPage（必填）   起始页，传1就是显示第1页，传2就是显示第2页。（已经从页面的data中获取了）
   * recordSize（非必填，默认30）  1页显示的记录数。（已经从页面的data中获取了）
   * isRefresh 是下拉刷新还是上拉加载，true刷新 false加载
   */
  httpsData: function (isRefresh){
    var that=this;
    var param = 'classAllNo=' + this.data.classAllNo + '&itemName=' + this.data.searchKey + '&sortName=' +
      this.data.sortName + '&sortType=' + this.data.sortType + '&startPage=' + this.data.indexPage + '&recordSize=' + this.data.pageNum + '&lon=' + app.globalData.longitude + '&lat=' + app.globalData.latitude + '&baiduMapNo=' + app.globalData.curCityCode;

    app.httpsDataGet('/shop/getShopItemList', param,
      function (res) {
        //成功
        wx.hideLoading()
        if(res.data.length == 0){
          that.setData({
            nullImg:true
          });
        }else{
          that.setData({
            nullImg:false
          });
        }
        var tempList=[];
        if (isRefresh){
          tempList = res.data;
        } else{
          var tempList = that.data.remList;
          tempList = tempList.concat(res.data);
        }
        var isNomore = res.data.length < that.data.pageNum ? true : false;
        that.setData({
          remList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
        });
      },
      function (returnFrom,res) {
        var indexPage = that.data.indexPage;
        if (indexPage>1){
          indexPage--;
        }
        that.setData({
          indexPage: indexPage,
          refreshing: true,
          nomore: true,
        });
      }
    )
  },

  /**
   * 外部调用开始搜索
   */
  searchPublic:function(){
    wx.showLoading();
    this.httpsData(true);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchKey: options.searchKey,
      classId: options.classId,//分类id
      classAllNo: options.classAllNo,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.httpsData(true);
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
  onPullDownRefresh: function() {},

})