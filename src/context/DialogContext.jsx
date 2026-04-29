import { createContext, createSignal, useContext } from "solid-js";

export const DialogContext = createContext();

export function DialogProvider(props) {
    const [dialogData, setDialogData] = createSignal({
        title: '',
        content: null,
        isOpen: false
    });

    const setDialogOpen = (isOpen) => setDialogData((dialog) => ({ ...dialog, isOpen }));

    const dialog = {
        dialogData,
        setDialogData,
        setDialogOpen
    };

    return (
        <DialogContext.Provider value={dialog}>
            {props.children}
        </DialogContext.Provider>
    );
}

export function useDialogContext() {
    return useContext(DialogContext);
}