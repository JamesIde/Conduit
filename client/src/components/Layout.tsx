import React from "react";
import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }: { children: any }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
