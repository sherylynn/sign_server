'use strict';

var Test = {
  init: function (app) {
    app.get('/test/test', this.doTest);
    app.get('/userInfo', this.doShow);
    app.get('/dashboard', this.dashboard);
  },

  doTest: function (req, res) {
    res.send({
      status: 1,
      info: '测试服务doTest'
    });
  },

  doShow: function (req, res) {
    const response = {
      success: false,
      username: '',
      message: ''
    };
    res.send(response);
  },
  dashboard: (req, res) => {
    res.send({ 'sales|8': [{
        'name|+1': 2008,
        'Clothes|200-500': 1,
        'Food|180-400': 1,
        'Electronics|300-550': 1
      }],
      'cpu': {
        'usage|50-600': 1,
        space: 825,
        'cpu|40-90': 1,
        'data|20': [{
          'cpu|20-80': 1
        }]
      },
      'browser': [{
        name: 'Google Chrome',
        percent: 43.3,
        status: 1
      }, {
        name: 'Mozilla Firefox',
        percent: 33.4,
        status: 2
      }, {
        name: 'Apple Safari',
        percent: 34.6,
        status: 3
      }, {
        name: 'Internet Explorer',
        percent: 12.3,
        status: 4
      }, {
        name: 'Opera Mini',
        percent: 3.3,
        status: 1
      }, {
        name: 'Chromium',
        percent: 2.53,
        status: 1
      }],
      user: {
        name: 'zuiidea',
        email: 'zuiiidea@.gmail.com',
        sales: 3241,
        sold: 3556,
        avatar: 'http://tva4.sinaimg.cn/crop.0.0.996.996.180/6ee6a3a3jw8f0ks5pk7btj20ro0rodi0.jpg'
      },
      'completed|12': [{
        'name|+1': 2008,
        'Task complete|200-1000': 1,
        'Cards Complete|200-1000': 1
      }],

      quote: {
        name: 'Joho Doe',
        title: 'Graphic Designer',
        content: `I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.`,
        avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236'
      }
    });
  }
};

module.exports = Test;