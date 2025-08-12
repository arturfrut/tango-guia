import Link from 'next/link';

export default function DenunciasPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start py-10">
      {/* Título */}
      <div className="text-center max-w-3xl px-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Denuncias y Recomendaciones</h1>
        <p className="text-lg text-default-500">
          Esta sección está pensada para <strong>mejorar el tango en Mar del Plata</strong>. Si
          sufriste alguna incomodidad o situación que creas importante avisar, o si tenés alguna
          recomendación para que podamos mejorar, este es el lugar.
        </p>
      </div>

      {/* Descripción */}
      <div className="max-w-3xl text-default-700 px-4 space-y-4 mb-10">
        <p>
          Al enviar tu denuncia o recomendación, podés elegir si querés que tu
          <strong> nombre y número</strong> sean visibles o si preferís mantenerte en el anonimato.
        </p>
        <p>
          El objetivo es <strong>mejorar los espacios</strong>, la convivencia y la experiencia de
          todas las personas que forman parte de la comunidad tanguera.
        </p>
        <p>
          Para realizar tu denuncia o recomendación, ingresá al <strong>chatbot Mia</strong> y
          seleccioná la <strong>opción 4</strong> en el menú.
        </p>
      </div>

      {/* Botón para hablar con Mia */}
      <Link
        href="https://wa.me/549XXXXXXXXX" // reemplazar por el número real de Mia
        className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 text-center"
      >
        Hablar con Mia
      </Link>
    </section>
  );
}
