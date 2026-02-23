import * as React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
    narrow?: boolean; // max-w-3xl for articles / forms
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className = '', as: Tag = 'div', narrow = false, children, ...props }, ref) => (
        <Tag
            ref={ref}
            className={[
                'container-brand',
                narrow ? 'max-w-3xl' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {children}
        </Tag>
    ),
);

Container.displayName = 'Container';
