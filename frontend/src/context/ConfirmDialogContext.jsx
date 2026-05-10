import { createContext, createSignal, useContext } from "solid-js";

export const ConfirmDialogContext = createContext();

const initialData = {
    title: '',
    text: null,
    onConfirm: null,
    isOpen: false,
    isDeletion: false
}

export function ConfirmDialogProvider(props) {
    const [confirmDialogData, setConfirmDialogData] = createSignal(initialData);

    const setConfirmDialogOpen = (isOpen) => setConfirmDialogData((dialog) => {
        if (!isOpen) {
            return ({ ...initialData, isOpen: false });
        }
        else {
            return ({ ...dialog, isOpen: true });
        }
    });

    const dialog = {
        confirmDialogData,
        setConfirmDialogData,
        setConfirmDialogOpen
    };

    return (
        <ConfirmDialogContext.Provider value={dialog}>
            {props.children}
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirmDialogContext() {
    return useContext(ConfirmDialogContext);
}