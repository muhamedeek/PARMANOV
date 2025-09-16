
// Simple stubs to replace shadcn/ui components so the page runs standalone.
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; }> =
  ({ className = '', ...props }) => <button {...props} className={className}/>;

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> =
  ({ className = '', children }) => <div className={className}>{children}</div>;

export const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> =
  ({ className = '', children }) => <div className={className}>{children}</div>;

export const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> =
  ({ className = '', children }) => <div className={className}>{children}</div>;

export const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> =
  ({ className = '', children }) => <div className={className}>{children}</div>;
