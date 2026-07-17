import { AuthProvider, useAuth } from './AuthProvider';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { ToastProvider, useToast } from './ToastProvider';

export function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export function useApp() {
  const auth = useAuth();
  const theme = useTheme();
  const toastCtx = useToast();

  return {
    ...auth,
    ...theme,
    toast: toastCtx?.toast,
  };
}
