import { redirect } from "next/navigation";

import { HeroSection } from "@/components/landing/hero-section";

type HomePageProps = {
  searchParams: Promise<{
    code?: string;
    error_code?: string;
    error_description?: string;
    next?: string;
    sb?: string;
    token_hash?: string;
    type?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  if (
    params.code ||
    params.token_hash ||
    params.type ||
    params.error_code ||
    params.error_description ||
    params.sb !== undefined
  ) {
    const callbackParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        callbackParams.set(key, value);
      }
    }

    redirect(`/auth/confirm?${callbackParams.toString()}`);
  }

  return <HeroSection />;
}
