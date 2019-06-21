// miniprogram/pages/me/me.js
const app = getApp()
import {
  formatDate
} from '../../util/index.js'
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../index/user-unlogin.png',
    userInfo: {},
    userDetail: {},
    index: 1,
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.addUser(e.detail.userInfo)
    }
  },
  addUser(userInfo) {
    console.log('userInfo', userInfo)
    const db = wx.cloud.database()
    console.log(this.data.openid, 'res')
    db.collection('user').where({
      _openid: this.data.openid
    }).get().then(res => {
      if (!res.data.length) {
        db.collection('user').count().then(resCount => {
          db.collection('user').add({
            data: {
              ...userInfo,
              like: [],
              score: 0,
              index: resCount.total + 1,
              updateDate: formatDate(new Date())
            },
            success: res => {
              $Message({
                content: '登录成功',
                type: 'success'
              });
            },
            fail: err => {
              $Message({
                content: '登录失败',
                type: 'error'
              });
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        })
      } else {
        $Message({
          content: '登录成功',
          type: 'success'
        });
      }
    })
  },
  getUserDetail() {
    if (app.globalData.openid) {
      const db = wx.cloud.database()
      db.collection('user').where({
        _openid: this.data.openid
      }).get().then(res => {
        console.log(res)
        this.setData({
          index: res.data[0].index,
          userDetail: res.data[0]
        })
        wx.setStorage({
          key: "userDetail",
          data: res.data[0]
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
    
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
    this.getUserDetail()
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