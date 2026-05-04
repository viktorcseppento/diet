import { liveQuery } from "dexie";
import { createEffect, createSignal, onCleanup } from "solid-js";

function createLiveQuery(queryFn, deps) {
    const [data, setData] = createSignal([]);

    createEffect(() => {
        if (typeof deps === "function") deps();

        const subscription = liveQuery(queryFn).subscribe({
            next: setData,
            error: (err) => console.error(err),
        });

        onCleanup(() => subscription.unsubscribe());
    });

    return data;
}

export default createLiveQuery;