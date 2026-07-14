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
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
