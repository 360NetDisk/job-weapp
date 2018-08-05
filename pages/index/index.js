//index.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPlate: function (e) {
    let id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: `../plate/plate?id=${id}`,
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
    this.getList();//获取列表信息
    this.getuserinfo();//获取登录过论坛的用户信息
  },
  getList() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/api/job/joblist",
      method: 'GET',
      data: {
      }, success(res) {
        console.log(res.data)
        if (res.data.status_code ==200 ) {
          that.setData({
            jobList: res.data.data
          })
        } else {

        }
      }
    })
  },
  getuserinfo() {
    console.log(app.globalData)
    console.log(555555 + app.globalData.openid)
    console.log(555555)
    let that = this;
    console.log(wx.getStorageSync("openid"))
    wx.request({
      url: app.globalData.baseUrl + "/api/login/getuserinfo",
      method: 'GET',
      data: {
        openid: app.globalData.openid
      }, success(res) {
        console.log(res.data)

        if (res.data.status == 1) {

          console.log(res.data)
        } else {
          wx.showModal({
            title: '提示',
            content: '检测到您还没注册，现在前往注册',
            confirmColor: "#32e0c1",
            showCancel: false,
            success(res1) {
              if (res1.confirm) {
                wx.reLaunch({
                  url: '../login/login'
                })
              }
            }
          })
          console.log(res.data)
        }
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