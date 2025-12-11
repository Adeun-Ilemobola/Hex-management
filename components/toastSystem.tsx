import { toast } from 'sonner';
import { AlertTriangle, ArrowUp, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon: boolean;
  action?: () => void;
}

const showToastSystem = ({ title, description, buttonText, buttonIcon, action }: Omit<Toast, 'id'>) => {
  toast.custom((t) => (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right duration-300">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>
            <button
              onClick={() => toast.dismiss(t)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
          {buttonText && (
            <button
              onClick={() => {
                action?.();
                toast.dismiss(t);
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 dark:from-orange-400 dark:to-red-400 dark:hover:from-orange-500 dark:hover:to-red-500 text-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {buttonIcon && <ArrowUp className="h-3 w-3 mr-1" />}
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  ), {
    duration: 15000,
    position: 'top-right',
  });
};

export default showToastSystem;
