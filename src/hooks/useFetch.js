import { useState } from "react";

function useFetch(initialUrl, initialOptions = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    function doFetch(url = initialUrl, options = initialOptions) {
        setIsLoading(true);
        setIsError(null);

        fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener datos");
                }
                if (response.status === 204) {
                    new Promise(
                        () => {
                            // Resolve
                            return {
                                message: "Recurso eliminado",
                            };
                        },
                        () => {
                            // Reject
                            throw Error("Error al obtener datos");
                        }
                    );
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                setIsError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return { data, isLoading, isError, doFetch };
}

export default useFetch;
