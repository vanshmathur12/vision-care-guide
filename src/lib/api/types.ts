import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const SigninResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});
export type SigninResponse = z.infer<typeof SigninResponseSchema>;

export const SignupResponseSchema = z.object({
  message: z.string(),
  userId: z.string(),
});
export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const AppointmentSchema = z.object({
  _id: z.string().optional(),
  patient: z.string().optional(),
  doctorId: z.string(),
  hospitalId: z.string(),
  hospitalGroupId: z.string().optional(),
  cityId: z.string(),
  date: z.string(),
  time: z.string(),
  reason: z.string().optional(),
  doctorName: z.string().optional(),
  doctorSpecialization: z.string().optional(),
  hospitalName: z.string().optional(),
  qrCode: z.string().optional(),
  qrImage: z.string().optional(),
  numericCode: z.string().optional(),
  status: z.enum(["pending", "cancelled", "confirmed"]).optional(),
  confirmationStatus: z.enum(["pending", "cancelled", "confirmed"]).optional(),
  createdAt: z.string().optional(),
});
export type Appointment = z.infer<typeof AppointmentSchema>;

export const PdfDocumentListItemSchema = z.object({
  _id: z.string(),
  filename: z.string(),
  uploadedAt: z.string(),
});
export type PdfDocumentListItem = z.infer<typeof PdfDocumentListItemSchema>;

export const PdfDocumentSchema = z.object({
  _id: z.string(),
  filename: z.string(),
  originalName: z.string().optional(),
  path: z.string().optional(),
  size: z.number().optional(),
  mimetype: z.string().optional(),
  uploadedBy: z.string().optional(),
  user: z.string().optional(),
  description: z.string().optional(),
  processingStatus: z.string().optional(),
  uploadedAt: z.string(),
});
export type PdfDocument = z.infer<typeof PdfDocumentSchema>;

export const DoctorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  specialization: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
});
export type Doctor = z.infer<typeof DoctorSchema>;

export const HospitalSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
});
export type Hospital = z.infer<typeof HospitalSchema>;

export const CitySchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type City = z.infer<typeof CitySchema>;

export const SpecializationSchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type Specialization = z.infer<typeof SpecializationSchema>;
