# GIS Accuracy Assessment Learning GIS

A static, browser-based learning platform for GIS and remote-sensing accuracy assessment. It includes eleven learning modules, interactive accuracy/precision and sampling activities, a sample-size calculator, a map-based accuracy-assessment simulator with paired classified/reference grids and live confusion matrix, step-by-step OA/PA/UA/omission/commission/Kappa calculations, a practice map, a timed assessment, local progress tracking, a same-device leaderboard, and printable certificates.

## GitHub-only deployment (GitHub Pages)

This project does not require Supabase, Firebase, a server, a database account, API keys, or a build step.

1. Download and extract this project ZIP.
2. Open the extracted `gis_accuracy_assessment-main` folder.
3. Upload **the contents of this folder** to the root of your GitHub repository. `index.html` must be at the repository's published root (not one folder deeper).
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your branch (usually `main`) and folder `/ (root)`, then click **Save**.
7. Wait for the Pages deployment and open the URL GitHub provides.

## How student names, progress and leaderboard work

- Students enter a name; no password or account is required.
- Progress, completed modules, points, quiz score and reflection are saved in the browser's `localStorage`.
- The leaderboard can show learners who have used the site in the **same browser on the same device**. Students can switch learner names on that device to demonstrate the class leaderboard.
- Data is not uploaded to GitHub and is not shared automatically between different students' phones/computers or browsers. GitHub Pages is static hosting and does not provide a writable shared database.
- Clearing browser data, using private/incognito mode, or changing browser/device can remove or separate saved progress.

This is suitable for low-stakes learning and classroom practice, not official grading or secure examinations. Name-only access is not identity verification.

## Certificates

Complete all eleven modules and score at least 120/160 on the assessment. Select **Download certificate / Print PDF**, then choose **Save as PDF** in the browser print dialog. The certificate is generated in the browser; no external certificate service is used.

## Internet and external assets

The learning content and local progress work as a static website. The interactive basemap uses Leaflet and public map tiles loaded from the internet; Google Fonts are also loaded externally. Those are visual assets, not accounts or databases. The practice map's sample points are illustrative and are not real field-verified reference observations.

## Notes for teaching

- The sampling grid and practice map points are synthetic learning examples.
- The sample-size calculator uses a simplified proportion formula and does not automatically account for stratification, unequal allocation, design effects, finite population correction, or class-specific precision.
- Interpret Kappa alongside the error matrix, overall accuracy, class-specific producer's/user's accuracy, sampling design and reference-data quality.


## Interactive map-based accuracy assessment simulator

The Confusion Matrix module now follows a paired-map sampling workflow:
- 15 × 15 synthetic classified and reference land-cover grids.
- Five classes: Forest, Water Bodies, Urban Areas, Agriculture and Grassland.
- Manual point selection by clicking cells on the classified map.
- Random samples (10, 30, 50), stratified random samples (up to 10 per mapped class), and systematic grid samples with a random start.
- A live confusion matrix with classified map classes in rows and reference classes in columns.
- Overall accuracy, producer's accuracy, user's accuracy, omission error, commission error, and Kappa.
- Expandable step-by-step calculation details.

**Statistical teaching note:** the simulator calculates raw agreement proportions from the selected sample. Its stratified option allocates up to 10 samples per mapped class; because this is not proportional allocation, raw overall accuracy is not an area-adjusted estimate of map-wide accuracy. For a formal stratified accuracy assessment, use appropriate area/stratum weights and a documented probability sampling design. All grid labels are synthetic and should not be reported as real validation data.


## Recent learning-site updates

- Simplified the website identity to **Learning GIS** (uses the requested “Learning GIS” wording throughout the visible interface).
- Fixed the GIS logo so the letters render together as one word.
- Named the timed course test **Assessment** and expanded it to 16 questions (160 points), including numerical problems on overall accuracy, producer’s accuracy, user’s accuracy, omission error, commission error and Kappa.
- Added a **Sampling Methods: Match the Statements** activity immediately before the Confusion Matrix module. It supports drag-and-drop on desktop and tap-to-select/tap-to-place on touch devices.
