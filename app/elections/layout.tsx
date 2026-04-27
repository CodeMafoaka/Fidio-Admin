import DashboardLayout from "../../components/DashboardLayout"

export default function ElectionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayout>{children}</DashboardLayout>
}
