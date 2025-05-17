import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import SignupForm from "@/components/organisms/SignupForm";
import { useSignup } from "@/application/hooks/useSignup";

const SignupPage: NextPage = () => {
  const { handleSignup, isLoading, error } = useSignup();

  return (
    <>
      <Head>
        <title>Sign Up | KUDOS App</title>
        <meta
          name="description"
          content="Create an account on KUDOS App and start recognizing your team members"
        />
      </Head>

      <AuthLayout title="Create Account">
        <SignupForm
          onSignup={handleSignup}
          isLoading={isLoading}
          error={error}
        />
      </AuthLayout>
    </>
  );
};

export default SignupPage;
