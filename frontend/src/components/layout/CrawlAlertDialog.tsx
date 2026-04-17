
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/AlertDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { Button } from "../ui/Button";
import { Info } from "lucide-react";

export function CrawlAlertDialog({ children }: { children: React.ReactNode }) {
    const [userSettings] = useLocalStorage("user-settings", {
        startURL: "",
        googleMapsApiKey: "",
    })

    const isDisabled = !userSettings.startURL || !userSettings.googleMapsApiKey;

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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDisabled}
                    >
                        Start
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}