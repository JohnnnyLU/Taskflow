import { RegisterForm } from "@/features/auth/RegisterForm";
import { PublicOnlyRoute } from "@/features/auth/PublicOnlyRoute";

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <RegisterForm />
    </PublicOnlyRoute>
  );
}
