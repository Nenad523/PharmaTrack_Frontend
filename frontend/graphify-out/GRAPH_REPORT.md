# Graph Report - /home/nenadpopovic_/College/2/SE/PharmaTrack_Frontend/frontend  (2026-06-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 459 nodes · 844 edges · 29 communities (15 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1bf42e41`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `apiUrl()` - 20 edges
2. `adminRequest()` - 16 edges
3. `compilerOptions` - 16 edges
4. `adminRequest()` - 13 edges
5. `formatTime()` - 10 edges
6. `PharmacyDetails` - 8 edges
7. `MedicationDetails` - 8 edges
8. `MedicationDose` - 7 edges
9. `formatDateTime()` - 7 edges
10. `City` - 7 edges

## Surprising Connections (you probably didn't know these)
- `PharmaTrack Next.js Project README` --references--> `PharmaTrack — Pharmacy & Medicine Search Platform (Montenegro)`  [INFERRED]
  README.md → public/poster.png
- `PharmaTrack Next.js Project README` --references--> `Next.js Logo SVG`  [INFERRED]
  README.md → public/next.svg
- `PharmaTrack Next.js Project README` --references--> `Vercel Logo SVG`  [INFERRED]
  README.md → public/vercel.svg
- `loadNews()` --calls--> `apiUrl()`  [EXTRACTED]
  app/_components/Home/news.tsx → lib/api.ts
- `adminRequest()` --calls--> `apiUrl()`  [EXTRACTED]
  app/_components/api/v1/admin/pharmacy_api.ts → lib/api.ts

## Import Cycles
- None detected.

## Communities (29 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (47): CityFilter(), CityFilterProps, formatDateTime(), formatDutyTimeRange(), formatFullDate(), formatShortDate(), formatTime(), formatWorkingHoursRange() (+39 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (39): MapPlaceholder(), MapPlaceholderProps, PharmacyMapView, MobileSearchControlsProps, createUserMarkerIcon(), DEFAULT_CENTER, PharmacyMapView(), PharmacyMapViewProps (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (46): adminRequest(), createDoses(), createIngredient(), createMedication(), deleteDose(), deleteMedication(), getIngredients(), getMedicationDetails() (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (48): DutyManager(), emptyForm, Props, adminRequest(), createDuty(), createPharmacy(), createScheduleException(), createWorkingHours() (+40 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (29): geistMono, geistSans, metadata, ThemeRegistry(), clearCachedCsrfToken(), fetchCurrentUser(), getAuthUrl(), getAuthUserFromResponse() (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (23): medicines, popularMedicines, MedicationsContentProps, PopularMedicine(), PopularMedicineProps, SearchBar(), SearchBarProps, Props (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (34): dependencies, @emotion/cache, @emotion/react, @emotion/styled, leaflet, lucide-react, @mui/icons-material, @mui/material (+26 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (8): useAuth(), features, QuickAction, quickActions, HomeFeatures(), HomeHero(), HomePromoVideo(), HomeQuickActions()

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (10): HomeNews(), loadNews(), NewsApiResponse, NewsItem, configuredApiBaseUrl, getApiBaseUrl(), isLoopbackHost(), isPrivateNetworkHost() (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (10): Capsules Icon SVG (Font Awesome), Duty Pharmacy Lookup Feature, Medicine Search Feature, Medicine Availability Notifications Feature, PharmaTrack — Pharmacy & Medicine Search Platform (Montenegro), Symptom-Based Medicine Search Feature, Next.js Logo SVG, PharmaTrack Landing Page Hero Screenshot (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.36
Nodes (7): API_BASE_URL, buildRequestHeaders(), buildResponseHeaders(), buildTargetUrl(), HOP_BY_HOP_HEADERS, proxy(), RouteContext

## Knowledge Gaps
- **145 isolated node(s):** `baseNavItems`, `HeaderProps`, `baseNavItems`, `MobileNavProps`, `QuickAction` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiUrl()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 5`, `Community 9`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `MedicationDose` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `baseNavItems`, `HeaderProps`, `baseNavItems` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.057539682539682536 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05853174603174603 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07597895967270601 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07831677381648158 - nodes in this community are weakly interconnected._