export type NavItem = {
  label: string;
  href: string;
};

export type NavSection = {
  id: string;
  label: string;
  href: string;
  featured?: boolean;
  children: NavItem[];
};
