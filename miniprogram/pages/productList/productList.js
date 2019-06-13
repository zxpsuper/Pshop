// miniprogram/pages/productList/productList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    index: 0,
    showAllDetail: false
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
    wx.cloud.database().collection("category").get().then(res => {
      console.log('diaryList', res)
      this.setData({
        categoryList: res.data
      })
    })
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