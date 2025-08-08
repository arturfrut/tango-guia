import { Link } from '@heroui/link'
import Image from 'next/image'

export default function Home() {
  return (
    <section className='flex flex-col items-center justify-center md:py-2 '>
      <div className='relative w-50 h-50 mb-6'>
        <Image
          src='/images/dancingMia.png'
          alt='Mia - Chatbot Tango Guía'
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className='h-full flex items-center justify-center flex-col gap-4'>
        <div>
          <h2 className='md:text-2xl text-xl text-center'>Hola! Bienvenidos a:</h2>
          <h1 className='md:text-8xl text-5xl text-center font-bold'>TANGO GUÍA</h1>
            <div className="flex flex-col items-center my-2">
              <p className='max-w-xl text-center mt-4 text-default-500'>
                Una plataforma para descubrir y promover el tango en Mar del
                Plata. Clases, milongas, comunidad y cultura. Todo en un solo
                lugar.
              </p>
            </div>
          
        </div>

        {/* BOTONES */}
        <div className='flex flex-col gap-4 w-full max-w-md px-4 mt-4'>
          <Link
            href='/agenda'
            className='bg-primary text-white font-medium text-center justify-center py-3 px-6 rounded-xl hover:opacity-90 transition-colors'
          >
            Tango esta semana!
          </Link>

          <Link
            href='/semillero'
            className='border border-default-200  justify-center text-default-900 font-medium text-center py-3 px-6 rounded-xl hover:bg-default-100 dark:hover:bg-default-700 transition-colors'
          >
            Tengo entre 18 y 35 años
          </Link>

          <Link
            href='/sobre-tango'
            className='border border-default-200 justify-center text-default-900 font-medium text-center py-3 px-6 rounded-xl hover:bg-default-100 dark:hover:bg-default-700 transition-colors col-span-1 sm:col-span-2'
          >
            Sobre Tango Guía y quiero colaborar
          </Link>

          <Link
            href='/recomendaciones'
            className='text-sm justify-center text-default-500 hover:underline text-center col-span-1 sm:col-span-2'
          >
            Denuncias y sugerencias
          </Link>
        </div>
      </div>
    </section>
  )
}
