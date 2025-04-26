SET search_path=public;

-- 都道府県
CREATE TABLE IF NOT EXISTS prefecture (
  code integer PRIMARY KEY NOT NULL,
  name text NOT NULL,
  name_kana text NOT NULL,
  name_alpha text NOT NULL
);
COMMENT ON COLUMN prefecture.code IS '都道府県（コード）';
COMMENT ON COLUMN prefecture.name IS '都道府県（漢字）';
COMMENT ON COLUMN prefecture.name_kana IS '都道府県（カナ）';
COMMENT ON COLUMN prefecture.name_alpha IS '都道府県（ローマ字）';

ALTER TABLE prefecture ENABLE ROW LEVEL SECURITY;

CREATE POLICY prefecture_policy
ON prefecture FOR all TO authenticated, postgres
USING (true);

-- 市区町村
CREATE TABLE municipality (
  prefecture_code integer NOT NULL,
  code integer PRIMARY KEY,
  name text NOT NULL,
  name_kana text NOT NULL,
  name_alpha text NOT NULL,
  CONSTRAINT fk_prefecture
    FOREIGN KEY (prefecture_code)
    REFERENCES prefecture (code)
    ON DELETE CASCADE
);
COMMENT ON COLUMN municipality.code IS '市区町村（コード）';
COMMENT ON COLUMN municipality.name IS '市区町村（漢字）';
COMMENT ON COLUMN municipality.name_kana IS '市区町村（カナ）';
COMMENT ON COLUMN municipality.name_alpha IS '市区町村（ローマ字）';

ALTER TABLE municipality ENABLE ROW LEVEL SECURITY;

CREATE POLICY municipality_policy
ON municipality FOR all TO authenticated, postgres
USING (true);
