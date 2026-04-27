import DashboardLayout from "../../components/DashboardLayout"

export default function CandidatesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayout>{children}</DashboardLayout>
}
