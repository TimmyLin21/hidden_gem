import { SearchBar } from '@/components/ui/SearchBar'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => {
        return (
            <div>
                <p>This is the notFoundComponent configured on root route</p>
                <Link to="/">Start Over</Link>
            </div>
        )
    },
})

function RootComponent() {
    return (
        <>
            <header className='container py-4 mb-6 mx-auto flex items-center justify-between gap-x-4'>
                <Link to="/" className='flex items-center gap-x-2 w-fit'>
                    <img src="/images/logo.svg" alt="Hidden Gem Logo" className='w-12' />
                    <h1 className='not-md:sr-only text-4xl font-bold'>Hidden Gem</h1>
                </Link>
                <SearchBar />
            </header>
            <Outlet />
            <footer className="bg-primary-50 py-8 mt-auto">
                <div className="container text-center mx-auto">
                    <p className="text-lg font-light text-primary-500">
                        &copy; 2026 HiddenGem. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}