import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "./Button";

export const SearchBar = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get("search") as string;
        navigate({
            to: "/",
            params: {
                query: search
            }
        });
    };

    return (
        <form
            className="relative md:min-w-120 md:max-w-1/3 lg:min-w-150 w-full"
            onSubmit={handleSubmit}
        >
            <label
                htmlFor="search"
                className="flex items-center justify-center absolute left-0 h-12 md:h-14 w-12 md:w-14 top-0 bottom-0"
            >
                <Search />
                <span className="sr-only">Search</span>
            </label>
            <input
                type="text"
                id="search"
                name="search"
                className="block w-full h-12 md:h-14 pl-12 md:pl-14 rounded-[28px] bg-slate-50 placeholder:text-slate-500 font-medium"
                placeholder="Cuisine, Restaurant ..."
            />
            <Button
                type="submit"
                size="lg"
                className="absolute top-0 bottom-0 right-0 text-xl rounded-[28px] px-6 h-full"
            >
                Search
            </Button>
        </form>
    );
};
