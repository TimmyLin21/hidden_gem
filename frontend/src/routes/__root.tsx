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
            <div className="p-2 flex gap-2 text-lg border-b">
                <Link
                    to="/"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Home
                </Link>{' '}
            </div>
            <hr />
            <Outlet />
        </>
    )
}