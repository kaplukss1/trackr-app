"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteApplication } from "@/app/(app)/applications/actions";

export function DeleteApplicationButton({
  id,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  showTrigger = false
}: {
  id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah modal tertutup otomatis sebelum proses selesai
    setIsDeleting(true);
    const result = await deleteApplication(id);
    setIsDeleting(false);

    if (result.error) {
      toast.error("Gagal menghapus: " + result.error);
    } else {
      toast.success("Aplikasi dihapus.");
      setOpen(false);
      if (window.location.pathname.includes('/applications/')) {
        router.push("/applications"); // Kembali ke tabel jika hapus dari halaman detail
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="bg-status-rejected-bg text-status-rejected hover:bg-status-rejected-border border border-status-rejected-border/50">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete App?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All application data and the timeline for this company will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}