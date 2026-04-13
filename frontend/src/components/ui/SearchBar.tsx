import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "./Button";
import React from "react";

export const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearch({
        strict: false,
    })
    const [searchTerm, setSearchTerm] = React.useState(search.query || "");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate({
            to: "/",
            search: {
                query: searchTerm
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full h-12 md:h-14 pl-12 md:pl-14 rounded-[28px] bg-slate-50 placeholder:text-slate-500 font-medium"
                placeholder="Restaurant Name"
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
