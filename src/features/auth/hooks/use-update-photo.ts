import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export function useUpdatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            initialQuality: 0.8,
          };
          fileToUpload = await imageCompression(file, options);
        } catch {
          // If compression fails, fall back to uploading raw file
          fileToUpload = file;
        }
      }
      return await authApi.updatePhoto(fileToUpload);
    },
    onSuccess: (updatedUser) => {
      toast.success("Profile photo updated successfully");
      queryClient.setQueryData(queryKeys.me, updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: () => {
      toast.error("Failed to update profile photo. Please try another image.");
    },
  });
}
