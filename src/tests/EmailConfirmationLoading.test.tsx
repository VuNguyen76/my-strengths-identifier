
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmailConfirmationLoading from '@/components/auth/EmailConfirmationLoading';

describe('EmailConfirmationLoading Component', () => {
  it('renders with email prop', () => {
    render(<EmailConfirmationLoading email="test@example.com" />);
    
    expect(screen.getByText('Xác nhận email')).toBeInTheDocument();
    expect(screen.getByText(/Chúng tôi đã gửi email xác nhận đến test@example.com/)).toBeInTheDocument();
  });

  it('renders without email prop', () => {
    render(<EmailConfirmationLoading />);
    
    expect(screen.getByText('Xác nhận email')).toBeInTheDocument();
    expect(screen.getByText('Đang xử lý yêu cầu của bạn')).toBeInTheDocument();
  });

  it('shows progress steps', () => {
    render(<EmailConfirmationLoading email="test@example.com" />);
    
    expect(screen.getByText('Đang gửi email xác nhận')).toBeInTheDocument();
    expect(screen.getByText('Đang chờ xác nhận từ email')).toBeInTheDocument();
    expect(screen.getByText('Hoàn tất!')).toBeInTheDocument();
  });

  it('calls onComplete when progress reaches 100%', async () => {
    const onComplete = vi.fn();
    render(<EmailConfirmationLoading email="test@example.com" onComplete={onComplete} />);
    
    // Wait for the progress to complete (it should complete in about 5 seconds based on the component logic)
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 6000 });
  });

  it('shows helpful tip', () => {
    render(<EmailConfirmationLoading email="test@example.com" />);
    
    expect(screen.getByText(/Kiểm tra hộp thư đến và thư mục spam/)).toBeInTheDocument();
  });
});
