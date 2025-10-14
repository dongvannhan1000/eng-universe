"use client";

import type React from "react";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  selectCaptureMode,
  setCaptureModeEnabled,
  setDefaultTags,
} from "../slices/captureModeSlice";

export function CaptureModeToggle() {
  const dispatch = useDispatch();
  const captureMode = useSelector(selectCaptureMode);
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tempTags, setTempTags] = useState<string[]>(captureMode.defaultTags);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset temp tags to current default tags when opening
      setTempTags(captureMode.defaultTags);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tempTags.includes(tag)) {
      setTempTags([...tempTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTempTags(tempTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    dispatch(setDefaultTags(tempTags));
    setOpen(false);
  };

  const handleToggle = (checked: boolean) => {
    dispatch(setCaptureModeEnabled(checked));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant={captureMode.enabled ? "default" : "outline"} size="lg" className="gap-2">
          <Camera className="size-4" />
          Capture Mode
          {captureMode.enabled && (
            <span className="ml-1 size-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Capture Mode Settings
          </DialogTitle>
          <DialogDescription>
            When enabled, new vocabulary entries will automatically use your preset tags.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="capture-mode-toggle" className="text-base">
                Enable Capture Mode
              </Label>
              <p className="text-sm text-muted-foreground">Auto-fill tags when adding new words</p>
            </div>
            <Switch
              id="capture-mode-toggle"
              checked={captureMode.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {/* Default Tags Configuration */}
          <div className="space-y-3">
            <Label htmlFor="default-tags">Default Tags</Label>
            <div className="flex gap-2">
              <Input
                id="default-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., daily-study, podcast"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>

            {tempTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                {tempTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {tempTags.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No default tags set. Add tags above to auto-fill them.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
