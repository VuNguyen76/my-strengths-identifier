
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';
import { supabase } from '@/integrations/supabase/client';

// Mock components that might cause issues
vi.mock('@/components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));

vi.mock('@/components/ui/waiting-interface', () => ({
  default: ({ title, onCancel }: any) => (
    <div data-testid="waiting-interface">
      <h2>{title}</h2>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '1' }, session: {} },
      error: null
    } as any);
    
    render(<Login />);
    
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('waiting-interface')).toBeInTheDocument();
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' }
    } as any);
    
    render(<Login />);
    
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    });
  });

  it('handles Facebook login', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
      data: { provider: 'facebook', url: 'https://facebook.com' },
      error: null
    } as any);
    
    render(<Login />);
    
    const facebookButton = screen.getByRole('button', { name: /facebook/i });
    await user.click(facebookButton);
    
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  });

  it('handles Google login', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
      data: { provider: 'google', url: 'https://google.com' },
      error: null
    } as any);
    
    render(<Login />);
    
    const googleButton = screen.getByRole('button', { name: /google/i });
    await user.click(googleButton);
    
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  });
});
