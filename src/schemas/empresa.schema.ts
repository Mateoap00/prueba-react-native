import { z } from 'zod';

// Schema de validación para el formulario de creación de empresa
export const esquemaCrearEmpresa = z.object({
  razonsocial: z
    .string()
    .min(3, 'La razón social debe tener al menos 3 caracteres')
    .max(100, 'La razón social no puede exceder 100 caracteres')
    .trim(),
  ruc: z
    .string()
    .min(13, 'El RUC debe tener 13 dígitos')
    .max(13, 'El RUC debe tener 13 dígitos')
    .regex(/^\d+$/, 'El RUC solo debe contener números')
    .trim(),
  contacto: z
    .string()
    .min(3, 'El nombre de contacto debe tener al menos 3 caracteres')
    .max(100, 'El nombre de contacto no puede exceder 100 caracteres')
    .trim(),
  telefono: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(10, 'El teléfono no puede exceder 10 dígitos')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono contiene caracteres inválidos')
    .trim(),
});

// Tipo inferido del schema
export type FormularioCrearEmpresa = z.infer<typeof esquemaCrearEmpresa>;
