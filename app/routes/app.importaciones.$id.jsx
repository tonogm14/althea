import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import { Page } from "@shopify/polaris";

// Loader para obtener detalles de la importación y su log de productos, con autenticación
export async function loader({ request, params }) {
  const { id } = params;

  // Autenticación del administrador
  const { admin } = await authenticate.admin(request);

  // Verificar si no está autenticado como admin
  if (!admin) {
    return redirect("/login"); // Redirigir a login si no es administrador
  }

  // Obtener la importación junto con su log de productos
  const importacion = await db.importaciones.findUnique({
    where: { id: parseInt(id) },
    include: {
      logProductos: true, // Relación con el log de productos
    },
  });

  if (!importacion) {
    throw new Error("Importación no encontrada");
  }

  return json({ importacion });
}

// Componente para mostrar los detalles de una importación
export default function ImportacionDetails() {
  const { importacion } = useLoaderData();

  return (
    <Page>
      <h1>Detalles de Importación {importacion.id}</h1>
      <div>
        <p>
          <strong>Fecha de Importación:</strong>{" "}
          {new Date(importacion.fechaImportacion).toLocaleString()}
        </p>
        <p>
          <strong>Total de Productos:</strong> {importacion.totalProductos}
        </p>
        <p>
          <strong>Productos Actualizados:</strong>{" "}
          {importacion.productosActualizados}
        </p>
        <p>
          <strong>Productos con Errores:</strong>{" "}
          {importacion.productosConErrores}
        </p>

        <h2>Log de Productos</h2>
        <ul>
          {importacion.logProductos.map((log) => (
            <li key={log.id}>
              {log.producto} - {log.estado}
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}
