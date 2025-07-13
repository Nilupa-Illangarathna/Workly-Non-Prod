"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function AdminPasswordVerification({
  userPassword,
}: {
  userPassword: string;
}) {
  const [inputPassword, setInputPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/verify-admin-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputPassword,
          userId: "WCS0001", // Replace with actual user ID from session
        }),
      });

      if (response.ok) {
        setIsVerified(true);
        setIsDialogOpen(false);
        toast.success("Verification successful!");
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setInputPassword("");
    }
  }, [isDialogOpen]);

  return (
    <div className="flex items-center gap-2">
      <Input
        type={isVerified ? "text" : "password"}
        value={userPassword ? userPassword : ""}
        disabled
        className="w-auto"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDialogOpen(true)}>
        {isVerified ? <Check /> : <Eye />}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Verification</DialogTitle>
            <DialogDescription>
              Enter admin password to continue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
              />
            </div>

            <Button
              onClick={verifyPassword}
              disabled={isLoading || !inputPassword}
              className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
