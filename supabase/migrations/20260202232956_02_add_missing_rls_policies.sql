/*
  # Add Missing RLS Policies for Subscriptions

  Missing INSERT policy for subscriptions table was preventing signup.
  Users need to be able to create their own subscription records when signing up.
*/

-- Add INSERT policy for subscriptions
CREATE POLICY "Users can create own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
