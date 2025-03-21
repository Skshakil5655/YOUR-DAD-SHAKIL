"use strict";

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
  return function searchForThread(name, callback) {
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

    var tmpForm = {
      client: "web_messenger",
      query: name,
      offset: 0,
      limit: 21,
      index: "fbid"
    };

    defaultFuncs
      .post("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZajax/mercury/search_threads.php", ctx.jar, tmpForm)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) throw resData;
        if (!resData.payload.mercury_payload.threads) return callback({ error: "Could not find thread `" + name + "`." });
        return callback(
          null,
          resData.payload.mercury_payload.threads.map(utils.formatThread)
        );
      });

    return returnPromise;
  };
};