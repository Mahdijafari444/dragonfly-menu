const badgeColors = {
  green: "bg-dragonfly-green text-white",
  amber: "bg-dragonfly-amber text-white",
  blue: "bg-dragonfly-blue text-white",
  red: "bg-dragonfly-red text-white",
  gray: "bg-dragonfly-muted text-white",
  gold: "bg-dragonfly-gold text-dragonfly-dark",
  brown: "bg-dragonfly-brown text-white",
  "light-green": "bg-dragonfly-green-light/20 text-dragonfly-green",
  "light-gray": "bg-gray-100 text-gray-600",
};

export default function Badge({
  children,
  color = "green",
  className = "",
  pulse = false,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full
        ${badgeColors[color] || badgeColors.green}
        ${pulse ? "status-pulse" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
