import { Home } from "lucide-react";

export type TNavLink = {
  id: number;
  name: string;
  href: string;
  icon?: React.ReactNode;
};

export const navLinks = [{ id: 1, name: "Home", href: "/", icon: <Home /> }];

export type TMenu = {
  id: number;
  name: string;
  path: string;
};

export const menu = [
  { id: 1, name: "Home", path: "/" },
  {
    id: 2,
    name: "Book Slot",
    path: "/booking/new",
  },
];


  export const resources = [
    "Meeting Room",
    "Conference Room",
    "Training Room",
    "Collaboration Space",
    "Event Space",
  ];