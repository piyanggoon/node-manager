const Web3 = require('web3');

exports.isFunc = function(func) {
    return (typeof func === 'function' ? true : false);
};

exports.strMatch = function(val1, val2) {
    if (val1.toLowerCase() == val2.toLowerCase()) {
        return true;
    }
    return false;
};

exports.toEther = function(val, type = 'ether') {
    val = (typeof val !== 'string' ? (val).toString() : val);
    return Number(Web3.utils.fromWei(val, type));
};

exports.toWei = function(val, type = 'ether') {
    val = (typeof val !== 'string' ? (val).toString() : val);
    return Web3.utils.toWei(val, type);
};

exports.keccak256 = function(val) {
    if (typeof val !== 'string') throw 'keccak256: string';
    return Web3.utils.keccak256(val);
};