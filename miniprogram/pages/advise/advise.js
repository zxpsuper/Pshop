// miniprogram/pages/advise/advise.js
const app = getApp()
import { formatDate } from '../../util/index.js'
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advise: ''
  },
  setAdvise(e) {
    console.log(e)
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setData({
        advise: e.detail.value
      })
    }, 500)
  },
  handleClick() {
    if (wx.getStorageSync('adviseTime')) {
      let time = new Date(wx.getStorageSync('adviseTime'))
      if (formatDate(new Date(), 'yyyy-MM-dd') === formatDate(time, 'yyyy-MM-dd')) {
        $Message({
          content: '一天最多提交一条建议哦',
          type: 'error'
        });
        return false
      }
    }
    wx.setStorageSync('adviseTime', new Date().toString())
    const db = wx.cloud.database()
    let data = this.data
    db.collection('advise').add({
      data: {
        name: app.globalData.userInfo.nickname,
        advise: this.data.advise,
        updateDate: formatDate(new Date())
      },
      success: res => {
        $Message({
          content: '提交成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        $Message({
          content: '提交失败',
          type: 'error'
        });
        console.error('[数据库] [新增记录] 失败：', err)
      }
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