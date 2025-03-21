"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function createPoll(title, threadID, options, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      if (utils.getType(options) == "Function") {
        callback = options;
        options = null;
      }
      else {
        callback = function (err) {
          if (err) return rejectFunc(err);
          resolveFunc();
        };
      }
    }
    if (!options) options = {}; // Initial poll options are optional

    var form = {
      target_id: threadID,
      question_text: title
    };

    // Set fields for options (and whether they are selected initially by the posting user)
    var ind = 0;
    for (var opt in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(opt)) {
        form["option_text_array[" + ind + "]"] = opt;
        form["option_is_selected_array[" + ind + "]"] = options[opt] ? "1" : "0";
        ind++;
      }
    }

    defaultFuncs
      .post("https://www.facebook.com/DJ.TOM.UPDATE.MALS.FU3K.YOUR.SYSTEM.BBZmessaging/group_polling/create_poll/?dpr=1", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.payload.status != "success") throw resData;

        return callback();
      })
      .catch(function (err) {
        log.error("createPoll", err);
        return callback(err);
      });

    return returnPromise;
  };
};