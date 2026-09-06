import Image from 'next/image'
import Link from 'next/link'
import Logo from '../../public/tyandor-logo.svg'

export function Footer() {
  return (
    <footer className="bg-layer-02 text-text-secondary border-t border-border-subtle mt-12 py-12">
      <div className="flex container justify-center mx-auto py-8">
        <Link href="/" className="p-8">
          <Image src={Logo} width={100} alt="logo for tyandor.com" />
        </Link>
      </div>
      <div className="container mx-auto px-4 text-center">
        <p>&and;&or; &copy; {new Date().getFullYear()} Tyler Andor. All rights reserved.</p>
      </div>
    </footer>
  )
}