// miniprogram/pages/productDetail/productDetail.js
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
    id: '',
    title: '新建商品',
    name: '',
    sort: '',
    description: '',
    salePrice: '',
    discountPrice: '',
    index: 0,
    brandIndex: 0,
    brandId: '',
    categoryId: '',
    onSale: true,
    brandList: [],
    categoryList: [],
    productImage: ['https://suporka-1254965331.cos.ap-guangzhou.myqcloud.com/wxe6b98ab31a72227e.o6zAJsx2RJPrHVFWlvHJgFVxJB5Q.tbTumU3koRoU4c85e8c59393f3865b3704051be60ffc.png', "https://suporka-1254965331.cos.ap-guangzhou.myqcloud.com/wxe6b98ab31a72227e.o6zAJsx2RJPrHVFWlvHJgFVxJB5Q.ZFJo8Gqn1j2o1bf61b93bc471aa170317edea2df6e82.svg", 'https://suporka-1254965331.cos.ap-guangzhou.myqcloud.com/wxe6b98ab31a72227e.o6zAJsx2RJPrHVFWlvHJgFVxJB5Q.rKACll2iemjgc7f8c5cb9a1a47fe01270de7085376cf.jpg']
  },
  changeOnSale(e) {
    this.setData({
      onSale: !this.data.onSale
    })
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
  setSalePrice(e) {
    this.setData({
      salePrice: e.detail.detail.value
    })
  },
  setDiscountPrice(e) {
    this.setData({
      discountPrice: e.detail.detail.value
    })
  },
  bindPickerChange(event) {
    console.log(event)
    this.setData({
      index: event.detail.value
    })
  },
  brandChange(event) {
    this.setData({
      brandIndex: event.detail.value
    })
  },
  deleteIcon(e) {
    console.log(e)
    this.data.productImage.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      productImage: this.data.productImage
    })
  },
  chooseImage() {
    let that = this
    wx.chooseImage({
      count: 9,
      success: function(res) {
        res.tempFilePaths.forEach(item => {
          that.uploadFile(item)
        })
      },
    })
  },
  uploadFile(filepath) {
    const prefix = 'https://suporka-1254965331.cos.ap-guangzhou.myqcloud.com/'
    let key = filepath.substr(filepath.lastIndexOf('/') + 1)
    wx.uploadFile({
      url: prefix,
      filePath: filepath,
      name: 'file',
      formData: {
        'key': key,
        'success_action_status': 200,
        "Signature": undefined,
        "x-cos-security-token": undefined,
        "Content-type": ''
      },
      success: res => {
        this.data.productImage.push(prefix + key)
        this.setData({
          productImage: this.data.productImage
        })
      }
    })
  },
  handleClick: function() {
    if (this.data.id) {
      this.updateProduct()
    } else {
      this.addProduct()
    }
  },
  // 添加商品
  addProduct() {
    let data = this.data
    if (!data.name || !data.salePrice || !data.description || !data.productImage.length) {
      $Message({
        content: '请填写完整信息',
        type: 'error'
      });
      return
    }
    const db = wx.cloud.database()
    db.collection('product').add({
      data: {
        productName: data.name,
        productSort: data.sort,
        productDescription: data.description,
        productImage: data.productImage,
        productSalePrice: data.salePrice,
        productDiscountPrice: data.discountPrice,
        onSale: data.onSale,
        categoryName: data.categoryList[data.index].categoryName,
        categoryId: data.categoryList[data.index]._id,
        brandName: data.brandList[data.brandIndex].brandName,
        brandId: data.brandList[data.brandIndex]._id,
        view: 0,
        like: 0,
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
  deleteProduct() {
    const db = wx.cloud.database()
    db.collection('product').doc(this.data.id).remove({
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
  updateProduct() {
    let data = this.data
    if (!data.name || !data.salePrice || !data.description || !data.productImage.length) {
      $Message({
        content: '请填写完整信息',
        type: 'error'
      });
      return
    }
    const db = wx.cloud.database()
    db.collection('product').doc(this.data.id).update({
      data: {
        productName: data.name,
        productSort: data.sort,
        productDescription: data.description,
        productImage: data.productImage,
        productSalePrice: data.salePrice,
        onSale: data.onSale,
        productDiscountPrice: data.discountPrice,
        categoryName: data.categoryList[data.index].categoryName,
        categoryId: data.categoryList[data.index]._id,
        brandName: data.brandList[data.brandIndex].brandName,
        brandId: data.brandList[data.brandIndex]._id,
        updateDate: formatDate(new Date())
      },
      success: res => {
        console.log(res)
        $Message({
          content: '修改成功',
          type: 'success'
        });
        setTimeout(() => {
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
  getProductDetail(id) {
    const db = wx.cloud.database()
    db.collection('product').where({
      _id: id
    }).get().then(res => {
      console.log('详情', res)
      let data = {
        name: res.data[0].productName,
        sort: res.data[0].productSort,
        description: res.data[0].productDescription,
        productImage: res.data[0].productImage,
        salePrice: res.data[0].productSalePrice,
        discountPrice: res.data[0].productDiscountPrice,
        brandId: res.data[0].brandId,
        categoryId: res.data[0].categoryId,
        onSale: res.data[0].onSale
      }
      if (this.data.brandList.length) {
        let index = this.data.brandList.findIndex((item) => item._id === data.brandId)
        index > -1 && (data.brandIndex = index)
      }
      if (this.data.categoryList.length) {
        let index = this.data.categoryList.findIndex((item) => item._id === data.categoryId)
        index > -1 && (data.index = index)
      }
      this.setData(data)
    })
  },
  getCategoryList() {
    wx.cloud.callFunction({
      name: 'categoryList',
      data: {},
      success: res => {
        this.setData({
          categoryList: res.result.data
        })
        this.getBrandList()
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
  getBrandList() {
    wx.cloud.callFunction({
      name: 'brandList',
      data: {},
      success: res => {
        let data = {
          brandList: res.result.data
        }
        this.setData(data, () => {

          if (this.data.id) this.getProductDetail(this.data.id)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.data.id = options.id
      this.setData({
        title: '编辑商品'
      })
    }
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
    this.getCategoryList()


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