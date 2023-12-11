"use client"
import Image from 'next/image'
import { useState } from 'react'

const Heart = () => {
    const [liked, setLiked] = useState(false);

  return (
    <Image
    src={liked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
    alt='heart'
    width={24}
    height={24}
    className='cursor-pointer object-contain transition-all'
    onClick={() => setLiked(!liked)}
  />
  )
}

export default Heart