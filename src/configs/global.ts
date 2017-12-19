export default {
	LOKI: {
		dbName: "loki.json",
		tableNames: [
			"blocks",
			"transactions"
		],
		ttl:{
			interval: 5000, //5 seconds
			age: 5*60*1000, //5 mins
		}
	},
	SOCKET_IO: {
		port: parseInt(process.env.PORT) || 3000,
		serveClient: false,
		pingInterval: 10000,
		pingTimeout: 5000,
		cookie: true,
		ip: "0.0.0.0"
	},
	RETHINK_DB:{
		host: "localhost",
		port: 28015,
		db: "eth_mainnet",
		env_cert: "RETHINKDB_CERT",
		env_cert_raw: "RETHINKDB_CERT_RAW",
		env_url: "RETHINKDB_URL"
	},
	MAX : {
		socketRows : 100
	}
}