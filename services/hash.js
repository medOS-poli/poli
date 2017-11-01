"use strict";

const jwt = require('jwt-simple');
const moment = require('moment');
const conf = require('../conf');

function createUserToken(user)
{    
    const payload = 
    {
        id: user._id, //get the new user id
        nick: user.nick,
        email: user.email,
        iat:moment().unix(), //get the creation time of the user
        exp: moment().add(14,'days').unix() //set expiration time to 14 days
    }
    
    return jwt.encode(payload, conf.auth.SECRET_TOKEN); //encode using a token
}

function createCommunityToken(community)
{    
    const payload = 
    {
        id: community._id, //get the new user id
        name: community.name,
        iat:moment().unix(), //get the creation time of the user
        exp: moment().add(3,'years').unix() //set expiration time to 3 years
    }
    
    return jwt.encode(payload, conf.auth.SECRET_TOKEN); //encode using a token
}


function decodeToken(token)
{
    const decoded = new Promise((resolve, reject) =>
    {
        try
        {
            const payload = jwt.decode(token, conf.auth.SECRET_TOKEN);           
           
            if(payload.exp <= moment().unix())
                reject({status: 401, message: "Token has expired"});
            else resolve(payload);
            
        }catch(err)
        {
            reject({status: 500, message: "Invalid Token"});
        }
    });
    
    return decoded;
}

module.exports = {createCommunityToken, createUserToken, decodeToken};
