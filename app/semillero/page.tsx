import Image from 'next/image';
import Link from 'next/link';

export default function SemilleroPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start">
      <div className="mb-6 dark:bg-gray-500/30 dark:rounded-full dark:w-28 dark:h-28 dark:flex dark:items-center dark:justify-center">
        <div className="relative w-20 h-20">
          {' '}
          <Image
            src="/images/semillero-logo.png"
            alt="Logo del Semillero de Tango"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      <div className="text-center max-w-2xl px-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">El Semillero</h1>
        <p className="text-lg text-default-500">
          Mar del Plata es la segunda ciudad con más tango del país, pero con muy poca participación
          de gente joven. El Semillero es una propuesta para cambiar eso. Si tenés entre{' '}
          <strong>18 y 35 años</strong>, ¡este espacio es para vos!
        </p>
      </div>

      <div className="max-w-3xl text-default-700 px-4 space-y-4 mb-10 text-center">
        <p>
          Vas a tener acceso a una <strong>clase gratuita</strong> en todos los espacios tangueros
          de Mar del Plata, y vas a estar invitado a todas las milongas.
        </p>
        <p>
          Además, nace un grupo específico llamado <strong>El Semillero</strong>, un espacio joven
          donde vas a poder tomar <strong>un mes entero de clases gratuitas</strong> todos los
          martes a las 19 hs, en Buenos Aires 2532, Hotel Rucalen.
        </p>
        <p>
          Las clases están a cargo de <strong>Melanie Salinas</strong>, una profesora excelente y
          cuidadosamente seleccionada para el grupo juvenil. Si este lugar no te queda cómodo o no
          te da el horario, podés ir a cualquiera de los otros espacios participantes. ¡Lo
          importante es sumarse!
        </p>
        <p>
          Nuestro objetivo: construir <strong>una nueva generación tanguera</strong>.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <Link
          href="https://docs.google.com/forms/d/1gGVltVLSi3f0T9tVadwimlyJj7eTZN4UE52lL61bSzk/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 text-center"
        >
          Quiero más info
        </Link>

        <Link
          href="/agenda"
          className="mb-20 border border-default-200 px-6 py-3 rounded-xl font-medium text-default-900 hover:bg-default-100 dark:hover:bg-default-700 text-center"
        >
          Ver clases y milongas
        </Link>
      </div>
    </section>
  );
}
