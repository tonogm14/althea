import db from "../db.server";
import { getAltheaDBConnection, sql } from "~/server/db.server";

/**
 * Obtiene los detalles completos de una importación por ID.
 * @param {number} id - ID de la importación a buscar.
 * @param {boolean} graphql - Si es true, formatea el resultado para GraphQL.
 * @returns {object|null} - Los datos completos de la importación o null si no se encuentra.
 */
export async function getImportacion(id, graphql = false) {
  const importacion = await db.importaciones.findFirst({
    where: { id: parseInt(id) },
  });

  if (!importacion) {
    return null;
  }

  // Transformar los datos al formato GraphQL
  if (graphql) {
    return {
      id: importacion.id,
      fechaImportacion: importacion.fechaImportacion,
      totalProductos: importacion.totalProductos,
      productosActualizados: importacion.productosActualizados,
      productosConErrores: importacion.productosConErrores,
      logProductos: importacion.logProductos.map((log) => ({
        id: log.id,
        producto: log.producto,
        estado: log.estado,
      })),
    };
  }

  return importacion;
}

/**
 * Obtiene todas las importaciones de una tienda específica.
 * @param {string} shop - Identificador de la tienda.
 * @param {boolean} graphql - Si es true, formatea el resultado para GraphQL.
 * @returns {Array} - Lista de importaciones o un arreglo vacío si no hay resultados.
 */
export async function getImportaciones(shop) {
  const importaciones = await db.importaciones.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  if (!importaciones || importaciones.length === 0) return [];

  return importaciones;
}

export async function getProductosParaActualizar() {
  const pool = await getAltheaDBConnection();

  const query = `
    SELECT id, nombre, precio, stock 
    FROM productos 
    WHERE necesita_actualizacion = 1
  `;

  const result = await pool.request().query(query);
  return result.recordset; // Devuelve los resultados en formato de objeto
}
