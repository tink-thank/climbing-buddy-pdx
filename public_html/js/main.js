(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  name:'Postings Collection',
  model: Posting,
  url: function () {
    return '/posts' + ( (this.id) ? '/' + this.id : '' );
  },
  comparator: function(model){
        return -model.get("timeStamp");
    }
});

module.exports = Postings
},{"../models/posting.js":3}],2:[function(require,module,exports){
var Postings = require('./collections/postings.js');

var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');

$.getJSON('/user', function (data) {
  
  var user = {}
  window.user = user;
  user.data = data;
  
});

var TopBar = require('./models/topbar.js')
var TopBarView = require('./views/topbar-view.js');

$(function () {   

  var ClimbingRouter = Backbone.Router.extend({});
  var myClimbingRouter = new ClimbingRouter;

  Backbone.history.start();  
  
  var postings = new Postings();
  postings.fetch();

  var topBar = new TopBar()
  var topBarView = new TopBarView({model: topBar});

  var formView = new FormView({collection:postings});
  var appView = new PostColView({collection:postings});

  var app = {}
  window.app = app;    
  app.postings = postings;


})
},{"./collections/postings.js":1,"./models/topbar.js":5,"./views/form-view.js":6,"./views/posting-collection-view.js":7,"./views/topbar-view.js":9}],3:[function(require,module,exports){
var Posting = Thorax.Model.extend({
  name:'Posting Model',
  
  urlRoot: '/posts',
  
  initialize: function () {
    this.save();
        
    if(this.get('userName') === user.data.displayName) {
      this.save({userAuth: true});
    }

  }

});

module.exports = Posting;
},{}],4:[function(require,module,exports){
var Reply = Thorax.Model.extend({
  urlRoot: '/user',
//  defaults: {
//    userName: 'Testing UserName, Please Ignore',
//    userImg: 'http://www.placekitten.com/75/75'
//  }
  defaults: {
    displayName: 'Test User',
    avatar: 'http://lorempixel.com/75/75',
    message: 'hello world'
  }
});

module.exports = Reply; 
},{}],5:[function(require,module,exports){
var TopBar = Thorax.Model.extend({
  url: '/user'
});

module.exports = TopBar; 
},{}],6:[function(require,module,exports){
var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  
  events: {
    'click #posting-submit-button': 'newPosting',
    'keypress #climb-details': 'createOnEnter'
  },

  initialize: function () {
    this.render();
  },
  
  postingIdMaker: function () {
    return Math.floor( Math.random() * 1000000000 );
  },
  
  createOnEnter: function () {
    
  },

  newPosting: function () {
    var self = this;   
    
    $.getJSON('/user', function (data) {
      var clmb = {
        gym: $('#climb-gym').val(),
        eta: $('#climb-eta').val(),
        duration: $('#climb-duration').val(),
        details: $('#climb-details').val().trim(),
      };

      var postingId = self.postingIdMaker();
       

      self.collection.create({
        postingId: postingId,
        title: 'posting-' + postingId,
        timeStamp: Date.now(),
        userName: data.displayName,
        userImg: data.avatar,
        climbGym: clmb.gym,
        climbEta: clmb.eta,
        climbDuration: clmb.duration,
        climbDetails: clmb.details,
        replies: [],
        id: postingId,
      });

        $('#climb-gym').val('');
        $('#climb-eta').val('');
        $('#climb-duration').val('');
        $('#climb-details').val('');
        $('.row-offcanvas').toggleClass('active');
    });
  },
});

