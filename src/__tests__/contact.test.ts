import { describe, it, expect } from 'vitest';
import { contactSchema, readContactForm } from '@/lib/contact-schema';

/** The brief form's rules, as the API route applies them. */
describe('Contact form validation', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    whatsapp: '',
    heard: 'Google search',
    needs: ['Website'],
    budget: '$500–1,000',
    message: 'This is a test message that is long enough.',
    honeypot: '',
    page: '/',
  };

  const fieldOf = (data: unknown) => {
    const result = contactSchema.safeParse(data);
    return result.success ? null : result.error.issues[0].path[0];
  };

  it('accepts a complete brief', () => {
    expect(contactSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts a brief without WhatsApp, needs or budget', () => {
    const { whatsapp: _w, needs: _n, budget: _b, ...data } = validData;
    expect(contactSchema.safeParse(data).success).toBe(true);
  });

  it('requires "How did you hear about us?"', () => {
    expect(fieldOf({ ...validData, heard: '' })).toBe('heard');
    expect(fieldOf({ ...validData, heard: '   ' })).toBe('heard');
  });

  it('accepts a WhatsApp number with +, spaces and dashes', () => {
    expect(contactSchema.safeParse({ ...validData, whatsapp: '+971 50-123 4567' }).success).toBe(true);
  });

  it('rejects a WhatsApp value that is not a phone number', () => {
    expect(fieldOf({ ...validData, whatsapp: 'call me' })).toBe('whatsapp');
    expect(fieldOf({ ...validData, whatsapp: '123' })).toBe('whatsapp');
  });

  it('rejects a name shorter than 2 characters', () => {
    expect(fieldOf({ ...validData, name: 'J' })).toBe('name');
  });

  it('rejects an invalid email address', () => {
    expect(fieldOf({ ...validData, email: 'not-an-email' })).toBe('email');
  });

  it('rejects a message shorter than 10 characters', () => {
    expect(fieldOf({ ...validData, message: 'Too short' })).toBe('message');
  });

  it('rejects a filled honeypot (bot detection)', () => {
    expect(fieldOf({ ...validData, honeypot: 'bot-value' })).toBe('honeypot');
  });

  it('rejects overlong fields', () => {
    expect(fieldOf({ ...validData, message: 'a'.repeat(5001) })).toBe('message');
    expect(fieldOf({ ...validData, subject: 'a'.repeat(201) })).toBe('subject');
    expect(fieldOf({ ...validData, needs: Array(9).fill('Website') })).toBe('needs');
  });

  it('reads every checked need from the form', () => {
    const form = new FormData();
    form.append('needs', 'Website');
    form.append('needs', 'Online store');
    form.append('heard', 'A referral');
    const data = readContactForm(form);
    expect(data.needs).toEqual(['Website', 'Online store']);
    expect(data.heard).toBe('A referral');
    expect(data.whatsapp).toBe('');
  });
});
