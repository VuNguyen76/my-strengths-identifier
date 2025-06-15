
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface WaitingInterfaceProps {
  title: string;
  description: string;
  steps?: Array<{
    label: string;
    duration: number;
  }>;
  onRetry?: () => void;
  onCancel?: () => void;
  autoProgress?: boolean;
  status?: 'loading' | 'success' | 'error';
}

const WaitingInterface = ({
  title,
  description,
  steps = [
    { label: "Đang xử lý yêu cầu...", duration: 3000 },
    { label: "Hoàn tất!", duration: 1000 }
  ],
  onRetry,
  onCancel,
  autoProgress = true,
  status = 'loading'
}: WaitingInterfaceProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!autoProgress || status !== 'loading') return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [autoProgress, status]);

  useEffect(() => {
    if (!autoProgress || status !== 'loading') return;

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, steps[currentStep]?.duration || 3000);

    return () => clearInterval(stepTimer);
  }, [currentStep, steps, autoProgress, status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className={`mx-auto w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mb-4`}>
            {getStatusIcon()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {description}
          </p>
        </div>

        {status === 'loading' && autoProgress && (
          <div className="mb-6">
            <Progress value={progress} className="w-full h-2 mb-4" />
            <p className="text-sm font-medium text-gray-700">
              {steps[currentStep]?.label}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              Thao tác đã được hoàn tất thành công!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Hủy
            </Button>
          )}
          {onRetry && status === 'error' && (
            <Button onClick={onRetry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WaitingInterface;
