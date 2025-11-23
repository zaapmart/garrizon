import React, { useEffect, useRef } from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open]);

    const handleClose = () => {
        onOpenChange && onOpenChange(false);
    };

    return (
        <dialog
            ref={dialogRef}
            className="rounded-md p-0 bg-white shadow-lg w-full max-w-md"
            onCancel={handleClose}
        >
            {children}
        </dialog>
    );
};

export const DialogContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mb-4">{children}</div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-semibold">{children}</h2>
);

export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm text-gray-500">{children}</p>
);

export const DialogClose: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ asChild = false, children }) => {
    if (asChild) {
        return React.cloneElement(React.Children.only(children) as React.ReactElement, {
            onClick: (e: any) => {
                const dialog = (e.target as HTMLElement).closest('dialog');
                if (dialog) dialog.close();
            },
        });
    }
    return (
        <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
                const dialog = (e.target as HTMLElement).closest('dialog');
                if (dialog) dialog.close();
            }}
        >
            ✕
        </button>
    );
};
