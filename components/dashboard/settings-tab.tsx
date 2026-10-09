"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "@/lib/auth-context";
import { updateMe, changePassword } from "@/lib/api";
import { GatedCard } from "./gated-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings } from "lucide-react";

export function SettingsTab() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  if (!user) return <GatedCard feature="Settings" />;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      await updateMe({ first_name: firstName, last_name: lastName, email });
      setProfileMessage("Profile updated.");
    } catch {
      setProfileMessage("Couldn't update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMessage("Password updated.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.old_password) {
        setPasswordMessage("Incorrect current password.");
      } else {
        setPasswordMessage("Couldn't update password.");
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-3xl border bg-card p-6">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Settings className="w-4 h-4 text-muted-foreground" />
          Profile
        </span>
        <form onSubmit={handleProfileSave} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {profileMessage && (
            <p className="text-sm text-muted-foreground">{profileMessage}</p>
          )}
          <Button type="submit" disabled={profileSaving} className="rounded-full cursor-pointer">
            {profileSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <span className="text-sm font-semibold">Change Password</span>
        <form onSubmit={handlePasswordSave} className="mt-4 space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {passwordMessage && (
            <p className="text-sm text-muted-foreground">{passwordMessage}</p>
          )}
          <Button type="submit" disabled={passwordSaving} className="rounded-full cursor-pointer">
            {passwordSaving ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
