exports.middlewareGlobal = (req, res, next)  =>{
    res.locals.variable = 'jafh318aizi82k1a9token.';
    next();
};

exports.lerQR = async(filename) => {
    var Jimp = require("jimp");
    var fs = require('fs')
    var qrCode = require('qrcode-reader');
    var buffer = fs.readFileSync("public/assets/img/crachas/" + filename);
    await Jimp.read(buffer, async function(e, image) {
        let qrcode = new qrCode();
        qrcode.callback = async function(e, value) {
            return value.result;
        };
        qrcode.decode(image.bitmap);
    });
};
