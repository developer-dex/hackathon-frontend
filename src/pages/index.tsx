import React from "react";
import Head from "next/head";
import MainLayout from "@/components/templates/MainLayout";
import Card from "@/components/molecules/Card";
import Button from "@/components/atoms/Button";

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Project</title>
        <meta
          name="description"
          content="A starter Next.js project with layered architecture"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout title="Next.js Starter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Presentation Layer">
            <p className="mb-4">UI components and pages</p>
            <Button size="sm">Explore Components</Button>
          </Card>

          <Card title="Application Layer">
            <p className="mb-4">Business logic and state management</p>
            <Button variant="secondary" size="sm">
              Explore Logic
            </Button>
          </Card>

          <Card title="Domain Layer">
            <p className="mb-4">Core entities and business rules</p>
            <Button variant="outline" size="sm">
              Explore Entities
            </Button>
          </Card>

          <Card title="Infrastructure Layer">
            <p className="mb-4">External services and data access</p>
            <Button variant="danger" size="sm">
              Explore Services
            </Button>
          </Card>
        </div>
      </MainLayout>
    </>
  );
}
