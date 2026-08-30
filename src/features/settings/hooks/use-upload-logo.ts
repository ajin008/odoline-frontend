import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { configApi } from "../api/config-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export function useUploadLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        try {
          const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            initialQuality: 0.9,
            fileType: file.type,
          };
          fileToUpload = await imageCompression(file, options);
        } catch {
          fileToUpload = file;
        }
      }
      return await configApi.uploadLogo(fileToUpload);
    },
    onSuccess: () => {
      toast.success("Logo updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.config });
    },
    onError: (err: unknown) => {
      if (isAxiosError(err)) {
        const code = err.response?.data?.error?.code;
        const message = err.response?.data?.error?.message;

        if (code === "VALIDATION_ERROR") {
          toast.error(message || "Please choose a valid image");
        } else if (code === "FILE_UPLOAD_FAILED") {
          toast.error(message || "Upload failed, try again");
        } else {
          toast.error(message || "Failed to update logo");
        }
      } else {
        toast.error("Failed to update logo");
      }
    },
  });
}
