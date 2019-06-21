//index.js
const app = getApp()
import {
  formatDate
} from '../../util/index.js'
const {
  $Message
} = require('../../dist/base/index');
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    productList: []
  },
  goProductDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/indexProduct/indexProduct?id=' + e.currentTarget.dataset.id,
    })
  },
  onShow: function() {
    this.getProductList()
  },
  onLoad: function() {
    this.onGetOpenid()
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
  getProductList() {
    const db = wx.cloud.database()
    db.collection('product').where({
      onSale: true
    }).get().then(res => {
      this.setData({
        productList: res.data
      })
    })
  },
  onGetUserInfo: function(e) {
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
  
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.data.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
})
