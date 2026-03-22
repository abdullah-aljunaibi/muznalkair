import Image from "next/image";

interface MuznLogoProps {
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export default function MuznLogo({
  size = 48,
  className = "",
  ariaLabel = "شعار مقرأة مُزن الخير",
}: MuznLogoProps) {
  return (
    <Image
      src="/logo-muzn.png"
      alt={ariaLabel}
      width={size}
      height={Math.round(size * 1.64)}
      className={className}
      priority
      style={{ objectFit: "contain", height: size, width: "auto" }}
    />
  );
}
