import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import SignupForm from "@/components/organisms/SignupForm";
import { ISignupRequest, IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";

interface ISignupPageProps {
  setUser: (user: IUser) => void;
}

const SignupPage: NextPage<ISignupPageProps> = ({ setUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (signupData: ISignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authUseCase.signup.execute(signupData);
      setUser(response.user);
      router.push("/"); // Redirect to home page after successful signup
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
