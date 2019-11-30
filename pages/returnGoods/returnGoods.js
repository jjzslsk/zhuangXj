// pages/returnGoods/returnGoods.js
const app = getApp();
var logisticsData = require('../../data/logistics.js');
var userId = '';
var modeAction = 0; //0申请退货;1发货
var action = '';
var countTimeVal;
var upImtCountTemp=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    shopCartId: '',
    orderNo: '',
    shopCartFlag: '',
    //orders订单表状态:0未支付,1已支付,2申请退货,3同意退货,4客户发货,5客服拒绝退货,6客服确认退货并退款（就是订单中商品的状态）
    //shop_cart购物车状态:0未支付1待发货3待收货4已收货5已评价6取消订单 7确认退货完成, 8申请退货, 9申请退货后 - 发货, 10同意申请退货, 11拒绝申请退货（就是订单那层状态）
    cartStatus: '',
    cartStatusName: '', //退货状态名称
    goodsInfo: {},
    isGetGoods: true, //是否已经收到货。true是，false否
    returnReason: '', //退款理由
    isReadReturnReason: false, //设置退款理由是否为只读
    logisticsNum: '', //物流单号
    logisticsCode: '', //物流公司编号
    logisticsName: '', //物流公司名称
    isReadLogistics: false, //设置物流单号输入框是否为只读
    returnAmount: '0.00', //退款金额
    imgList: [],
    maxImg: 6 //最多6张图片
  },

  /**选择商品状态 */
  radioItemTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var isGetGoods = id == 0 ? true : false;
    this.setData({
      isGetGoods: isGetGoods
    });
  },

  /**监听退款原因输入 */
  returnReasonInput: function(e) {
    this.setData({
      returnReason: e.detail.value
    })
  },

  /**监听输入物流单号 */
  logisticsInput: function(e) {
    var that = this;
    var logisticsNum = e.detail.value;
    this.setData({
      logisticsNum: logisticsNum
    })
    if (logisticsNum.length < 6) {
      return;
    }
    if (countTimeVal != undefined) {
      clearTimeout(countTimeVal)
    }
    countTimeVal = setTimeout(function() {
      clearTimeout(countTimeVal)
      wx.request({
        url: app.globalData.wlsMartUrl + '?num=' + logisticsNum + '&key=' + app.globalData.realTimeKey,
        method: 'post',
        header: {
          'content-type': 'application/json;charset=utf-8'
        },
        success: res => {
          wx.hideLoading();
          if (res.statusCode == 200) {
            var obj = res.data;
            if (res.message = 'ok') {
              var comCode = obj[0]==undefined || obj[0].comCode == undefined ? '' : obj[0].comCode; //物流公司编号
              var comName = comCode.length > 0 ? logisticsData.logisticsJson[comCode] : '';//物流公司名称
              that.setData({
                logisticsCode: comCode, //物流公司编号
                logisticsName: comName //物流公司名称
              });
            } else {
              that.setData({
                logisticsCode: '', //物流公司编号
                logisticsName: '' //物流公司名称
              });
            }
          } else {
            that.setData({
              logisticsCode: '', //物流公司编号
              logisticsName: '' //物流公司名称
            });
          }
        },
        fail: res => {
          //请求接口失败
          wx.hideLoading();
          that.setData({
            logisticsCode: '', //物流公司编号
            logisticsName: '' //物流公司名称
          });
        }
      })
    }, 1000);

  },

  chooseLogisticsTap:function(e){
    //YT4066493105396
    //选择物流
    wx.navigateTo({
      url: '/pages/chooseLogistics/chooseLogistics'
    });
  },

  /**
   * 删除图片
   */
  delImgTap: function(e) {
    var that = this;
    var position = e.currentTarget.dataset.position;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗?',
      success(res) {
        if (res.confirm) {
          var imgList = that.data.imgList;
          imgList.splice(position, 1);
          that.setData({
            imgList: imgList
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
    var maxImg = this.data.maxImg;
    var imgList = this.data.imgList;
    var maxCount = maxImg - imgList.length;
    wx.chooseImage({
      count: maxCount, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'], //所选的图片的尺寸
      sourceType: ['album', 'camera'], //选择图片的来源
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        imgList = imgList.concat(tempFilePaths)
        that.setData({
          imgList: imgList
        })
      }
    })
  },

  /**
   * 查看附件图片
   */
  selAttImgTab: function(e) {
    var attImgPosition = e.currentTarget.dataset.attimgindex;
    var imgUrls = this.data.imgList;
    wx.previewImage({
      current: imgUrls[attImgPosition], // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })
  },

  /**拨打商家电话 */
  callShopTap:function(e){
    var shopPhone = e.currentTarget.dataset.shopphone;
    wx.makePhoneCall({
      phoneNumber: shopPhone
    })
  },

  /**返回上上页 */
  backClose: function(msgStr) {
    wx.showModal({
      title: '提示',
      content: msgStr,
      showCancel: false,
      success: res => {
        wx.setStorage({
          key: 'return_code',
          data: '1'
        })
        var delta = action == 'orderDetailAction' ? 3 : 2;
        wx.navigateBack({
          delta: delta
        });
      }
    })
  },

  /**递归上传图片*/
  recursiveUpImg: function (attFkId,imgList,position){
    var than=this;
    var imgPath = imgList[position];
    var attFkName = '6_shop_after_sale';
    var attName = '6_shop_after_sale' + position + '.jpg';
    app.uploadFileHttps(userId, attFkId, attFkName, attName, imgPath, function(isSuccess) {
      if (isSuccess) { 
        upImtCountTemp++;
      }
      position++;
      if (position < imgList.length){
        than.recursiveUpImg(attFkId, imgList, position);
      }else{
        if (upImtCountTemp < imgList.length - 1) {
          wx.hideLoading();
          than.backClose('提交成功,但部分图片上传失败');
        } else {
          wx.hideLoading();
          than.backClose('提交成功');
        }
      }

    });
  },

  uploadImgHttps: function(attFkId, imgList) {
    var than = this;
    if (imgList.length > 0) {
      upImtCountTemp=0;
      than.recursiveUpImg(attFkId, imgList, 0);
      // var countTemp = 0;
      // for (var index in imgList) {
      //   var imgPath = imgList[index];
      //   var attFkName = '6_shop_after_sale';
      //   var attName = '6_shop_after_sale' + index + '.jpg';
      //   app.uploadFileHttps(userId, attFkId, attFkName, attName, imgPath, function(isSuccess) {
      //     if (isSuccess) { 
      //       countTemp++;
      //     }
      //     if (imgList.length - 1 == index) {
      //       if (countTemp < imgList.length - 1) {
      //         wx.hideLoading();
      //         than.backClose('提交成功,但部分图片上传失败');
      //       } else {
      //         wx.hideLoading();
      //         than.backClose('提交成功');
      //       }
      //     }

      //   });
      // }

    } else {
      wx.hideLoading();
      than.backClose('提交成功');
    }

  },

  /**提交申请(订单是通过商品详情直接下单) */
  sumbitByGoodsDetail: function(returnReason, logisticsOrderNo, imgList) {
    var that = this;
    var orderId = this.data.orderId;
    var param = "MODE=" + modeAction + "&BACK_GOODS_REASON=" + returnReason + "&BACK_LOGISTICS_INFO=" + logisticsOrderNo + "&ORDER_ID=" + orderId;
    wx.showLoading();
    app.httpsPlatformClass('applyBackGoods', param,
      function(res) {
        //成功
        var resultMsg = res.msg;
        var codeMsg = '';
        var msgStr = '';
        if (typeof resultMsg == 'object' && resultMsg) {
          //如果是json对象,不用做处理
          codeMsg = resultMsg.code;
          msgStr = resultMsg.msg;
        } else {
          //如果是json字符串，则需要处理成json对象
          if (resultMsg == '' || resultMsg == null) {} else {
            var objMsg = JSON.parse(resultMsg);
            codeMsg = objMsg.code;
            msgStr = objMsg.msg;
          }
        }
        if (codeMsg == 0 || codeMsg == '0') {
          if (imgList.length > 0) {
            that.uploadImgHttps(orderId, imgList);
          } else {
            wx.hideLoading();
            that.backClose(msgStr);
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: msgStr + '(' + codeMsg + ')',
            icon: 'none',
            duration: 1000
          });
        }

      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      });
  },

  /**提交申请(订单是通过购物车下单) */
  sumbitByShopCar: function(returnReason, logisticsOrderNo, imgList) {
    var that = this;
    var shopCartId = this.data.shopCartId;
    var param = "MODE=" + modeAction + "&BACK_GOODS_REASON=" + returnReason + "&BACK_LOGISTICS_INFO=" + logisticsOrderNo + "&SHOP_CART_ID=" + shopCartId;
    wx.showLoading();
    app.httpsPlatformClass('applyCartBackGoods', param,
      function(res) {
        //成功
        //成功
        var resultMsg = res.msg;
        var codeMsg = '';
        var msgStr = '';
        if (typeof resultMsg == 'object' && resultMsg) {
          //如果是json对象,不用做处理
          codeMsg = resultMsg.code;
          msgStr = resultMsg.msg;
        } else {
          //如果是json字符串，则需要处理成json对象
          if (resultMsg == '' || resultMsg == null) {} else {
            var objMsg = JSON.parse(resultMsg);
            codeMsg = objMsg.code;
            msgStr = objMsg.msg;
          }
        }
        if (codeMsg == 0 || codeMsg == '0') {
          if (imgList.length > 0) {
            that.uploadImgHttps(shopCartId, imgList);
          } else {
            wx.hideLoading();
            that.backClose(msgStr);
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: msgStr + '(' + codeMsg + ')',
            icon: 'none',
            duration: 1000
          });
        }
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      });
  },

  /**提交信息 */
  submitApply: function(e) {
    var returnReason = this.data.returnReason;
    var shopCartFlag = this.data.shopCartFlag;
    var imgList = this.data.imgList;
    if (returnReason == undefined || returnReason == null || returnReason == '') {
      wx.showToast({
        title: '请输入退款理由',
        icon: 'none',
        duration: 2000
      });
    } else if (imgList == undefined || imgList.length == 0) {
      wx.showToast({
        title: '至少要上传一张凭证',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (shopCartFlag == 0 || shopCartFlag == '0') {
        //状态是从商品直接下单
        this.sumbitByGoodsDetail(returnReason, '', imgList);
      } else {
        //状态是从购物车下单
        this.sumbitByShopCar(returnReason, '', imgList);
      }
    }
  },

  /**提交物流单号 */
  submitLogistics: function(e) {
    modeAction = 1;
    var logisticsNum = this.data.logisticsNum;
    var logisticsCode = this.data.logisticsCode;//物流公司编号
    var logisticsName = this.data.logisticsName;//物流公司名称
    var returnReason = this.data.returnReason;
    var shopCartFlag = this.data.shopCartFlag;
    if (logisticsNum == undefined || logisticsNum == null || logisticsNum == '') {
      wx.showToast({
        title: '请输入物流单号',
        icon: 'none',
        duration: 2000
      });
    } 
    else if (logisticsName == undefined || logisticsName == null || logisticsName == '') {
      wx.showToast({
        title: '请选择物流公司',
        icon: 'none',
        duration: 2000
      });
    } else {
      var logisticsInfo = logisticsNum+','+logisticsCode + ',' + logisticsName;
      if (shopCartFlag == 0 || shopCartFlag == '0') {
        //状态是从商品直接下单
        this.sumbitByGoodsDetail(returnReason, logisticsInfo, []);
      } else {
        //状态是从购物车下单
        this.sumbitByShopCar(returnReason, logisticsInfo, []);
      }
      modeAction = 0;//恢复成初始化值，否则影响下一笔申请（申请后不需要商家同意，会直接变成客户发货）
    }
  },

  /**请求获取图片 */
  getImgHttps: function() {
    wx.showLoading();
    var that = this;
    var attFkId = '';
    var shopCartFlag = this.data.shopCartFlag;
    if (shopCartFlag == 0 || shopCartFlag == '0') {
      //状态是从商品直接下单
      attFkId = this.data.orderId;
    } else {
      //状态是从购物车下单
      attFkId = this.data.shopCartId;
    }
    var param = 'clientId=' + attFkId + '&type=shop_after_sale' + '&userType=6';
    app.httpsDataGet('/member/getPhoto', param,
      function(res) {
        wx.hideLoading();
        var imgList = res.pic;
        var imgListTemp = [];
        for (var index in imgList) {
          var imgObj = imgList[index];
          imgListTemp.push(imgObj.pic);
        }
        that.setData({
          imgList: imgListTemp
        })
      },
      function(res) {
        //失败
        wx.hideLoading();
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    action = options.action;
    userId = app.globalData.userId;
    var that = this;
    wx.getStorage({
      key: 'rtn_goods_info',
      success(res) {
        
        var orderInfo = JSON.parse(res.data);
        var goodsinfo = orderInfo.goodsinfo;
        var itemNumber = goodsinfo.itemNumber;
        var itemPrice = goodsinfo.itemPrice;
        var returnAmount = (Number(itemPrice) * Number(itemNumber)).toFixed(2);

        var isReadReturnReason = goodsinfo.cartStatus == 1 ? false : true;
        var isReadLogistics = goodsinfo.cartStatus == 3 ? false : true;

        var backLogisticsInfo = goodsinfo.backLogisticsInfo;
        var logisticsNum = '', logisticsCode = '', logisticsName='';
        if (backLogisticsInfo!=undefined){
          var blInfoArr = backLogisticsInfo.split(",");
          if (blInfoArr.length > 0) {
            logisticsNum = blInfoArr[0] == undefined ? '' : blInfoArr[0];
            logisticsCode = blInfoArr[1] == undefined ? '' : blInfoArr[1];
            logisticsName = blInfoArr[2] == undefined ? '' : blInfoArr[2];
          }
        }

        that.setData({
          orderId: orderInfo.orderId,
          orderNo: orderInfo.orderNo,
          shopPhone: orderInfo.shopPhone,
          shopCartFlag: orderInfo.shopCartFlag,
          goodsInfo: goodsinfo,
          shopCartId: goodsinfo.shopCartId == undefined ? '' : goodsinfo.shopCartId,
          cartStatus: goodsinfo.cartStatus,
          cartStatusName: goodsinfo.cartStatusName == undefined ? '' : goodsinfo.cartStatusName,
          returnReason: goodsinfo.backReason == undefined ? '' : goodsinfo.backReason,
          logisticsNum: logisticsNum,
          logisticsCode: logisticsCode,
          logisticsName: logisticsName, 
          returnAmount: returnAmount,
          isReadReturnReason: isReadReturnReason,
          isReadLogistics: isReadLogistics
        });

        //清除缓存
        wx.removeStorage({
          key: 'rtn_goods_info',
          success(res) { }
        })
        that.getImgHttps();
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