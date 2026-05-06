import styles from './SearchBox.module.scss';
import { classList } from '../utils/utils';

export default function SearchBox(props) {
    return (
        <div class={styles.container}>
            <input
                class={styles.input}
                id='search'
                type="text"
                data-type="search"
                placeholder={"Keresés..."}
                value={props.value()}
                onInput={(e) => {
                    props.setValue(e.target.value);
                }}
            />
            <i class={classList('fa-solid fa-magnifying-glass', styles.magnifyingGlassIcon)} />
            <i class={classList('fa-solid fa-xmark', styles.clearIcon)} onClick={() => props.setValue('')} />
        </div>
    );
}