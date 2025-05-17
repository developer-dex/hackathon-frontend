import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import LoginForm from "@/components/organisms/LoginForm";
import { IAuthCredentials, IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";

interface ILoginPageProps {
  setUser: (user: IUser) => void;
}

const LoginPage: NextPage<ILoginPageProps> = ({ setUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: IAuthCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authUseCase.login.execute(credentials);
      setUser(response.user);
      router.push("/"); // Redirect to home page after successful login
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | KUDOS App</title>
        <meta
          name="description"
          content="Login to KUDOS App and start recognizing your team members"
        />
      </Head>

      <AuthLayout title="Member Login">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
      </AuthLayout>
    </>
  );
};

export default LoginPage;
