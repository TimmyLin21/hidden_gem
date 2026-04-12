import { Button } from '@/components/ui/Button'
import { Filters } from '@/components/ui/Filters'
import { createFileRoute } from '@tanstack/react-router'
import { Filter, Map } from 'lucide-react'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {

    return (
        <main className="container flex w-full gap-x-6 mb-12 mx-auto">
            <div className="flex justify-between w-full">
                <Filters>
                    <Button variant="outline" size="lg" rounded="full">
                        <Filter /> Filters
                    </Button>
                </Filters>
                <Button variant="secondary" size="lg" rounded="full">
                    <Map /> Map
                </Button>
            </div>

        </main>
    )
}