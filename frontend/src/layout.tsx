import { Outlet } from "react-router";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* nested routes render here */}
      </main>
      <Toaster richColors={true} closeButton={true} expand={true} />
    </>
  );
}
