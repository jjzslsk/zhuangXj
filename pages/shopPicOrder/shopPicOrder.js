// pages/shopPicOrder/shopPicOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:'',
    orderId:'',
    step:'1',
    pickedImgs: [],
    compressImgs: [],
    compressImgsIndex: 0,
    uploadedImgs: [],
    uploadedImgIndex: 0,

    addressInfo: { //收货地址
      id:'',
      takeName: '',
      takePhone: '',
      address: '',
      cityName: '',
      postcode: ''
    },
  },

  setStep: function (e) {
    var step = e.currentTarget.dataset.step;		
    if(step=='1'){
      this.setData({
        step: '2'
      });
    }else{
      this.uploadImg()
    }
  },

  chooseImage: function (e) {
    var pickedImgs = this.data.pickedImgs
    var that = this
    var count = 12 - pickedImgs.length
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          //pickedImgs: res.tempFilePaths,
          compressImgs: res.tempFilePaths
        });
        that.compressImage()
      }
    })
  },

  compressImage: function () {
    var compressImgsIndex = this.data.compressImgsIndex
    var compressImgs = this.data.compressImgs
    var pickedImgs = this.data.pickedImgs

    var that = this
    if (compressImgsIndex < compressImgs.length) {
      wx.compressImage({
        src: compressImgs[compressImgsIndex],
        quality: 50,
        success(res) {
          pickedImgs.unshift(res.tempFilePath)

          compressImgsIndex = compressImgsIndex + 1

          that.setData({
            pickedImgs: pickedImgs,
            compressImgsIndex: compressImgsIndex
          })

          that.compressImage()
        }, fail(res) {
        }
      })
    } else {
      if (this.data.pickedImgs.length>=12){
        wx.showToast({
          title: '您已选择12张图，若还有需求，请另发订单',
          icon: 'none',
          duration: 2000
        })
      }
      that.setData({
        compressImgsIndex: 0,
        compressImgs: []
      });
    }
  },

  deleteImg: function (e) {
    var i = e.currentTarget.dataset.index;
    var pickedImgs = this.data.pickedImgs
    pickedImgs.splice(i, 1)
    this.setData({
      pickedImgs: pickedImgs
    });
  },

  uploadImg: function (e) {
    var uploadedImgIndex = this.data.uploadedImgIndex;
    var pickedImgs = this.data.pickedImgs;
    var uploadedImgs = this.data.uploadedImgs;

    if (pickedImgs.length==0){
      wx.showModal({
        title: '提示',
        content: '请选择图片',
        showCancel: false,
      });
      return
    } else if (!this.data.addressInfo.id) {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        showCancel: false,
      });
      return
    }
    if (!this.data.orderId){
      this.getOrderId()
      return;
    }      

    wx.showLoading({
      title: '提交中',
    })


    var uploadImgParam = {
      attUser: app.globalData.userId,
      attFkId: this.data.orderId,
      attFkName: "[ORDER_PHOTO]",
      attName: "[_" + uploadedImgIndex + "_ORDER_PHOTO.jpg]",
      clientId: app.globalData.userId,
      attNoWater: '1'
    }
    var that = this
    wx.uploadFile({
      url: app.globalData.url +'/upFile',
      filePath: pickedImgs[uploadedImgIndex],
      name: 'file',
      formData: uploadImgParam,
      success(res) {
        if (res.data) {
          var resData = JSON.parse(res.data)
          if (resData.pic && resData.pic.length > 0)
            uploadedImgs.push(resData.pic[0].pic)

          that.setData({
            uploadedImgs: uploadedImgs
          })
        }

        uploadedImgIndex++
        that.setData({
          uploadedImgIndex: uploadedImgIndex
        })
        if (uploadedImgIndex < pickedImgs.length) {
          that.uploadImg()
        } else {
          that.commit()
        }
      }
    })

  },

  commit: function () {
    var that=this
    var param={
      photoOrderId: this.data.orderId,
      clientId: app.globalData.userId,
      shopId: this.data.shopId,
      clientAddress: this.data.addressInfo.id
    }
    app.httpsDataPost('/photoOrder/createPhotoOrder', param,
      function (ret) {
        //成功
        if (ret.status) {
          that.setData({
            step: '3'
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败',
            showCancel: false,
          });
        }
        wx.hideLoading();
      },
      function (ret) {
        //失败
        wx.hideLoading();
      });
  },

  getOrderId: function (options) {
    var that = this
    app.httpsDataGet('/utils/getPK', '',
      function (res) {
        if (res.status) {
          that.setData({
            orderId: res.data
          });
        }
        wx.hideLoading()
      },
      function (res) {
        //失败
        wx.hideLoading()

      }
    )
  },

  chooseAddressTab: function (e) {
    wx.navigateTo({
      url: '/pages/addressMg/addressMg?action=1'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.shopId//'1903211149003208'//
    this.setData({
      shopId:id
    })
    this.getOrderId()
    var that=this
    app.getUserDefAddress(function (ret) {
      if (ret == null) return;
      var addressInfoTemp = {};
      addressInfoTemp.id = ret.CLIENT_ADDRESS_ID;
      addressInfoTemp.takeName = ret.CLIENT_NAME;
      addressInfoTemp.takePhone = ret.CLIENT_PHONE;
      addressInfoTemp.address = ret.CLIENT_ADDRESS;
      addressInfoTemp.cityName = ret.CLIENT_CITY;
      addressInfoTemp.postcode = ret.CLIENT_MAILBOX;

      that.setData({
        addressInfo: addressInfoTemp
      });
    });
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