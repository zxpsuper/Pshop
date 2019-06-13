// miniprogram/pages/category/category.js
import { formatDate } from '../../util/index.js'
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sort: '',
    description: '',
    title: '新建分类'
  },
  setName(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  setSort(e) {
    this.setData({
      sort: e.detail.detail.value
    })
  },
  setDescription(e) {
    this.setData({
      description: e.detail.detail.value
    })
  },
  handleClick: function () {
    if (this.data.id) {
      this.updateCategory()
    } else {
      this.addCategory()
    }
  },
  // 添加分类
  addCategory() {
    const db = wx.cloud.database()
    let data = this.data
    db.collection('category').add({
      data: {
        categoryName: data.name,
        categorySort: data.sort,
        categoryDescription: data.description,
        updateDate: formatDate(new Date())
      },
      success: res => {
        $Message({
          content: '添加成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        $Message({
          content: '添加失败',
          type: 'error'
        });
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  // 删除分类
  deleteCategory() {
    const db = wx.cloud.database()
    db.collection('category').doc(this.data.id).remove({
      success: res => {
        console.log(res)
        $Message({
          content: '删除成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        $Message({
          content: '删除失败',
          type: 'error'
        });
      }
    })
  },
  updateCategory() {
    const db = wx.cloud.database()
    let data = this.data
    db.collection('category').doc(this.data.id).update({
      data: {
        categoryName: data.name,
        categorySort: data.sort,
        categoryDescription: data.description,
        updateDate: formatDate(new Date())
      },
      success: res => {
        console.log(res)
        $Message({
          content: '修改成功',
          type: 'success'
        });
        setTimeout(()=> {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        $Message({
          content: '修改失败',
          type: 'error'
        });
      }
    })
  },
  getCategoryDetail(id) {
    const db = wx.cloud.database()
    db.collection('category').where({
      _id: id
    }).get().then(res => {
      this.setData({
        name: res.data[0].categoryName,
        sort: res.data[0].categorySort,
        description: res.data[0].categoryDescription,
      })
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id) {
        this.setData({
          id: options.id,
          title: '编辑分类'
        })
        this.getCategoryDetail(options.id)
      }
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