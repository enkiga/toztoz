import React from "react";
import NavigationBar from "@/app/_contentBlocks/NavigationBar";
import Footer from "@/app/_contentBlocks/Footer";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default layout;
