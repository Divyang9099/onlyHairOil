import * as React from 'react';

type CardVariant = 'default' | 'elevated' | 'glass' | 'outlined';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white border border-neutral-200 shadow-sm',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-300',
    glass: 'glass-card shadow-md',
    outlined: 'bg-transparent border-2 border-brand-forest/20',
};

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => (
        <div
            ref={ref}
            className={[
                'rounded-xl overflow-hidden',
                variantStyles[variant],
                paddingStyles[padding],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {children}
        </div>
    ),
);

Card.displayName = 'Card';

// Sub-components
export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`mb-4 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`font-heading text-xl font-bold text-neutral-900 ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-neutral-500 font-body mt-1 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`font-body ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`mt-4 pt-4 border-t border-neutral-100 ${className}`} {...props}>
        {children}
    </div>
);
