
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Register from '@/pages/Register';
import { supabase } from '@/integrations/supabase/client';

// Mock components
vi.mock('@/components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));

vi.mock('@/components/auth/EmailConfirmationLoading', () => ({
  default: ({ email, onComplete }: any) => (
    <div data-testid="email-confirmation">
      <span>Email confirmation for {email}</span>
      <button onClick={onComplete}>Complete</button>
    </div>
  )
}));

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    render(<Register />);
    
    expect(screen.getByText('Đăng ký')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /đăng ký/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Tên phải có ít nhất 2 ký tự')).toBeInTheDocument();
    });
  });

  it('shows password mismatch error', async () => {
    const user = userEvent.setup();
    render(<Register />);
    
    await user.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test User');
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'differentpassword');
    
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Mật khẩu không khớp')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: '1' }, session: null },
      error: null
    } as any);
    
    render(<Register />);
    
    await user.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test User');
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');
    
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-confirmation')).toBeInTheDocument();
    });
    
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User',
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
  });

  it('handles registration error', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already registered' }
    } as any);
    
    render(<Register />);
    
    await user.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test User');
    await user.type(screen.getByPlaceholderText('email@example.com'), 'existing@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');
    
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));
    
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });
  });

  it('handles Facebook registration', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
      data: { provider: 'facebook', url: 'https://facebook.com' },
      error: null
    } as any);
    
    render(<Register />);
    
    const facebookButton = screen.getByRole('button', { name: /facebook/i });
    await user.click(facebookButton);
    
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  });
});
