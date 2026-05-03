import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '../components/layout/Navbar'


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

export const metadata = {
  title: 'Avora — Buy. Sell. Connect.',
  description: 'The campus marketplace for University of Ilorin',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cormorant.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}