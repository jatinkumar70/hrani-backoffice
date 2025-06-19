import React from 'react';
import * as LucideIcons from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconName } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add all Font Awesome icons to the library
library.add(fas, far);

interface AmenityIconProps {
    icon: string;
    size?: number;
}

const AmenityIcon: React.FC<AmenityIconProps> = ({ icon, size = 24 }) => {
    // Handle Font Awesome icons
    if (icon?.startsWith('fa-')) {
        // Extract the icon name and determine if it's a regular or solid icon
        const iconName = icon.replace('fa-', '');
        const prefix = iconName.startsWith('regular-') ? 'far' : 'fas';
        const name = iconName.replace(/^(regular|solid)-/, '') as IconName;
        return <FontAwesomeIcon icon={[prefix, name]} style={{ fontSize: size }} />;
    }

    // Handle Lucide icons
    const IconComponent = (LucideIcons as any)[icon];
    if (IconComponent) {
        return <IconComponent size={size} />;
    }

    // Fallback icon
    return (
        <svg
            className="w-6 h-6"
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" fill="none" />
            <path d="M12 7v5m0 4v.01m0 0h.01m-.01 0h-.01" />
        </svg>
    );
};

export default AmenityIcon; 