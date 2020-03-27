var express = require('express');
const cryptoRandomString = require('crypto-random-string');

let EmailUtil = {

    sendMail: function(mailer, params) {
        mailer.send(params.template, params, function (err, message) {
            if (err) {
              console.log(err);
              return;
            }
          });
    },

    generateActivationCode: function(length) {
        return cryptoRandomString({length: length, type: 'url-safe'});
    }
}

module.exports = EmailUtil;