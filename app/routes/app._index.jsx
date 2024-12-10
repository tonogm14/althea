import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { Card, EmptyState, Layout, Page, IndexTable } from "@shopify/polaris";
import { getImportaciones } from "../models/Importaciones.server";
import db from "../db.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const importaciones = await getImportaciones(session.shop);
  //const importaciones = [];
  return json({ importaciones });
}

const sincronizarProductos = () => {};
// [START empty]
const EmptyImportCodeState = ({ onAction }) => (
  <EmptyState
    heading="Lista de Importación de Productos para Sincronizar"
    action={{
      content: "Sincronizar",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>
      Esta es la primera vez aqui. Presiona el botón Sincronizar para iniciar.
    </p>
  </EmptyState>
);
// [END empty]

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

// [START table]
const ImportacionTable = ({ importaciones }) => (
  <IndexTable
    resourceName={{ singular: "Importación", plural: "Importaciones" }}
    itemCount={importaciones.length}
    headings={[
      { title: "Fecha de Importación" },
      { title: "Total de Productos" },
      { title: "Productos Actualizados" },
      { title: "Productos con Errores" },
      { title: "Acción" },
    ]}
    selectable={false}
  >
    {importaciones.map((importacion) => (
      <ImportacionTableRow key={importacion.id} importacion={importacion} />
    ))}
  </IndexTable>
);
// [END table]

// [START row]
const ImportacionTableRow = ({ importacion }) => (
  <IndexTable.Row id={importacion.id} position={importacion.id}>
    <IndexTable.Cell>
      {new Date(importacion.fechaImportacion).toLocaleString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{importacion.totalProductos}</IndexTable.Cell>
    <IndexTable.Cell>{importacion.productosActualizados}</IndexTable.Cell>
    <IndexTable.Cell>{importacion.productosConErrores}</IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`/importaciones/${importacion.id}`}>Ver Detalles</Link>
    </IndexTable.Cell>
  </IndexTable.Row>
);
// [END row]

// Main
export default function Index() {
  const { importaciones } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Importaciones">
        <button variant="primary" onClick={() => sincronizarProductos()}>
          Sincronizar
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {importaciones.length === 0 ? (
              <EmptyImportCodeState onAction={() => sincronizarProductos()} />
            ) : (
              <ImportacionTable importaciones={importaciones} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
