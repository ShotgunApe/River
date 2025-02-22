'use client'

import Image from 'next/image'
import Link from 'next/link'

import { getReq } from './utils/test'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="wrapper" className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div onClick={(getReq)} id="map">
        </div>
      </div>
    </main>
  )
}
