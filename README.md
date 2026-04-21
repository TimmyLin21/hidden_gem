# Hidden Gem

## Description
Hidden Gem is a web application that discovers off-the-beaten-path restaurants by crawling travel blogs using Go. It enriches data via the Google Places API and provides a React-based interface for filtering and visualizing results on an interactive map.

https://github.com/user-attachments/assets/15a13cfa-a7cf-42f5-b167-d81f73c35f60



## Motivation

Finding "hidden gems" in a city usually requires manually scouring dozens of different travel blogs and listicles. While these sites provide addresses, the process of clicking through multiple pages, cross-referencing locations, and checking maps is incredibly inefficient. 

I built **Hidden Gem** to automate this research phase. By using a custom crawler built in Go, the application programmatically aggregates recommendations from across the web, enriches them with the Google Places API, and consolidates them into a single React-based map. What used to take an hour of manual searching now happens instantly, allowing me to spend less time behind a screen and more time discovering new places.
## 🚀 Quick Start
1. Prerequisites
   - **Docker Desktop** installed and running [Download here](https://www.docker.com/products/docker-desktop/)
   - A **Google Places API Key** [Get one here](https://console.cloud.google.com/welcome?project=deft-reflection-470700-e3)
2. Launch the Application
   - Clone the repository and spin up the stack with a single command:
        ```=bash
        git clone https://github.com/TimmyLin21/hidden_gem.git
        cd hidden-gem
        docker-compose up --build
        ```
3. Access the app
   - Navigate to http://localhost in your browser.

   - **Note**: Ensure ports **80** and **8080** are available. If you have another web server running (like Nginx or Apache), please stop it first.
4. Initialize & Crawl
   1. Open the Settings menu in the UI.
   2. Enter your **Google Places API Key** and a **Start URL**.
   3. Click "Crawl" button to start extraction.
   4. Once the Go crawler finishes, the list will automatically refresh with your new "Hidden Gems."
   5. You can use map view to see restaurants locations.

## Usage

### Filter
The app includes several ways to explore and customize restaurant data:

- Filter restaurants by type, price, rating, and restroom availability
- Search for a specific restaurant in the database
- Sort restaurants by rating
- View restaurants on a map to explore locations
- Click map icons to focus on a specific restaurant
- Change the starting crawl URL in Settings for preferred websites

## 👏 Contributing
I would love your help! Contribute by forking the repo and opening pull requests. Please ensure that your code passes the existing tests and linting, and write tests to test your changes if applicable.

All pull requests should be submitted to the main branch.

