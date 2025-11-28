    -- Add subscription_type and program_type to clients table
    ALTER TABLE clients 
    ADD COLUMN IF NOT EXISTS subscription_type TEXT CHECK (subscription_type IN ('3_month', 'monthly', 'yearly')),
    ADD COLUMN IF NOT EXISTS program_type TEXT CHECK (program_type IN ('silver', 'gold', 'platinum', 'weight_loss', 'weight_gain', 'strength_conditioning', 'medical_condition', 'rehab'));

    -- Add index for faster queries
    CREATE INDEX IF NOT EXISTS idx_clients_subscription_type ON clients(subscription_type);
    CREATE INDEX IF NOT EXISTS idx_clients_program_type ON clients(program_type);




