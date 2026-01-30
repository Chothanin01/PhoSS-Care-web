  "use client";

  import Image from "next/image";

  export function NavBar() {
    return (
      <header
        className="
          fixed top-6 z-30 h-18 bg-white rounded-lg
          shadow-[0_10px_20px_rgba(5,84,141,0.15)]
          left-20 right-6
          flex items-center px-4
        "
      >
        <div className="flex items-center h-16 px-2">
          <Image
            src="/image/PhossLogo.png"
            alt="Phoss care Logo"
            width={40}
            height={40}
            className="rounded-full mr-4"
          />
          <h1 className="text-3xl font-bold text-Bamboo-100 whitespace-nowrap">
            โรงพยาบาลโพธิ์ศรีสุวรรณ
          </h1>
        </div>
      </header>
    );
  }
