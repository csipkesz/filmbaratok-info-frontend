# Filmbarátok Info - Frontend

A searchable database of movies and TV series discussed in the episodes and videos of the Filmbaratok Podcast.

---

## About The Project

This project aims to aggregate and structure more than a decade of content from the Filmbaratok YouTube channel into a
fast, searchable interface. Using video titles and descriptions combined with the TMDB API, discussed movies and TV
series are matched with roughly 90% accuracy.

*Disclaimer: This is an independent hobby project and is not officially affiliated with the Filmbaratok team.*

---

## Key Features

- Fast Search: Search across movies, TV series (Hungarian and original titles), YouTube video names, and participants.
- Daily Highlights: Randomly selected movie, commentary, and episode recommendations on the landing page.
- Spoiler Detection: Automated spoiler detection for discussed topics.
- Zero-Backend Architecture: Operates on static JSON indices without requiring a dedicated backend server or database
  infrastructure.

---

## AI / LLM Usage

AI was used selectively with human oversight to avoid unverified or unmaintainable code:

- AI Usage:
    - Generating regular expressions for the parsing pipeline.
    - Scaffolding initial UI component structures and layouts.
- Non-AI Components:
    - Core business logic, filtering, and application architecture.
- All AI-generated code was manually reviewed, and refactored.

---

## Data & Coverage

- Total Processed Entries: ~2,200
- Automated Match Accuracy: ~90-95%
- Manual Corrections Needed: ~100-200 entries
- Data Sources: YouTube Data API v3 and TMDB API

> Data parsing in the other repository: [youtube-info-export](https://github.com/csipkesz/youtube-info-export)

---

## Tech Stack

- Nuxt 4
- Nuxt UI
- Tailwind CSS
- Fuse.js

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build