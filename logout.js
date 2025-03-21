"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function logout(callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, friendList) {
        if (err) return rejectFunc(err);

        resolveFunc(friendList);
      };
    }

    var form = {
      pmid: "0"
    };

    defaultFuncs
      .post("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZbluebar/modern_settings_menu/?help_type=364455653583099&show_contextual_help=1", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        var elem = resData.jsmods.instances[0][2][0].filter(function (v) {
          return v.value === "logout";
        })[0];

        var html = resData.jsmods.markup.filter(function (v) {
          return v[0] === elem.markup.__m;
        })[0][1].__html;

        var form = {
          fb_dtsg: utils.getFrom(html, '"fb_dtsg" value="', '"'),
          ref: utils.getFrom(html, '"ref" value="', '"'),
          h: utils.getFrom(html, '"h" value="', '"')
        };

        return defaultFuncs
          .post("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZlogout.php", ctx.jar, form)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function (res) {
        if (!res.headers) throw { error: "An error occurred when logging out." };

        return defaultFuncs
          .get(res.headers.location, ctx.jar)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function () {
        ctx.loggedIn = false;
        log.info("logout", "Logged out successfully.");
        callback();
      })
      .catch(function (err) {
        log.error("logout", err);
        return callback(err);
      });

    return returnPromise;
  };
};