
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/AlertDialog";

export function CrawlAlertDialog({ children }: { children: React.ReactNode }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-lg"
                    >
                        Confirm Crawl Initiative
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Start</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}