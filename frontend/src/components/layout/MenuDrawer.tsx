import { Button } from "@/components/ui/Button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/Drawer"
import { Menu, X } from "lucide-react"
import { SettingDialog } from "./SettingDialog"
import { Separator } from "../ui/Separator"
import { CrawlAlertDialog } from "./CrawlAlertDialog"


export function MenuDrawer() {


    return (
        <Drawer
            direction="left"
        >
            <DrawerTrigger asChild>
                <Button variant="outline" size="icon-lg" rounded="full" className="md:hidden">
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-none!">
                <DrawerHeader className="flex flex-col">
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" rounded="full" className="self-end">
                            <X />
                            <span className="sr-only">Cancel</span>
                        </Button>
                    </DrawerClose>
                    <DrawerTitle className="text-3xl text-center">Menu</DrawerTitle>
                </DrawerHeader>
                <Separator className="mb-2" />
                <SettingDialog>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-xl mb-4"
                    >
                        Settings
                    </Button>
                </SettingDialog>
                <CrawlAlertDialog>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-xl mb-4"
                    >
                        Crawl
                    </Button>
                </CrawlAlertDialog>
            </DrawerContent>
        </Drawer>
    )
}
