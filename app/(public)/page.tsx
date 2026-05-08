"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      console.log("Login success:", data);

      if (data.token) {
        Cookies.set("token", data.token, { expires: 3 });
      }

      router.push("/patient");
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center p-4 lg:p-6 gap-6 lg:gap-16">
      <div className="w-full max-w-sm lg:w-175 lg:max-w-none lg:h-170 bg-[#05548D]/30 rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
        <div className="flex flex-col items-center justify-center p-6 lg:p-10 h-full">
          <div className="bg-white rounded-full p-8 lg:p-14 shadow-md mt-0 lg:mt-20">
            <Image
              src="/image/PhossLogo.png"
              alt="hospital-logo"
              width={120}
              height={120}
              className="w-30 h-30 lg:w-60 lg:h-60"
            />
          </div>

          <h1 className="text-white text-xl lg:text-3xl font-bold mt-6 lg:mt-10 text-center">
            โรงพยาบาลโพธิ์ศรีสุวรรณ
          </h1>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full max-w-sm lg:max-w-none lg:px-16 xl:px-24 py-6 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-10">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
          <div>
            <label className="block mb-2 text-[#000000]/40 font-medium text-sm lg:text-base">
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
              className={`w-full lg:w-100 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-Bamboo-100"
              }`}
            />
          </div>

          <div>
            <label className="block mb-2 text-[#000000]/40 font-medium text-sm lg:text-base">
              รหัสผ่าน
            </label>

            <div className="relative w-full lg:w-[400px]">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-100 bg-Bamboo-100 text-white font-semibold py-3 rounded-lg shadow-[0_15px_15px_-5px_rgba(5,84,141,0.5)] transition-all duration-300 cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}