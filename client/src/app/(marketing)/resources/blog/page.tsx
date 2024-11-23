import { Background, Container, Hero, Wrapper } from "@/components"
import { Spotlight } from "@/components/ui/spotlight"

const BlogPage = () => {
    return (
        <Background>
            <Wrapper className="py-20 relative">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="rgba(255, 255, 255, 0.5)"
                    />
                </Container>
            </Wrapper>
        </Background>
    )
}

export default BlogPage;