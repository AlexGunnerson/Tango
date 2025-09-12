import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txorjhplnexyhpfzmkfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b3JqaHBsbmV4eWhwZnpta2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjczMzAsImV4cCI6MjA3MzA0MzMzMH0.BksEtGaEAsrsGNI3x99CqJ5US3kESPfE5N7McMPFHfM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
