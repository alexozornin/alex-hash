'use strict'

const crypto = require('crypto');

module.exports.get = (data, local) =>
{
    let salt = (Math.floor(Math.random() * (2147483647 - 256)) + 256).toString(16);
    let primary = crypto.createHmac('sha256', local.toString(16));
    primary.update(data.toString());
    let secondary = crypto.createHmac('sha224', salt);
    secondary.update(primary.digest('hex'));
    return { salt: salt, hash: secondary.digest('hex') };
}

module.exports.check = (data, local, salt) =>
{
    let primary = crypto.createHmac('sha256', local.toString(16));
    primary.update(data.toString());
    let secondary = crypto.createHmac('sha224', salt);
    secondary.update(primary.digest('hex'));
    return { hash: secondary.digest('hex') };
}
