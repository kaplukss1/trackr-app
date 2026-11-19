"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateApplication } from "@/app/(app)/applications/actions";

const formSchema = z.object({
  company_name: z.string().min(1, "Required"),
  position: z.string().min(1, "Required"),
  status: z.enum(["Applied", "Screening", "Interview", "Offer", "Rejected"]),
  applied_date: z.string(),
  job_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

export function EditApplicationDialog({ app }: { app: any }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      position: "",
      status: "Applied",
      applied_date: "",
      job_url: "",
      location: "",
      salary: "",
      notes: "",
    },
  });

  // Isi form dengan data aplikasi saat modal dibuka
  useEffect(() => {
    if (open && app) {
      reset({
        company_name: app.company_name,
        position: app.position,
        status: app.status,
        applied_date: app.applied_date,
        job_url: app.job_url || "",
        location: app.location || "",
        salary: app.salary || "",
        notes: app.notes || "",
      });
    }
  }, [open, app, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const result = await updateApplication(app.id, values);
    setIsSubmitting(false);

    if (result.error) {
      toast.error("Gagal mengupdate: " + result.error);
    } else {
      toast.success("Aplikasi berhasil diupdate!");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Aplikasi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input {...register("company_name")} />
              {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input {...register("position")} />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status *</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Screening">Screening</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Applied Date *</Label>
              <Input type="date" {...register("applied_date")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...register("location")} />
            </div>
            <div className="space-y-2">
              <Label>Salary Range</Label>
              <Input {...register("salary")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job URL</Label>
            <Input {...register("job_url")} />
            {errors.job_url && <p className="text-xs text-destructive">{errors.job_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...register("notes")} className="h-20" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}