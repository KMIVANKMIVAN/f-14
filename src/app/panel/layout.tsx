import { Metadata } from "next";
import MenuLateral from "@/components/MenuLateral";
export const metadata: Metadata = {
  title: "Admintracion",
  description: "Sindicato 14 de septiembre",
};

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MenuLateral>{children}</MenuLateral>
    </div>
  );
}
