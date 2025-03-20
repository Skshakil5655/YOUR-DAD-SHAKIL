"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function resolvePhotoUrl(photoID, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    defaultFuncs
      .get("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZmercury/attachments/photo", ctx.jar, { photo_id: photoID })
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(resData => {
        if (resData.error) throw resData;
        var photoUrl = resData.jsmods.require[0][3][0];
        return callback(null, photoUrl);
      })
      .catch(err => {
        log.error("resolvePhotoUrl", err);
        return callback(err);
      });

    return returnPromise;
  };
};