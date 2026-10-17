import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupaBase } from "./useSupaBase";

// this is for saving the property in database by the user who is logged in
export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
    const { userId } = useAuth()
    const authSupabase = useSupaBase()

    const [isSaved, setIsSaved] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)

    // checks if the current property is saved by the logged in user or not
    const checkIfSaved = async () => {
        // if user not found then return
        if (!userId) return;

        // search & fetch the saved properties
        const { data } = await authSupabase
            .from("saved_properties")
            .select("id")
            .eq("user_clerk_id", userId)
            .eq("property_id", propertyId)
            .single();

        // set the fetched data
        setIsSaved(!!data)
    }

    // run the checkIfSaved function when the component loads or when the userId or propertyId changes
    useEffect(() => {
        checkIfSaved()
    }, [propertyId, userId])


    //  this functions toggles the save state based on the current state, if it is 
    const toggleSave = async () => {
        // if user not found or saveLoading is true then return
        if (!userId || saveLoading) return;
        setSaveLoading(true)

        // if the property is saved then delete it
        if (isSaved) {
            await authSupabase
                .from("saved_properties")
                .delete()
                .eq("user_clerk_id", userId)
                .eq("property_id", propertyId);
            setIsSaved(false);
            onUnsave?.();
        } else {
            // if the property is not saved then insert it
            await authSupabase
                .from("saved_properties")
                .insert({
                    user_clerk_id: userId,
                    property_id: propertyId,
                });
            setIsSaved(true);
        }

        setSaveLoading(false);
    }

    return { isSaved, saveLoading, toggleSave }
} 