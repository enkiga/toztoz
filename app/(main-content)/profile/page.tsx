import React from "react";
import { UserProfile } from "@clerk/nextjs";

type Props = {};

const ProfilePage = (props: Props) => {
  return(
  <section className="container mx-auto pt-20 px-4">
    <UserProfile />;
  </section>)
};

export default ProfilePage;
