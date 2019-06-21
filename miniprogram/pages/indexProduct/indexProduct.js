// miniprogram/pages/indexProduct/indexProduct.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    discountPrice: '',
    name: '',
    description: '',
    productImage: [],
    salePrice: '',
    like: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    iflike: false
  },
  getProductDetail(id) {
    const db = wx.cloud.database()
    db.collection('product').where({
      _id: id
    }).get().then(res => {
      console.log('详情', res)
      let data = {
        name: res.data[0].productName,
        description: res.data[0].productDescription,
        productImage: res.data[0].productImage,
        salePrice: res.data[0].productSalePrice,
        discountPrice: res.data[0].productDiscountPrice,
        like: res.data[0].like
      }
      this.setData(data)
      this.data.productDetail = res.data[0]
      this.uploadProductView(res.data[0].view + 1)
    })
  },
  likeProduct() {
    const db = wx.cloud.database()
    this.setData({
      iflike: true
    })
    db.collection('product').doc(this.data.id).update({
      data: {
        like: this.data.like + 1
      }
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      let hasProduct = false
      this.data.userId = res.data[0]._id
      this.data.userLikeArr = res.data[0].like
      for (let i = 0; i < res.data[0].like.length; i++) {
        if (res.data[0].like[i]._id === this.data.id) {
          hasProduct = true
          break;
        }
      }
      if (!hasProduct) {
        this.addMyLike()
      }
    })
  },
  addMyLike() {
    const db = wx.cloud.database()
    let like = this.data.userLikeArr
    like.push(this.data.productDetail)
    db.collection('user').doc(this.data.userId).update({
      data: {
        like,
      }
    })
  },
  uploadProductView(view) {
    const db = wx.cloud.database()
    db.collection('product').doc(this.data.id).update({
      data: {
       view
      }
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.getProductDetail(options.id)
    
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