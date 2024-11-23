import { Background, Container, Hero, Pricing, Reviews, Wrapper } from "@/components"
import { Spotlight } from "@/components/ui/spotlight"

const PricingPage = () => {
    return (
        <Background>
            <Wrapper className="py-20 relative">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="rgba(255, 255, 255, 0.5)"
                    />
                </Container>
                <Pricing />
                <Reviews />
            </Wrapper>
        </Background>
    )
}

export default PricingPage;