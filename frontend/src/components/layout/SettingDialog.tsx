import { Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog";
import { Field, FieldDescription, FieldLabel, FieldSeparator } from "../ui/Field";
import { Input } from "../ui/Input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export function SettingDialog(
    {
        children
    }: {
        children?: React.ReactNode
    }
) {
    const [userSettings, setUserSettings] = useLocalStorage("user-settings", {
        startURL: "",
        googleMapsApiKey: "",
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);
            const startURL = formData.get("startURL") as string;
            const googleMapsApiKey = formData.get("googleMapsApiKey") as string;

            if (!startURL.startsWith("http")) {
                return toast.error("Please enter a valid URL starting with http/https")
            }
            setUserSettings({ startURL, googleMapsApiKey });
            toast.success("Settings saved successfully!")

        } catch (error) {
            toast.error("Failed to save settings.")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Settings
                        </DialogTitle>
                        <DialogDescription>
                            Configure your data source and Google Maps integration to begin crawling.
                        </DialogDescription>
                    </DialogHeader>
                    <Field className="mt-2">
                        <FieldLabel htmlFor="start-url">Start URL</FieldLabel>
                        <Input
                            defaultValue={userSettings.startURL}
                            id="start-url"
                            type="text"
                            name="startURL"
                            placeholder="https://www.timeout.com/sydney/food-drink"
                        />
                        <FieldDescription>
                            Supports JSON-LD metadata only.
                        </FieldDescription>
                    </Field>
                    <FieldSeparator className="my-1" />
                    <Field className="mb-2">
                        <div className="flex items-center gap-x-2">
                            <FieldLabel htmlFor="google-maps-api-key">Google Maps API Key</FieldLabel>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" rounded="full">
                                        <Info />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Your key is transmitted securely via SSL during crawling and is never persisted on our servers. Stored locally in your browser.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input
                            id="google-maps-api-key"
                            type="password"
                            name="googleMapsApiKey"
                            placeholder="Enter your Google Maps API key"
                            defaultValue={userSettings.googleMapsApiKey}
                        />
                        <FieldDescription>
                            Used to enrich restaurant details.
                        </FieldDescription>
                    </Field>
                    <DialogFooter className="justify-between! w-auto!">
                        <DialogClose asChild>
                            <Button variant="outline" size="lg" rounded="full">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="default" size="lg" rounded="full" type="submit">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}