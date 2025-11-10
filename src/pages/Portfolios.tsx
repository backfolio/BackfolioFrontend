import Layout from '../components/Layout'

const Portfolios = () => {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/[0.03] border border-white/[0.15] rounded-3xl p-12 text-center backdrop-blur-2xl">
                    <div className="text-6xl mb-6">💼</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Hello - Portfolios Page
                    </h1>
                    <p className="text-xl text-white/60 font-medium">
                        Coming soon: Manage and track your investment portfolios
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Portfolios
