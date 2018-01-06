import bn from 'bignumber.js'
let bufferToHex = (_buf: Buffer): string => {
	let r = '0x' + new Buffer(_buf).toString('hex')
	if (r == '0x') r = "0x0"
	return r
}
let bnToHex = (_bn: any): string => {
	return '0x'+_bn.toString(16)
}

export {
	bufferToHex,
	bnToHex
}