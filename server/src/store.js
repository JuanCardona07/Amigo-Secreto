// Con REDIS_URL definida (Render Key Value, Upstash, etc.) el estado sobrevive a
// los reinicios del servicio. Sin ella, se usa un archivo local (solo para desarrollo).
module.exports = process.env.REDIS_URL ? require("./storeRedis") : require("./storeArchivo");
