var TopBar = Thorax.Model.extend({
  url: '/user',
//  defaults: {
//    userName: 'Testing UserName, Please Ignore',
//    userImg: 'http://www.placekitten.com/75/75'
//  }
  
  defaults: {
    userName: this.displayName,
    userImg: this.avatar
  }
});

module.exports = TopBar; 