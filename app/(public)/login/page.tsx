"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    if (username !== "admin" || password !== "1234") {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    setError("");
    router.push("/patient");
  };

  return (
    <div className="min-h-screen bg-white flex items-top justify-left p-6">
      <div className="w-[700px] h-[680px] bg-[#05548D]/30 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="bg-white rounded-full p-14 shadow-md mt-20">
            <Image
              src="/image/PhossLogo.png"
              alt="hospital-logo"
              width={240}
              height={240}
            />
          </div>

          <h1 className="text-white text-3xl font-bold mt-10 text-center">
            โรงพยาบาลโพธิ์ศรีสุวรรณ
          </h1>
        </div>
      </div>

      <div className="flex flex-col justify-center px-50 py-16">
        <h2 className="text-3xl font-bold mb-10">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-[#000000]/40">
              ชื่อผู้ใช้งาน
            </label>
            <input
              type="text"
              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className={`w-[400px] border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-Bamboo-100"
              }`}
            />
          </div>
          <div>
            <label className="block mb-2 text-[#000000]/40">รหัสผ่าน</label>

            <div className="relative w-[400px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="กรุณากรอกรหัสผ่าน"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`w-full border rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-Bamboo-100"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-[400px] bg-Bamboo-100 text-white font-semibold py-3 rounded-lg shadow-md transition cursor-pointer mt-2"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
