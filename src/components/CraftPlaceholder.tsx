import Image from "next/image";
import type { CraftType } from "@/types";

interface CraftPlaceholderProps {
  craftType: CraftType;
  label: string;
  className?: string;
}

const IMAGE_SRC: Record<CraftType, string> = {
  도자기: "/images/pottery.svg",
  나전칠기: "/images/najeon.svg",
  보자기: "/images/bojagi.svg",
  목공예: "/images/woodcraft.svg",
};

/** Local SVG illustration used instead of product photos (no external requests). */
export function CraftPlaceholder({ craftType, label, className = "" }: CraftPlaceholderProps) {
  return (
    <Image
      src={IMAGE_SRC[craftType]}
      alt={label}
      width={160}
      height={120}
      unoptimized
      className={`h-auto w-full object-cover ${className}`}
    />
  );
}
