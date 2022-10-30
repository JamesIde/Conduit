import React from "react";
import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }: { children: any }) {
  return (
    <div className="h-[100vh]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
