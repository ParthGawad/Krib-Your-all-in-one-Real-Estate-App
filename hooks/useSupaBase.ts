import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";

/**
 * Custom hook to retrieve an authenticated Supabase client instance.
 * It integrates Clerk authentication by passing Clerk's JWT/session token generator to Supabase,
 * enabling Row Level Security (RLS) policies on the Supabase backend.
 */
export function useSupaBase() {
    // Retrieve the `getToken` function from Clerk's hook to fetch the user's active session token.
    const { getToken } = useAuth()

    // Memoize the client instance so we do not recreate the Supabase client on every component render.
    // The client will only be re-initialized if the `getToken` reference changes.
    const client = useMemo(
        () => createClerkSupabaseClient(() => getToken()),
        [getToken]
    );

    return client
}