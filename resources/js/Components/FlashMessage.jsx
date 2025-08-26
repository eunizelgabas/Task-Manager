import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const FlashMessage = ({ type, message, onClose, autoClose = true, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose && duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            setTimeout(onClose, 300); // Wait for animation
        }
    };

    if (!isVisible) return null;

    const configs = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-600'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-600'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600'
        }
    };

    const config = configs[type] || configs.info;
    const Icon = config.icon;

    return (
        <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} border px-4 py-3 rounded-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                    <span className="text-sm font-medium">{message}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className={`${config.textColor} hover:${config.bgColor} p-1 h-auto`}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default FlashMessage;
