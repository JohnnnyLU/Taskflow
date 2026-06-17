import { LoginForm } from "@/features/auth/LoginForm";
import { PublicOnlyRoute } from "@/features/auth/PublicOnlyRoute";

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginForm />
    </PublicOnlyRoute>
  );
}
