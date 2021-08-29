const Web3 = require('web3');

exports.isMatch = function(val1, val2) {
    if (val1.toLowerCase() == val2.toLowerCase()) {
        return true;
    }
    return false;
};

exports.toEther = function(val, type = 'ether') {
    val = (typeof val !== 'string' ? (val).toString() : val);
    return Number(Web3.utils.fromWei(val, type));
};