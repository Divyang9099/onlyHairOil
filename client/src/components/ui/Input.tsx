import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
        const reactId = React.useId();
        const inputId = id ?? `input-${reactId}`;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-neutral-700 font-body"
                    >
                        {label}
                        {props.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}

                <div className="relative flex items-center">
                    {leftIcon && (
                        <span className="absolute left-3 text-neutral-400">{leftIcon}</span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={[
                            'w-full rounded-lg border bg-white px-4 py-2.5 text-base font-body text-neutral-900',
                            'transition-all duration-150 ease-in-out',
                            'placeholder:text-neutral-400',
                            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
                            error
                                ? 'border-destructive focus:ring-destructive/40'
                                : 'border-neutral-300 hover:border-neutral-400',
                            leftIcon ? 'pl-10' : '',
                            rightIcon ? 'pr-10' : '',
                            className,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />

                    {rightIcon && (
                        <span className="absolute right-3 text-neutral-400">{rightIcon}</span>
                    )}
                </div>

                {error && (
                    <p id={`${inputId}-error`} className="text-sm text-destructive font-body">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-sm text-neutral-500 font-body">
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
