//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(this.globalData.userInfo)
    // 登录
    // 登录
    let that = this
    wx.login({
      
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
         console.log(res.code)
        wx.request({
          url: this.globalData.baseUrl + '/api/login/getopenid',
          method: 'GET',
          data: {
            code: res.code,
            appid: "wx9352f3b75707fdca",
            secret: "f9fd6a92602863fc12b53165b4ff8883"
          },
          success(res1) {
            wx.setStorageSync("openid", res1.data.openid)
            that.globalData.openid = res1.data.openid
            console.log("333" + that.globalData.openid)
            
            // console.log(res1.data.openid)
          }, fail(res1) {

          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    baseUrl: 'https://job.c3w.cc/index.php',
    openid:'',
    userInfo: null
  }
})