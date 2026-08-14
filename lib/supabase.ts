import { createClient } from "@supabase/supabase-js";

// Fetch the Supabase API URL and public Anonymous Key from environment variables.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

// 1. Standard, unauthenticated Supabase client instance.
// This instance can be used for public reads or operations that do not require user-specific context/claims.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 2. Factory function to create an authenticated Supabase client.
 * It configures Supabase to retrieve Clerk's JWT/session token dynamically on every request.
 * This ensures Supabase acts on behalf of the signed-in Clerk user, honoring Row Level Security (RLS) policies.
 * 
 * @param getToken A function returning a Promise that resolves to the Clerk JWT token.
 */
export function createClerkSupabaseClient(
    getToken: () => Promise<string | null>
) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        // Intercepts and overrides the access token generation for Supabase client requests.
        async accessToken() {
            return getToken();
        },
    });
}   