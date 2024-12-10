import sql from "mssql";

const DB_USER = tu_usuario;
const DB_PASSWORD = tu_contraseña;
const DB_HOST = tu_servidor;
const DB_NAME = tu_base_de_datos;
const DB_PORT = 1433;

// Configuración de la base de datos SQL Server
const config = {
  user: process.env.DB_USER, // Usuario para la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  server: process.env.DB_HOST, // Host de la base de datos (puede ser localhost o IP)
  database: process.env.DB_NAME, // Nombre de la base de datos
  port: parseInt(process.env.DB_PORT, 10) || 1433, // Puerto del servidor
  options: {
    encrypt: true, // Usar cifrado si el servidor requiere SSL
    trustServerCertificate: true, // Establece en true si estás usando un certificado autofirmado
  },
};

let pool;

// Función para establecer la conexión
export async function getAltheaDBConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// Exporta el paquete de SQL Server para consultas directas si es necesario
export { sql };
