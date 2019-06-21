// miniprogram/pages/productList/productList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    brandList: [],
    productList: [],
    name: '',
    price: '',
    index: 0,
    brandIndex: 0,
    total: 0,
    showAllDetail: false,
    pageNo: 1
  },
  // 换页
  changePage({
    detail
  }) {
    const type = detail.type;
    if (type === 'next') {
      this.getProductList(this.data.pageNo + 1)
      this.setData({
        pageNo: this.data.pageNo + 1
      });
    } else if (type === 'prev') {
      this.getProductList(this.data.pageNo - 1)

      this.setData({
        pageNo: this.data.pageNo - 1
      });
    }
  },
  getProductList(pageNo) {
    let skip = (pageNo - 1) * 5
    let search = {}
    if (this.data.name) search.productName = this.data.name
    if (this.data.price) search.productSalePrice = this.data.price
    if (this.data.brandIndex > 0) search.brandId = this.data.brandList[this.data.brandIndex]._id || ''
    if (this.data.index > 0)  search.categoryId = this.data.categoryList[this.data.index]._id || ''
    if (skip === 0) {
      wx.cloud.database().collection("product").where(search).limit(5).get().then(res => {
        this.setData({
          productList: res.data
        })
      })
    } else {
      wx.cloud.database().collection("product").where(search).skip(skip).limit(5).get().then(res => {
        this.setData({
          productList: res.data
        })
      })
    }
    wx.cloud.database().collection("product").where(search).count().then(res => {
      console.log(res, search)
      this.setData({
        total: Math.ceil(res.total / 5)
      })
    })
  },
  searchProduct() {
    this.setData({
      pageNo: 1
    })
    this.getProductList(1)
  },
  onChange(e) {
    this.setData({
      showAllDetail: !this.data.showAllDetail
    })
  },
  addProduct() {
    wx.navigateTo({
      url: '/pages/productDetail/productDetail',
    })
  },
  bindPickerChange(event) {
    this.setData({
      index: event.detail.value
    })
  },
  brandChange(event) {
    this.setData({
      brandIndex: event.detail.value
    })
  },
  setName(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  setPrice(e) {
    this.setData({
      price: e.detail.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.cloud.callFunction({
      name: 'categoryList',
      data: {},
      success: res => {
        this.setData({
          categoryList: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
    wx.cloud.callFunction({
      name: 'brandList',
      data: {},
      success: res => {
        this.setData({
          brandList: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
    wx.cloud.database().collection("product").limit(5).get().then(res => {
      this.setData({
        productList: res.data
      })
    })
    wx.cloud.database().collection("product").count().then(res => {
      this.setData({
        total: Math.ceil(res.total / 5)
      })
    })
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