module.exports = FormView;
},{"../../templates/form.handlebars":10}],7:[function(require,module,exports){
var postingsViewTemplate = require('../../templates/posting.handlebars');
var PostingView = require('./posting-view');
var Posting = require('../models/posting.js');

var PostingCollectionView = Thorax.CollectionView.extend({
  itemTemplate: postingsViewTemplate,
  itemView: PostingView,
  name: 'Postings Collection View',
  el: '#main',
  
  initialize: function () {
    this.render();
  },
  
  
});

module.exports = PostingCollectionView;
},{"../../templates/posting.handlebars":11,"../models/posting.js":3,"./posting-view":8}],8:[function(require,module,exports){
var Reply = require('../models/reply.js');

var PostingView = Thorax.View.extend({
  template: Handlebars.compile('{{collection}}') ,
  name: 'posting-view',
  
  context: function (model, i) {
    return this.model.attributes;
  },
  
  initialize: function () {
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  
  events: {
//    'keydown .posting-reply':'addReplyEnter',
    'click .posting-reply-button': 'addReply',
    'click .posting-reply': 'edit',
    'blur .posting-reply':'removeOrange',
    'click .btn-danger':'removeModelYo'
  },
  
  checkUser: function () {
    
  },
  
  removeModelYo: function () {
    this.model.destroy();
  },
  
  edit: function () {
    this.$el.addClass('orange');
  },
  
  removeOrange: function () {
    this.$el.removeClass('orange');
  },

  addReply: function () {
    
    var self = this;
    
    $.getJSON('/user', function (data) {
      self.$el.addClass('orange');
    
      var replyArray = _.clone(self.model.get('replies'));

      replyArray.push({
        userName: data.displayName,
        userImg: data.avatar,
        message: $(".orange").find(".posting-reply").val(),
        time: new Date().toDateString(),
        timeStamp: Date.now()
      });

      self.model.save({ replies: replyArray });

      self.$el.find('.posting-reply').val('');
      self.$el.removeClass('orange');
      
    });
  },
  
//  addReplyEnter: function (e) {
//			if (e.which === ENTER_KEY) {
//				this.addReply(); 
//			}    
//  }
  
  
});

module.exports = PostingView;
},{"../models/reply.js":4}],9:[function(require,module,exports){
var topBarTemplate = require('../../templates/topbar.handlebars');

var TopBarView = Thorax.View.extend({
  template: topBarTemplate,
  el: '#top-bar',
  initialize: function () {
    this.render();
  }
});

module.exports = TopBarView;
},{"../../templates/topbar.handlebars":12}],10:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<aside class=\"panel-default\">\r\n  <select class=\"form-control form-inline\" id=\"climb-gym\" name=\"climb-gym\">\r\n    <option value=\"null\">I'm Climbing at:</option>\r\n    <option value=\"Circuit NE\">The Circuit NE</option>\r\n    <option value=\"Circuit SW\">The Circuit SW</option>\r\n    <option value=\"Portland Rock Gym\">Portland Rock Gym</option>\r\n  </select>\r\n  <select class=\"form-control form-inline\" id=\"climb-eta\" name=\"climb-eta\">\r\n    <option value=\"null\">I'm going in:</option>\r\n    <option value=\"0\">Now!</option>\r\n    <option value=\"15\">15 minutes</option>\r\n    <option value=\"30\">30 minutes</option>\r\n    <option value=\"45\">45 minutes</option>\r\n    <option value=\"60\">1 hour</option>\r\n  </select>\r\n  <select class=\"form-control form-inline\" id=\"climb-duration\" name=\"climb-duration\">\r\n    <option value=\"null\">I'm climbing for:</option>\r\n    <option value=\"30\">30 minutes</option>\r\n    <option value=\"60\">1 hour</option>\r\n    <option value=\"90\">1.5 hours</option>\r\n    <option value=\"120\">2 hours</option>\r\n  </select>\r\n  More Info for fun:\r\n  <textarea class=\"form-control\" rows=\"3\" type=\"text\" id=\"climb-details\" name=\"climb-details\" placeholder=\"Meet me over by the...\"></textarea>\r\n\r\n  <button class=\"btn btn-danger\" id=\"posting-submit-button\">Go Climbing!</button>\r\n</aside>";
  });
},{"handlebars/runtime":19}],11:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <br/>\n        <p>";
  if (helper = helpers.climbDetails) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbDetails); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"panel-body\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.replies), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"list-group\">\n      <div href=\"#\" class=\"list-group-item\">\n        <!--            <div class=\"col-xs-2\"><img class=\"img-responsive\"  src=\""
    + escapeExpression(((stack1 = (depth0 && depth0.userImg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" /></div>-->\n        <p class=\"list-group-item-text\">\n          <strong>"
    + escapeExpression(((stack1 = (depth0 && depth0.userName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> - "
    + escapeExpression(((stack1 = (depth0 && depth0.message)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          <br>\n          <small>"
    + escapeExpression(((stack1 = (depth0 && depth0.time)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n        </p>\n      </div>\n    </div>\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\n      <button class=\"btn btn-danger\" type=\"submit\">Delete</button>\n    ";
  }

  buffer += escapeExpression((helper = helpers.view || (depth0 && depth0.view),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.collection), options) : helperMissing.call(depth0, "view", (depth0 && depth0.collection), options)))
    + "\n<div class=\"panel panel-default panel-posting\">\n  <div class=\"panel-heading\">\n    <div class=\"row\">\n      <div class=\"col-xs-2\">\n        <img src=\"";
  if (helper = helpers.userImg) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userImg); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n      </div>\n      <div class=\"col-xs-10 panel-emphasis\">\n        <strong>";
  if (helper = helpers.userName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong>\n        <em>@ ";
  if (helper = helpers.climbGym) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbGym); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " in ";
  if (helper = helpers.climbEta) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbEta); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " for ";
  if (helper = helpers.climbDuration) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbDuration); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " minutes</em>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.climbDetails), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    </div>\n  </div>\n  \n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.replies), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  \n  <div class=\"panel-footer\">\n    <textarea class=\"form-control posting-reply\" rows=\"1\" type=\"text\" name=\"posting-reply\" placeholder=\"Maybe we should meet up...\"></textarea>\n    <button class=\"btn btn-default posting-reply-button\" type=\"submit\">Reply</button>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.userAuth), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>";
  return buffer;
  });
},{"handlebars/runtime":19}],12:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"navbar navbar-fixed-top navbar-inverse topbar\" role=\"navigation\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">Climbing Buddy PDX</a>\n          \n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n        <i class=\"fa fa-bars\"></i>\n      </button>\n      \n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"offcanvas\">\n        <i class=\"fa fa-plus\"></i>\n      </button>\n    \n    </div>\n    \n    \n    \n    <div class=\"collapse navbar-collapse no-list\">\n      <li class=\"navbar-text navbar-right dropdown\">\n        Hi, ";
  if (helper = helpers.displayName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.displayName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "!\n        <img class=\"hidden-xs\" src=\"";
  if (helper = helpers.avatar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n        <a class=\"hidden-xs dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n          <i class=\"fa fa-caret-down fa-lg\"></i>\n        </a>\n        <a class=\"visible-xs\" href=\"/logout\">Logout</a>\n      <ul class=\"dropdown-menu\">        \n          <li><a href=\"/logout\">Logout</a></li>                  \n      </ul>\n\n      </li>\n    \n<!--\n    <li class=\"dropdown\">\n      <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Dropdown <b class=\"caret\"></b></a>\n      <ul class=\"dropdown-menu\">\n        <li><a href=\"#\">Action</a></li>\n      </ul>\n    </li>\n-->\n    </div>\n  \n    \n    <div class=\"collapse\">\n      \n    </div>\n    \n  </div>\n</div>\n";
  return buffer;
  });
},{"handlebars/runtime":19}],13:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":14,"./handlebars/exception":15,"./handlebars/runtime":16,"./handlebars/safe-string":17,"./handlebars/utils":18}],14:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":15,"./utils":18}],15:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],16:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":14,"./exception":15,"./utils":18}],17:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],18:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":17}],19:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":13}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL2NvbGxlY3Rpb25zL3Bvc3RpbmdzLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvZmFrZV9hYzU1ZDQ1Zi5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL21vZGVscy9wb3N0aW5nLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvbW9kZWxzL3JlcGx5LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvbW9kZWxzL3RvcGJhci5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL3ZpZXdzL2Zvcm0tdmlldy5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL3ZpZXdzL3Bvc3RpbmctY29sbGVjdGlvbi12aWV3LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvdmlld3MvcG9zdGluZy12aWV3LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvdmlld3MvdG9wYmFyLXZpZXcuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L2FwcC90ZW1wbGF0ZXMvZm9ybS5oYW5kbGViYXJzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvdGVtcGxhdGVzL3Bvc3RpbmcuaGFuZGxlYmFycyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL3RlbXBsYXRlcy90b3BiYXIuaGFuZGxlYmFycyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvZXhjZXB0aW9uLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQb3N0aW5nID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Bvc3RpbmcuanMnKTtcblxudmFyIFBvc3RpbmdzID0gVGhvcmF4LkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbmFtZTonUG9zdGluZ3MgQ29sbGVjdGlvbicsXG4gIG1vZGVsOiBQb3N0aW5nLFxuICB1cmw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJy9wb3N0cycgKyAoICh0aGlzLmlkKSA/ICcvJyArIHRoaXMuaWQgOiAnJyApO1xuICB9LFxuICBjb21wYXJhdG9yOiBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgIHJldHVybiAtbW9kZWwuZ2V0KFwidGltZVN0YW1wXCIpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RpbmdzIiwidmFyIFBvc3RpbmdzID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9ucy9wb3N0aW5ncy5qcycpO1xuXG52YXIgRm9ybVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2Zvcm0tdmlldy5qcycpO1xudmFyIFBvc3RDb2xWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9wb3N0aW5nLWNvbGxlY3Rpb24tdmlldy5qcycpO1xuXG4kLmdldEpTT04oJy91c2VyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgXG4gIHZhciB1c2VyID0ge31cbiAgd2luZG93LnVzZXIgPSB1c2VyO1xuICB1c2VyLmRhdGEgPSBkYXRhO1xuICBcbn0pO1xuXG52YXIgVG9wQmFyID0gcmVxdWlyZSgnLi9tb2RlbHMvdG9wYmFyLmpzJylcbnZhciBUb3BCYXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy90b3BiYXItdmlldy5qcycpO1xuXG4kKGZ1bmN0aW9uICgpIHsgICBcblxuICB2YXIgQ2xpbWJpbmdSb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHt9KTtcbiAgdmFyIG15Q2xpbWJpbmdSb3V0ZXIgPSBuZXcgQ2xpbWJpbmdSb3V0ZXI7XG5cbiAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpOyAgXG4gIFxuICB2YXIgcG9zdGluZ3MgPSBuZXcgUG9zdGluZ3MoKTtcbiAgcG9zdGluZ3MuZmV0Y2goKTtcblxuICB2YXIgdG9wQmFyID0gbmV3IFRvcEJhcigpXG4gIHZhciB0b3BCYXJWaWV3ID0gbmV3IFRvcEJhclZpZXcoe21vZGVsOiB0b3BCYXJ9KTtcblxuICB2YXIgZm9ybVZpZXcgPSBuZXcgRm9ybVZpZXcoe2NvbGxlY3Rpb246cG9zdGluZ3N9KTtcbiAgdmFyIGFwcFZpZXcgPSBuZXcgUG9zdENvbFZpZXcoe2NvbGxlY3Rpb246cG9zdGluZ3N9KTtcblxuICB2YXIgYXBwID0ge31cbiAgd2luZG93LmFwcCA9IGFwcDsgICAgXG4gIGFwcC5wb3N0aW5ncyA9IHBvc3RpbmdzO1xuXG5cbn0pIiwidmFyIFBvc3RpbmcgPSBUaG9yYXguTW9kZWwuZXh0ZW5kKHtcbiAgbmFtZTonUG9zdGluZyBNb2RlbCcsXG4gIFxuICB1cmxSb290OiAnL3Bvc3RzJyxcbiAgXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgXG4gICAgaWYodGhpcy5nZXQoJ3VzZXJOYW1lJykgPT09IHVzZXIuZGF0YS5kaXNwbGF5TmFtZSkge1xuICAgICAgdGhpcy5zYXZlKHt1c2VyQXV0aDogdHJ1ZX0pO1xuICAgIH1cblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3Rpbmc7IiwidmFyIFJlcGx5ID0gVGhvcmF4Lk1vZGVsLmV4dGVuZCh7XG4gIHVybFJvb3Q6ICcvdXNlcicsXG4vLyAgZGVmYXVsdHM6IHtcbi8vICAgIHVzZXJOYW1lOiAnVGVzdGluZyBVc2VyTmFtZSwgUGxlYXNlIElnbm9yZScsXG4vLyAgICB1c2VySW1nOiAnaHR0cDovL3d3dy5wbGFjZWtpdHRlbi5jb20vNzUvNzUnXG4vLyAgfVxuICBkZWZhdWx0czoge1xuICAgIGRpc3BsYXlOYW1lOiAnVGVzdCBVc2VyJyxcbiAgICBhdmF0YXI6ICdodHRwOi8vbG9yZW1waXhlbC5jb20vNzUvNzUnLFxuICAgIG1lc3NhZ2U6ICdoZWxsbyB3b3JsZCdcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVwbHk7ICIsInZhciBUb3BCYXIgPSBUaG9yYXguTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiAnL3VzZXInXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb3BCYXI7ICIsInZhciBmb3JtVmlld1RlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vdGVtcGxhdGVzL2Zvcm0uaGFuZGxlYmFycycpO1xuXG52YXIgRm9ybVZpZXcgPSBUaG9yYXguVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogZm9ybVZpZXdUZW1wbGF0ZSxcbiAgbmFtZTogJ0Zvcm0gVmlldycsXG4gIGVsOiAnI3NpZGViYXInLFxuICBcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrICNwb3N0aW5nLXN1Ym1pdC1idXR0b24nOiAnbmV3UG9zdGluZycsXG4gICAgJ2tleXByZXNzICNjbGltYi1kZXRhaWxzJzogJ2NyZWF0ZU9uRW50ZXInXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG4gIFxuICBwb3N0aW5nSWRNYWtlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwMCApO1xuICB9LFxuICBcbiAgY3JlYXRlT25FbnRlcjogZnVuY3Rpb24gKCkge1xuICAgIFxuICB9LFxuXG4gIG5ld1Bvc3Rpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7ICAgXG4gICAgXG4gICAgJC5nZXRKU09OKCcvdXNlcicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgY2xtYiA9IHtcbiAgICAgICAgZ3ltOiAkKCcjY2xpbWItZ3ltJykudmFsKCksXG4gICAgICAgIGV0YTogJCgnI2NsaW1iLWV0YScpLnZhbCgpLFxuICAgICAgICBkdXJhdGlvbjogJCgnI2NsaW1iLWR1cmF0aW9uJykudmFsKCksXG4gICAgICAgIGRldGFpbHM6ICQoJyNjbGltYi1kZXRhaWxzJykudmFsKCkudHJpbSgpLFxuICAgICAgfTtcblxuICAgICAgdmFyIHBvc3RpbmdJZCA9IHNlbGYucG9zdGluZ0lkTWFrZXIoKTtcbiAgICAgICBcblxuICAgICAgc2VsZi5jb2xsZWN0aW9uLmNyZWF0ZSh7XG4gICAgICAgIHBvc3RpbmdJZDogcG9zdGluZ0lkLFxuICAgICAgICB0aXRsZTogJ3Bvc3RpbmctJyArIHBvc3RpbmdJZCxcbiAgICAgICAgdGltZVN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICB1c2VyTmFtZTogZGF0YS5kaXNwbGF5TmFtZSxcbiAgICAgICAgdXNlckltZzogZGF0YS5hdmF0YXIsXG4gICAgICAgIGNsaW1iR3ltOiBjbG1iLmd5bSxcbiAgICAgICAgY2xpbWJFdGE6IGNsbWIuZXRhLFxuICAgICAgICBjbGltYkR1cmF0aW9uOiBjbG1iLmR1cmF0aW9uLFxuICAgICAgICBjbGltYkRldGFpbHM6IGNsbWIuZGV0YWlscyxcbiAgICAgICAgcmVwbGllczogW10sXG4gICAgICAgIGlkOiBwb3N0aW5nSWQsXG4gICAgICB9KTtcblxuICAgICAgICAkKCcjY2xpbWItZ3ltJykudmFsKCcnKTtcbiAgICAgICAgJCgnI2NsaW1iLWV0YScpLnZhbCgnJyk7XG4gICAgICAgICQoJyNjbGltYi1kdXJhdGlvbicpLnZhbCgnJyk7XG4gICAgICAgICQoJyNjbGltYi1kZXRhaWxzJykudmFsKCcnKTtcbiAgICAgICAgJCgnLnJvdy1vZmZjYW52YXMnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtVmlldzsiLCJ2YXIgcG9zdGluZ3NWaWV3VGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvcG9zdGluZy5oYW5kbGViYXJzJyk7XG52YXIgUG9zdGluZ1ZpZXcgPSByZXF1aXJlKCcuL3Bvc3RpbmctdmlldycpO1xudmFyIFBvc3RpbmcgPSByZXF1aXJlKCcuLi9tb2RlbHMvcG9zdGluZy5qcycpO1xuXG52YXIgUG9zdGluZ0NvbGxlY3Rpb25WaWV3ID0gVGhvcmF4LkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gIGl0ZW1UZW1wbGF0ZTogcG9zdGluZ3NWaWV3VGVtcGxhdGUsXG4gIGl0ZW1WaWV3OiBQb3N0aW5nVmlldyxcbiAgbmFtZTogJ1Bvc3RpbmdzIENvbGxlY3Rpb24gVmlldycsXG4gIGVsOiAnI21haW4nLFxuICBcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG4gIFxuICBcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RpbmdDb2xsZWN0aW9uVmlldzsiLCJ2YXIgUmVwbHkgPSByZXF1aXJlKCcuLi9tb2RlbHMvcmVwbHkuanMnKTtcblxudmFyIFBvc3RpbmdWaWV3ID0gVGhvcmF4LlZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IEhhbmRsZWJhcnMuY29tcGlsZSgne3tjb2xsZWN0aW9ufX0nKSAsXG4gIG5hbWU6ICdwb3N0aW5nLXZpZXcnLFxuICBcbiAgY29udGV4dDogZnVuY3Rpb24gKG1vZGVsLCBpKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuYXR0cmlidXRlcztcbiAgfSxcbiAgXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcbiAgfSxcbiAgXG4gIGV2ZW50czoge1xuLy8gICAgJ2tleWRvd24gLnBvc3RpbmctcmVwbHknOidhZGRSZXBseUVudGVyJyxcbiAgICAnY2xpY2sgLnBvc3RpbmctcmVwbHktYnV0dG9uJzogJ2FkZFJlcGx5JyxcbiAgICAnY2xpY2sgLnBvc3RpbmctcmVwbHknOiAnZWRpdCcsXG4gICAgJ2JsdXIgLnBvc3RpbmctcmVwbHknOidyZW1vdmVPcmFuZ2UnLFxuICAgICdjbGljayAuYnRuLWRhbmdlcic6J3JlbW92ZU1vZGVsWW8nXG4gIH0sXG4gIFxuICBjaGVja1VzZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgfSxcbiAgXG4gIHJlbW92ZU1vZGVsWW86IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgfSxcbiAgXG4gIGVkaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbC5hZGRDbGFzcygnb3JhbmdlJyk7XG4gIH0sXG4gIFxuICByZW1vdmVPcmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnb3JhbmdlJyk7XG4gIH0sXG5cbiAgYWRkUmVwbHk6IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgJC5nZXRKU09OKCcvdXNlcicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzZWxmLiRlbC5hZGRDbGFzcygnb3JhbmdlJyk7XG4gICAgXG4gICAgICB2YXIgcmVwbHlBcnJheSA9IF8uY2xvbmUoc2VsZi5tb2RlbC5nZXQoJ3JlcGxpZXMnKSk7XG5cbiAgICAgIHJlcGx5QXJyYXkucHVzaCh7XG4gICAgICAgIHVzZXJOYW1lOiBkYXRhLmRpc3BsYXlOYW1lLFxuICAgICAgICB1c2VySW1nOiBkYXRhLmF2YXRhcixcbiAgICAgICAgbWVzc2FnZTogJChcIi5vcmFuZ2VcIikuZmluZChcIi5wb3N0aW5nLXJlcGx5XCIpLnZhbCgpLFxuICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpLFxuICAgICAgICB0aW1lU3RhbXA6IERhdGUubm93KClcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLm1vZGVsLnNhdmUoeyByZXBsaWVzOiByZXBseUFycmF5IH0pO1xuXG4gICAgICBzZWxmLiRlbC5maW5kKCcucG9zdGluZy1yZXBseScpLnZhbCgnJyk7XG4gICAgICBzZWxmLiRlbC5yZW1vdmVDbGFzcygnb3JhbmdlJyk7XG4gICAgICBcbiAgICB9KTtcbiAgfSxcbiAgXG4vLyAgYWRkUmVwbHlFbnRlcjogZnVuY3Rpb24gKGUpIHtcbi8vXHRcdFx0aWYgKGUud2hpY2ggPT09IEVOVEVSX0tFWSkge1xuLy9cdFx0XHRcdHRoaXMuYWRkUmVwbHkoKTsgXG4vL1x0XHRcdH0gICAgXG4vLyAgfVxuICBcbiAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3N0aW5nVmlldzsiLCJ2YXIgdG9wQmFyVGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvdG9wYmFyLmhhbmRsZWJhcnMnKTtcblxudmFyIFRvcEJhclZpZXcgPSBUaG9yYXguVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdG9wQmFyVGVtcGxhdGUsXG4gIGVsOiAnI3RvcC1iYXInLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVG9wQmFyVmlldzsiLCJ2YXIgdGVtcGxhdGVyID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKS5kZWZhdWx0LnRlbXBsYXRlO21vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVyKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxhc2lkZSBjbGFzcz1cXFwicGFuZWwtZGVmYXVsdFxcXCI+XFxyXFxuICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2wgZm9ybS1pbmxpbmVcXFwiIGlkPVxcXCJjbGltYi1neW1cXFwiIG5hbWU9XFxcImNsaW1iLWd5bVxcXCI+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIm51bGxcXFwiPkknbSBDbGltYmluZyBhdDo8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiQ2lyY3VpdCBORVxcXCI+VGhlIENpcmN1aXQgTkU8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiQ2lyY3VpdCBTV1xcXCI+VGhlIENpcmN1aXQgU1c8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiUG9ydGxhbmQgUm9jayBHeW1cXFwiPlBvcnRsYW5kIFJvY2sgR3ltPC9vcHRpb24+XFxyXFxuICA8L3NlbGVjdD5cXHJcXG4gIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbCBmb3JtLWlubGluZVxcXCIgaWQ9XFxcImNsaW1iLWV0YVxcXCIgbmFtZT1cXFwiY2xpbWItZXRhXFxcIj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwibnVsbFxcXCI+SSdtIGdvaW5nIGluOjwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCIwXFxcIj5Ob3chPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjE1XFxcIj4xNSBtaW51dGVzPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjMwXFxcIj4zMCBtaW51dGVzPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjQ1XFxcIj40NSBtaW51dGVzPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjYwXFxcIj4xIGhvdXI8L29wdGlvbj5cXHJcXG4gIDwvc2VsZWN0PlxcclxcbiAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sIGZvcm0taW5saW5lXFxcIiBpZD1cXFwiY2xpbWItZHVyYXRpb25cXFwiIG5hbWU9XFxcImNsaW1iLWR1cmF0aW9uXFxcIj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwibnVsbFxcXCI+SSdtIGNsaW1iaW5nIGZvcjo8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiMzBcXFwiPjMwIG1pbnV0ZXM8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiNjBcXFwiPjEgaG91cjwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCI5MFxcXCI+MS41IGhvdXJzPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjEyMFxcXCI+MiBob3Vyczwvb3B0aW9uPlxcclxcbiAgPC9zZWxlY3Q+XFxyXFxuICBNb3JlIEluZm8gZm9yIGZ1bjpcXHJcXG4gIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiByb3dzPVxcXCIzXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwiY2xpbWItZGV0YWlsc1xcXCIgbmFtZT1cXFwiY2xpbWItZGV0YWlsc1xcXCIgcGxhY2Vob2xkZXI9XFxcIk1lZXQgbWUgb3ZlciBieSB0aGUuLi5cXFwiPjwvdGV4dGFyZWE+XFxyXFxuXFxyXFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlclxcXCIgaWQ9XFxcInBvc3Rpbmctc3VibWl0LWJ1dHRvblxcXCI+R28gQ2xpbWJpbmchPC9idXR0b24+XFxyXFxuPC9hc2lkZT5cIjtcbiAgfSk7IiwidmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIikuZGVmYXVsdC50ZW1wbGF0ZTttb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcihmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICA8YnIvPlxcbiAgICAgICAgPHA+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNsaW1iRGV0YWlscykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jbGltYkRldGFpbHMpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9wPlxcbiAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuZnVuY3Rpb24gcHJvZ3JhbTMoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazE7XG4gIGJ1ZmZlciArPSBcIlxcbiAgPGRpdiBjbGFzcz1cXFwicGFuZWwtYm9keVxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLnJlcGxpZXMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oNCwgcHJvZ3JhbTQsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuICA8L2Rpdj5cXG4gIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5mdW5jdGlvbiBwcm9ncmFtNChkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMTtcbiAgYnVmZmVyICs9IFwiXFxuICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZ3JvdXBcXFwiPlxcbiAgICAgIDxkaXYgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImxpc3QtZ3JvdXAtaXRlbVxcXCI+XFxuICAgICAgICA8IS0tICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTJcXFwiPjxpbWcgY2xhc3M9XFxcImltZy1yZXNwb25zaXZlXFxcIiAgc3JjPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDAgJiYgZGVwdGgwLnVzZXJJbWcpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgLz48L2Rpdj4tLT5cXG4gICAgICAgIDxwIGNsYXNzPVxcXCJsaXN0LWdyb3VwLWl0ZW0tdGV4dFxcXCI+XFxuICAgICAgICAgIDxzdHJvbmc+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC51c2VyTmFtZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiPC9zdHJvbmc+IC0gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC5tZXNzYWdlKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXG4gICAgICAgICAgPGJyPlxcbiAgICAgICAgICA8c21hbGw+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC50aW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCI8L3NtYWxsPlxcbiAgICAgICAgPC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuZnVuY3Rpb24gcHJvZ3JhbTYoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIFxuICByZXR1cm4gXCJcXG4gICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlclxcXCIgdHlwZT1cXFwic3VibWl0XFxcIj5EZWxldGU8L2J1dHRvbj5cXG4gICAgXCI7XG4gIH1cblxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbigoaGVscGVyID0gaGVscGVycy52aWV3IHx8IChkZXB0aDAgJiYgZGVwdGgwLnZpZXcpLG9wdGlvbnM9e2hhc2g6e30sZGF0YTpkYXRhfSxoZWxwZXIgPyBoZWxwZXIuY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmNvbGxlY3Rpb24pLCBvcHRpb25zKSA6IGhlbHBlck1pc3NpbmcuY2FsbChkZXB0aDAsIFwidmlld1wiLCAoZGVwdGgwICYmIGRlcHRoMC5jb2xsZWN0aW9uKSwgb3B0aW9ucykpKVxuICAgICsgXCJcXG48ZGl2IGNsYXNzPVxcXCJwYW5lbCBwYW5lbC1kZWZhdWx0IHBhbmVsLXBvc3RpbmdcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwicGFuZWwtaGVhZGluZ1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTJcXFwiPlxcbiAgICAgICAgPGltZyBzcmM9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy51c2VySW1nKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnVzZXJJbWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiAvPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMCBwYW5lbC1lbXBoYXNpc1xcXCI+XFxuICAgICAgICA8c3Ryb25nPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy51c2VyTmFtZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC51c2VyTmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L3N0cm9uZz5cXG4gICAgICAgIDxlbT5AIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jbGltYkd5bSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jbGltYkd5bSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCIgaW4gXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNsaW1iRXRhKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNsaW1iRXRhKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIiBmb3IgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNsaW1iRHVyYXRpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY2xpbWJEdXJhdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCIgbWludXRlczwvZW0+XFxuICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuY2xpbWJEZXRhaWxzKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gIDwvZGl2PlxcbiAgXFxuICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAucmVwbGllcyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgzLCBwcm9ncmFtMywgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG4gIFxcbiAgPGRpdiBjbGFzcz1cXFwicGFuZWwtZm9vdGVyXFxcIj5cXG4gICAgPHRleHRhcmVhIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2wgcG9zdGluZy1yZXBseVxcXCIgcm93cz1cXFwiMVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwicG9zdGluZy1yZXBseVxcXCIgcGxhY2Vob2xkZXI9XFxcIk1heWJlIHdlIHNob3VsZCBtZWV0IHVwLi4uXFxcIj48L3RleHRhcmVhPlxcbiAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgcG9zdGluZy1yZXBseS1idXR0b25cXFwiIHR5cGU9XFxcInN1Ym1pdFxcXCI+UmVwbHk8L2J1dHRvbj5cXG4gICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLnVzZXJBdXRoKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDYsIHByb2dyYW02LCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgPC9kaXY+XFxuPC9kaXY+XCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pOyIsInZhciB0ZW1wbGF0ZXIgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpLmRlZmF1bHQudGVtcGxhdGU7bW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZXIoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJuYXZiYXIgbmF2YmFyLWZpeGVkLXRvcCBuYXZiYXItaW52ZXJzZSB0b3BiYXJcXFwiIHJvbGU9XFxcIm5hdmlnYXRpb25cXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwibmF2YmFyLWhlYWRlclxcXCI+XFxuICAgICAgPGEgY2xhc3M9XFxcIm5hdmJhci1icmFuZFxcXCIgaHJlZj1cXFwiI1xcXCI+Q2xpbWJpbmcgQnVkZHkgUERYPC9hPlxcbiAgICAgICAgICBcXG4gICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIm5hdmJhci10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIi5uYXZiYXItY29sbGFwc2VcXFwiPlxcbiAgICAgICAgPGkgY2xhc3M9XFxcImZhIGZhLWJhcnNcXFwiPjwvaT5cXG4gICAgICA8L2J1dHRvbj5cXG4gICAgICBcXG4gICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIm5hdmJhci10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJvZmZjYW52YXNcXFwiPlxcbiAgICAgICAgPGkgY2xhc3M9XFxcImZhIGZhLXBsdXNcXFwiPjwvaT5cXG4gICAgICA8L2J1dHRvbj5cXG4gICAgXFxuICAgIDwvZGl2PlxcbiAgICBcXG4gICAgXFxuICAgIFxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2Ugbm8tbGlzdFxcXCI+XFxuICAgICAgPGxpIGNsYXNzPVxcXCJuYXZiYXItdGV4dCBuYXZiYXItcmlnaHQgZHJvcGRvd25cXFwiPlxcbiAgICAgICAgSGksIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5kaXNwbGF5TmFtZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kaXNwbGF5TmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCIhXFxuICAgICAgICA8aW1nIGNsYXNzPVxcXCJoaWRkZW4teHNcXFwiIHNyYz1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmF2YXRhcikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5hdmF0YXIpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgIDxhIGNsYXNzPVxcXCJoaWRkZW4teHMgZHJvcGRvd24tdG9nZ2xlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGhyZWY9XFxcIiNcXFwiPlxcbiAgICAgICAgICA8aSBjbGFzcz1cXFwiZmEgZmEtY2FyZXQtZG93biBmYS1sZ1xcXCI+PC9pPlxcbiAgICAgICAgPC9hPlxcbiAgICAgICAgPGEgY2xhc3M9XFxcInZpc2libGUteHNcXFwiIGhyZWY9XFxcIi9sb2dvdXRcXFwiPkxvZ291dDwvYT5cXG4gICAgICA8dWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiPiAgICAgICAgXFxuICAgICAgICAgIDxsaT48YSBocmVmPVxcXCIvbG9nb3V0XFxcIj5Mb2dvdXQ8L2E+PC9saT4gICAgICAgICAgICAgICAgICBcXG4gICAgICA8L3VsPlxcblxcbiAgICAgIDwvbGk+XFxuICAgIFxcbjwhLS1cXG4gICAgPGxpIGNsYXNzPVxcXCJkcm9wZG93blxcXCI+XFxuICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImRyb3Bkb3duLXRvZ2dsZVxcXCIgZGF0YS10b2dnbGU9XFxcImRyb3Bkb3duXFxcIj5Ecm9wZG93biA8YiBjbGFzcz1cXFwiY2FyZXRcXFwiPjwvYj48L2E+XFxuICAgICAgPHVsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIj5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCIjXFxcIj5BY3Rpb248L2E+PC9saT5cXG4gICAgICA8L3VsPlxcbiAgICA8L2xpPlxcbi0tPlxcbiAgICA8L2Rpdj5cXG4gIFxcbiAgICBcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiPlxcbiAgICAgIFxcbiAgICA8L2Rpdj5cXG4gICAgXFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufTtcblxudmFyIEhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMS4zLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNDtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz49IDEuMC4wJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChpbnZlcnNlIHx8IGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgc3RyKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gICAgdmFyIGkgPSAwLCByZXQgPSBcIlwiLCBkYXRhO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICBkYXRhLmxhc3QgID0gKGkgPT09IChjb250ZXh0Lmxlbmd0aC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbaV0sIHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYoZGF0YSkgeyBcbiAgICAgICAgICAgICAgZGF0YS5rZXkgPSBrZXk7IFxuICAgICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRba2V5XSwge2RhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihpID09PSAwKXtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IFV0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHtmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2h9KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBjb250ZXh0KTtcbiAgfSk7XG59XG5cbnZhciBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogeyAwOiAnZGVidWcnLCAxOiAnaW5mbycsIDI6ICd3YXJuJywgMzogJ2Vycm9yJyB9LFxuXG4gIC8vIFN0YXRlIGVudW1cbiAgREVCVUc6IDAsXG4gIElORk86IDEsXG4gIFdBUk46IDIsXG4gIEVSUk9SOiAzLFxuICBsZXZlbDogMyxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAobG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xuZnVuY3Rpb24gbG9nKGxldmVsLCBvYmopIHsgbG9nZ2VyLmxvZyhsZXZlbCwgb2JqKTsgfVxuXG5leHBvcnRzLmxvZyA9IGxvZzt2YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICBVdGlscy5leHRlbmQob2JqLCBvYmplY3QpO1xuICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICB2YXIgbGluZTtcbiAgaWYgKG5vZGUgJiYgbm9kZS5maXJzdExpbmUpIHtcbiAgICBsaW5lID0gbm9kZS5maXJzdExpbmU7XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gbm9kZS5maXJzdENvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcblxuZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKFwiK3J1bnRpbWVWZXJzaW9ucytcIikgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uIChcIitjb21waWxlclZlcnNpb25zK1wiKS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJJbmZvWzFdK1wiKS5cIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247Ly8gVE9ETzogUmVtb3ZlIHRoaXMgbGluZSBhbmQgYnJlYWsgdXAgY29tcGlsZVBhcnRpYWxcblxuZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlXCIpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgaWYgKGVudi5jb21waWxlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHsgZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkIH0sIGVudik7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICB2YXIgY29udGFpbmVyID0ge1xuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGZuLCBkYXRhKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgaWYoZGF0YSkge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbShpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgdmFyIHJldCA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiAocGFyYW0gIT09IGNvbW1vbikpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIGNvbW1vbik7XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBwcm9ncmFtV2l0aERlcHRoOiBlbnYuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuYW1lc3BhY2UgPSBvcHRpb25zLnBhcnRpYWwgPyBvcHRpb25zIDogZW52LFxuICAgICAgICBoZWxwZXJzLFxuICAgICAgICBwYXJ0aWFscztcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBoZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgcGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIG5hbWVzcGFjZSwgY29udGV4dCxcbiAgICAgICAgICBoZWxwZXJzLFxuICAgICAgICAgIHBhcnRpYWxzLFxuICAgICAgICAgIG9wdGlvbnMuZGF0YSk7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgZW52LlZNLmNoZWNrUmV2aXNpb24oY29udGFpbmVyLmNvbXBpbGVySW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW1XaXRoRGVwdGgoaSwgZm4sIGRhdGEgLyosICRkZXB0aCAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgW2NvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhXS5jb25jYXQoYXJncykpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gYXJncy5sZW5ndGg7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW1XaXRoRGVwdGggPSBwcm9ncmFtV2l0aERlcHRoO2Z1bmN0aW9uIHByb2dyYW0oaSwgZm4sIGRhdGEpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGEpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICB2YXIgb3B0aW9ucyA9IHsgcGFydGlhbDogdHJ1ZSwgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG5cbiAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGVzY2FwZSA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6IFwiJnF1b3Q7XCIsXG4gIFwiJ1wiOiBcIiYjeDI3O1wiLFxuICBcImBcIjogXCImI3g2MDtcIlxufTtcblxudmFyIGJhZENoYXJzID0gL1smPD5cIidgXS9nO1xudmFyIHBvc3NpYmxlID0gL1smPD5cIidgXS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXSB8fCBcIiZhbXA7XCI7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHZhbHVlKSB7XG4gIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH07XG59XG52YXIgaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nIGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICghc3RyaW5nICYmIHN0cmluZyAhPT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTsiLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJyk7XG4iXX0=
