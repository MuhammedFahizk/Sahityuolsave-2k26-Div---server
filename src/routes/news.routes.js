import { Router }  from 'express';
import controllers from '../controllers/index.js';
import { protect, upload } from '../middleware/index.js';

const router = Router();

// Public
router.get('/public', controllers.getAllNewsPublic);
router.get('/',    controllers.getAllNews);
router.get('/:id', controllers.getNewsById);

// Protected — with optional cover image upload
router.post('/',    protect, upload.single('coverImage'), controllers.createNews);
router.post('/:id',  protect, upload.single('coverImage'), controllers.updateNews);
router.delete('/:id', protect, controllers.deleteNews);

export default router;



// Perfect! Now I have everything. Let me present the complete public site plan before writing any code:

// Complete Public Site Plan
// Tech Decisions

// Mobile-first — every page designed for phone first
// Bottom tab bar — 5 tabs: Home, Results, Teams, Gallery, News
// Language — English only
// Framework — Next.js App Router (already set up)


// Pages and What Each Shows
// 1. Home Page
// - Festival hero banner (name, year, date, venue)
// - Live announcement strip (latest news ticker)
// - Leaderboard preview (top 3 teams with points)
// - Quick stats (total results, teams, photos)
// - Latest results preview (3 recent cards)
// - Latest news preview (2 recent posts)
// - Links to all other pages
// 2. Results Page
// - Filter tabs on top (All, High School, Junior, Senior, General)
// - Search bar (search by category name)
// - Result cards — exactly like the image you shared
//   - Result number badge
//   - Category name + group pill
//   - 1st, 2nd, 3rd entries with name + team
// - Only published results shown
// 3. Teams Page
// - Full leaderboard — rank 1 to 10
// - Gold/silver/bronze badges for top 3
// - Each row: rank, team color dot, name, manager, points
// - Tap team → opens team detail (name, color, description, manager, members count)
// 4. Gallery Page
// - Mixed photos + videos together (newest first)
// - Uniform square grid (3 columns — Instagram explore style)
// - Videos show a play button overlay on the thumbnail
// - Tap any item → opens fullscreen TikTok-style viewer
//   - Scroll UP/DOWN to go to next/previous item
//   - Photos show full image
//   - Videos play inline (YouTube iframe or Cloudinary player)
//   - Swipe down or tap X to close
// 5. News Page
// - Blog-style list
// - Each card: cover image + category pill + title + date + preview text
// - Tap → opens full post with rich text content (Quill HTML rendered)
// - Malayalam text renders correctly
// 6. About Page
// - Festival name, history, about text
// - Date, venue, organizer details
// - Contact/social links

// Folder Structure — Public Pages
// src/app/
// ├── (public)/
// │   ├── layout.js              ← public layout with bottom tab bar
// │   ├── page.js                ← Home
// │   ├── results/
// │   │   └── page.js            ← Results with filter
// │   ├── teams/
// │   │   ├── page.js            ← Teams leaderboard
// │   │   └── [id]/page.js       ← Team detail
// │   ├── gallery/
// │   │   └── page.js            ← Mixed grid + fullscreen viewer
// │   ├── news/
// │   │   ├── page.js            ← News list
// │   │   └── [id]/page.js       ← Single post
// │   └── about/
// │       └── page.js            ← About festival
// │
// └── components/
//     └── public/
//         ├── BottomTabBar.jsx   ← Instagram-style bottom nav
//         ├── ResultCard.jsx     ← Result card like the image
//         ├── GalleryGrid.jsx    ← 3-col square grid
//         ├── GalleryViewer.jsx  ← TikTok-style fullscreen viewer
//         ├── NewsCard.jsx       ← Blog post card
//         ├── TeamCard.jsx       ← Leaderboard row
//         └── HeroBanner.jsx     ← Festival hero section

// Component Plan
// ComponentWhat It DoesBottomTabBarFixed bottom — 5 icons + labels, active stateResultCardMatches your image — number, category, group, entriesGalleryGrid3-col uniform grid, video items show play iconGalleryViewerFullscreen modal — scroll to next item, close buttonNewsCardCover image, category pill, title, excerptTeamCardRank badge, color dot, name, pointsHeroBannerFestival name, date, venue, background image

// API Calls — Public Pages
// PageAPI CallsHomeGET /api/teams, GET /api/results, GET /api/newsResultsGET /api/results, GET /api/results/filtersTeamsGET /api/teams, GET /api/teams/:idGalleryGET /api/gallery/photos, GET /api/gallery/videosNewsGET /api/news, GET /api/news/:idAboutStatic content (no API needed)
// All public calls return published only — backend already handles this.

// Gallery Viewer — How It Works
// User opens gallery page
//   → sees 3-col grid (photos + videos mixed, newest first)
//   → taps any item
//   → fullscreen viewer opens
//   → current item fills screen
//   → scroll UP → next item
//   → scroll DOWN → previous item
//   → videos auto-play when in view
//   → tap X or swipe down to close