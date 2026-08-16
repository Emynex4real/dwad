-- dwad backend schema
-- Load with: mysql -u root -e "CREATE DATABASE IF NOT EXISTS dwad" && mysql -u root dwad < api/database/schema.sql
--
-- Seed accounts all share the demo password: password123

CREATE TABLE IF NOT EXISTS artists (
    id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'artist') NOT NULL DEFAULT 'artist',
    phone VARCHAR(40) NULL,
    genre VARCHAR(80) NULL,
    country VARCHAR(80) NULL,
    avatar_url VARCHAR(255) NULL,
    bio TEXT NULL,
    upload_access ENUM('granted', 'locked') NOT NULL DEFAULT 'granted',
    status ENUM('pending', 'active') NOT NULL DEFAULT 'active',
    payout_method ENUM('bank_transfer', 'paypal', 'mobile_money') NULL,
    payout_details TEXT NULL,
    joined_date DATE NULL,
    social_spotify VARCHAR(255) NULL,
    social_instagram VARCHAR(255) NULL,
    social_youtube VARCHAR(255) NULL,
    social_apple VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    plan ENUM('plan-a', 'plan-b', 'unlimited', 'gold', 'diamond', 'platinum', 'platinum-pro') NOT NULL,
    status ENUM('active', 'expired', 'suspended') NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    auto_renew TINYINT(1) NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    token VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL,
    expires_at DATETIME NOT NULL,
    -- Synchronizer-pattern CSRF token issued alongside the session, returned in the
    -- login/me JSON body (never as a cookie) and required as X-CSRF-Token on writes —
    -- see Auth::validateCsrf(). Nullable so existing rows survive the migration.
    csrf_token VARCHAR(64) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Fixed-window rate limiting for brute-force-prone endpoints (login, forgot-password).
