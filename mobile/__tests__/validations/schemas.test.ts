import { validateForm, loginSchema, registerSchema, createJobSchema } from '../../src/validations/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = { email: 'test@example.com', password: '123456' };
      const result = validateForm(loginSchema, data);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid-email', password: '123456' };
      const result = validateForm(loginSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe('Email inválido');
    });

    it('should reject short password', () => {
      const data = { email: 'test@example.com', password: '123' };
      const result = validateForm(loginSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.password).toBe('La contraseña debe tener al menos 6 caracteres');
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };
      const result = validateForm(registerSchema, data);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: 'different',
      };
      const result = validateForm(registerSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.confirmPassword).toBe('Las contraseñas no coinciden');
    });

    it('should reject short name', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };
      const result = validateForm(registerSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBe('El nombre debe tener al menos 2 caracteres');
    });
  });

  describe('createJobSchema', () => {
    it('should validate correct job data', () => {
      const data = {
        serviceId: 'service-123',
        problemDescription: 'El auto no enciende y necesita diagnóstico',
        address: 'Calle Principal 123',
        latitude: -34.6037,
        longitude: -58.3816,
      };
      const result = validateForm(createJobSchema, data);
      expect(result.success).toBe(true);
    });

    it('should reject missing serviceId', () => {
      const data = {
        serviceId: '',
        problemDescription: 'El auto no enciende',
        address: 'Calle Principal 123',
        latitude: -34.6037,
        longitude: -58.3816,
      };
      const result = validateForm(createJobSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.serviceId).toBe('Debe seleccionar un servicio');
    });

    it('should reject short description', () => {
      const data = {
        serviceId: 'service-123',
        problemDescription: 'Corto',
        address: 'Calle Principal 123',
        latitude: -34.6037,
        longitude: -58.3816,
      };
      const result = validateForm(createJobSchema, data);
      expect(result.success).toBe(false);
      expect(result.errors?.problemDescription).toBe('Describa el problema con al menos 10 caracteres');
    });
  });
});
