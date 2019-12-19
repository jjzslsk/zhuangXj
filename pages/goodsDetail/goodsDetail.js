// pages/goodsDetail/goodsDetail.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const utilJs = require('../../utils/util.js');
const app = getApp();
var goodsId = ''; //商品id
var userId = '';
var isOnShowRefresh=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:'',//合计
    allowBuy:true,
    showModalStatus: false,
    showSpecMethodPopup: false, //是否显示选择规格列表
    animationSpecData: {},
    //轮播图按钮
    good: true,
    showLeft1: false,
    goShopCar: true,
    menu: true,

    topNum: 0,
    floorstatus: false,
    inputValue: '',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    new_price: 0, //商品新单价
    old_price: 0, //商品原单价
    shop_num: 0, //购物车数量
    distribution: '', //配送方式
    detailInfo: '', //基本信息
    //商品图片轮播图
    imgUrls: [],
    inventory_num: 0, //库存
    goods_name: '', //商品名称
    spec_name: '', //选择的规格名称
    spec_imgurl: '', //规格图片
    //规格型号
    specifications_list: [],
    //前四个规格
    classNum:[],
    classNums:[],
    //评价
    evaluation_info: {
      total: 0,
      list: []
    },
    buy_num: 1, //购买数量
    specificationsCurIndex: -1, //选择当前的规格下边
    deliveryExplain: '', //发货方式说明
    isCollect: false //是否收藏
  },

  //点赞
  tapGood() {
    this.setData({
      good: !this.data.good
    });
  },
  
  /**
   * 拨打电话
   */
  callPhoneTap: function (e) {
    var phoneNum = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: phoneNum //仅为示例，并非真实的电话号码
    })
  },

  // 弹框
  powerDrawer: function(e) {
    this.setData({
      showModalStatus: this.data.showModalStatus == true ? false : true
    });
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },

  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function() {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
    }.bind(this), 200)
  },

  toggle() {
    this.setData({
      goShopCar: true,
      menu: true,
    });
  },

  //分享
  onShareAppMessage: function(res) {
    let that = this;
    that.setData({
      showLeft1: !this.data.showLeft1,
    })
    return {
      title: '装小匠,让装修更快捷更省钱',
      // path: '/pages/index/index', // 相对的路径
      imageUrl: '/images/placeholder.png', //用户分享出去的自定义图片大小为5:4,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 分享失败
      },
    }
  },

  toggleHag() {
    var param = 'orderId=&otherPayId=' + app.customerService.id + '&otherPayName=' + app.customerService.name + '&otherPayAva=' + app.customerService.avatar
    wx.navigateTo({
      url: '/pages/chat/chat?' + param
    })
  },

  toggleHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  toggleQuestion() {
    wx.navigateTo({
      url: '/pages/question/question',
    })
  },

  togglemag() {
    this.setData({
      goShopCar: true,
      menu: true,
    });
  },


  _onScroll: function(e) {
    const scrollTop = e.detail.scrollTop;
    //回到顶部
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function(e) { // 一键回到顶部
    this.setData({
      topNum: this.data.topNum = 0
    });
  },

  /**
   * 查看附件图片
   */
  selAttImgTab: function(e) {
    var attImgPosition = e.currentTarget.dataset.attimgindex;
    // var json = {};
    // json.attImgList = this.data.imgUrls;
    // var queryBean = JSON.stringify(json);
    // //把对象放到缓存中
    // wx.setStorage({
    //   key: "sel_bit_img",
    //   data: queryBean
    // })
    // wx.navigateTo({
    //   url: '/pages/selBigImg/selBigImg?indexCur=' + attImgPosition
    // })

    var imgUrls = this.data.imgUrls;
    wx.previewImage({
      current: imgUrls[attImgPosition], // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })

  },

  /**预览规格图片 */
  lookSpecTap:function(e){
    var imgUrls=[];
    imgUrls.push(this.data.spec_imgurl);
    // var json = {};
    // json.attImgList = imgUrls;
    // var queryBean = JSON.stringify(json);
    // //把对象放到缓存中
    // wx.setStorage({
    //   key: "sel_bit_img",
    //   data: queryBean
    // })
    // wx.navigateTo({
    //   url: '/pages/selBigImg/selBigImg?indexCur=' + 0
    // })
    wx.previewImage({
      current: imgUrls[0], // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })
  },


  /**显示选择规格列表*/
  showSpecDialog: function(e) {
    var that = this;
    // 显示遮罩层(弹出支付方式)
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step();
    this.setData({
      animationSpecData: animation.export(),
      showSpecMethodPopup: true,
    })

    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationSpecData: animation.export()
      })
    }.bind(this), 100)
  },

  /**
   * 关闭选择规格列表
   */
  colseSpecMethod: function(e) {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationSpecData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationSpecData: animation.export(),
        showSpecMethodPopup: false
      })
    }.bind(this), 200);
  },

  /**规格开关 */
  switchSpec: function(position) {
    var indexCur = this.data.specificationsCurIndex;
    var specifications = this.data.specifications_list[position];

    if (indexCur == position && specifications.selected) {
      //如果选择的规格还是当前的规格，则不需要再做处理

      if (indexCur > -1) {//暂行和更新处理一样
        var checkedCur = "specifications_list[" + indexCur + "].selected";
        this.setData({
          [checkedCur]: false
        })
      }
      var checked = "specifications_list[" + position + "].selected";
      var specImgurl = this.data.spec_imgurl;
      this.setData({
        [checked]: true,
        new_price: specifications.itemSalePrice,
        totalPrice: specifications.itemSalePrice,
        old_price: specifications.price,
        // inventory_num:specifications.inventory_num,
        specificationsCurIndex: position,
        spec_name: specifications.spec,
        // spec_imgurl: specifications.imgUrl != undefined && specifications.imgUrl.length > 0 ? specifications.imgUrl : ''
        spec_imgurl: specifications.imgUrl != undefined && specifications.imgUrl.length > 0 ? specifications.imgUrl : specImgurl
      })//暂行和更新处理一样 end

    } else {
      //如果选择的规格不是当前的规格，则需要进行更新处理
      if (indexCur > -1) {
        var checkedCur = "specifications_list[" + indexCur + "].selected";
        this.setData({
          [checkedCur]: false
        })
      }
      var checked = "specifications_list[" + position + "].selected";
      var specImgurl = this.data.spec_imgurl;
      this.setData({
        [checked]: true,
        new_price: specifications.itemSalePrice,
        totalPrice: specifications.itemSalePrice,
        old_price: specifications.price,
        // inventory_num:specifications.inventory_num,
        specificationsCurIndex: position,
        spec_name: specifications.spec,
        // spec_imgurl: specifications.imgUrl != undefined && specifications.imgUrl.length > 0 ? specifications.imgUrl : ''
        spec_imgurl: specifications.imgUrl != undefined && specifications.imgUrl.length > 0 ? specifications.imgUrl : specImgurl
      })
    }
  },

  /**选择规格 */
  specificationsTap: function(e) {

    var position = e.currentTarget.dataset.position; //列表下标
    var id = e.currentTarget.dataset.id;
    this.switchSpec(position);
    this.setData({
      // totalPrice:'0',
      buy_num: 1
    })
  },

  /**跳转到地图显示商品地址 */
  goShopAddressTap: function (e) {
    var shopName = e.currentTarget.dataset.shopname;
    var shopAddress = e.currentTarget.dataset.address;
    var lng = e.currentTarget.dataset.lng;
    var lat = e.currentTarget.dataset.lat;
    // wx.navigateTo({
    //   url: '/pages/shopMap/shopMap?lat=' + lat + '&lon=' + lng + '&name=' + shopName
    // })

    utilJs.openMapLocation(lat, lng, shopName, shopAddress,18);

  },

  /**跳转到商店 */
  goShopTap: function(e) {
    //店铺
    var id = e.currentTarget.dataset.id;
    if (id == undefined || id == null || id==''){
      wx.showToast({
        title: '先歇歇再操作',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?shopId=' + id
    })
  },

  /**聊一聊 */
  chatTap: function(e) {
    var param = 'orderId=&otherPayId=' + this.data.detailInfo.shopId + '&otherPayName=' + this.data.detailInfo.shopName + '&otherPayAva=' + this.data.detailInfo.shopLogo;
    wx.navigateTo({
      url: '/pages/chat/chat?' + param
    })
  },

  /**删除数量 */
  delNumTap: function(e) {
    var buyNum = this.data.buy_num; //购买数量
    if (buyNum > 1) {
      buyNum--;
      var totalPrice = (Number(buyNum) * Number(this.data.new_price)).toFixed(2)
      this.setData({
        buy_num: buyNum,
        totalPrice: totalPrice
      })
    } else {
      wx.showToast({
        title: '已经不能再减了',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**添加数量 */
  appNumTap: function(e) {
    var buyNum = this.data.buy_num; //购买数量
    var inventoryNum = this.data.inventory_num; //库存
    if (buyNum < inventoryNum) {
      buyNum++;
      var totalPrice = (Number(buyNum) * Number(this.data.new_price)).toFixed(2)
      this.setData({
        buy_num: buyNum,
        totalPrice: totalPrice
      })
    } else {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1000
      })
    }
  },

  //手动输入数量
  bindKeyInput: function(e) {
    var that = this
    var buyNum = e.detail.value; //购买数量
    var inventoryNum = this.data.inventory_num; //库存
    var input = e.detail.value;
    if (input == 0) {//判空
      that.setData({
        buy_num: buyNum,
        allowBuy:false//是否允许购买
      })
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      var value = e.detail.value
      var pos = e.detail.cursor
      return {
        value: value.replace(/0/g, '1'),
        cursor: pos
      }
    }else if(buyNum > inventoryNum){//判断库存
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        buy_num: inventoryNum,
        allowBuy:false//是否允许购买
      })
    }else {
      var totalPrice = (Number(buyNum) * Number(this.data.new_price)).toFixed(2)
      that.setData({
        totalPrice: totalPrice,
        buy_num: buyNum,
        buy_num: e.detail.value,
        allowBuy:true//是否允许购买
      })
    }
  },

  //点击收藏
  collectTap: function(e) {
    if (!app.checkLoginState(
      function(isLogin){
        if(isLogin){
          isOnShowRefresh=true;
        }
      }
    )){
      return;
    };
    var that = this;
    var isCollect = this.data.isCollect;
    var dataSet;
    var param;
    if (isCollect) {
      //取消收藏
      dataSet = 'clientDelFav';
      param = 'CLIENT_ID=' + userId + '&FAV_ID=' + this.data.detailInfo.shopItemId;
    } else {
      //添加收藏
      dataSet = 'clientFav';
      param = 'CLIENT_ID=' + userId + '&FAV_ID=' + this.data.detailInfo.shopItemId + '&FAV_TYPE=1'; //FAV_TYPE 0商铺；1商品
    }
    wx.showLoading({
      title: '加载中',
    })
    app.httpsPlatformClass(dataSet, param,
      function(res) {
        //成功
        that.setData({
          isCollect: !isCollect
        });
        if (isCollect) {
          wx.showToast({
            title: '取消收藏成功',
            icon: 'none',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: '添加收藏成功',
            icon: 'success',
            duration: 1000
          });
        }
      },
      function(returnFrom, res) {
        //失败
        wx.hideLoading();
      }
    );



  },

  /**
   * 跳转购物车
   */
  goShopCar: function(e) {
    // wx.switchTab({
    //   url: '/pages/shopCar/shopCar'
    // })
    if (!app.checkLoginState(
      function (isLogin) {
        if (isLogin) {
          isOnShowRefresh = true;
        }
      }
    )) {
      return;
    };
    wx.navigateTo({
      url: '/pages/shopCar2/shopCar2'
    })
  },

  comRec() {
    wx.navigateTo({
      url: '/pages/commentRecommend/commentRecommend'
    })
  },

  /**
   * 查看全部评价
   */
  selEvaAllTap: function(e) {
    const goodsData =
      '?goodsId=' + goodsId +
      '&favourable=' + this.data.detailInfo.favourable +
      '&favourableRate=' + this.data.detailInfo.favourableRate +
      '&middle=' + this.data.detailInfo.middle +
      '&middleRate=' + this.data.detailInfo.middleRate +
      '&negative=' + this.data.detailInfo.negative +
      '&negativeRate=' + this.data.detailInfo.negativeRate +
      '&deliveryRate=' + this.data.detailInfo.deliveryRate +
      '&serviceTotal=' + this.data.detailInfo.serviceTotal +
      '&n1StarLevel=' + this.data.detailInfo.n1StarLevel +
      '&n2StarLevel=' + this.data.detailInfo.n2StarLevel +
      '&n3StarLevel=' + this.data.detailInfo.n3StarLevel +
      '&classNums=' + this.data.classNums[0].imgUrl
    wx.navigateTo({
      url: '/pages/goodsEvaList/goodsEvaList' + goodsData
    })
  },

  httpsData: function(id, userid) {
    var that = this;
      wx.showLoading({
        title: '加载中',
      })
    var param = 'shopItemId=' + id + '&clientId=' + userid + '&lon=' + app.globalData.longitude + '&lat=' + app.globalData.latitude;
    app.httpsDataGet('/shop/getShopItem', param,
      function(ret) {
        //成功
        wx.hideLoading();
        var dataObj = ret.data;
        var specificationsList = [];
        var position = -1;
        //遍历封装规格列表
        for (var index in dataObj.itemSpec) {
          var itemSpec = dataObj.itemSpec[index][index];
          itemSpec.id = index;
          // position = itemSpec.selected ? index:-1;
          if (index == 0) {
            position = index;
          }
          // itemSpec.selected = index == 0 ? true : false;
          itemSpec.selected = false;
          specificationsList.push(itemSpec);
        }

        //封装轮播图
        var imgUrls = dataObj.picUrl;
        //设置数据
        that.setData({
          detailInfo: dataObj,
          shop_num: Number(dataObj.cartTotal),
          imgUrls: imgUrls,
          goods_name: dataObj.itemName,
          // new_price: dataObj.itemPrice,
          // old_price: dataObj.itemPrice,
          new_price: specificationsList[0].itemSalePrice,
          old_price: specificationsList[0].price,

          inventory_num: dataObj.upNumber,
          distribution: dataObj.deliveryMode,
          specificationsCurIndex: -1,
          specifications_list: specificationsList,
          evaluation_info: {
            total: dataObj.commentTotal,
            // list: dataObj.shopItemComment
          },
          deliveryExplain: dataObj.deliveryNotes == undefined ? '' : dataObj.deliveryNote,
          isCollect: dataObj.favStatus == 1 ? true : false
        });

        var evaluateDate = []
        dataObj.shopItemComment.forEach((item,index)=>{//筛选客户评论
          if (item.commentParentId == 1){
            evaluateDate.push(item)
          }
        })

        //评价时间格式调整
        for(var item in evaluateDate){
          evaluateDate[item].commentDate = evaluateDate[item].commentDate.substr(0,10);
        }
        that.setData({
          evaluation_info: {
            list: evaluateDate.slice(0,2)
          },
        });

        that.setData({//获取前四张规格图
          classNum:that.data.specifications_list.slice(0,4)
        })

        var classNums = []
        that.data.classNum.forEach(element => {//过滤空图
          if(typeof element.imgUrl !=="undefined"){
            classNums.push(element)
            }
        });
        that.setData({
          classNums:classNums
        })
        
        //检索选择规格
        if (position > -1) {
          that.switchSpec(position);
        }
        WxParse.wxParse('article', 'html', dataObj.itemNotes, that, 5);
      },
      function(ret) {
        //失败
        wx.hideLoading();
      });
  },

  /**
   * 加入购物车
   */
  joinCarTap: function(e) {
    var that = this;
    var buyNum = this.data.buy_num; //购买数量
    var inventoryNum = this.data.inventory_num; //库存
    if (buyNum > inventoryNum) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.colseSpecMethod();
      if (!app.checkLoginState(
        function (isLogin) {
          if (isLogin) {
            isOnShowRefresh = true;
          }
        }
      )) {
        return;
      };
      var detailInfo = this.data.detailInfo;
      if (this.data.spec_name == null || this.data.spec_name == '' || this.data.spec_name == undefined) {
        wx.showModal({
          title: '提示',
          content: '请先选择规格',
          showCancel: false,
          success: res => {}
        })
        return;
      }
      var param = {};
      param.clientId = userId;
      param.shopItemId = detailInfo.shopItemId;
      param.itemName = detailInfo.itemName;
      // param.itemPrice = this.data.new_price;
      param.itemSalePrice = this.data.new_price;
      param.itemPrice = this.data.old_price;
      param.itemNumber = this.data.buy_num;
      param.itemSpec = detailInfo.itemSpec;
      param.shopItemSpecAttr = this.data.spec_name;
      param.imgUrl = this.data.spec_imgurl;
      param.shopId = detailInfo.shopId;
      param.memo = '';
      wx.showLoading({
        title: '加载中',
      })
      app.httpsDataPost('/order/addToCart', param,
        function(ret) {
          //成功
          if (ret.status) {
            that.setData({
              shop_num: ret.data
            });
            wx.showToast({
              title: '已加入购物车',
              icon: 'success',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: ret.msg + '(' + ret.code + ')',
              icon: 'none',
              duration: 2000
            });
          }
        },
        function(ret) {
          //失败
          wx.hideLoading();
        });
    }


  },

  /**
   * 立即购买
   */
  buyNowTap: function(e) {
    if (!app.checkLoginState(
      function (isLogin) {
        if (isLogin) {
          isOnShowRefresh = true;
        }
      }
    )) {
      return;
    };
    if(this.data.allowBuy){
      var specList = this.data.specifications_list;
      var specInfo;
      for (var index in specList) {
        if (specList[index].selected) {
          specInfo = specList[index];
        }
      }
      if (specInfo == null || specInfo == '' || specInfo == undefined) {
        wx.showModal({
          title: '提示',
          content: '请先选择规格',
          showCancel: false,
          success: res => {}
        })
        return;
      }
      this.colseSpecMethod();
      var detailInfo = this.data.detailInfo;
      var goodsList = [];
      var goodsObj = {};
      goodsObj.shopName = detailInfo.shopName;
      goodsObj.goodsId = detailInfo.shopItemId;
      goodsObj.itemName = detailInfo.itemName;
      goodsObj.imgUrl = this.data.spec_imgurl;
      goodsObj.price = this.data.new_price;
      goodsObj.oldprice = this.data.old_price;
  
      goodsObj.buyNum = this.data.buy_num;
      // goodsObj.specName = specInfo.spec;
      goodsObj.shopItemSpecAttr = specInfo.spec;
      goodsObj.shopCartId = '';
      goodsObj.deliveryMode = detailInfo.deliveryMode;
      goodsObj.postageType = detailInfo.postageType;
      goodsObj.postageAmnt = detailInfo.postageAmnt == undefined ? 0 : detailInfo.postageAmnt;
      goodsList.push(goodsObj);
      wx.setStorage({
        key: 'goods_list',
        data: JSON.stringify(goodsList)
      })
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?action=0'
      })

    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确的数量',
        showCancel: false,
        success: res => {}
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let isIphoneX = app.globalData.isIphoneX; this.setData({ isIphoneX: isIphoneX })

    // if (!app.checkLoginState(
    //   function (isLogin) {
    //     if (isLogin) {
    //       isOnShowRefresh = true;
    //     }
    //   }
    // )) {
    //   return;
    // };
    var that = this;
          // app.wxLogin().then(function(res) {
          //   userId = app.globalData.userId;
          //   goodsId = options.id;
          //   this.httpsData(goodsId, userId);
          // })

    userId = app.globalData.userId;
    goodsId = options.id;


    this.httpsData(goodsId, userId);
    
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
    if (isOnShowRefresh){
      isOnShowRefresh=false;
      userId = app.globalData.userId;  
      this.httpsData(goodsId, userId);
    }
    
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
  onShareAppMessage: function(res) {
    // this.setData({
    //   showModalStatus:false
    // });
   
    var imgurl = this.data.spec_imgurl;
    if (imgurl == undefined || imgurl == null || imgurl==''){
      imgurl='../../images/icon/App_logo.png';
    }
    return {
      title: '装小匠商城',
      path: '/pages/goodsDetail/goodsDetail?id=' + goodsId,
      imageUrl: imgurl
    }
  }
})