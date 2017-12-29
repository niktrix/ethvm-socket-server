import configs from '@/configs'

let log = {
	error: (..._msg: Array<any>): void => {
		console.error(_msg.join(' '))
	},
	info: (..._msg: Array<any>): void => {
		console.info(_msg.join(' '))
	}
}
export {
	log
}