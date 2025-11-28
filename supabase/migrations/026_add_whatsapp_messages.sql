-- ============================================================================
-- WHATSAPP MESSAGES TABLE
-- ============================================================================
-- Stores incoming and outgoing WhatsApp messages for conversation history

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL, -- Store phone number in case client_id is null
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_id TEXT, -- WhatsApp message ID from Meta
  message_text TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'template')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  whatsapp_timestamp TIMESTAMPTZ, -- Timestamp from WhatsApp
  metadata JSONB DEFAULT '{}'::jsonb, -- Store additional data (template info, media URLs, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_client_id ON whatsapp_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_direction ON whatsapp_messages(direction);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_client_created ON whatsapp_messages(client_id, created_at DESC) WHERE client_id IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically link messages to clients by phone number
CREATE OR REPLACE FUNCTION link_whatsapp_message_to_client()
RETURNS TRIGGER AS $$
BEGIN
  -- If client_id is not set, try to find client by phone number
  IF NEW.client_id IS NULL THEN
    -- Normalize phone number (remove +, spaces, etc.)
    DECLARE
      normalized_phone TEXT;
      found_client_id UUID;
    BEGIN
      normalized_phone := regexp_replace(NEW.phone_number, '[^0-9]', '', 'g');
      
      -- Try to find client with matching phone (handle various formats)
      SELECT id INTO found_client_id
      FROM clients
      WHERE 
        regexp_replace(phone, '[^0-9]', '', 'g') = normalized_phone
        OR regexp_replace(phone, '[^0-9]', '', 'g') = RIGHT(normalized_phone, 10) -- Last 10 digits
        OR regexp_replace(phone, '[^0-9]', '', 'g') = RIGHT(normalized_phone, 11) -- Last 11 digits
      LIMIT 1;
      
      IF found_client_id IS NOT NULL THEN
        NEW.client_id := found_client_id;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-link messages to clients
CREATE TRIGGER auto_link_whatsapp_message
  BEFORE INSERT ON whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION link_whatsapp_message_to_client();



