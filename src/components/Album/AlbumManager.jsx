import React, { useState } from "react";
import PopupDelete from "./PopupDelete";
import useFetch from "../../hooks/useFetch"; // Asegúrate de tener un hook para manejar las peticiones

function AlbumManager() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [albumId, setAlbumId] = useState(null);
    const onDelete = useFetch();

    const handleOpenPopup = (id) => {
        setAlbumId(id);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setAlbumId(null);
    };

    const handleDeleteAlbum = () => {
        onDelete.doFetch(
            `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/${albumId}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        handleClosePopup();
    };

    return (
        <div>
            <button onClick={() => handleOpenPopup(1)}>Eliminar Álbum 1</button>
            <PopupDelete
                open={isPopupOpen}
                onClose={handleClosePopup}
                onConfirm={handleDeleteAlbum}
            />
        </div>
    );
}

export default AlbumManager;