import { notFound } from "next/navigation";

const content: Record<string, { label: string; title: string; text: string }> = {
  about: { label: "Our practice", title: "About Attri Associates", text: "Led by CE. SS Attri, our practice brings together scientific Vastu, architecture and design coordination for clients in India and worldwide." },
  services: { label: "What we do", title: "Integrated design services", text: "We advise on residential, commercial, industrial and institutional Vastu, architecture, structural design, interiors, floor planning and 2D/3D modelling." },
  projects: { label: "Our work", title: "Projects & case studies", text: "A curated collection of projects and client transformations will be published here as our CMS goes live." },
  consultants: { label: "Our team", title: "Talk to a consultant", text: "Choose the right expert for your project. Online and phone consultations will be available after our secure booking system is connected." },
  "privacy-policy": { label: "Legal", title: "Privacy policy", text: "Privacy and data-handling terms will be published here before customer accounts and forms are activated." },
  "terms-and-conditions": { label: "Legal", title: "Terms & conditions", text: "Service and platform terms will be published here before online transactions are enabled." }
};

export function generateStaticParams() { return Object.keys(content).map((slug) => ({ slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = content[slug];
  if (!page) notFound();
  return <main><section className="hero"><div className="container"><div className="eyebrow">{page.label}</div><h1>{page.title}</h1><p className="lead">{page.text}</p><div className="actions"><a className="button gold" href="mailto:attriassociates99@gmail.com">Email our team</a><a className="button outline" href="/">Back to home</a></div></div></section></main>;
}
