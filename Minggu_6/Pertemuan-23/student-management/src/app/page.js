import Dashboard from "@/app/dashboard/page";
import Image from "next/image";
import LoginPage from "./login/page";

export default function Home() {
  return (
    <div className="bg-gray-500 h-screen">
      <LoginPage />
    </div>
  );
}
