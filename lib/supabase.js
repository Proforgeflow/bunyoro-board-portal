import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://qnloqqmvsceqgodixnel.supabase.co/rest/v1/
constsupabaseAnonKey=process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFubG9xcW12c2NlcWdvZGl4bmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODU0MjQsImV4cCI6MjEwNDM2MTQyNH0.BUM4SxcxGB00XMuELQ9VGT646pIUPEY4_00IxjZox5I

export const supabase = createClient(supabaseUrl, supabaseAnonKey);