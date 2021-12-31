import Link from "next/link";

export default function Admin() {
  return (
    <main className="w-full max-w-xl px-10 mx-auto my-20">
      <div className="text-center my-20">
        <h1 className="text-4xl">Administración</h1>
        <p>Elige una opción</p>
      </div>
      <section>
        <h2 className="text-2xl mb-5">Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center">
          <Link href="/admin/products/add">
            <a className="shadow-lg px-5 py-10 rounded-lg border-4 border-blue-400 text-black font-bold hover:bg-blue-100">
              Publicar
            </a>
          </Link>
          <Link href="/admin/products">
            <a className="shadow-lg px-5 py-10 rounded-lg border-4 border-blue-400 text-black font-bold hover:bg-blue-100">
              Ver todos
            </a>
          </Link>
        </div>
      </section>

      <section className="mt-20 text-gray-700">
        <h2 className="text-2xl mb-5">¿Necesitas ayuda?</h2>
        <ul>
          <li>
            Para <strong>publicar un nuevo producto</strong> hacé click en "
            <strong>Publicar</strong>".
          </li>
          <li>
            Si queres <strong>ver todos los productos</strong>,{" "}
            <strong>borrar</strong> o <strong>modificar</strong> alguno hacé
            click en "<strong>Ver todos</strong>".
          </li>
        </ul>
      </section>
    </main>
  );
}
