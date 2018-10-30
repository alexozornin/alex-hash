'use strict'

const crypto = require('crypto');

module.exports.get = (input, local) =>
{
    let data = JSON.stringify(input);
    let blocks = Math.ceil(data.length / 2);
    let salt_length = Math.floor((Math.random() * (blocks + 1)) + blocks);
    let doubles = salt_length - blocks;
    let salt = [];
    let primary_input = [];
    for (let i = 0; i < blocks; i++)
    {
        let A256 = Math.floor(Math.random() * 256);
        salt.push(A256.toString(16));
        if (i < doubles)
        {
            let B256 = Math.floor(Math.random() * 256);
            salt.push(B256.toString(16));
            if (data.length >= 2 * i + 2)
            {
                primary_input.push(mix(data[2 * i] + data[2 * i + 1], A256, B256));
            }
            else
            {
                primary_input.push(mix(data[2 * i], A256, B256));
            }
        }
        else
        {
            if (data.length >= 2 * i + 2)
            {
                primary_input.push(mix(data[2 * i] + data[2 * i + 1], A256));
            }
            else
            {
                primary_input.push(mix(data[2 * i], A256));
            }
        }
    }
    let primary = crypto.createHmac('sha256', local.toString(16));
    primary.update(data);
    let secondary = crypto.createHmac('sha224', salt);
    secondary.update(primary.digest('hex'));
    return { salt: salt, hash: secondary.digest('hex') };
}

module.exports.check = (input, local, salt) =>
{
    let data = JSON.stringify(input);
    let primary = crypto.createHmac('sha256', local.toString(16));
    primary.update(data);
    let secondary = crypto.createHmac('sha224', salt);
    secondary.update(primary.digest('hex'));
    return { hash: secondary.digest('hex') };
}

function div(numerator, denominator)
{
    let remainder = numerator % denominator;
    return { rem: remainder, res: (numerator - remainder) / denominator };
}

function mix(initial, A256, B256)
{
    if (B256 == undefined || B256 == null)
    {
        if (initial.length == 1)
        {
            let divA = div(A256, 4);
            switch (divA.rem % 2)
            {
                case 0:
                    return initial[0] + symbols[divA.res];
                default:
                    return symbols[divA.res] + initial[0];
            }
        }
        else
        {
            let divA = div(A256, 4);
            switch (divA.rem)
            {
                case 0:
                    return initial[0] + symbols[divA.res] + initial[1];
                case 1:
                    return initial[1] + initial[0] + symbols[divA.res];
                case 2:
                    return initial[1] + symbols[divA.res] + initial[0];
                default:
                    return symbols[divA.res] + initial[1] + initial[0];
            }
        }
    }
    else
    {
        if (initial.length == 1)
        {
            let divA = div(A256, 4);
            let divB = div(B256, 4);
            switch ((divA.rem * 4 + divB.rem) % 6)
            {
                case 0:
                    return symbols[divB.res] + initial[0] + symbols[divA.res];
                case 1:
                    return symbols[divA.res] + initial[0] + symbols[divB.res];
                case 2:
                    return initial[0] + symbols[divB.res] + symbols[divA.res];
                case 3:
                    return symbols[divB.res] + symbols[divA.res] + initial[0];
                case 4:
                    return initial[0] + symbols[divA.res] + symbols[divB.res];
                default:
                    return symbols[divA.res] + symbols[divB.res] + initial[0];
            }
        }
        else
        {
            let divA = div(A256, 4);
            let divB = div(B256, 4);
            switch (divA.rem * 4 + divB)
            {
                case 0:
                    return initial[0] + symbols[divA.res] + initial[1] + symbols[divB.res];
                case 1:
                    return symbols[divA.res] + initial[0] + symbols[divB.res] + initial[1];
                case 2:
                    return symbols[divA.res] + initial[0] + initial[1] + symbols[divB.res];
                case 3:
                    return initial[0] + symbols[divA.res] + symbols[divB.res] + initial[1];
                case 4:
                    return initial[1] + symbols[divA.res] + initial[0] + symbols[divB.res];
                case 5:
                    return symbols[divA.res] + initial[1] + symbols[divB.res] + initial[0];
                case 6:
                    return symbols[divA.res] + initial[1] + initial[0] + symbols[divB.res];
                case 7:
                    return initial[1] + symbols[divA.res] + symbols[divB.res] + initial[0];
                case 8:
                    return initial[0] + symbols[divB.res] + initial[1] + symbols[divA.res];
                case 9:
                    return symbols[divB.res] + initial[0] + symbols[divA.res] + initial[1];
                case 10:
                    return symbols[divB.res] + initial[0] + initial[1] + symbols[divA.res];
                case 11:
                    return initial[0] + symbols[divB.res] + symbols[divA.res] + initial[1];
                case 12:
                    return initial[1] + symbols[divB.res] + initial[0] + symbols[divA.res];
                case 13:
                    return symbols[divB.res] + initial[1] + symbols[divA.res] + initial[0];
                case 14:
                    return symbols[divB.res] + initial[1] + initial[0] + symbols[divA.res];
                case 15:
                    return initial[1] + symbols[divB.res] + symbols[divA.res] + initial[0];
            }
        }
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
