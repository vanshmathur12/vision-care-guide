import { http } from './http';
import { PdfDocument, PdfDocumentListItem, PdfDocumentSchema, PdfDocumentListItemSchema } from './types';

export const documentsApi = {
  uploadDocument: async (file: File, description?: string): Promise<{ message: string; document: PdfDocument }> => {
    const formData = new FormData();
    formData.append('document', file);
    if (description) {
      formData.append('description', description);
    }

    const { data } = await http.post('/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      message: data.message,
      document: PdfDocumentSchema.parse(data.document),
    };
  },

  getMyDocuments: async (): Promise<PdfDocumentListItem[]> => {
    const { data } = await http.get('/my-documents');
    return data.map((doc: any) => PdfDocumentListItemSchema.parse(doc));
  },

  deleteDocument: async (id: string): Promise<{ message: string }> => {
    const { data } = await http.delete(`/documents/${id}`);
    return data;
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const { data } = await http.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  },
};
