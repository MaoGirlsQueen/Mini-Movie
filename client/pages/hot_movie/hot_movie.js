// pages/hot_movie/hot_movie.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

var touch = [0, 0];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieData: [/*{
      id: 0,
      title: '壁花少年',
      image: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',
      description: '查理（罗根·勒曼 Logan Lerman 饰）是个害羞和孤独的高中新生，拥有超越年龄的敏感和泪腺，总是默默观察身边的家人和朋友，是个典型的「壁花少年」。他的青春期充满各种挫折，先后经历了阿姨为给他买生日礼物去世、最好朋友自杀、受同侪排挤欺负、单恋没有回应等各种事情。然而查理还不是最惨的，因为和他一样被生活逼入墙角罚站的人实在太多。他幸运的拥有一个开明的老师和两个高年级的好友：叛逆娇俏的少女珊（艾玛·沃森 Emma Watson 饰）和自信满满的同志男生帕特里克（埃兹拉·米勒 Ezra Miller 饰），他们让查理明白了有时候不能永远旁观，必须要参与进来才能拥有属于自己的精彩。 ',
      catagory: '青春 / 成长 / 美国 / 爱情',
    }*/],
    testCurrentNav: 0,
    currentIndex: 0,
    currentMovie: {},
    // movieAnimationData: '',
    movieDistance: 0,
    classArray: ['active', 'next'], // 定义class数组，存放样式class，
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getMovieList()
  },
  // 开始滑动
  onTouchStart(e) {
    console.log(e)

    touch[0] = e.touches[0].clientX
  },
  // 结束滑动
  onTouchEnd(e) {
    touch[1] = e.changedTouches[0].clientX;
    if (touch[0] - touch[1] > 5) {
      this.addClassName('left');
    } else if (touch[1] - touch[0] > 5) {
      this.addClassName('right');
    }
  },
  addClassName(direction) {
    let currentIndex = this.data.currentIndex
    let currentMovie = {}
    let movieData = this.data.movieData
    let length = movieData.length
    let classArray = new Array(length)

    if (direction === 'left') {  // 向左滑动
      if (++currentIndex >= length) return

      classArray[currentIndex] = 'active';
      classArray[currentIndex - 1] = 'prev';
      if (currentIndex + 1 < length) {
        classArray[currentIndex + 1] = 'next';
      }

    } else if (direction === 'right') {  // 向右滑动
      if (--currentIndex < 0) return

      if (currentIndex - 1 >= 0) {
        classArray[currentIndex - 1] = 'prev';
      }
      classArray[currentIndex] = 'active';
      classArray[currentIndex + 1] = 'next';

    }

    currentMovie = movieData[currentIndex]
    this.moveCard(direction)

    this.setData({
      currentIndex,
      classArray,
      currentMovie,
    })
  },
  // 创建平移动画
  moveCard(direction) {
    let currentIndex = this.data.currentIndex + 1
    let movieDistance = this.data.movieDistance

    if (direction === 'left') {
      movieDistance -= 549
    } else if (direction === 'right') {
      movieDistance += 549
    }

    this.setData({
      movieDistance
    })
  },
  /**
   * 获取电影信息
   */
  getMovieList() {
    wx.showLoading({
      title: '获取电影列表...',
    })

    qcloud.request({
      url: config.service.movieList,
      success: res => {
        wx.hideLoading()

        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: '电影列表加载完毕',
          })
          this.setData({
            movieData: data.data,
            currentMovie: data.data[0]
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影列表加载失败',
            image: '../../image/error.svg'
          })
        }
      },
      fail: res => { 
        wx.hideLoading()
        // console.log('加载失败', res)
        wx.showToast({
          icon: 'none',
          title: '电影列表加载失败',
          image: '../../image/error.svg'
        })
      }
    })
  },
  // 实现页面跳转
  onTapNavigateTo(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id, e)

    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
})