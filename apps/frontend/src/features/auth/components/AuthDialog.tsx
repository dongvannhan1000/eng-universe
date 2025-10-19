"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { setAuthActiveTab } from "../slices/authDialogSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { clearError } from "../slices/authSlice";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const dispatch = useDispatch();
  const activeTab = useSelector((s: RootState) => s.authDialog.authActiveTab);

  const handleOpenChange = (nextOpen: boolean) => {
    // clear ngay để lần mở tiếp theo không bị dính lỗi cũ
    dispatch(clearError());
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            Sign in to access your vocabularies and training missions
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => dispatch(setAuthActiveTab(v as typeof activeTab))}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <LoginForm
              onSuccess={() => onOpenChange(false)}
              // onForgotPassword={() => dispatch(setAuthActiveTab("forgot"))}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <RegisterForm
              onSuccess={() => onOpenChange(false)}
              onSwitchToLogin={() => dispatch(setAuthActiveTab("login"))}
            />
          </TabsContent>

          <TabsContent value="forgot" className="mt-4">
            <ForgotPasswordForm onBack={() => dispatch(setAuthActiveTab("login"))} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
