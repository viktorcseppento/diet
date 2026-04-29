import styles from './Dialog.module.scss';
import { Dialog as KobalteDialog } from '@kobalte/core/dialog';
import { useDialogContext } from "../context/DialogContext";

export default function Dialog() {
    const { dialogData, setDialogOpen } = useDialogContext();

    return (
        <KobalteDialog
            open={dialogData().isOpen}
            onOpenChange={setDialogOpen}
            modal={true}
        >
            <KobalteDialog.Portal>
                <KobalteDialog.Overlay class={styles.dialogOverlay} />
                <div class={styles.dialogContainer}>
                    <KobalteDialog.Content
                        class={styles.dialogContent}
                    >
                        <div class={styles.dialogHeader}>
                            <KobalteDialog.Title class={styles.dialogTitle}>{dialogData().title}</KobalteDialog.Title>
                            <KobalteDialog.CloseButton class={styles.dialogCloseButton}>
                                <i class={`fa-solid fa-xmark`} />
                            </KobalteDialog.CloseButton>
                        </div>
                        {dialogData().content()}
                    </KobalteDialog.Content>
                </div>
            </KobalteDialog.Portal>
        </KobalteDialog>
    );
}