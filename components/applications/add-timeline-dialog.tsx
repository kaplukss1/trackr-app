"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addTimelineEvent } from "@/app/(app)/applications/actions";

export function AddTimelineDialog({ appId }: { appId: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Format tanggal default ke waktu sekarang (YYYY-MM-DDThh:mm)
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const [eventDate, setEventDate] = useState(now.toISOString().slice(0, 16));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await addTimelineEvent(appId, {
      title,
      description,
      event_date: eventDate,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error("Gagal menambah timeline: " + result.error);
    } else {
      toast.success("Timeline berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Tambah Riwayat Timeline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Judul Event *</Label>
            <Input 
              placeholder="e.g. Technical Interview" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea 
              placeholder="Catatan tambahan..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="h-20"
            />
          </div>
          <div className="space-y-2">
            <Label>Tanggal & Waktu *</Label>
            <Input 
              type="datetime-local" 
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)} 
              required 
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}