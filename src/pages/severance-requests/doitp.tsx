'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/ui/PageLayout';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { Sidebar } from '@/components/ui/sidebar';
import { Navbar } from '@/components/ui/navbar';
interface Student {
  id: number;
  name: string;
  department: string;
}

const ALLOWED_ROLES = ['doitp'];

export default function DoitpClearancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([{
    id: 101,
    name: 'Ahmet Yılmaz',
    department: 'Computer Engineering',
  }, {
    id: 102,
    name: 'Ayşe Demir',
    department: 'Mechanical Engineering',
  }, {
    id: 103,
    name: 'Mehmet Kaya',
    department: 'Electrical Engineering',
  }]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      router.push('/unauthorized'); // izin yoksa yönlendir
    } else {
      setUser(currentUser); // izin varsa user'ı ayarla
    }
  }, []);

  const handleApprove = (id: number) => {
    alert(`✅ Student ID ${id} DOITP clearance approved.`);
  };

  const handleReject = (id: number) => {
    alert(`❌ Student ID ${id} DOITP clearance rejected.`);
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />

      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={handleLogout}
          onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-4xl w-full mx-auto py-10 px-4">

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">DOITP Clearance Requests</CardTitle>
            <p className="text-sm text-muted-foreground">Review and process clearance requests for the DOITP department.</p>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2">{student.id}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.department}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 text-xs"
                        onClick={() => handleApprove(student.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 text-xs"
                        onClick={() => handleReject(student.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  </div>
  );
}