CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_image VARCHAR(500),
  author_github VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_comments_post_id ON comments(post_id);

CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  ip_hash VARCHAR(64),
  viewed_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_page_views_dedup ON page_views(page_path, ip_hash, viewed_at);