-- id is a bucket key like "login:203.0.113.5"; see RateLimiter::tooManyAttempts().
CREATE TABLE IF NOT EXISTS rate_limit_hits (
    id VARCHAR(191) PRIMARY KEY,
    attempts INT UNSIGNED NOT NULL DEFAULT 1,
    window_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS artist_invites (
    token VARCHAR(64) PRIMARY KEY,
    created_by VARCHAR(40) NOT NULL,
    used_at TIMESTAMP NULL,
    used_by_artist_id VARCHAR(40) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by_artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    type ENUM('upload_submitted', 'upload_approved', 'upload_rejected', 'release_alert', 'subscription_expired', 'subscription_renewed', 'general') NOT NULL,
    title VARCHAR(80) NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    metadata JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tracks (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    title VARCHAR(150) NOT NULL,
    featuring VARCHAR(150) NULL,
    genre VARCHAR(80) NOT NULL,
    release_date DATE NOT NULL,
    upc_code VARCHAR(40) NULL,
    isrc_code VARCHAR(40) NULL,
    release_link VARCHAR(255) NULL,
    cover_art_url VARCHAR(255) NULL,
    audio_file_url VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected', 'live') NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    review_note TEXT NULL,
    platforms JSON NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payouts (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    amount_usd DECIMAL(12, 2) NOT NULL,
    period VARCHAR(7) NULL,
    note VARCHAR(255) NULL,
    recorded_by VARCHAR(40) NOT NULL,
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS artist_analytics_monthly (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    period VARCHAR(7) NOT NULL,
    streams BIGINT UNSIGNED NOT NULL DEFAULT 0,
    revenue_gbp DECIMAL(12, 4) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY artist_period (artist_id, period),
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS artist_track_platform_analytics_monthly (
    id VARCHAR(40) PRIMARY KEY,
    artist_id VARCHAR(40) NOT NULL,
    period VARCHAR(7) NOT NULL,
    track_title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    streams BIGINT UNSIGNED NOT NULL DEFAULT 0,
    revenue_gbp DECIMAL(12, 4) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY artist_period_track_platform (artist_id, period, track_title, platform),
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report_uploads (
    id VARCHAR(40) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    period VARCHAR(7) NOT NULL,
    total_rows INT UNSIGNED NOT NULL DEFAULT 0,
    matched_groups INT UNSIGNED NOT NULL DEFAULT 0,
    pending_groups INT UNSIGNED NOT NULL DEFAULT 0,
    uploaded_by VARCHAR(40) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- sha256 of the uploaded file's contents; rejects re-processing an identical CSV
    -- (upload() upserts with `+=` semantics, so a duplicate upload would double-add revenue).
    content_hash CHAR(64) NULL,
    UNIQUE KEY report_uploads_content_hash_unique (content_hash)
);

CREATE TABLE IF NOT EXISTS report_pending_rows (
    id VARCHAR(40) PRIMARY KEY,
    report_upload_id VARCHAR(40) NOT NULL,
    credit_text VARCHAR(255) NOT NULL,
    reason ENUM('unmatched', 'multi_artist') NOT NULL,
    streams BIGINT UNSIGNED NOT NULL DEFAULT 0,
    revenue_gbp DECIMAL(12, 4) NOT NULL DEFAULT 0,
    track_platform_breakdown JSON NULL,
    status ENUM('pending', 'resolved', 'skipped') NOT NULL DEFAULT 'pending',
    resolved_artist_id VARCHAR(40) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_upload_id) REFERENCES report_uploads(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id TINYINT PRIMARY KEY DEFAULT 1,
    gbp_to_usd_rate DECIMAL(10, 4) NOT NULL DEFAULT 1.2700,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO settings (id, gbp_to_usd_rate) VALUES (1, 1.2700);

CREATE TABLE IF NOT EXISTS currency_rates_cache (
    id TINYINT PRIMARY KEY DEFAULT 1,
    rates_json JSON NOT NULL,
    fetched_at TIMESTAMP NOT NULL
);

-- Unused — a short-lived attempt at admin-managed per-currency rates. Reverted
-- back to auto-fetched rates (currency_rates_cache above) since maintaining
-- ~50 currencies by hand was more upkeep than wanted. Left in place rather
-- than dropped (no data of consequence, but avoids a destructive migration).
CREATE TABLE IF NOT EXISTS currency_rates (
    currency_code VARCHAR(3) PRIMARY KEY,
    rate DECIMAL(18, 6) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin-editable USD prices shown on the Distro/Studio/AkiibStudio marketing
-- pages. Only the price itself is editable here — plan names, feature lists
-- etc. stay hardcoded in each page's own JSX. Every visitor sees these
-- converted to their local currency via /pricing/localized's live rate.
CREATE TABLE IF NOT EXISTS pricing_plans (
    id VARCHAR(60) PRIMARY KEY,
    label VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO pricing_plans (id, label, price) VALUES
('distro-a', 'Distro — A (1 Song Upload)', 10.00),
('distro-b', 'Distro — B (1 Song Upload Pro)', 15.00),
('distro-c', 'Distro — C (Unlimited)', 30.00),
('distro-gold', 'Distro — Gold', 150.00),
('distro-diamond', 'Distro — Diamond', 500.00),
('distro-platinum', 'Distro — Platinum', 1000.00),
('studio-package-1', 'Studio — Package 1', 150.00),
('studio-package-2', 'Studio — Package 2', 300.00),
('studio-package-3', 'Studio — Package 3', 500.00),
('studio-package-4', 'Studio — Package 4', 1000.00),
('akiib-promo', 'Akiib Studio — Promo', 35.00),
('akiib-package-1', 'Akiib Studio — Package 1', 135.00),
('akiib-package-2', 'Akiib Studio — Package 2', 200.00),
('akiib-package-3', 'Akiib Studio — Package 3', 335.00),
('akiib-package-4', 'Akiib Studio — Package 4', 665.00);

CREATE TABLE IF NOT EXISTS productions (
    id VARCHAR(40) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    artist_name VARCHAR(150) NOT NULL,
    cover_art_url VARCHAR(255) NULL,
    audio_file_url VARCHAR(255) NULL,
    spotify_url VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beats (
    id VARCHAR(40) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    bpm VARCHAR(20) NULL,
    type ENUM('lease', 'purchase') NOT NULL DEFAULT 'lease',
    price DECIMAL(10, 2) NULL,
    audio_file_url VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin-editable Spotlight page content. Hall of Fame and the artist-name
-- marquee are deliberately NOT here — both are reused as-is on Home/Studio/
-- Distro/Graphics pages and were kept hardcoded on purpose. The hero heading/
-- description are also deliberately NOT here — kept static in SpotlightPage.tsx.
CREATE TABLE IF NOT EXISTS spotlight_settings (
    id TINYINT PRIMARY KEY DEFAULT 1,
    artist_of_month_name VARCHAR(150) NOT NULL DEFAULT '',
    artist_of_month_genre VARCHAR(100) NULL,
    artist_of_month_country VARCHAR(100) NULL,
    artist_of_month_photo VARCHAR(255) NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO spotlight_settings (id, artist_of_month_name, artist_of_month_genre, artist_of_month_country, artist_of_month_photo) VALUES
(1, 'M Day Yor', 'Afro Soul', 'Nigeria', 'spotlight/artist-of-month.jpg');

-- One polymorphic table for the six list-shaped sections (roster, top
-- talents, top hits, videos, top classics, cover wall) rather than six
-- near-duplicate tables — they're genuinely the same repeating shape.
CREATE TABLE IF NOT EXISTS spotlight_items (
    id VARCHAR(40) PRIMARY KEY,
    section ENUM('roster', 'top_talents', 'top_hits', 'videos', 'top_classics', 'cover_wall') NOT NULL,
    primary_text VARCHAR(150) NULL,
    secondary_text VARCHAR(150) NULL,
    image_path VARCHAR(255) NULL,
    video_id VARCHAR(30) NULL,
    external_url VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (section, sort_order)
);

INSERT INTO spotlight_items (id, section, primary_text, secondary_text, image_path, external_url, sort_order) VALUES
('spotlight-seed-roster-01', 'roster', 'M Day Yor', 'Afro Soul · NG', 'spotlight/items/roster-mday.jpg', NULL, 1),
('spotlight-seed-roster-02', 'roster', 'Akiib', 'Alt Pop · NG', 'spotlight/items/roster-akiib.jpg', NULL, 2),

('spotlight-seed-talent-01', 'top_talents', 'Badess Kid', 'Artist', 'spotlight/items/talent-badess-kid.jpeg', 'https://open.spotify.com/artist/2CPYKOVDrb7jnJzi8lo3fD', 1),
('spotlight-seed-talent-02', 'top_talents', 'Dmanteaser', 'Artist', NULL, 'https://open.spotify.com/search/dmanteaser/artists', 2),
('spotlight-seed-talent-03', 'top_talents', 'Jazzydking', 'Artist', NULL, 'https://open.spotify.com/search/jazzydking/artists', 3),

('spotlight-seed-hit-01', 'top_hits', 'Gallivant', 'Youngzy', 'spotlight/items/gallivant.jpeg', 'https://open.spotify.com/artist/3ogv3yL56eGFd8jsNw5CXa', 1),
('spotlight-seed-hit-02', 'top_hits', 'A Cry to God', 'King Yungzil', 'spotlight/items/cover-17.jpeg', 'https://open.spotify.com/artist/326UBkWhn2XgCcjIhjtmr7', 2),
('spotlight-seed-hit-03', 'top_hits', 'Drip', 'African Boy', 'spotlight/items/cover-20.jpeg', 'https://open.spotify.com/artist/25bc1K8fnRXnOG0lyKOCEl', 3),
('spotlight-seed-hit-04', 'top_hits', 'My Life', 'Normal Donzee ft. Bella Shmurda', 'spotlight/items/cover-16.jpeg', 'https://open.spotify.com/artist/7uOVdfoFMg0FbFmc1Xp7Ye', 4),
('spotlight-seed-hit-05', 'top_hits', 'All for You', 'Karmarr', 'spotlight/items/cover-21.jpeg', 'https://open.spotify.com/artist/1eesfZPQ3CCwy2qKdifzY9', 5),
('spotlight-seed-hit-06', 'top_hits', 'Where You Dey', 'Jah Lingo', 'spotlight/items/cover-15.jpeg', 'https://open.spotify.com/artist/4j7tdwUsMU9Y8PxeQrmCE1', 6),
('spotlight-seed-hit-07', 'top_hits', 'Oja Men', 'Ysteve ft. Ojadilichukwu', 'spotlight/items/cover-19.jpeg', 'https://open.spotify.com/artist/4QEXoweI6YsbmAuwd0NeCT', 7),
('spotlight-seed-hit-08', 'top_hits', 'Who is Akiib? EP', 'Akiib', 'spotlight/items/who-is-akiib.jpeg', 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG', 8),
('spotlight-seed-hit-09', 'top_hits', 'Love Letter', 'Valid Patema', 'spotlight/items/cover-18.jpeg', 'https://open.spotify.com/artist/2AwcOuICLKuwxBoftfCpMQ', 9),
('spotlight-seed-hit-10', 'top_hits', 'Oya Egbu Onwu', 'Uche Onye Egwu', 'spotlight/items/uche-onye-egwu.jpg', 'https://open.spotify.com/artist/1GiPtQPB6UOfSHDiedkkl9', 10),
('spotlight-seed-hit-11', 'top_hits', 'Naija', 'Solotone', NULL, 'https://open.spotify.com/artist/5TR5ha19awStaDcqWGnwHU', 11),
('spotlight-seed-hit-12', 'top_hits', 'Ohema Remix', 'Nokyes ft Sugarboi', 'spotlight/items/cover-14.jpeg', 'https://open.spotify.com/artist/1nJ9LK9SJxdYAFUGy4FYuI', 12),

('spotlight-seed-video-01', 'videos', 'Bryno T Ft. Sy Lynghuan', 'Unbeliever', NULL, NULL, 1),
('spotlight-seed-video-02', 'videos', 'Youngzy', 'Gallivant', NULL, NULL, 2),
('spotlight-seed-video-03', 'videos', 'Akiib', 'Asalamalekun', NULL, NULL, 3),
('spotlight-seed-video-04', 'videos', 'Ryno ft Oberz', 'Lavida Loca', NULL, NULL, 4),

('spotlight-seed-classic-01', 'top_classics', 'Gallivant', 'Youngzy', 'spotlight/items/gallivant.jpeg', 'https://open.spotify.com/artist/3ogv3yL56eGFd8jsNw5CXa', 1),
('spotlight-seed-classic-02', 'top_classics', 'Oja Men', 'Ysteve ft. Ojadilichukwu', 'spotlight/items/cover-19.jpeg', 'https://open.spotify.com/artist/4QEXoweI6YsbmAuwd0NeCT', 2),
('spotlight-seed-classic-03', 'top_classics', 'Party Animal', 'Nature Republiq', 'spotlight/items/cover-11.jpeg', 'https://open.spotify.com/artist/0XMntmvSwcr9AjpRgZ9cQ4', 3),
('spotlight-seed-classic-04', 'top_classics', 'Grace Time', 'Omo Oluwa Badboi Kp', 'spotlight/items/cover-03.jpeg', 'https://open.spotify.com/artist/2WgKuGjjR3RfKpzBxTyAX0', 4),
('spotlight-seed-classic-05', 'top_classics', 'Watin Dey', 'Jazzydking', 'spotlight/items/cover-06.jpeg', 'https://open.spotify.com/artist/4Lde6MtzI4hIWwobB5Wc46', 5),
('spotlight-seed-classic-06', 'top_classics', 'Yehowa Ye', 'Empaya Vybez', 'spotlight/items/cover-09.jpeg', 'https://open.spotify.com/album/2YWVKEc1cPnYdHFw0ox2rZ', 6),
('spotlight-seed-classic-07', 'top_classics', 'Crazy', 'BThree', 'spotlight/items/cover-08.jpeg', 'https://open.spotify.com/album/1pW6nzt5pPCpAcQEYHQHau', 7),
('spotlight-seed-classic-08', 'top_classics', 'Omo Oloja', 'Akiib', NULL, 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG', 8),
('spotlight-seed-classic-09', 'top_classics', 'Mommy', 'Mhuftybwoy', 'spotlight/items/cover-10.jpeg', 'https://open.spotify.com/artist/48WsE4LHxumfAOmy7hI1Z8', 9),
('spotlight-seed-classic-10', 'top_classics', 'Flenjo', 'Brown Spice', 'spotlight/items/cover-07.jpeg', 'https://open.spotify.com/artist/0d9ezg07OhJowFemqUo7ax', 10),
('spotlight-seed-classic-11', 'top_classics', 'Gallivant', 'Youngzy', 'spotlight/items/gallivant.jpeg', 'https://open.spotify.com/artist/3ogv3yL56eGFd8jsNw5CXa', 11),
('spotlight-seed-classic-12', 'top_classics', 'Bianca', 'Boldmanhs', 'spotlight/items/cover-04.jpeg', 'https://open.spotify.com/artist/24grl33UR73dBjbqGSRp8n', 12),

('spotlight-seed-wall-01', 'cover_wall', NULL, NULL, 'spotlight/items/cover-01.jpeg', NULL, 1),
('spotlight-seed-wall-02', 'cover_wall', NULL, NULL, 'spotlight/items/cover-02.jpeg', NULL, 2),
('spotlight-seed-wall-03', 'cover_wall', NULL, NULL, 'spotlight/items/cover-03.jpeg', NULL, 3),
('spotlight-seed-wall-04', 'cover_wall', NULL, NULL, 'spotlight/items/cover-04.jpeg', NULL, 4),
('spotlight-seed-wall-05', 'cover_wall', NULL, NULL, 'spotlight/items/cover-05.jpeg', NULL, 5),
('spotlight-seed-wall-06', 'cover_wall', NULL, NULL, 'spotlight/items/cover-06.jpeg', NULL, 6),
('spotlight-seed-wall-07', 'cover_wall', NULL, NULL, 'spotlight/items/cover-07.jpeg', NULL, 7),
('spotlight-seed-wall-08', 'cover_wall', NULL, NULL, 'spotlight/items/cover-08.jpeg', NULL, 8),
('spotlight-seed-wall-09', 'cover_wall', NULL, NULL, 'spotlight/items/cover-09.jpeg', NULL, 9),
('spotlight-seed-wall-10', 'cover_wall', NULL, NULL, 'spotlight/items/cover-10.jpeg', NULL, 10),
('spotlight-seed-wall-11', 'cover_wall', NULL, NULL, 'spotlight/items/cover-11.jpeg', NULL, 11),
('spotlight-seed-wall-12', 'cover_wall', NULL, NULL, 'spotlight/items/cover-12.jpeg', NULL, 12),
('spotlight-seed-wall-13', 'cover_wall', NULL, NULL, 'spotlight/items/cover-13.jpeg', NULL, 13),
('spotlight-seed-wall-14', 'cover_wall', NULL, NULL, 'spotlight/items/cover-14.jpeg', NULL, 14),
('spotlight-seed-wall-15', 'cover_wall', NULL, NULL, 'spotlight/items/cover-15.jpeg', NULL, 15),
('spotlight-seed-wall-16', 'cover_wall', NULL, NULL, 'spotlight/items/cover-16.jpeg', NULL, 16),
('spotlight-seed-wall-17', 'cover_wall', NULL, NULL, 'spotlight/items/cover-17.jpeg', NULL, 17),
('spotlight-seed-wall-18', 'cover_wall', NULL, NULL, 'spotlight/items/cover-18.jpeg', NULL, 18),
('spotlight-seed-wall-19', 'cover_wall', NULL, NULL, 'spotlight/items/cover-19.jpeg', NULL, 19),
('spotlight-seed-wall-20', 'cover_wall', NULL, NULL, 'spotlight/items/cover-20.jpeg', NULL, 20),
('spotlight-seed-wall-21', 'cover_wall', NULL, NULL, 'spotlight/items/cover-21.jpeg', NULL, 21);

-- password_hash for 'password123'
INSERT INTO artists (id, name, email, password_hash, role, phone, genre, country, bio, upload_access, joined_date, social_spotify, social_instagram, social_youtube, social_apple) VALUES
('admin-001', 'Dwad Admin', 'admin@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'admin', NULL, NULL, NULL, NULL, 'granted', NULL, NULL, NULL, NULL, NULL),
('artist-001', 'Akiib', 'akiib@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'artist', '+234 801 234 5678', 'Alt Pop', 'Nigeria', 'Alt Pop artist from Lagos with a unique blend of afrobeats and electronic production.', 'granted', '2024-01-15', 'https://open.spotify.com/artist/akiib', 'https://instagram.com/akiib', NULL, NULL),
('artist-002', 'M Day Yor', 'mday@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'artist', '+234 802 345 6789', 'Afro Soul', 'Nigeria', 'Afro Soul singer with deeply emotional vocals and storytelling rooted in West African culture.', 'granted', '2024-03-10', 'https://open.spotify.com/artist/mday', 'https://instagram.com/mday_yor', NULL, NULL),
('artist-003', 'Davee Jay', 'daveejay@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'artist', '+234 803 456 7890', 'Afrobeats', 'Nigeria', 'Afrobeats hitmaker known for high-energy tracks and live performances.', 'locked', '2024-05-20', NULL, 'https://instagram.com/daveejay', NULL, NULL),
('artist-004', 'Lyriq Yeyé', 'lyriq@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'artist', '+234 804 567 8901', 'Hip Hop', 'Nigeria', 'Lyrical hip hop artist with razor-sharp wordplay and a signature sound.', 'granted', '2024-07-08', 'https://open.spotify.com/artist/lyriq', NULL, 'https://youtube.com/@lyriqyeye', NULL),
('artist-005', 'Uche Onye Egwu', 'uche@dwadmusic.com', '$2y$10$l41pPmblZJuw0B/YVQNGzOF301cBz22dvHeGEYykm8G.pNvVlM6u6', 'artist', '+234 805 678 9012', 'Gospel', 'Nigeria', 'Gospel artist spreading faith and hope through powerful music ministry.', 'granted', '2024-09-14', NULL, NULL, 'https://youtube.com/@ucheonyeegwu', NULL);

INSERT INTO subscriptions (id, artist_id, plan, status, start_date, expiry_date, auto_renew, price) VALUES
('sub-001', 'artist-001', 'gold', 'active', '2025-01-01', '2026-01-01', 1, 150),
('sub-002', 'artist-002', 'unlimited', 'active', '2025-03-01', '2026-03-01', 1, 30),
('sub-003', 'artist-003', 'plan-a', 'expired', '2024-05-20', '2025-05-20', 0, 10),
('sub-004', 'artist-004', 'unlimited', 'active', '2025-07-01', '2026-07-01', 1, 30),
('sub-005', 'artist-005', 'plan-a', 'active', '2025-09-01', '2026-09-01', 0, 10);

INSERT INTO notifications (id, artist_id, type, title, message, is_read, metadata, created_at) VALUES
('notif-001', 'artist-001', 'upload_approved', 'Upload Approved', 'Your track "Midnight Frequency" has been approved and is now live on all platforms.', 1, '{"trackId":"track-001","trackTitle":"Midnight Frequency"}', '2025-05-25 10:00:00'),
('notif-002', 'artist-001', 'release_alert', 'Release Tomorrow', 'Your track "Lagos Nights" is scheduled to release tomorrow, August 1st. Make sure your promotional assets are ready.', 0, '{"trackId":"track-002","trackTitle":"Lagos Nights"}', '2025-07-31 08:00:00'),
('notif-003', 'artist-002', 'upload_submitted', 'Upload Received', 'We have received your upload for "Soul in the Rain". Our team will review it within 2-3 business days.', 1, '{"trackId":"track-003","trackTitle":"Soul in the Rain"}', '2025-06-05 09:20:00'),
('notif-004', 'artist-003', 'subscription_expired', 'Subscription Expired', 'Your Starter plan expired on May 20, 2025. Renew now to regain upload access and keep your music live.', 0, NULL, '2025-05-20 00:00:00'),
('notif-005', 'artist-004', 'upload_submitted', 'Upload Received', 'We have received your upload for "Ayakata". Our team will review it within 2-3 business days.', 0, '{"trackId":"track-005","trackTitle":"Ayakata"}', '2025-06-01 17:00:00');

INSERT INTO tracks (id, artist_id, title, featuring, genre, release_date, upc_code, isrc_code, release_link, status, submitted_at, platforms) VALUES
('track-001', 'artist-001', 'Midnight Frequency', NULL, 'Alt Pop', '2025-06-15', '00602507339654', 'NGAKB2500001', 'https://open.spotify.com/track/midnight-frequency', 'live', '2025-05-20 10:30:00', '["Spotify","Apple Music","Boomplay","TikTok","YouTube Music"]'),
('track-002', 'artist-001', 'Lagos Nights', 'M Day Yor', 'Alt Pop', '2025-08-01', '00602507339655', 'NGAKB2500002', NULL, 'approved', '2025-06-01 14:00:00', '["Spotify","Apple Music","Boomplay","TikTok"]'),
('track-003', 'artist-002', 'Soul in the Rain', NULL, 'Afro Soul', '2025-07-10', '00602507339656', 'NGMDY2500001', 'https://open.spotify.com/track/soul-in-rain', 'live', '2025-06-05 09:15:00', '["Spotify","Apple Music","Boomplay","Audiomack"]'),
('track-004', 'artist-003', 'Hush Little Boys', NULL, 'Afrobeats', '2024-12-01', '00602507339650', 'NGDJB2400001', 'https://open.spotify.com/track/hush-little-boys', 'live', '2024-11-01 11:00:00', '["Spotify","Apple Music","Boomplay","TikTok","YouTube Music","Audiomack"]'),
('track-005', 'artist-004', 'Ayakata', NULL, 'Hip Hop', '2025-09-15', '00602507339657', 'NGLYY2500001', NULL, 'pending', '2025-06-01 16:45:00', '["Spotify","Apple Music","Boomplay","Audiomack","Tidal"]'),
('track-006', 'artist-005', 'Oya Egbu Onwu', NULL, 'Gospel', '2025-10-01', NULL, NULL, NULL, 'pending', '2025-06-01 18:00:00', '["Spotify","Apple Music","Boomplay","YouTube Music"]');
