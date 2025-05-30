"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import "@/app/globals.css";

interface Student {
  id: number;
  name: string;
  gpa: number;
  isEligible: boolean;
  invitationSent: boolean;
}

const dummyStudents: Student[] = [
  {
    id: 1,
    name: "Ayşe Yıldız",
    gpa: 3.75,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 2,
    name: "Mehmet Acar",
    gpa: 2.98,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 3,
    name: "Ali Ural",
    gpa: 2.95,
    isEligible: false,
    invitationSent: false,
  },
];

export default function GraduationCeremonyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "studentAffairs") {
      router.push("/unauthorized");
    } else {
      setUser(currentUser);
      setStudents([...dummyStudents]);
    }
  }, [router]);

  const handleConfirmSendInvitations = () => {
    const updated = students.map((s) =>
      s.isEligible ? { ...s, invitationSent: true } : s
    );
    setStudents(updated);
    setShowConfirmation(false);
    toast({
      title: "Invitations sent",
      description: "Invitations were sent to all eligible students.",
    });
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={handleLogout}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-4xl w-full mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Graduation Ceremony Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">GPA</th>
                    <th className="p-2 text-left">Eligible?</th>
                    <th className="p-2 text-left">Invitation Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-2">{s.id}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.gpa.toFixed(2)}</td>
                      <td className="p-2">{s.isEligible ? "✅" : "❌"}</td>
                      <td className="p-2">{s.invitationSent ? "✅" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-sky-700 hover:bg-sky-800"
                >
                  Generate Invitations
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* 🔒 Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold">Send Invitations?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to send graduation invitations to all
              eligible students?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConfirmSendInvitations}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
