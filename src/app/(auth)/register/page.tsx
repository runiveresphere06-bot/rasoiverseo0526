import { Suspense } from "react";
import { RegisterFormContent } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background">Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
