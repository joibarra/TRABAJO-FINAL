import React from "react";

function ArtistCard ({artist}){
    return (
        <div className={`card has-background-dark`}>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className={`title is-4 has-text-white`}>
                            {song.title}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtistCard;