const modbusCrc = (arrBytes, offset, len) => {
  let CRC = 0xffff;
  const POLYNOMIAL = 0xA001;

  for (let i = 0; i < len; i++) {
    CRC ^= arrBytes[i + offset] & 0x00ff;
    for (let j = 0; j < 8; j += 1) {
      if ((CRC & 0x0001) !== 0) {
        CRC >>= 1;
        CRC ^= POLYNOMIAL;
      } else {
        CRC >>= 1;
      }
    }
  }

  return CRC;
};

const hexString2Bytes = (str) => {
  let pos = 0;
  let len = str.length;
  if (len % 2 !== 0) {
    return null;
  }
  len /= 2;
  const arrBytes = new Array(len);
  for (let i = 0; i < len; i += 1) {
    const s = str.substr(pos, 2);
    const v = parseInt(s, 16);
    arrBytes.push(v);
    pos += 2;
  }
  return arrBytes;
};

const bytes2HexString = (arrBytes) => {
  let str = '';
  for (let i = 0; i < arrBytes.length; i += 1) {
    let tmp;
    const num = arrBytes[i];
    if (num < 0) {
      tmp = (255 + num + 1).toString(16);
    } else {
      tmp = num.toString(16);
    }
    if (tmp.length === 1) {
      tmp = `0${tmp}`;
    }
    str += tmp;
  }
  return str;
};

const sendFrameWithCrc = (port, sendBuf, offset, len) => {
  const send = new Array(len + 2);
  for (let j = 0; j < len - 2; j++) {
    send[j] = sendBuf[offset + j];
  }
  const checkSum = modbusCrc(sendBuf, offset, len - 2);
  send[len - 2] = checkSum & 0xff;
  send[len - 1] = (checkSum >> 8) & 0xff;
  port.write(sendBuf);
};

const sendFrame = (port, sendBuf, offset, len) => {
  const send = new Array(len);
  for (let j = 0; j < len; j++) {
    send[j] = sendBuf[offset + j];
  }
  port.write(sendBuf);
};

const receiveDataProcess = (data) => {
  const recvLen = data.length;
  if (recvLen <= 1) return;
  switch (data[1]) {
    case 0x03:
      console.log(data.toString('hex').toUpperCase());
      break;
    case 0x10:
      break;
    default:
      break;
  }
};

export {
  modbusCrc,
  hexString2Bytes,
  bytes2HexString,
  sendFrameWithCrc,
  sendFrame,
  receiveDataProcess,
};
