import configs from '@/configs'

let isValidRoom = (_rName: string): boolean => {
	return configs.validRooms.indexOf(_rName) > -1
}
let log = {
	error: (..._msg: Array<any>): void => {
		console.error(_msg.join(' '))
	},
	info: (..._msg: Array<any>): void => {
		console.info(_msg.join(' '))
	}
}
export {
	isValidRoom,
	log
}