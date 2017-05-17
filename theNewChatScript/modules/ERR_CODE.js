/*  
    Error code module for ChatScript.
    Turns out to be the universal error code across the app.
    Just 'require' it and it can then be used.
    If not gonna use this module, just use the error code accordingly.
 */

const ERR_CODE = {
    "MESSAGE_INVALID": 101,
    "PARAM_NOT_A_MSG": 201,
    "PARAM_NOT_A_BUFFER": 202,
}

module.exports = ERR_CODE
