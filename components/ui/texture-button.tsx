import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

type TextureButtonVariant = "primary" | "accent" | "secondary" | "destructive" | "minimal" | "icon";
type TextureButtonSize = "sm" | "default" | "lg" | "icon";

interface TextureButtonBaseProps {
  variant?: TextureButtonVariant;
  size?: TextureButtonSize;
  children: ReactNode;
  color?: string;
  textColor?: string;
  borderColor?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  className?: string;
  style?: CSSProperties;
  type?: string;
}

type TextureButtonProps = TextureButtonBaseProps &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "color" | "size" | "style" | "type">)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "color" | "href" | "style">)
  );

const variantClasses: Record<TextureButtonVariant, string> = {
  primary:
    "border border-zinc-800 bg-gradient-to-b from-zinc-700 to-zinc-950 text-white shadow-[0_3px_0_#18181b,0_8px_16px_rgba(24,24,27,0.2)] hover:from-zinc-600 hover:to-zinc-900",
  accent:
    "border border-orange-700 bg-gradient-to-b from-orange-500 to-orange-700 text-white shadow-[0_3px_0_#9a3412,0_8px_16px_rgba(234,88,12,0.22)] hover:from-orange-400 hover:to-orange-600",
  secondary:
    "border border-zinc-300 bg-gradient-to-b from-white to-zinc-100 text-zinc-800 shadow-[0_3px_0_#d4d4d8,0_8px_16px_rgba(24,24,27,0.08)] hover:from-white hover:to-zinc-50",
  destructive:
    "border border-rose-800 bg-gradient-to-b from-rose-500 via-red-600 to-red-700 text-white shadow-[0_3px_0_#9f1239,0_9px_18px_rgba(225,29,72,0.25)] hover:from-rose-400 hover:via-red-500 hover:to-red-600",
  minimal:
    "border border-transparent bg-transparent text-zinc-700 shadow-none hover:border-zinc-200 hover:bg-zinc-100",
  icon:
    "border border-zinc-300 bg-gradient-to-b from-white to-zinc-100 text-zinc-700 shadow-[0_2px_0_#d4d4d8,0_6px_12px_rgba(24,24,27,0.08)] hover:from-white hover:to-zinc-50",
};

const sizeClasses: Record<TextureButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  default: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
  icon: "h-10 w-10 p-0",
};

export function TextureButton({
  variant = "primary",
  size = "default",
  type = "button",
  className = "",
  children,
  color,
  textColor,
  borderColor,
  width,
  height,
  href,
  style,
  ...props
}: TextureButtonProps) {
  const overrideStyle: CSSProperties = {
    ...style,
    ...(color ? { background: color } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor } : color ? { borderColor: color } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
  const sharedClassName = `texture-button group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  const content = <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>;

  if (href) {
    const anchorProps = props as unknown as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
    return (
      <Link href={href} className={sharedClassName} style={overrideStyle} {...anchorProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type === "submit" || type === "reset" ? type : "button"}
      className={sharedClassName}
      style={overrideStyle}
      {...(props as Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "style" | "type">)}
    >
      {content}
    </button>
  );
}
