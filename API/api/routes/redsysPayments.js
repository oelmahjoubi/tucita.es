const crypto = require('crypto');
const base64url = require('base64url');

class Payment{
    encrypt3DES(str, key) {
        const secretKey = Buffer.from(key, 'base64');
        const iv = Buffer.alloc(8, 0);
        const cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv);
        cipher.setAutoPadding(false);
        return cipher.update(this.zeroPad(str, 8), 'utf8', 'base64') +
            cipher.final('base64');
    }

    decrypt3DES(str, key) {
        const secretKey = Buffer.from(key, 'base64');
        const iv = Buffer.alloc(8, 0);
        const cipher = crypto.createDecipheriv('des-ede3-cbc', secretKey, iv);
        cipher.setAutoPadding(false);
        const res = cipher.update(this.zeroUnpad(str, 8), 'base64', 'utf8') +
            cipher.final('utf8');
        return res.replace(/\0/g, '');
    }

    mac256(data, key) {
        return crypto.createHmac('sha256', Buffer.from(key, 'base64'))
            .update(data)
            .digest('base64');
    }

    createMerchantParameters(data) {
        return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
    }

    decodeMerchantParameters(data) {
        const _data = JSON.parse(base64url.decode(data, 'utf8'));
        const res = {};
        for (var name in _data) {
            res[decodeURIComponent(name)] = decodeURIComponent(_data[name]);
        }
        return res;
    }

    createMerchantSignature(key, data) {
        const _data = this.createMerchantParameters(data);
        const orderId = data.Ds_Merchant_Order || data.DS_MERCHANT_ORDER;
        const orderKey = this.encrypt3DES(orderId, key);
        return this.mac256(_data, orderKey);
    }

    createMerchantSignatureNotif(key, data) {
        const _data = this.decodeMerchantParameters(data);
        const orderId = _data.Ds_Order || _data.DS_ORDER;
        const orderKey = this.encrypt3DES(orderId, key);
        const res = this.mac256(data, orderKey);
        return base64url.encode(res, 'base64');
    }

    merchantSignatureIsValid(signA, signB) {
        return base64url.decode(signA, 'base64') ===
            base64url.decode(signB, 'base64');
    }

    zeroPad(buf, blocksize) {
        if (typeof buf === 'string') {
            buf = Buffer.from(buf, 'utf8');
        }
        var pad = Buffer.alloc((blocksize - (buf.length % blocksize)) % blocksize, 0);
        return Buffer.concat([buf, pad]);
    }

    zeroUnpad(buf, blocksize) {
        var lastIndex = buf.length;
        while (lastIndex >= 0 && lastIndex > buf.length - blocksize - 1) {
            lastIndex--;
            if (buf[lastIndex] != 0) {
                break;
            }
        }
        return buf.slice(0, lastIndex + 1).toString('utf8');
    }
}

module.exports = Payment;