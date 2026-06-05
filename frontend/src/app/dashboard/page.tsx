import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { DashboardContent } from "@/widgets/DashboardContent";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
