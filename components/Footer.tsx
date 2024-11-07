import { logoutAccount } from '@/lib/actions/user.actions'
import { Router } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'


const Footer = ({ user, type = 'desktop' }: FooterProps) => {

  const router = useRouter()

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) router.push('/sign-in')
  }
  return (
    <footer className='footer'>
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className='text-xl font-bold text-gray-700'>
          {user?.firstName[0]}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
        <h2 className='text-14 truncate text-gray-700 font-semibold'>
          {user?.firstName}
        </h2>
        <p className='text-14 truncate font-normal text-gray-600'>
          {user?.email}
        </p>
      </div>
      <div className='footer_image' onClick={handleLogOut}>
        <Image
          src='icons/logout.svg'
          alt='jsm'
          fill
        />
      </div>
    </footer>
  )
}

export default Footer