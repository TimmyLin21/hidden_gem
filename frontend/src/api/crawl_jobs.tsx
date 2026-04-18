export type CrawlJob = {
    ID: string;
    Status: "pending" | "in_progress" | "completed" | "failed";
    StartUrl: string;
    ErrorMessage: {
        String: string;
        Valid: boolean;
    };
}

export type StartCrawlJobResponse = {
    crawl_job_id: string;
    message: string;
}

export const startCrawlJob = async (startUrl: string, googleMapsApiKey: string): Promise<StartCrawlJobResponse> => {
    const response = await fetch("/api/crawl", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            start_url: startUrl,
            google_maps_api_key: googleMapsApiKey,
        }),
    });
    return await response.json();
}

export const fetchCrawlJob = async (id: string): Promise<CrawlJob> => {
    const response = await fetch(`/api/crawl-jobs/${id}`);
    return await response.json();
}