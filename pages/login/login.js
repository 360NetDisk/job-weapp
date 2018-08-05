// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code_num: 60,
    isShow: 0,//验证码显示
    phone: 0,
    code: 0,
    isDisabled: false, //是否禁用按钮
    phoneFocus: null, //手机号输入框是否聚焦
    codeFocus: null,  //验证码输入框聚焦
    hasUser: false
  },

  //手机号码
  phoneBI: function (e) {
    this.setData({
      phone: e.detail.value
    })
    ///^1\d{10}$/  /^1[3|4|5|7|8][0-9]{9}$/
    if (e.detail.cursor > 10 && !/^1\d{10}$/.test(e.detail.value)) {
      // app.showError('错误提示', '请输入正确手机号码', false, "#f45608")
      wx.showToast({
        title: '请您输入正确的手机号码',
        icon: "none",
        duration: 1500
      })
    } else if (e.detail.cursor > 10 && /^1\d{10}$/.test(e.detail.value)) {
      this.setData({
        phoneFocus: false
      })
    }
  },

  //获取验证码
  getCode: function () {
    let phone = this.data.phone
    var count = 60;
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/api/sms/code',
      data: {
        mobile: phone
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status == "OK") {
          if (count == 0) {
            that.setData({
              isShow: 0
            })
            clearInterval(setTime);
            count == 60;
            return;
          } else {
            var setTime = setInterval(
              function () {
                count--;
                that.setData({
                  isShow: 1,
                  code_num: count,
                  isDisabled: true
                })
                if (count == 0) {
                  clearInterval(setTime);
                  that.setData({
                    isShow: 0,
                    isDisabled: false
                  })
                }
              }, 1000)
          }
        } else {
          wx.showModal({
            title: '提示',
            content: `${res.data.msg},请稍后再试`,
            confirmColor: "#f45608",
            showCancel: false
          })
        }
      }
    })
  },

  //验证码
  codeBI: function (e) {
    this.setData({
      code: e.detail.value
    })
    if (e.detail.cursor > 3) {
      this.setData({
        codeFocus: false
      })
    }
  },

  //登录按钮
  loginBtn: function () {
    let openid = wx.getStorageSync('openid')
    let mobile = this.data.phone
    let code = this.data.code
    let avatarUrl = app.globalData.userInfo.avatarUrl
    let nickName = app.globalData.userInfo.nickName
    let province = app.globalData.userInfo.province
    let city = app.globalData.userInfo.city
    let language = app.globalData.userInfo.language
    let sex = app.globalData.userInfo.gender
    wx.request({
      url: app.globalData.baseUrl+'/api/login/register',
      method: 'GET',
      data: {
        openid: openid,
        mobile: mobile,
        code: code,
        head_pic: avatarUrl,
        nickname: nickName,
        province: province,
        city: city,
        language: language,
        sex: sex
      }, success(res) {
        console.log(res.data)
        if (res.data.code == 1) {
          wx.setStorageSync("token", res.data.token)
          wx.setStorageSync("user_id", res.data.user_id)
          wx.navigateTo({
            url: '../resume/resume'
          })
        } else if (res.data.code == 2) {
          console.log(res.data)
          wx.setStorageSync("token", res.data.token)
          wx.setStorageSync("user_id", res.data.user_id)
          wx.showModal({
            title: '提示',
            content: '您的账户已经存在,无需注册',
            confirmColor: "#f45608",
            confirmText: "确定",
            showCancel: false,
            success(res1) {
              if (res1.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 查看是否授权
    console.log(app.globalData.userInfo)
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {

              app.globalData.userInfo = res.userInfo
              that.setData({
                hasUser: true
              })
              //用户已经授权过
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
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    let that = this
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        hasUser: true
      })
      console.log(this.data.hasUser)
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '您已经拒绝授权，先删除小程序，在微信搜索小程序重新进入，或者点击下面的去设置',
        confirmColor: "#f45608",
        confirmText: "去设置",
        showCancel: false,
        success(res1) {
          if (res1.confirm) {
            wx.openSetting({
              success: (res) => {
                that.setData({
                  hasUser: true
                })
                res.authSetting = {
                  "scope.userInfo": true
                }
              }
            })
          }
        }
      })
    }
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