import type { PaginationMeta } from "@/api/restaurants"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/Pagination"
import { getPaginationList } from "@/lib/utils"

const PAGE_SIZE = 9

export function RestaurantsPagination({ meta }: { meta: PaginationMeta | undefined }) {
    if (meta === undefined) {
        return null
    }

    return (
        <>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            to="/"
                            search={(prev) => ({
                                ...prev,
                                page: Math.max(meta.current_page - 1, 1)
                            })}
                            disabled={meta.current_page === 1}
                        />
                    </PaginationItem>
                    {
                        getPaginationList(meta.current_page, meta.total_pages).map((page, index) => {
                            if (page === -1) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            } else {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            to="/"
                                            search={(prev) => ({
                                                ...prev,
                                                page: page
                                            })}
                                            isActive={page === meta.current_page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            }
                        })
                    }
                    <PaginationItem>
                        <PaginationNext
                            to="/"
                            search={(prev) => ({
                                ...prev,
                                page: Math.min(meta.current_page + 1, meta.total_pages)
                            })}
                            disabled={meta.current_page === meta.total_pages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <p
                className="text-center font-light text-neutral-400"
            >
                Showing results
                {` ${(meta.current_page - 1) * PAGE_SIZE + 1}-${Math.min(meta.current_page * PAGE_SIZE, meta.total_count)} `}
                of
                {` ${meta.total_count}`}
            </p>
        </>
    )
}
