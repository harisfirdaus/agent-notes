import { AuthForm } from "@/components/auth/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    redirectedFrom?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return <AuthForm mode="login" redirectedFrom={params.redirectedFrom} />;
}
