// miniprogram/pages/brandList/brandList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAllDetail: false,
        brandList: [],
        page: 1
    },
    onChange(e) {
        this.setData({
            showAllDetail: !this.data.showAllDetail
        })
    },

    addCategory() {
        wx.navigateTo({
            url: '/pages/brandDetail/brandDetail',
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