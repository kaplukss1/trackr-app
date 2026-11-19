"use client";

import { Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addApplication } from "@/app/(app)/applications/actions";


const formSchema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    status: z.enum(["Applied", "Screening", "Interview", "Offer", "Rejected"]),
    applied_date: z.string(),
    job_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    location: z.string().optional(),
    salary: z.string().optional(),
    notes: z.string().optional(),
});

export function AddApplicationDialog() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "Applied",
            applied_date: "",
        },
    });
    useEffect(() => {
        if (open) {
            reset({
                company_name: "",
                position: "",
                status: "Applied",
                applied_date: new Date().toISOString().split("T")[0], // <-- Pindah ke sini
                job_url: "",
                location: "",
                salary: "",
                notes: "",
            });
        }
    }, [open, reset]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        const result = await addApplication(values);
        setIsSubmitting(false);

        if (result.error) {
            toast.error("Gagal menyimpan data: " + result.error);
        } else {
            toast.success("Aplikasi berhasil ditambahkan!");
            reset();
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Aplikasi Baru</DialogTitle>
                    <DialogDescription>
                        Catat lamaran pekerjaan baru ke dalam pipeline kamu.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Name *</Label>
                            <Input {...register("company_name")} placeholder="e.g. Stripe" />
                            {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Position *</Label>
                            <Input {...register("position")} placeholder="e.g. Product Designer" />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full h-11">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
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
                            <Input {...register("location")} placeholder="e.g. Remote" />
                        </div>
                        <div className="space-y-2">
                            <Label>Salary Range</Label>
                            <Input {...register("salary")} placeholder="e.g. $100k - $120k" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Job URL</Label>
                        <Input {...register("job_url")} placeholder="https://..." />
                        {errors.job_url && <p className="text-xs text-destructive">{errors.job_url.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea {...register("notes")} placeholder="Catatan tambahan..." className="h-20" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Menyimpan..." : "Simpan Aplikasi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}