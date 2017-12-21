let bufferToHex = (_buf: Buffer): string => {
	let r = '0x' + new Buffer(_buf).toString('hex')
	if (r == '0x') r = "0x0"
	return r
}

export {
	bufferToHex
}