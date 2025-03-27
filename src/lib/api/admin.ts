// lib/api/admin.ts

export async function deleteAdmin(id: number) {
    const res = await fetch(`http://localhost:3001/admins/${id}`, {
      method: 'DELETE',
      credentials: 'include', // ⬅️ สำคัญถ้ามี auth
    });
  
    if (!res.ok) {
      throw new Error('Failed to delete admin');
    }
  
    return res.json();
  }
  