'use client'

import Image from "next/image"

export default function Header() {

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <header className="flex justify-center w-full z-50">
      <div className="flex justify-center w-full py-5 text-2xl lg:text-3xl font-semibold px-10 bg-primary">
        <button className="cursor-pointer" onClick={handleReload} aria-label="Reload Page">
          <Image
            src="/gymondoLogo.png"
            alt="Site Logo"
            width={50}
            height={40}
            priority
          />
        </button>
      </div>
    </header>
  )
}
