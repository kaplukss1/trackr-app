"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditApplicationDialog } from "./edit-application-dialog";
import { DeleteApplicationButton } from "./delete-application-button";

export function ApplicationRowActions({ app }: { app: any }) {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                        <Link href={`/applications/${app.id}`} className="cursor-pointer flex items-center">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                        </Link>
                    </DropdownMenuItem>

                    {/* Trigger Modal Edit */}
                    <DropdownMenuItem onSelect={() => setShowEdit(true)} className="cursor-pointer flex items-center">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>

                    {/* Trigger Alert Hapus */}
                    <DropdownMenuItem onSelect={() => setShowDelete(true)} className="cursor-pointer flex items-center text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 
        Kita panggil komponen modalnya di sini, tapi kita berikan props 
        agar mereka bisa dikontrol (Open/Close) dari Dropdown 
      */}
            <div className="hidden">
                {/* Trik: render dialog di dalam hidden div, kontrol via state */}
            </div>

            <EditApplicationDialog
                app={app}
                open={showEdit}
                onOpenChange={setShowEdit}
            />

            <DeleteApplicationButton
                id={app.id}
                open={showDelete}
                onOpenChange={setShowDelete}
            />

        </>

    );
}