-- Add paid_items column to track which items have been paid for
ALTER TABLE wishlists 
ADD COLUMN paid_items JSONB DEFAULT '[]'::jsonb;

-- Add an index for better performance when querying paid items
CREATE INDEX idx_wishlists_paid_items ON wishlists USING GIN (paid_items);

-- Add a comment to document the column
COMMENT ON COLUMN wishlists.paid_items IS 'Array of item IDs that have been paid for to prevent duplicate payments';

-- Create a payments table to track individual payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  share_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payer_address TEXT,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX idx_payments_share_id ON payments(share_id);
CREATE INDEX idx_payments_item_id ON payments(item_id);

-- Add RLS policies for payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert payments (when someone pays for items)
CREATE POLICY "Allow insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read payments (to check what's been paid)
CREATE POLICY "Allow read payments" ON payments
  FOR SELECT USING (true);

-- Add comment
COMMENT ON TABLE payments IS 'Tracks individual item payments to prevent duplicate payments'; 