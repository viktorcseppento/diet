import styles from './ConfirmDialogContent.module.scss';
import { useDialogContext } from "../context/DialogContext";
import { Button } from '@kobalte/core/button';
import { classList } from '../utils/utils';

export default function ConfirmDialogContent(props) {
    const { setDialogOpen } = useDialogContext();

    return (
        <div class={styles.content}>
            <p class={styles.text} innerHTML={props.text} />
            <div class={styles.buttons}>
                <Button class={classList(styles.button, styles.cancelButton)} onClick={() => setDialogOpen(false)}>Mégse</Button>
                <Button class={classList(styles.button, styles.confirmButton)} onClick={() => {
                    props.onConfirm();
                    setDialogOpen(false);
                }}>
                    Igen
                </Button>
            </div>
        </div>
    );
}