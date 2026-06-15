import { Navbar }         from './Navbar'
import { Hero }           from './Hero'
import { SocialProof }    from './SocialProof'
import { Features }       from './Features'
import { ProductPreview } from './ProductPreview'
import { Trust }          from './Trust'
import { Pricing }        from './Pricing'
import { FAQ }            from './FAQ'
import { CTAFinal }       from './CTAFinal'
import { Footer }         from './Footer'

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0e1a' }}>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <ProductPreview />
      <Trust />
      <Pricing />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  )
}
