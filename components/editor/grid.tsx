interface GridProps {
    size: number
    color?: string
}

export function Grid({ size = 10, color = "currentColor" }: GridProps) {
    return (
        <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none opacity-10"
        >
        <defs>
            <pattern id="grid" width={size} height={size} patternUnits="userSpaceOnUse">
            <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    )
}  