import { EnquiryForm } from "@/components/enquiry-form";

export default function ContactPage() {
  return <main><section className="hero"><div className="container"><div className="eyebrow">Get in touch</div><h1>Start a conversation.</h1><p className="lead">Tell us about your project, site, property or requirement. We will guide you to the right service.</p></div></section><section className="section"><div className="container split"><div><h2>Let us help you plan with clarity.</h2><p className="muted">Based in India and serving worldwide. You can also contact us by phone at +91 99907 77716 or email attriassociates99@gmail.com.</p></div><EnquiryForm /></div></section></main>;
}
