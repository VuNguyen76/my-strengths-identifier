
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Mail, Clock, Loader2 } from "lucide-react";

interface EmailConfirmationLoadingProps {
  email?: string;
  onComplete?: () => void;
}

const EmailConfirmationLoading = ({ email, onComplete }: EmailConfirmationLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Mail, label: "Đang gửi email xác nhận", duration: 2000 },
    { icon: Clock, label: "Đang chờ xác nhận từ email", duration: 3000 },
    { icon: CheckCircle, label: "Hoàn tất!", duration: 1000 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  const CurrentIcon = steps[currentStep]?.icon || Loader2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CurrentIcon className={`w-8 h-8 text-blue-600 ${currentStep < 2 ? 'animate-spin' : ''}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xác nhận email
          </h2>
          <p className="text-gray-600">
            {email ? `Chúng tôi đã gửi email xác nhận đến ${email}` : "Đang xử lý yêu cầu của bạn"}
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="w-full h-2 mb-4" />
          <p className="text-sm font-medium text-gray-700">
            {steps[currentStep]?.label}
          </p>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  index <= currentStep
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                <StepIcon className="w-4 h-4 mr-3" />
                <span className="text-sm">{step.label}</span>
                {index <= currentStep && (
                  <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Kiểm tra hộp thư đến và thư mục spam để tìm email xác nhận
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmailConfirmationLoading;
