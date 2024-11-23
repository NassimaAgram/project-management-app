import { Background, Container, SignUpForm, Wrapper } from "@/components"
import { Particles } from "@/components/ui/particles";
import { Suspense } from "react";

const SignUpPage = () => {
    return (
<div className="flex flex-col items-center justify-center size-full">            
    <Container>
                <Wrapper className="flex flex-col mx-auto justify-center items-center min-h-screen">
                    <Particles
                        className="absolute inset-0 w-full h-full -z-10"
                        quantity={80}
                        ease={20}
                        color="#d4d4d8"
                        refresh
                    />
                    <Suspense>
                        <SignUpForm />
                    </Suspense>
                </Wrapper>
            </Container>
        </div>
    )
}

export default SignUpPage;