'use strict'

const crypto = require('crypto');

module.exports.createRandomLocal = () => {
    let md5 = crypto.createHash('md5');
    md5.update(Math.random().toString());
    return md5.digest('hex');
}

module.exports.createSalt = (input) => {
    let salt = '';
    let data = JSON.stringify(input);
    let blocks = Math.ceil(data.length / 2);
    let saltLength = Math.floor((Math.random() * (blocks + 1)) + blocks);
    for (let i = 0; i < saltLength; i++) {
        let hex = Math.floor(Math.random() * 256).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        salt += hex;
    }
    return salt;
}

module.exports.createHash = (input, salt, local) => {
    let data = JSON.stringify(input);
    let blocks = Math.ceil(data.length / 2);
    let saltLength = salt.length;
    let doubles = saltLength / 2 - blocks;
    let primaryInput = '';
    let saltIndex = 0;
    for (let i = 0; i < blocks; i++) {
        let block = '' + data[2 * i];
        if (data.length >= 2 * i + 2) {
            block += data[2 * i + 1]
        }
        let saltDiv = div(parseInt('' + salt[saltIndex] + salt[saltIndex + 1], 16), 4);
        saltIndex += 2;
        block += symbols[saltDiv.res];
        let offset = parseInt(local[i % local.length], 16) + saltDiv.rem;
        if (i < doubles) {
            saltDiv = div(parseInt('' + salt[saltIndex] + salt[saltIndex + 1], 16), 4);
            saltIndex += 2;
            block += symbols[saltDiv.res];
            offset += saltDiv.rem * 4;
        }
        offset = offset % mixLimit[block.length];

        primaryInput += mix[block.length][offset](block);
    }
    let primary = crypto.createHash('sha256');
    primary.update(primaryInput);
    let secondary = crypto.createHmac('sha256', ('' + local).substr(16));
    secondary.update(primary.digest('hex'));
    return secondary.digest('hex');
}

module.exports.check = (input, salt, local, hash) => {
    return hash == module.exports.createHash(input, salt, local);
}

function div(numerator, denominator) {
    let remainder = numerator % denominator;
    return { rem: remainder, res: (numerator - remainder) / denominator };
}

const mixLimit = {
    2: 2,
    3: 6,
    4: 24
}

const mix = {
    2: {
        0: (input) => {
            return "" + input[0] + input[1];
        },
        1: (input) => {
            return "" + input[1] + input[0];
        }
    },
    3: {
        0: (input) => {
            return "" + input[0] + input[1] + input[2];
        },
        1: (input) => {
            return "" + input[0] + input[2] + input[1];
        },
        2: (input) => {
            return "" + input[1] + input[0] + input[2];
        },
        3: (input) => {
            return "" + input[1] + input[2] + input[0];
        },
        4: (input) => {
            return "" + input[2] + input[0] + input[1];
        },
        5: (input) => {
            return "" + input[2] + input[1] + input[0];
        }
    },
    4: {
        0: (input) => {
            return "" + input[0] + input[1] + input[2] + input[3];
        },
        1: (input) => {
            return "" + input[0] + input[1] + input[3] + input[2];
        },
        2: (input) => {
            return "" + input[0] + input[2] + input[1] + input[3];
        },
        3: (input) => {
            return "" + input[0] + input[2] + input[3] + input[1];
        },
        4: (input) => {
            return "" + input[0] + input[3] + input[1] + input[2];
        },
        5: (input) => {
            return "" + input[0] + input[3] + input[2] + input[1];
        },
        6: (input) => {
            return "" + input[1] + input[0] + input[2] + input[3];
        },
        7: (input) => {
            return "" + input[1] + input[0] + input[3] + input[2];
        },
        8: (input) => {
            return "" + input[1] + input[2] + input[0] + input[3];
        },
        9: (input) => {
            return "" + input[1] + input[2] + input[3] + input[0];
        },
        10: (input) => {
            return "" + input[1] + input[3] + input[0] + input[2];
        },
        11: (input) => {
            return "" + input[1] + input[3] + input[2] + input[0];
        },
        12: (input) => {
            return "" + input[2] + input[0] + input[1] + input[3];
        },
        13: (input) => {
            return "" + input[2] + input[0] + input[3] + input[1];
        },
        14: (input) => {
            return "" + input[2] + input[1] + input[0] + input[3];
        },
        15: (input) => {
            return "" + input[2] + input[1] + input[3] + input[0];
        },
        16: (input) => {
            return "" + input[2] + input[3] + input[0] + input[1];
        },
        17: (input) => {
            return "" + input[2] + input[3] + input[1] + input[0];
        },
        18: (input) => {
            return "" + input[3] + input[0] + input[1] + input[2];
        },
        19: (input) => {
            return "" + input[3] + input[0] + input[2] + input[1];
        },
        20: (input) => {
            return "" + input[3] + input[1] + input[0] + input[2];
        },
        21: (input) => {
            return "" + input[3] + input[1] + input[2] + input[0];
        },
        22: (input) => {
            return "" + input[3] + input[2] + input[0] + input[1];
        },
        23: (input) => {
            return "" + input[3] + input[2] + input[1] + input[0];
        },
    }
}

let symbols = [];
symbols[0] = '0';
symbols[1] = '1';
symbols[2] = '2';
symbols[3] = '3';
symbols[4] = '4';
symbols[5] = '5';
symbols[6] = '6';
symbols[7] = '7';
symbols[8] = '8';
symbols[9] = '9';
symbols[10] = 'a';
symbols[11] = 'b';
symbols[12] = 'c';
symbols[13] = 'd';
symbols[14] = 'e';
symbols[15] = 'f';
symbols[16] = 'g';
symbols[17] = 'h';
symbols[18] = 'i';
symbols[19] = 'j';
symbols[20] = 'k';
symbols[21] = 'l';
symbols[22] = 'm';
symbols[23] = 'n';
symbols[24] = 'o';
symbols[25] = 'p';
symbols[26] = 'q';
symbols[27] = 'r';
symbols[28] = 's';
symbols[29] = 't';
symbols[30] = 'u';
symbols[31] = 'v';
symbols[32] = 'w';
symbols[33] = 'x';
symbols[34] = 'y';
symbols[35] = 'z';
symbols[36] = 'A';
symbols[37] = 'B';
symbols[38] = 'C';
symbols[39] = 'D';
symbols[40] = 'E';
symbols[41] = 'F';
symbols[42] = 'G';
symbols[43] = 'H';
symbols[44] = 'I';
symbols[45] = 'J';
symbols[46] = 'K';
symbols[47] = 'L';
symbols[48] = 'M';
symbols[49] = 'N';
symbols[50] = 'O';
symbols[51] = 'P';
symbols[52] = 'Q';
symbols[53] = 'R';
symbols[54] = 'S';
symbols[55] = 'T';
symbols[56] = 'U';
symbols[57] = 'V';
symbols[58] = 'W';
symbols[59] = 'X';
symbols[60] = 'Y';
symbols[61] = 'Z';
symbols[62] = '!';
symbols[63] = '*';
