import "../globals.css";
import DashboardWrapper from "../dashboardWrapper";

interface Props {
    children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
    return (
        <main className="relative w-full h-screen select-none">
            <DashboardWrapper>
                {children}
            </DashboardWrapper>
        </main>
    );
}

export default MainLayout;