
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
