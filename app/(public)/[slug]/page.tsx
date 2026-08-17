import { notFound } from "next/navigation";
const pages:Record<string,{title:string;description:string}>={
  about:{title:"About Attri Associates",description:"A multidisciplinary architecture and scientific Vastu practice led by CE. SS Attri."},
  services:{title:"Our Services",description:"Residential, commercial and industrial Vastu, architecture, structural, interior and modelling services."},
  projects:{title:"Projects & Case Studies",description:"A growing collection of spaces shaped by practical design and directional intelligence."},
  consultants:{title:"Meet Our Consultants",description:"Connect with qualified professionals for private, scheduled consultations."},
  blog:{title:"Ideas & Insights",description:"Practical perspectives on Vastu, architecture, structure and interior environments."},
  courses:{title:"Courses",description:"Structured learning in modern and Vedic Vastu science."},
  shop:{title:"Curated Shop",description:"Purposeful products selected for harmonious spaces."},
  contact:{title:"Contact Us",description:"Speak with our team in India or arrange a worldwide remote consultation."},
  faq:{title:"Frequently Asked Questions",description:"Answers about services, consultations, payments and delivery."},
  "privacy-policy":{title:"Privacy Policy",description:"How Attri Associates handles and protects personal information."},
  "terms-and-conditions":{title:"Terms & Conditions",description:"Terms governing use of this website and its services."}
};
export function generateStaticParams(){return Object.keys(pages).map(slug=>({slug}))}
export default async function ContentPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=pages[slug];if(!page)notFound();return <><section className="page-hero"><div className="container"><div className="eyebrow">Attri Associates</div><h1>{page.title}</h1><p className="lead">{page.description}</p></div></section><section className="section"><div className="container"><div className="card"><h2>Content managed from the CMS</h2><p className="muted">This page is connected to the phase-one content model. Published content will replace this editorial placeholder after Supabase is configured and seeded.</p></div></div></section></>}
