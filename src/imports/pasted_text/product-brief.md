# Product Brief: AI-Powered Wardrobe & Outfit Planner

## 1. Product Vision
This application acts as a comprehensive digital wardrobe and personal stylist. By digitizing a user's closet and leveraging artificial intelligence for outfit creation, it bridges the gap between digital outfit planning and physical fitting rooms. It aims to reduce decision fatigue, minimize buyer's remorse, and promote mindful consumption.

## 2. Core Wardrobe & Inventory Management
The application analyzes existing wardrobe items to maximize utility. Users can build their digital database through a dual-import system.
- **Manual Photo Import with AI Tagging:** Users can take photos of their clothing. The AI automatically removes the background, crops the images, and tags metadata (color, season, brand, style).
- **Automated E-Commerce Syncing:** Users can sync digital receipts or order history to automatically pull high-quality stock images, purchase dates, and prices for a frictionless import experience.
- **Privacy-First Receipt Parsing:** To ensure user trust and comply with data privacy standards, the app uses a dual-option email strategy. Users can either grant direct inbox sync for maximum convenience or manually forward specific purchase receipts to a dedicated app email address (e.g., `add@wardrobeapp.com`) to prevent the app from scanning their full private inbox. Parsed receipt data is processed securely.
- **Full-Body Generation:** Creates a photorealistic image of the worn outfit using the user's uploaded full-body picture.

## 3. Contextual Suggestion Engine
The AI stylist recommends outfits dynamically based on external data and user input, generating **2 to 3 initial outfit options per request**, with a button to "Generate More" if the user wants additional choices.
- **Environmental Factors:** Integrates with location-based weather APIs to ensure outfits are climate-appropriate.
- **Scheduling & Conflict Resolution:** Syncs with the user's calendar to dress them appropriately for specific daily events. If conflicting or highly contrasting events are detected on the same day (e.g., a gym session followed by a formal dinner), the app will ignore the conflict and simply prompt the user to select which event they want to prioritize for that specific outfit generation.
- **Specific Prompting:** Allows the user to input specific requests ("Give me a Y2K aesthetic using my blue jeans") or specify items they *must* wear that day.

## 4. Collaborative Group Styling ("Style Jams")
This feature introduces social networking mechanics to wardrobe management, allowing users to coordinate aesthetics with friends, partners, or event groups.
- **Unique Group Codes:** Users enter a generated PIN or link to temporarily sync their digital wardrobes into a shared pool.
- **Custom Event Prompts:** The host creates a Style Jam space with an initial prompt (e.g., "Bohemian beach wedding in Bali").
- **Collaborative Editing:** The prompt and event parameters are fully editable by any group member, allowing the aesthetic to evolve collaboratively.
- **AI-Driven Group Matching:** Analyzes all connected wardrobes to generate 2 to 3 cohesive group outfits based on the prompt, thematic complementing, and color matching.

## 5. Smart Shopping & Strict-Budget Referral System
This feature transforms the app into an engine for product discovery, explicitly designed to encourage mindful spending by maximizing the user's current wardrobe before suggesting new purchases.
- **"Shop the Look" Toggle:** Users are presented with a clear toggle switch asking if they want the AI to include items from the marketplace in their outfit suggestions.
- **Strict Budget Fallback:** If the toggle is active, users must input a specific maximum budget. The AI attempts to fill wardrobe gaps with marketplace items under that budget. If the budget is insufficient, the AI completely skips the buying section and falls back to generating the best possible outfits using *only* the clothes the user already owns.
- **Hybrid Outfit Generation:** The AI builds the core of the outfit from the user's *existing* wardrobe, only suggesting a purchase if it fits the strict budget and the prompt.
- **Affiliate Link Integration:** Suggested new clothes feature direct buy buttons powered by an affiliate marketing system.
- **Virtual Try-On for Referrals:** Before buying, users can overlay the suggested marketplace item onto their full-body avatar to evaluate the fit.

## 6. Sizing and Styling Education
This section focuses on reducing return rates and actively improving the user's personal fashion knowledge.
- **Smart Sizing:** Recommends exact clothing sizes across different brands using the user's inputted body measurements.
- **Color Tone Checker:** Analyzes complexions to determine warm or cool undertones for optimized color palettes.
- **Fashion Advice Hub:** Teaches ideal silhouettes, body proportions, and color-matching rules tailored to the user.

## 7. Technical Integrations
Building this platform requires linking front-end rendering engines with external data sources.
- **Try-on APIs:** Google Cloud's Virtual Try-On API or Pixazo to handle complex full-body clothing rendering.
- **Contextual APIs:** Location-based weather services and calendar synchronization.
- **Data Extraction:** Email scraping APIs and OCR (Optical Character Recognition) for receipt scanning and automated inventory building.
- **Real-Time Database Syncing:** Handles multi-user "Style Jam" sessions, ensuring rapid wardrobe cross-referencing and group state management.
- **Affiliate & Catalog APIs:** Integration with platforms like Mavely or Amazon Associates to pull live product data, pricing, and track referral commissions.