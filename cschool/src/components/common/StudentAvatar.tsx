import React from 'react';
import { User, Camera, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MEDIA_BASE_URL } from '../../services/api';

interface StudentAvatarProps {
    firstName: string;
    lastName: string;
    photo?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    isUpdating?: boolean;
    showCameraOverlay?: boolean;
    onClick?: () => void;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
    firstName,
    lastName,
    photo,
    size = 'md',
    className,
    isUpdating = false,
    showCameraOverlay = false,
    onClick
}) => {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

    const sizeClasses = {
        'xs': 'w-8 h-8 text-[10px]',
        'sm': 'w-10 h-10 text-xs',
        'md': 'w-12 h-12 text-sm',
        'lg': 'w-16 h-16 text-lg',
        'xl': 'w-24 h-24 text-2xl',
        '2xl': 'w-32 h-32 text-3xl',
    };

    const photoUrl = photo
        ? (photo.startsWith('http') ? photo : `${MEDIA_BASE_URL}${photo}`)
        : null;

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative inline-block rounded-full overflow-hidden border-2 border-white shadow-sm transition-all group",
                sizeClasses[size],
                onClick && "cursor-pointer hover:ring-4 hover:ring-primary-50",
                className
            )}
        >
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        isUpdating ? "opacity-40" : "opacity-100"
                    )}
                    onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            ) : (
                <div className={cn(
                    "w-full h-full flex items-center justify-center font-bold italic tracking-tighter bg-gradient-to-br from-primary-600 to-indigo-700 text-white",
                    isUpdating && "opacity-40"
                )}>
                    {initials || <User size={size === 'xs' ? 14 : 20} />}
                </div>
            )}

            {/* Updating State */}
            {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
                    <Loader2 className="animate-spin text-primary-600" size={size === 'xs' ? 12 : 20} />
                </div>
            )}

            {/* Camera Overlay */}
            {!isUpdating && showCameraOverlay && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white mb-0.5" size={size === 'xl' || size === '2xl' ? 24 : 16} />
                    <span className={cn(
                        "text-white font-black uppercase tracking-widest",
                        size === 'xl' || size === '2xl' ? "text-[10px]" : "text-[8px]"
                    )}>
                        Update
                    </span>
                </div>
            )}
        </div>
    );
};
