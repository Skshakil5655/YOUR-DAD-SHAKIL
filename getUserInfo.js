"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatData(data) {
  var retObj = {};

  for (var prop in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(prop)) {
      var innerObj = data[prop];
      retObj[prop] = {
        name: innerObj.name,
        firstName: innerObj.firstName,
        vanity: innerObj.vanity,
        thumbSrc: innerObj.thumbSrc,
        profileUrl: innerObj.uri,
        gender: innerObj.gender,
        type: innerObj.type,
        isFriend: innerObj.is_friend,
        isBirthday: !!innerObj.is_birthday
      };
    }
  }

  return retObj;
}

module.exports = function (defaultFuncs, api, ctx) {
  return function getUserInfo(id, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, userInfo) {
        if (err) return rejectFunc(err);
        resolveFunc(userInfo);
      };
    }

    if (utils.getType(id) !== "Array") id = [id];

    var form = {};
    id.map(function (v, i) {
      form["ids[" + i + "]"] = v;
    });
    defaultFuncs
      .post("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZchat/user_info/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) throw resData;
        return callback(null, formatData(resData.payload.profiles));
      })
      .catch(function (err) {
        log.error("getUserInfo", "Lỗi: getUserInfo Có Thể Do Bạn Spam Quá Nhiều !,Hãy Thử Lại !");
        return callback(err);
      });

    return returnPromise;
  };
};