import { useUser } from "@clerk/expo"
import useUserStore from "@/store/userStore"
import { useSupaBase } from "./useSupaBase"
import { useEffect } from "react"

/**
 * Custom hook to synchronize the authenticated user's profile details from Clerk to the Supabase database.
 * If the user's record does not exist in the Supabase 'users' table, a new profile is created.
 * It also fetches the user's role (isAdmin) and updates the global Zustand store accordingly.
 */
export const useUserSync = () => {
    // 1. Fetch user authentication details (id, email, names, image) from Clerk.
    const { user } = useUser()
    
    // 2. Fetch the state setter function from the global Zustand store to update the isAdmin flag.
    const setIsAdmin = useUserStore((state) => state.setIsAdmin)

    // 3. Initialize the authenticated Supabase client using our custom useSupaBase hook.
    const authSupabase = useSupaBase();

    // 4. Trigger the user synchronization whenever the Clerk user object changes (e.g., on sign-in or profile updates).
    useEffect(() => {
        if (!user) return
        syncUser();
    }, [user])

    /**
     * Helper function to perform the check-and-upsert sync logic with Supabase.
     */
    const syncUser = async () => {
        // Query the Supabase 'users' table to see if a record already exists with the current Clerk user's ID.
        const { data } = await authSupabase
            .from("users")
            .select("clerk_id,is_admin")
            .eq("clerk_id", user!.id)
            .single()

        if (data) {
            // Case A: User already exists in Supabase.
            // Just update the local Zustand store with the user's administrator status from the database.
            setIsAdmin(data.is_admin ?? false)
            return
        }

        // Case B: User does not exist in Supabase.
        // Insert a new record into the 'users' table using details retrieved from the Clerk user object.
        const { data: newUser } = await authSupabase
            .from("users")
            .insert({
                clerk_id: user!.id,
                email: user!.emailAddresses[0].emailAddress,
                first_name: user!.firstName,
                last_name: user!.lastName,
                avatar_url: user!.imageUrl,
            })
            .select("is_admin")
            .single()
        
        // Update the local Zustand store with the new user's admin state (defaulting to false).
        setIsAdmin(newUser?.is_admin ?? false)
    }
}   