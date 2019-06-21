// miniprogram/pages/mylike/mylike.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actions2: [
      {
        name: '删除',
        color: '#ed3f14'
      }
    ],
    likeList: [],
    deleteIndex: 0,
    visible2: false,
    toggle: false
  },
  goProductDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/indexProduct/indexProduct?id=' + e.currentTarget.dataset.id,
    })
  },
  actionsTap(e) {
    this.data.deleteIndex = e.currentTarget.dataset.index
    this.setData({
      visible2: true
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false,
      toggle: this.data.toggle ? false : true
    });
  },
  handleClickItem2() {
    this.setData({
      visible2: false,
      toggle: this.data.toggle ? false : true
    })
    this.data.likeList.splice(this.data.deleteIndex, 1)
    this.setData({
      likeList: this.data.likeList
    }, () => {
      this.updateMyLike()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'userDetail',
      success(res) {
        that.setData({
          likeList: res.data.like
        })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  updateMyLike() {
    const that = this
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      db.collection('user').doc(res.data[0]._id).update({
        data: {
          like: that.data.likeList
        },
        success: res22 => {
          console.log(res22, 222)
        },
        fail: res222 => {
          console.log(res222, 333)
        },
        complete: () => {
          console.log('完成')
        }
      })
    })
    
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