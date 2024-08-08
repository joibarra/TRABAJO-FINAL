import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import ProfileImageModal from "./ProfileImageModal";

function Profile() {
    const { token } = useAuth("state");

    const [editMode, setEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingState, setIsEditingState] = useState(false);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const bioRef = useRef(null);
    const userStateRef = useRef(null);

    // Fetch para cargar tarjeta de perfil
    const {
        data: userData,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
        doFetch: fetchProfile,
    } = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    // Fetch para actualizar vía JSON
    const {
        data: updatedUserData,
        isLoading: loadingUpdate,
        isError: errorUpdating,
        doFetch: updateProfile,
    } = useFetch();

    // Fetch para actualizar vía FormData
    const {
        data: profileImageData,
        isLoading: isLoadingUpdate,
        isError: errorProfileImage,
        doFetch: updateProfileImage,
    } = useFetch();

    const {
        data: userStates,
        isLoading: isLoadingUserStates,
        isError: isErrorUserStates,
        doFetch: fetchUserStates,
    } = useFetch(`${import.meta.env.VITE_API_BASE_URL}users/user-states/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    useEffect(() => {
        if (updatedUserData && isEditingState) {
            setIsEditingState(false);
            userData.state = updatedUserData.state;
        }
    }, [updatedUserData]);

    useEffect(() => {
        fetchProfile();
    }, [token]);

    useEffect(() => {
        if (profileImageData) {
            // Si no es null o undefined
            userData.image = profileImageData.image;
        }
    }, [profileImageData]);

    useEffect(() => {
        fetchUserStates();
    }, [isEditingState]);

    function handleEditMode() {
        setEditMode(!editMode);
    }

    function handleSubmit(event) {
        event.preventDefault();
        updateProfile(
            `${import.meta.env.VITE_API_BASE_URL}users/profiles/${
                userData.user__id
            }/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    email: emailRef.current.value,
                    dob: dobRef.current.value,
                    bio: bioRef.current.value,
                }),
            }
        );
    }

    function handleStateChange(event) {
        const newUserStateID = event.target.value;

        updateProfile(
            `${import.meta.env.VITE_API_BASE_URL}users/profiles/${
                userData.user__id
            }/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    state: newUserStateID,
                }),
            }
        );
    }

    if (isLoadingProfile) return <p>Cargando perfil...</p>;
    if (isErrorProfile) return <p>Error: {isErrorProfile}</p>;

    return (
        <div className="card">
            {userData ? (
                <>
                    <form className="card-content" onSubmit={handleSubmit}>
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-48x48">
                                    <img
                                        src={
                                            `${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }${userData.image}` ||
                                            "https://bulma.io/assets/images/placeholders/96x96.png"
                                        }
                                        alt="Profile image"
                                        style={{ borderRadius: "50%" }}
                                        onClick={() => setIsModalOpen(true)}
                                    />
                                </figure>
                            </div>
                            <div className="media-content">
                                {editMode ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            alignItems: "center",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="input is-small"
                                            ref={firstNameRef}
                                            defaultValue={userData.first_name}
                                            style={{ width: "40%" }}
                                        />
                                        <input
                                            type="text"
                                            className="input is-small"
                                            ref={lastNameRef}
                                            defaultValue={userData.last_name}
                                            style={{ width: "40%" }}
                                        />
                                    </div>
                                ) : (
                                    <p className="title is-4 pb-2">
                                        {firstNameRef.current?.value ||
                                            userData.first_name}{" "}
                                        {lastNameRef.current?.value ||
                                            userData.last_name}
                                    </p>
                                )}
                                {isEditingState ? (
                                    <div className="field">
                                        <div className="control">
                                            <div className="select is-small">
                                                <select
                                                    ref={userStateRef}
                                                    defaultValue={
                                                        userData.state.id
                                                    }
                                                    onChange={handleStateChange}
                                                >
                                                    {/* {isLoadingUserStates && (
                                                        <option>
                                                            Cargando estados...
                                                        </option>
                                                    )}
                                                    {isErrorUserStates && (
                                                        <option>
                                                            Error al cargar los
                                                            estados
                                                        </option>
                                                    )} */}
                                                    {userStates &&
                                                        userStates.results.map(
                                                            (state) => (
                                                                <option
                                                                    key={
                                                                        state.id
                                                                    }
                                                                    value={
                                                                        state.id
                                                                    }
                                                                >
                                                                    {state.name}
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="subtitle is-6"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        onClick={() => setIsEditingState(true)}
                                    >
                                        <img
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }${userData.state.icon}`}
                                            alt="State icon"
                                            style={{
                                                height: "20px",
                                                marginRight: "5px",
                                                borderRadius: "50%",
                                            }}
                                        />
                                        {userData.state.name}
                                    </div>
                                )}
                            </div>
                            <button
                                className="button is-primary"
                                onClick={handleEditMode}
                            >
                                {!editMode ? "Editar" : "Salir"}
                            </button>
                        </div>

                        <div className="content">
                            <div className="field">
                                <label className="label">Email:</label>
                                <div className="control">
                                    <input
                                        type="email"
                                        className="input"
                                        id="email"
                                        name="email"
                                        ref={emailRef}
                                        defaultValue={userData.email}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">
                                    Fecha de Nacimiento:
                                </label>
                                <div className="control">
                                    <input
                                        type="date"
                                        className="input"
                                        id="dob"
                                        name="dob"
                                        ref={dobRef}
                                        defaultValue={userData.dob}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Biografía:</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        id="bio"
                                        name="bio"
                                        ref={bioRef}
                                        defaultValue={
                                            userData.bio || "No disponible"
                                        }
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            {editMode ? (
                                <div className="field">
                                    <button
                                        className="button is-primary is-fullwidth"
                                        type="submit"
                                    >
                                        {loadingUpdate
                                            ? "Enviando..."
                                            : "Enviar"}
                                        {errorUpdating
                                            ? "Ocurrió un error al enviar el formulario"
                                            : null}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </form>
                    <ProfileImageModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        userId={userData.user__id}
                        onUpload={{
                            isLoadingUpdate,
                            profileImageData,
                            updateProfileImage,
                        }}
                    />
                </>
            ) : (
                <p className="subtitle">No se encontraron datos del usuario.</p>
            )}
        </div>
    );
}

export default Profile;