import { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Main Content Area - Full Width */}
            <main className="w-full h-screen">
                {children}
            </main>
        </div>
    )
}

export default Layout