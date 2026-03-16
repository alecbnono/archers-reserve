import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { useAuthStore } from "~/store/user.store";
import { logoutUser } from "~/features/auth/services/auth.service";
import { deleteAccount } from "~/features/profile/services/profile.service";
import { useAvatarUpload } from "~/features/profile/hooks/useAvatarUpload";
import { useBioEdit } from "~/features/profile/hooks/useBioEdit";

export default function ProfileHeader() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const {
        fileInputRef,
        isUploading,
        uploadError,
        openFilePicker,
        handleFileChange,
    } = useAvatarUpload();

    const {
        isEditing,
        bioDraft,
        isSaving,
        bioError,
        setBioDraft,
        startEditing,
        cancelEditing,
        saveBio,
    } = useBioEdit();

    async function handleLogout() {
        await logoutUser();
        logout();
        navigate("/");
    }

    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (!confirmed) return;

        const result = await deleteAccount();
        if (result.error) {
            alert(result.error);
            return;
        }

        logout();
        navigate("/");
    }

    const avatarSrc = currentUser?.profilePictureUrl || "/profile.png";

    return (
        <Card>
            <CardContent>
                <div className="p-6 flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative">
                        <img
                            src={avatarSrc}
                            alt=""
                            className="size-48 min-w-48 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/profile.png";
                            }}
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-0 right-0 rounded-full"
                            onClick={openFilePicker}
                            disabled={isUploading}
                        >
                            {isUploading ? "..." : "Edit"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="flex gap-8 items-center justify-between w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <h1 className="text-3xl font-bold">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h1>
                            {isEditing ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={bioDraft}
                                        onChange={(e) => setBioDraft(e.target.value)}
                                        maxLength={1000}
                                        rows={3}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        disabled={isSaving}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">{bioDraft.length}/280</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={saveBio} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="">{currentUser?.bio}</p>
                            )}
                            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
                            {bioError && <p className="text-red-500 text-sm">{bioError}</p>}
                        </div>
                        <div className="flex flex-col items-center gap-2 md:mx-10">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={isEditing ? cancelEditing : startEditing}
                                disabled={isSaving}
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </Button>
                            <Button className="bg-neutral-500 w-full" onClick={handleLogout}>Log out</Button>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        className="hover:text-white text-black"
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                    >
                                        Delete
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>WARNING: This will delete your account!</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
