import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api/documents';
import { queryKeys } from '@/lib/utils/queryKeys';
import { toast } from 'sonner';
import { downloadBlob } from '@/lib/utils/download';

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) =>
      documentsApi.uploadDocument(file, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    },
  });
}

export function useMyDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.my,
    queryFn: () => documentsApi.getMyDocuments(),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.documents.my });
      
      const previousDocs = queryClient.getQueryData(queryKeys.documents.my);
      
      queryClient.setQueryData(queryKeys.documents.my, (old: any) =>
        old?.filter((doc: any) => doc._id !== id)
      );
      
      return { previousDocs };
    },
    onError: (error: any, _id, context) => {
      queryClient.setQueryData(queryKeys.documents.my, context?.previousDocs);
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
    onSuccess: () => {
      toast.success('Document deleted');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
    },
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
      const blob = await documentsApi.downloadDocument(id);
      downloadBlob(blob, filename);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download document');
    },
  });
}
