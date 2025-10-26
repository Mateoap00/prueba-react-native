import { z } from 'zod';

// Schema de validación para el formulario de creación de usuario
export const esquemaCrearUsuario = z.object({
  identificacion: z
    .string()
    .min(10, 'La identificación debe tener al menos 10 caracteres')
    .max(10, 'La identificación no puede exceder 10 caracteres')
    .trim(),
  nombres: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  apellidos: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .trim(),
  email: z.string().email('Debe ser un email válido').trim().toLowerCase(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(20, 'La contraseña no puede exceder 20 caracteres'),
  telefono: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(10, 'El teléfono no puede exceder 10 dígitos')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono contiene caracteres inválidos')
    .trim(),
  direccion: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .trim(),
  role: z.string().min(1, 'Debe seleccionar un rol'),
  empresa: z.string().min(1, 'Debe tener un ID de empresa válido'),
});

// Tipo inferido del schema
export type FormularioCrearUsuario = z.infer<typeof esquemaCrearUsuario>;
