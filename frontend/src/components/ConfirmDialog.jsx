import styles from './Dialog.module.scss';
import { Dialog as KobalteDialog } from '@kobalte/core/dialog';
import { useConfirmDialogContext } from '../context/ConfirmDialogContext';
import { Button } from '@kobalte/core/button';
import { classList } from '../utils/utils';

export default function ConfirmDialog() {
    const { confirmDialogData, setConfirmDialogOpen } = useConfirmDialogContext();

    return (
        <KobalteDialog
            open={confirmDialogData().isOpen}
            onOpenChange={setConfirmDialogOpen}
            modal={true}
        >
            <KobalteDialog.Portal>
                <KobalteDialog.Overlay class={styles.dialogOverlay} />
                <div class={styles.confirmDialogContainer}>
                    <KobalteDialog.Content
                        class={styles.confirmDialogContent}
                    >
                        <div class={styles.dialogHeader}>
                            <KobalteDialog.Title class={styles.dialogTitle}>{confirmDialogData().title}</KobalteDialog.Title>
                            <KobalteDialog.CloseButton class={styles.dialogCloseButton}>
                                <i class={`fa-solid fa-xmark`} />
                            </KobalteDialog.CloseButton>
                        </div>
                        <div class={styles.content}>
                            <p class={styles.text} innerHTML={confirmDialogData().text} />
                            <div class={styles.buttons}>
                                <Button class={classList(styles.button, styles.cancelButton)} onClick={() => setConfirmDialogOpen(false)}>Mégse</Button>
                                <Button class={classList(styles.button, styles.confirmButton, confirmDialogData().isDeletion && styles.deleteButton)} onClick={() => {
                                    confirmDialogData().onConfirm();
                                    setConfirmDialogOpen(false);
                                }}>
                                    Igen
                                </Button>
                            </div>
                        </div>
                    </KobalteDialog.Content>
                </div>
            </KobalteDialog.Portal>
        </KobalteDialog>
    );
}