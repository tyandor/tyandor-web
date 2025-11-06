-- Enable Row Level Security
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_history ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access" ON technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON technology_history FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON technologies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON technologies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON technologies FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert history" ON technology_history FOR INSERT TO authenticated WITH CHECK (true);
