// pages/shopCar/shopCar.js
const app = getApp();

var userId = '';
var indexPage = 1; //页码从1开始
var pageNum = 30;

const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actions5: [
      {
          name: '取消'
      },
      {
          name: '去登录',
          color: '#ed3f14',
          loading: false
      }
  ],
    footerBox: false, //默认隐藏底部栏
    nullImg1:false,
    visible5: false,
    stateImg:true,
    isGoodsNumber: '0',
    thisIsChecked: false, //样式切换红色
    goodsNumber: '',//购买数量
    nullImg: false,
    submitIsDel: false, //提交的是否是删除操作
    isRadioAll: false, //是否全选
    totalPrice: 0.00, //总价
    goodsList: [],
    refreshing: true,
    nomore: false, //true已加载完全部，flase正在加载更多数据
  },
  /**编辑*/
  editTap: function (e) {
    var submitIsDel = this.data.submitIsDel;
    this.setData({
      submitIsDel: !submitIsDel
    })
  },

  /**item选择按钮 */
  radioTap: function (e) {
    var position = e.currentTarget.dataset.position; //列表下标
    var id = e.currentTarget.dataset.id; //商品ID
    var isChecked = !this.data.goodsList[position].isChecked;
    var upGoodsItem = "goodsList[" + position + "].isChecked";
    //修改选择状态
    this.setData({
      [upGoodsItem]: isChecked,
      thisIsChecked: isChecked
    })

    var isAll = this.checkRadioAll();
    this.setData({
      isRadioAll: isAll
    })
    this.calTotalPrice();
  },

  /**全选 */
  radioAllTap: function (e) {
    var isRadioAll = this.data.isRadioAll;
    var goodsList = this.data.goodsList;
    for (var index in goodsList) {
      goodsList[index].isChecked = !isRadioAll;
    }
    this.setData({
      isRadioAll: !isRadioAll,
      goodsList: goodsList,
      thisIsChecked: !isRadioAll
    })
    this.calTotalPrice();
  },

  /**单项选择检验是否已经选了全部 */
  checkRadioAll: function () {
    var result = true;
    var goodsList = this.data.goodsList;
    if (goodsList.length == 0) return result = false;
    for (var index in goodsList) {
      if (!goodsList[index].isChecked) {
        result = false;
        break;
      }
    }
    return result;
  },

  /**跳转详情 */
  itemtap: function (e) {
    this.setData({//恢复默认
      thisIsChecked: false,
      goodsNumber: '0',
      isGoodsNumber: '0'
    })
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  // 购物车为空，跳转到首页页面
  nullBut(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**删除数量 */
  delNumTap: function (e) {
    var position = e.currentTarget.dataset.position; //列表下标
    var id = e.currentTarget.dataset.id;
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
    var id = e.currentTarget.dataset.id;
    var buyNum = this.data.goodsList[position].itemNumber; //购买数量
    var upNumber = this.data.goodsList[position].upNumber; //库存
    buyNum++;
    if (buyNum > upNumber){
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

  //更新购买数量
  httpsUpShopCart:function(orderData,goodsNumber){
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

  //手动输入数量
  bindKeyInput: function (e) {
    //判空
    var input = e.detail.value;
    var position = e.currentTarget.dataset.position; //列表下标
    var id = e.currentTarget.dataset.id;
    var orderData = this.data.goodsList[position];
    var buyNum = this.data.goodsList[position].itemNumber; //购买数量
    var upNumber = this.data.goodsList[position].upNumber; //库存
    // if (buyNum < inventoryNum) {
    var upPuyNum = "goodsList[" + position + "].itemNumber";
    if (input == 0) {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      var value = e.detail.value;
      var pos = e.detail.cursor;
      return {
        value: value.replace(/0/g, '1'),
        cursor: pos
      }
    }
    else if (input>upNumber){
      wx.showToast({
        title: '输入数量不能大于库存:' + upNumber,
        icon: 'none',
        duration: 2000
      });
      this.setData({
        [upPuyNum]: upNumber
      })
      this.calTotalPrice();
      this.httpsUpShopCart(orderData, upNumber);
    }
    else {
      this.setData({
        [upPuyNum]: e.detail.value
      })
      this.calTotalPrice();
      this.httpsUpShopCart(orderData, e.detail.value);
    }
  },

  /**计算总价 */
  calTotalPrice: function () {
    var goodsList = this.data.goodsList;
    var totalPrice = 0;
    var goodsSum = [];
    for (var index in goodsList) {
      if (goodsList[index].isChecked) {
        var xfMoney = (Number(goodsList[index].itemSalePrice) * Number(goodsList[index].itemNumber)).toFixed(2);
        totalPrice = app.accAdd(totalPrice, xfMoney);
        var postageAmnt = goodsList[index].postageAmnt == undefined ? 0 : goodsList[index].postageAmnt;
        totalPrice = app.accAdd(totalPrice, Number(postageAmnt));
        goodsSum.push(goodsList[index].itemNumber)
        this.setData({
          goodsNumber: goodsSum.reduce((a, b) => a + b)
        })
      }
    }

    this.setData({
      totalPrice: totalPrice.toFixed(2),
      isGoodsNumber: this.data.goodsNumber //解决数字统计时闪烁问题
    })
    if (totalPrice == 0) {
      this.setData({
        goodsNumber: 0,
        isGoodsNumber: 0,
        thisIsChecked: false
      })
    } else {
      this.setData({
        thisIsChecked: true
      })
    }
  },

    // 收藏
    goodsCollect(){
      //删除
      var that = this;
      var submitIsDel = this.data.submitIsDel;
      if (submitIsDel) {
        //删除
        var goodsList = this.data.goodsList;
        var tempGoodsList = []; //留下的数据
        // var delGoodsList = []; //要删除的数据
        var delGoodsIds = '';//要删除的数据id
        for (var index in goodsList) {
          if (goodsList[index].isChecked) {
            //要删除的数据
            delGoodsIds = delGoodsIds + goodsList[index].shopCartId + ','
          } else {
            //留下的数据
            tempGoodsList.push(goodsList[index]);
          }
        }
  
        if (delGoodsIds.length > 0) {
          delGoodsIds = delGoodsIds.substring(0, delGoodsIds.length - 1);
          var param = 'clientId=' + userId + '&shopCartId=' + delGoodsIds;
          app.httpsDataGet('/order/moveShopItemToFav', param,
            function (res) {
              // 成功
              wx.showToast({ title: '已加入收藏夹', icon: 'none', duration: 2000 })
              if (res.status) {
                that.setData({
                  goodsList: tempGoodsList,
                  submitIsDel: false
                })
                that.calTotalPrice();
              }
            },
            function (returnFrom, res) {
              // 失败
            }
          );
        }
      }
    },

  /**提交按钮点击事件 */
  submitTap: function (e) {
    var that = this;
    if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == '') {
      that.handleOpen5()
    }
    else {
      var submitIsDel = this.data.submitIsDel;
      if (submitIsDel) {
        wx.showModal({
          title: '提示',
          content: '是否确定删除?',
          showCancel:true,
          confirmText:'删除',
          cancelText:'我再想想',
          success(res) {
            if (res.confirm) {
              //删除
              var goodsList = that.data.goodsList;
              var tempGoodsList = []; //留下的数据
              // var delGoodsList = []; //要删除的数据
              var delGoodsIds = '';//要删除的数据id
              for (var index in goodsList) {
                if (goodsList[index].isChecked) {
                  //要删除的数据
                  delGoodsIds = delGoodsIds + goodsList[index].shopCartId + ','
                } else {
                  //留下的数据
                  tempGoodsList.push(goodsList[index]);
                }
              };
              if (delGoodsIds.length > 0) {
                delGoodsIds = delGoodsIds.substring(0, delGoodsIds.length - 1);
                var param = 'clientId=' + userId + '&shopCartId=' + delGoodsIds;
                app.httpsDataGet('/order/deleteCart', param,
                  function (res) {
                    //成功
                    wx.showToast({ title: res.msg, icon: 'none', duration: 1000 })
                    if (res.status) {
                      that.setData({
                        goodsList: tempGoodsList,
                        submitIsDel: false
                      })
                      that.calTotalPrice();
                    }
                  },
                  function (returnFrom, res) {
                    //失败
                  }
                );
              }
            }
          }
        });
      } else {
        //去结算
        var goodsList = this.data.goodsList;
        var priceGoodsList = []; //要支付的数据
        for (var index in goodsList) {
          var goodsInfo = goodsList[index];
          if (goodsInfo.isChecked) {
            //要支付的数据
            var goodsObj = {};
            goodsObj.shopName = goodsInfo.shopName;
            goodsObj.goodsId = goodsInfo.shopItemId;
            goodsObj.itemName = goodsInfo.itemName;
            goodsObj.imgUrl = goodsInfo.imgUrl;
            goodsObj.price = goodsInfo.itemSalePrice;
            goodsObj.oldprice = goodsInfo.itemPrice;
            goodsObj.buyNum = goodsInfo.itemNumber;
            goodsObj.shopItemSpecAttr = goodsInfo.shopItemSpecAttr;
            goodsObj.shopCartId = goodsInfo.shopCartId;
            goodsObj.deliveryMode = goodsInfo.deliveryMode;
            goodsObj.postageType = goodsInfo.postageType == undefined ? '' : goodsInfo.postageType;
            goodsObj.postageAmnt = goodsInfo.postageAmnt == undefined ? 0 : goodsInfo.postageAmnt;
            priceGoodsList.push(goodsObj);
          }
        }
        if (priceGoodsList.length > 0) {
          wx.setStorage({
            key: 'goods_list',
            data: JSON.stringify(priceGoodsList)
          })
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?action=1'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请选择商品',
            showCancel: false,
          })
        }
  
      }
    }
  },

  httpsDataList: function (isRefresh) {
    var that = this;
    that.setData({
      goodsNumber: '0',
      thisIsChecked: false
    });
    var param = 'userId=' + userId + '&startPage=' + indexPage + '&recordSize=' + pageNum;
    app.httpsDataGet('/order/getCartList', param,
      function (res) {
        wx.hideLoading();
        that.setData({
          visible5:false,
        })
        if (res.data.length == 0) {
          that.setData({
            nullImg: true
          });
        } else {
          that.setData({
            nullImg: false,
            nullImg1: false
          });
        }
        //成功
        var dataList = res.data
        for (var index in dataList) {
          dataList[index].isChecked = false;
          // if(typeof index === 'object'){
          //   that.data.goodsList.push(index)
          //   }
        }
        var tempList = [];
        if (isRefresh) {
           that.setData({//初始化
            goodsList: [],
            goodsNumber: 0,
            isGoodsNumber: 0,
            thisIsChecked: false
          });
          tempList = dataList;
        } else { 
          var tempList = that.data.goodsList;
          tempList = tempList.concat(dataList);
        }
        var isNomore = dataList.length < pageNum ? true : false;
        that.setData({
          goodsList: tempList,
          refreshing: isNomore,
          nomore: isNomore,
        });
        var isAll = that.checkRadioAll();
        that.setData({
          isRadioAll: isAll
        })

        if(that.data.nullImg == false && that.data.stateImg == false){//底部栏显示隐藏
          that.setData({
            footerBox:true
        });
        }else{
          that.setData({
            footerBox:false
        });
        }
        
      },
      function (returnFrom, res) {
        //失败
        // wx.hideLoading();
        if (indexPage > 1) {
          indexPage--;
        }
      }
    )

  },

  /**下拉刷新监听函数 */
  myOnPullRefresh: function () {
    indexPage = 1;
    this.setData({
      refreshing: false
    });
    this.httpsDataList(true);
  },

  /**加载更多监听函数 */
  myOnLoadmore: function () {
    indexPage++;
    this.httpsDataList(false);
  },

  myOnScroll: function (e) { },

  /**
   * 检查是否用户登录状态
   */
  checkLoginState: function () {
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

  //更新数据
  refreshData: function () {
    var that = this;
    userId = app.globalData.userId;
    indexPage = 1;
    that.setData({
      totalPrice: 0.00,
    });
    wx.showLoading({
      title: '加载中',
    })
    that.httpsDataList(true);
  },

  //弹窗登录
  handleOpen5 () {
    this.setData({
        visible5: true
    });
},

handleClick5 ({ detail }) {
  if (detail.index === 0) {
      this.setData({
          visible5: false,
          nullImg1:true
      });

  } else {
    this.setData({
      nullImg1:false
  });
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone'
      })
  }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == '') {
      // app.wxLogin().then(function (res) {
      // })
      that.handleOpen5()
    } else {
      that.setData({
        visible5: false,
        stateImg:false
    });
      that.refreshData();
    }
    // if (!this.checkLoginState()) return;
    // userId = app.globalData.userId;
    // indexPage = 1;
    // this.setData({
    //   totalPrice:0
    // });
    // wx.showLoading();
    // this.httpsDataList(true);
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