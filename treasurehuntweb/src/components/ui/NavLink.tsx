"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavLink = ({
  children,
  href,
  activeClassName,
  nonActiveClassName,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  href: string;
  activeClassName?: string;
  nonActiveClassName?: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive =
    // pathname.endsWith(href) || (href.includes(pathname) && pathname !== "/");
    pathname.endsWith(href) && pathname !== "/";
  const newClassName = `${isActive ? activeClassName : nonActiveClassName} ${className}`;
  return (
    <Link href={href} className={newClassName} {...rest}>
      {children}
    </Link>
  );
};
export default NavLink;