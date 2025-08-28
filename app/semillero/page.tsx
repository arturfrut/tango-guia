import Image from 'next/image'
import Link from 'next/link'

export default function SemilleroPage() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-start'>
      <div className='relative w-20 h-20 mb-6'>
        <Image
          src='/images/semillero-logo.png'
          alt='Logo del Semillero de Tango'
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className='text-center max-w-2xl px-4 mb-8'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>El Semillero</h1>
        <p className='text-lg text-default-500'>
          Mar del Plata es la segunda ciudad con más tango del país, pero con
          muy poca participación de gente joven. El Semillero es una propuesta
          para cambiar eso. Si tenés entre <strong>18 y 35 años</strong>, ¡este
          espacio es para vos!
        </p>
      </div>

      <div className='max-w-3xl text-default-700 px-4 space-y-4 mb-10 text-center'>
        <p>
          Vas a tener acceso a una <strong>clase gratuita</strong> en todos los
          espacios tangueros de Mar del Plata, y vas a estar invitado a todas
          las milongas.
        </p>
        <p>
          Además, nace un grupo específico llamado <strong>El Semillero</strong>
          , un espacio joven donde vas a poder tomar{' '}
          <strong>un mes entero de clases gratuitas</strong> todos los martes a
          las 20 hs, en Buenos Aires 1232, Hotel Trenquelauquen.
        </p>
        <p>
          Las clases están a cargo de <strong>Melanie Salinas</strong>, una de
          las profesoras y bailarinas más importantes de la ciudad. Si este
          lugar no te queda cómodo o no te da el horario, podés ir a cualquiera
          de los otros espacios participantes. ¡Lo importante es sumarse!
        </p>
        <p>
          Nuestro objetivo: construir{' '}
          <strong>una nueva generación tanguera</strong>.
        </p>
      </div>

      <div className='flex flex-col gap-4 w-full max-w-md px-4'>
        <Link
          href='/contacto' // o el link que corresponda para "más info"
          className='bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 text-center'
        >
          Quiero más info
        </Link>

        <Link
          href='/agenda'
          className='mb-20 border border-default-200 px-6 py-3 rounded-xl font-medium text-default-900 hover:bg-default-100 dark:hover:bg-default-700 text-center'
        >
          Ver clases y milongas
        </Link>
      </div>
    </section>
  )
}
