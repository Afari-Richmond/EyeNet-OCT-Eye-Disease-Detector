import { Raleway } from "next/font/google";

const raleway = Raleway({
  variable: "--font-raleway",
  weight: "600",
  subsets: ["latin"],
});

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${raleway.variable} font-raleway`}>{children}</div>;
}
