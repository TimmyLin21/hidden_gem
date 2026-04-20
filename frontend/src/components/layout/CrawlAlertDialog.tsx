
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/AlertDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { Button } from "../ui/Button";
import { Info } from "lucide-react";
import React, { useEffect } from "react";
import { fetchCrawlJob, startCrawlJob } from "@/api/crawl_jobs";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/Spinner";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function CrawlAlertDialog({ children }: { children: React.ReactNode }) {
    const [userSettings] = useLocalStorage("user-settings", {
        startURL: "",
        googleMapsApiKey: "",
    })
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeJobId, setActiveJobId] = useLocalStorage<string | null>("active-crawl-job-id", null);
    const { data: job } = useQuery({
        queryKey: ["crawlStatus", activeJobId],
        queryFn: () => {
            if (!activeJobId) {
                throw new Error("No active job ID");
            }
            return fetchCrawlJob(activeJobId);
        },
        enabled: !!activeJobId,
        meta: {
            errorMessage: "Could not track crawl status"
        },
        refetchInterval: (query) => {
            const data = query.state.data
            if (!activeJobId) return false;

            if (!data) return 5000;

            const status = data.Status
            return status === "completed" || status === "failed" ? false : 5000;
        }
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (!job?.Status) return

        const isFinished = job.Status === "completed"
        const isFailed = job.Status === "failed"

        if (isFinished || isFailed) {
            if (isFinished) {
                toast.success("Crawl completed successfully!")
                navigate({
                    to: '.'
                });
            } else {
                toast.error(job.ErrorMessage.String)
            }
            setActiveJobId(null);
        }

    }, [job?.Status, setActiveJobId, job?.ErrorMessage])

    async function handleStartCrawl() {
        try {
            const job = await startCrawlJob(userSettings.startURL, userSettings.googleMapsApiKey);
            setActiveJobId(job.crawl_job_id);
            toast.success("Crawl job started successfully!");
        } catch (error: any) {
            toast.error("Failed to start crawl job.")
            console.error(error);
        }
    }

    const isDisabled = !userSettings.startURL || !userSettings.googleMapsApiKey;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-lg"
                    >
                        Confirm Crawl Initiative
                        {isDisabled && (<Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" rounded="full" className="ml-2">
                                    <Info />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>You need to enter a start URL and a Google Maps API key to proceed.</p>
                            </TooltipContent>
                        </Tooltip>)}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <p className="mb-2">
                            This operation will consume your <b>Google Places API credits.</b>
                        </p>
                        <ul className="list-disc pl-6 mb-2">
                            <li>
                                <b>Usage:</b> Google provides a standard free credit tier, but costs apply once exceeded.
                            </li>
                            <li>
                                <b>Duration:</b> This process may take several minutes depending on the data volume.
                            </li>
                        </ul>
                        <p>
                            View <a href="https://developers.google.com/maps/billing-and-pricing/pricing#places-pricing" target="_blank" className="underline">Google's offical pricing guide</a> for more details.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <Button
                        disabled={isDisabled || !!activeJobId}
                        onClick={handleStartCrawl}
                        className="flex gap-2"
                    >
                        {(activeJobId) && <Spinner />}
                        {activeJobId ? "Crawling..." : "Start Extraction"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}