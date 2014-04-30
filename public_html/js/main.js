!function e(n,t,a){function i(o,l){if(!t[o]){if(!n[o]){var s="function"==typeof require&&require;if(!l&&s)return s(o,!0);if(r)return r(o,!0);throw new Error("Cannot find module '"+o+"'")}var d=t[o]={exports:{}};n[o][0].call(d.exports,function(e){var t=n[o][1][e];return i(t?t:e)},d,d.exports,e,n,t,a)}return t[o].exports}for(var r="function"==typeof require&&require,o=0;o<a.length;o++)i(a[o]);return i}({1:[function(e,n){var t=e("../models/posting.js"),a=Thorax.Collection.extend({name:"Postings Collection",model:t,url:function(){return"/posts"+(this.id?"/"+this.id:"")},comparator:function(e){return-e.get("timeStamp")}});n.exports=a},{"../models/posting.js":3}],2:[function(e){var n=e("./collections/postings.js"),t=e("./views/form-view.js"),a=e("./views/posting-collection-view.js"),i=e("./models/topbar.js"),r=e("./views/topbar-view.js"),o=e("./views/about-view.js");$(function(){var e=Backbone.Router.extend({}),l=new e;Backbone.history.start();var s=new n;s.fetch();{var d=(new t({collection:s}),new a({collection:s})),c=new i;new r({model:c}),new o({model:new Thorax.Model})}l.route("circuit-ne","showNE",function(){$("#about").addClass("hidden"),$("#main").show(),d.collection.forEach(function(e){if("Circuit NE"===e.get("climbGym")){var n=e.cid;$("div[data-model-cid="+n+"]").show()}else{var n=e.cid;$("div[data-model-cid="+n+"]").hide()}})}),l.route("circuit-sw","showSW",function(){$("#about").addClass("hidden"),$("#main").show(),d.collection.forEach(function(e){if("Circuit SW"===e.get("climbGym")){var n=e.cid;$("div[data-model-cid="+n+"]").show()}else{var n=e.cid;$("div[data-model-cid="+n+"]").hide()}})}),l.route("prg","showPRG",function(){$("#about").addClass("hidden"),$("#main").show(),d.collection.forEach(function(e){if("Portland Rock Gym"===e.get("climbGym")){var n=e.cid;$("div[data-model-cid="+n+"]").show()}else{var n=e.cid;$("div[data-model-cid="+n+"]").hide()}})}),l.route("","showALL",function(){$("#about").addClass("hidden"),$("#main").show(),d.collection.forEach(function(e){var n=e.cid;$("div[data-model-cid="+n+"]").show()})}),l.route("about","showABOUT",function(){$("#about").removeClass("hidden"),$("#main").hide()});var u={};window.app=u,u.postings=s})},{"./collections/postings.js":1,"./models/topbar.js":4,"./views/about-view.js":5,"./views/form-view.js":6,"./views/posting-collection-view.js":7,"./views/topbar-view.js":9}],3:[function(e,n){var t=Thorax.Model.extend({name:"Posting Model",urlRoot:"/posts",initialize:function(){this.save()}});n.exports=t},{}],4:[function(e,n){var t=Thorax.Model.extend({url:"/user"});n.exports=t},{}],5:[function(e,n){var t=e("../../templates/about.handlebars"),a=Thorax.View.extend({template:t,el:"#about",initialize:function(){this.render()}});n.exports=a},{"../../templates/about.handlebars":10}],6:[function(e,n){var t=e("../../templates/form.handlebars"),a=Thorax.View.extend({template:t,name:"Form View",el:"#sidebar",events:{"click #posting-submit-button":"newPosting","keypress #climb-details":"createOnEnter"},initialize:function(){this.render()},postingIdMaker:function(){return Math.floor(1e9*Math.random())},createOnEnter:function(){},newPosting:function(){var e=this;$.getJSON("/user",function(n){var t={gym:$("#climb-gym").val(),eta:$("#climb-eta").val(),duration:$("#climb-duration").val(),details:$("#climb-details").val().trim()},a=e.postingIdMaker();"null"!=t.gym&&"null"!=t.eta&&"null"!=t.duration?(e.collection.create({postingId:a,title:"posting-"+a,timeStamp:Date.now(),userName:n.displayName,userImg:n.avatar,climbGym:t.gym,climbEta:t.eta,climbDuration:t.duration,climbDetails:t.details,replies:[],id:a}),$("#climb-gym").val(""),$("#climb-eta").val(""),$("#climb-duration").val(""),$("#climb-details").val(""),$("#wrapper").toggleClass("active")):e.$el.find(".text-danger").html("**VALIDATION FAIL**").fadeOut(0).fadeIn(250).fadeOut(1e3)})}});n.exports=a},{"../../templates/form.handlebars":11}],7:[function(e,n){var t=e("../../templates/posting.handlebars"),a=e("../../templates/loading.handlebars"),i=e("./posting-view"),r=(e("../models/posting.js"),Thorax.CollectionView.extend({itemTemplate:t,itemView:i,loadingTemplate:a,name:"Postings Collection View",el:"#main",initialize:function(){this.render()}}));n.exports=r},{"../../templates/loading.handlebars":12,"../../templates/posting.handlebars":13,"../models/posting.js":3,"./posting-view":8}],8:[function(e,n){var t=Thorax.View.extend({template:Handlebars.compile("{{collection}}"),name:"posting-view",context:function(){return this.model.attributes},initialize:function(){this.render(),this.listenTo(this.model,"change",this.render)},events:{"click .posting-reply-button":"addReply"},edit:function(){this.$el.addClass("orange")},removeOrange:function(){this.$el.removeClass("orange")},addReply:function(){var e=this,n=this.$el.find(".posting-reply").val();n?$.getJSON("/user",function(t){var a=_.clone(e.model.get("replies"));a.push({userName:t.displayName,userImg:t.avatar,message:n,time:(new Date).toDateString(),timeStamp:Date.now()}),e.model.save({replies:a}),e.$el.find(".posting-reply").val("")}):e.$el.find(".text-danger").html("**VALIDATION FAIL**").fadeOut(0).fadeIn(250).fadeOut(1e3)}});n.exports=t},{}],9:[function(e,n){var t=e("../../templates/topbar.handlebars"),a=Thorax.View.extend({template:t,el:"#top-bar",initialize:function(){this.render()}});n.exports=a},{"../../templates/topbar.handlebars":14}],10:[function(e,n){var t=e("handlebars/runtime").default.template;n.exports=t(function(e,n,t,a,i){return this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,e.helpers),i=i||{},'<div class="panel panel-default panel-posting panel-about">\n  <h2>About</h2>\n  <p>Sometimes it can be hard to find people to climb with. Sometimes you want to go climbing RIGHT NOW but everyone you know is busy. Heck, sometimes you just might not know anyone else who climbs! Climbing Buddy PDX helps climbers in the Portland Area find people to climb with on short notice. We currently feature three major climbing gyms in Portland. Simply select your gym of choice, when you will be climbing, for how long you will be climbing, and enter any other information you would like to provide. Talk to other climbers in the reply section of your post, or read through the whole list and find a buddy you would like to climb with!</p>\n  <p>Be smart, be safe, and happy climbing!</p>\n  <p>Climbing Buddy PDX is a Capstone Project built for the Portland Code School Full-Stack Javascript Winter/Spring 2014 session by Jhenna Voorhis and Christopher Peddecord with Austen Price and Dan Berezhinskiy</p>\n  <p>We used and deployed the following:</p>\n  <ul>\n    <li>Node.js - The best thing in life, ever.</li>\n    <li>Express - Node.js backend framework</li>\n    <li>Passport - Authentication for Node.js </li>\n    <li>Gulp - Stream-based Node.js Task Rnner</li>\n    <li>Thorax - An extension of Backbone.js</li>\n    <li>Sass - Syntactically Awesome Style Sheets</li>\n  </ul>\n  \n  <p>Our server is running on the beautiful cloud at Digital Ocean</p>\n  \n</div>'})},{"handlebars/runtime":21}],11:[function(e,n){var t=e("handlebars/runtime").default.template;n.exports=t(function(e,n,t,a,i){return this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,e.helpers),i=i||{},'<div class="sidebar-group">\r\n  <div class="row">\r\n    <div id ="top-bar"></div>\r\n  </div>\r\n  \r\n  <div class="row sidebar-guy">\r\n    <div class="dropdown">\r\n      <a href="#" class="dropdown-toggle" data-toggle="dropdown">Search by Gym <i class="fa fa-caret-down"></i></a>\r\n      <ul class="dropdown-menu">\r\n        <li><a href="#circuit-ne">The Circuit NE</a></li>\r\n        <li><a href="#circuit-sw">The Circuit SW</a></li>\r\n        <li><a href="#prg">Portland Rock Gym</a></li>\r\n        <li class="divider"></li>\r\n        <li><a href="#">Reset</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  \r\n  <div class="row sidebar-guy">\r\n    <select class="form-control form-inline" id="climb-gym" name="climb-gym">\r\n      <option value="null">I\'m climbing at:</option>\r\n      <option value="Circuit NE">The Circuit NE</option>\r\n      <option value="Circuit SW">The Circuit SW</option>\r\n      <option value="Portland Rock Gym">Portland Rock Gym</option>\r\n    </select>\r\n    <select class="form-control form-inline" id="climb-eta" name="climb-eta">\r\n      <option value="null">I\'m going in:</option>\r\n      <option value="0">Now!</option>\r\n      <option value="15">15 minutes</option>\r\n      <option value="30">30 minutes</option>\r\n      <option value="45">45 minutes</option>\r\n      <option value="60">1 hour</option>\r\n    </select>\r\n    <select class="form-control form-inline" id="climb-duration" name="climb-duration">\r\n      <option value="null">I\'m climbing for:</option>\r\n      <option value="30">30 minutes</option>\r\n      <option value="60">1 hour</option>\r\n      <option value="90">1.5 hours</option>\r\n      <option value="120">2 hours</option>\r\n    </select>\r\n    <textarea class="form-control" rows="3" type="text" id="climb-details" name="climb-details" placeholder="Leave some details here..."></textarea>\r\n    <br>\r\n    <div class="submit-line"><button class="btn btn-primary" id="posting-submit-button">Climb on!</button><button class="btn btn-link text-danger"></button></div>\r\n  </div>\r\n  \r\n\r\n  \r\n</div>\r\n'})},{"handlebars/runtime":21}],12:[function(e,n){var t=e("handlebars/runtime").default.template;n.exports=t(function(e,n,t,a,i){return this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,e.helpers),i=i||{},'<div class="panel panel-default panel-posting">  \n  <div class="panel-heading">\n    <p>Loading...</p>\n  </div>\n</div>'})},{"handlebars/runtime":21}],13:[function(e,n){var t=e("handlebars/runtime").default.template;n.exports=t(function(e,n,t,a,i){function r(e,n){var a,i="";return i+='\n  <div class="panel-body">\n    ',a=t.each.call(e,e&&e.replies,{hash:{},inverse:h.noop,fn:h.program(2,o,n),data:n}),(a||0===a)&&(i+=a),i+="\n  </div>\n  "}function o(e,n){var a,i,r="";return r+='\n    <div class="media panel-reply">\n      <div class="pull-left">\n        <img class="media-object" src="',(i=t.userImg)?a=i.call(e,{hash:{},data:n}):(i=e&&e.userImg,a=typeof i===u?i.call(e,{hash:{},data:n}):i),r+=p(a)+'">\n      </div>\n      <div class="media-body panel-small-text">\n        <div><a><strong class="media-heading">',(i=t.userName)?a=i.call(e,{hash:{},data:n}):(i=e&&e.userName,a=typeof i===u?i.call(e,{hash:{},data:n}):i),r+=p(a)+"</strong></a> ",(i=t.message)?a=i.call(e,{hash:{},data:n}):(i=e&&e.message,a=typeof i===u?i.call(e,{hash:{},data:n}):i),r+=p(a)+"</div>\n        <em><p>",(i=t.time)?a=i.call(e,{hash:{},data:n}):(i=e&&e.time,a=typeof i===u?i.call(e,{hash:{},data:n}):i),r+=p(a)+"</p></em>\n      </div>                    \n    </div>\n    "}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,e.helpers),i=i||{};var l,s,d,c="",u="function",p=this.escapeExpression,h=this,m=t.helperMissing;return c+=p((s=t.view||n&&n.view,d={hash:{},data:i},s?s.call(n,n&&n.collection,d):m.call(n,"view",n&&n.collection,d)))+'\n<div class="panel panel-default panel-posting fade-in">\n  \n  <div class="panel-heading">                  \n    <div class="row panel-small-text dropdown">\n      <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n        <img src="',(s=t.userImg)?l=s.call(n,{hash:{},data:i}):(s=n&&n.userImg,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+'" />      \n        <strong>',(s=t.userName)?l=s.call(n,{hash:{},data:i}):(s=n&&n.userName,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+"</strong>\n      </a>\n        <p>\n          <em>@ ",(s=t.climbGym)?l=s.call(n,{hash:{},data:i}):(s=n&&n.climbGym,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+"<br>in ",(s=t.climbEta)?l=s.call(n,{hash:{},data:i}):(s=n&&n.climbEta,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+" minutes for a ",(s=t.climbDuration)?l=s.call(n,{hash:{},data:i}):(s=n&&n.climbDuration,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+' minute session.</em> \n        </p>\n      \n      <div class="dropdown-menu">\n        <div class="dropdown-inner">\n          <strong>',(s=t.userName)?l=s.call(n,{hash:{},data:i}):(s=n&&n.userName,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+'</strong>\n          <p>More info eventually!</p>          \n        </div>        \n      </div>\n    </div>\n    <div class="row panel-message">\n      <p>',(s=t.climbDetails)?l=s.call(n,{hash:{},data:i}):(s=n&&n.climbDetails,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+"</p>\n    </div>\n  </div>\n\n  ",l=t["if"].call(n,n&&n.replies,{hash:{},inverse:h.noop,fn:h.program(1,r,i),data:i}),(l||0===l)&&(c+=l),c+='\n  \n  <div class="panel-footer">\n    <textarea class="form-control posting-reply" rows="1" type="text" name="posting-reply" placeholder="Maybe we should meet up..."></textarea>\n    <div class="submit-line"><button class="btn btn-default posting-reply-button" type="submit">Reply</button><button class="btn btn-link text-danger"></p></div>\n  </div>\n\n</div>\n\n<!--\n<div class="dropdown">\n      <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown Tester <i class="fa fa-caret-down"></i></a>\n      <div class="dropdown-menu">\n        <div class="dropdown-inner">\n          <strong>',(s=t.displayName)?l=s.call(n,{hash:{},data:i}):(s=n&&n.displayName,l=typeof s===u?s.call(n,{hash:{},data:i}):s),c+=p(l)+"</strong>\n          <p>"+p((l=n&&n.githubData,l=null==l||l===!1?l:l.login,typeof l===u?l.apply(n):l))+'</p>\n          <a href="/logout">Logout</a>\n        </div>        \n      </div>-->\n'})},{"handlebars/runtime":21}],14:[function(e,n){var t=e("handlebars/runtime").default.template;n.exports=t(function(e,n,t,a,i){this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,e.helpers),i=i||{};var r,o,l="",s="function",d=this.escapeExpression;return l+='<div class="sidebar-intro dropdown">\n  <div class="panel-small-text">\n    <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n      <img src="',(o=t.avatar)?r=o.call(n,{hash:{},data:i}):(o=n&&n.avatar,r=typeof o===s?o.call(n,{hash:{},data:i}):o),l+=d(r)+'">\n      ',(o=t.displayName)?r=o.call(n,{hash:{},data:i}):(o=n&&n.displayName,r=typeof o===s?o.call(n,{hash:{},data:i}):o),l+=d(r)+'      \n    </a>\n    <div class="dropdown-menu">\n      <div class="dropdown-inner">\n        <strong>',(o=t.displayName)?r=o.call(n,{hash:{},data:i}):(o=n&&n.displayName,r=typeof o===s?o.call(n,{hash:{},data:i}):o),l+=d(r)+"</strong>\n        <p>"+d((r=n&&n.githubData,r=null==r||r===!1?r:r.login,typeof r===s?r.apply(n):r))+'</p>\n<!--        <a href="/logout">Logout</a>-->\n      </div>        \n    </div>\n  </div>\n</div>'})},{"handlebars/runtime":21}],15:[function(e,n,t){"use strict";var a=e("./handlebars/base"),i=e("./handlebars/safe-string")["default"],r=e("./handlebars/exception")["default"],o=e("./handlebars/utils"),l=e("./handlebars/runtime"),s=function(){var e=new a.HandlebarsEnvironment;return o.extend(e,a),e.SafeString=i,e.Exception=r,e.Utils=o,e.VM=l,e.template=function(n){return l.template(n,e)},e},d=s();d.create=s,t["default"]=d},{"./handlebars/base":16,"./handlebars/exception":17,"./handlebars/runtime":18,"./handlebars/safe-string":19,"./handlebars/utils":20}],16:[function(e,n,t){"use strict";function a(e,n){this.helpers=e||{},this.partials=n||{},i(this)}function i(e){e.registerHelper("helperMissing",function(e){if(2===arguments.length)return void 0;throw new l("Missing helper: '"+e+"'")}),e.registerHelper("blockHelperMissing",function(n,t){var a=t.inverse||function(){},i=t.fn;return p(n)&&(n=n.call(this)),n===!0?i(this):n===!1||null==n?a(this):u(n)?n.length>0?e.helpers.each(n,t):a(this):i(n)}),e.registerHelper("each",function(e,n){var t,a=n.fn,i=n.inverse,r=0,o="";if(p(e)&&(e=e.call(this)),n.data&&(t=v(n.data)),e&&"object"==typeof e)if(u(e))for(var l=e.length;l>r;r++)t&&(t.index=r,t.first=0===r,t.last=r===e.length-1),o+=a(e[r],{data:t});else for(var s in e)e.hasOwnProperty(s)&&(t&&(t.key=s,t.index=r,t.first=0===r),o+=a(e[s],{data:t}),r++);return 0===r&&(o=i(this)),o}),e.registerHelper("if",function(e,n){return p(e)&&(e=e.call(this)),!n.hash.includeZero&&!e||o.isEmpty(e)?n.inverse(this):n.fn(this)}),e.registerHelper("unless",function(n,t){return e.helpers["if"].call(this,n,{fn:t.inverse,inverse:t.fn,hash:t.hash})}),e.registerHelper("with",function(e,n){return p(e)&&(e=e.call(this)),o.isEmpty(e)?void 0:n.fn(e)}),e.registerHelper("log",function(n,t){var a=t.data&&null!=t.data.level?parseInt(t.data.level,10):1;e.log(a,n)})}function r(e,n){f.log(e,n)}var o=e("./utils"),l=e("./exception")["default"],s="1.3.0";t.VERSION=s;var d=4;t.COMPILER_REVISION=d;var c={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:">= 1.0.0"};t.REVISION_CHANGES=c;var u=o.isArray,p=o.isFunction,h=o.toString,m="[object Object]";t.HandlebarsEnvironment=a,a.prototype={constructor:a,logger:f,log:r,registerHelper:function(e,n,t){if(h.call(e)===m){if(t||n)throw new l("Arg not supported with multiple helpers");o.extend(this.helpers,e)}else t&&(n.not=t),this.helpers[e]=n},registerPartial:function(e,n){h.call(e)===m?o.extend(this.partials,e):this.partials[e]=n}};var f={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(e,n){if(f.level<=e){var t=f.methodMap[e];"undefined"!=typeof console&&console[t]&&console[t].call(console,n)}}};t.logger=f,t.log=r;var v=function(e){var n={};return o.extend(n,e),n};t.createFrame=v},{"./exception":17,"./utils":20}],17:[function(e,n,t){"use strict";function a(e,n){var t;n&&n.firstLine&&(t=n.firstLine,e+=" - "+t+":"+n.firstColumn);for(var a=Error.prototype.constructor.call(this,e),r=0;r<i.length;r++)this[i[r]]=a[i[r]];t&&(this.lineNumber=t,this.column=n.firstColumn)}var i=["description","fileName","lineNumber","message","name","number","stack"];a.prototype=new Error,t["default"]=a},{}],18:[function(e,n,t){"use strict";function a(e){var n=e&&e[0]||1,t=u;if(n!==t){if(t>n){var a=p[t],i=p[n];throw new c("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+a+") or downgrade your runtime to an older version ("+i+").")}throw new c("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+e[1]+").")}}function i(e,n){if(!n)throw new c("No environment passed to template");var t=function(e,t,a,i,r,o){var l=n.VM.invokePartial.apply(this,arguments);if(null!=l)return l;if(n.compile){var s={helpers:i,partials:r,data:o};return r[t]=n.compile(e,{data:void 0!==o},n),r[t](a,s)}throw new c("The partial "+t+" could not be compiled when running in runtime-only mode")},a={escapeExpression:d.escapeExpression,invokePartial:t,programs:[],program:function(e,n,t){var a=this.programs[e];return t?a=o(e,n,t):a||(a=this.programs[e]=o(e,n)),a},merge:function(e,n){var t=e||n;return e&&n&&e!==n&&(t={},d.extend(t,n),d.extend(t,e)),t},programWithDepth:n.VM.programWithDepth,noop:n.VM.noop,compilerInfo:null};return function(t,i){i=i||{};var r,o,l=i.partial?i:n;i.partial||(r=i.helpers,o=i.partials);var s=e.call(a,l,t,r,o,i.data);return i.partial||n.VM.checkRevision(a.compilerInfo),s}}function r(e,n,t){var a=Array.prototype.slice.call(arguments,3),i=function(e,i){return i=i||{},n.apply(this,[e,i.data||t].concat(a))};return i.program=e,i.depth=a.length,i}function o(e,n,t){var a=function(e,a){return a=a||{},n(e,a.data||t)};return a.program=e,a.depth=0,a}function l(e,n,t,a,i,r){var o={partial:!0,helpers:a,partials:i,data:r};if(void 0===e)throw new c("The partial "+n+" could not be found");return e instanceof Function?e(t,o):void 0}function s(){return""}var d=e("./utils"),c=e("./exception")["default"],u=e("./base").COMPILER_REVISION,p=e("./base").REVISION_CHANGES;t.checkRevision=a,t.template=i,t.programWithDepth=r,t.program=o,t.invokePartial=l,t.noop=s},{"./base":16,"./exception":17,"./utils":20}],19:[function(e,n,t){"use strict";function a(e){this.string=e}a.prototype.toString=function(){return""+this.string},t["default"]=a},{}],20:[function(e,n,t){"use strict";function a(e){return s[e]||"&amp;"}function i(e,n){for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}function r(e){return e instanceof l?e.toString():e||0===e?(e=""+e,c.test(e)?e.replace(d,a):e):""}function o(e){return e||0===e?h(e)&&0===e.length?!0:!1:!0}var l=e("./safe-string")["default"],s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},d=/[&<>"'`]/g,c=/[&<>"'`]/;t.extend=i;var u=Object.prototype.toString;t.toString=u;var p=function(e){return"function"==typeof e};p(/x/)&&(p=function(e){return"function"==typeof e&&"[object Function]"===u.call(e)});var p;t.isFunction=p;var h=Array.isArray||function(e){return e&&"object"==typeof e?"[object Array]"===u.call(e):!1};t.isArray=h,t.escapeExpression=r,t.isEmpty=o},{"./safe-string":19}],21:[function(e,n){n.exports=e("./dist/cjs/handlebars.runtime")},{"./dist/cjs/handlebars.runtime":15}]},{},[2]);