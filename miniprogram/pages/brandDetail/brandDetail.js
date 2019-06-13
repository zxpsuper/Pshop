// miniprogram/pages/brandDetail/brandDetail.js
import { formatDate } from '../../util/index.js'
const { $Message } = require('../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '新建品牌',
        brandLogo:'',
        name: '',
        sort: "",
        description: ''
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
    chooseImage() {
        let that = this
        wx.chooseImage({
            count: 1,
            success: function(res) {
                that.uploadFile(res.tempFilePaths[0])
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
                console.log(res)
                this.setData({
                    brandLogo: prefix+key
                })
            }
        })
    },

    handleClick: function () {
        if (this.data.id) {
            this.updateBrand()
        } else {
            this.addBrand()
        }
    },
    // 添加分类
    addBrand() {
        let data = this.data
        if (!data.name || !data.brandLogo) {
            $Message({
                content: '请填写完整信息',
                type: 'error'
            });
            return
        }
        const db = wx.cloud.database()
        db.collection('brand').add({
            data: {
                brandName: data.name,
                brandSort: data.sort,
                brandDescription: data.description,
                brandLogo: data.brandLogo,
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
    deleteBrand() {
        const db = wx.cloud.database()
        db.collection('brand').doc(this.data.id).remove({
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
    updateBrand() {
        let data = this.data
        if (!data.name || !data.brandLogo) {
            $Message({
                content: '请填写完整信息',
                type: 'error'
            });
            return
        }
        const db = wx.cloud.database()
        db.collection('brand').doc(this.data.id).update({
            data: {
                brandName: data.name,
                brandSort: data.sort,
                brandDescription: data.description,
                brandLogo: data.brandLogo,
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
    getBrandDetail(id) {
        const db = wx.cloud.database()
        db.collection('brand').where({
            _id: id
        }).get().then(res => {
            this.setData({
                name: res.data[0].brandName,
                sort: res.data[0].brandSort,
                description: res.data[0].brandDescription,
                brandLogo: res.data[0].brandLogo
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
                title: '编辑品牌'
            })
            this.getBrandDetail(options.id)
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