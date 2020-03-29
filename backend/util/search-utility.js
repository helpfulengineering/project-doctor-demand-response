var express = require('express');

let SearchUtil = {
    filterUserInfo: function(user) {
        return {
            org_name: user.org_name,
            first_name: user.first_name,
            last_name: user.last_name,
            city: user.city,
            state: user.state,
            zipcode: user.zipcode,
            email: user.email,
            phone: user.phone,
            alternate_email: user.alternate_email,
            alternate_phone: user.alternate_phone
        }
    }
}

module.exports = SearchUtil;