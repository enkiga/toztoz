import React from "react";
import Image from "next/image";

// get current year
const year = new Date().getFullYear();

const EmailBody = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="w-full ">
        <Image src="/TozTozBanner.png" alt="logo" width={100} height={50} />
      </section>
      {/* Body */}
      {/* Footer */}
        <section className="w-full">
            <p>© {year} TozToz. All rights reserved.</p>
        </section>
    </div>
  );
};

export default EmailBody;
