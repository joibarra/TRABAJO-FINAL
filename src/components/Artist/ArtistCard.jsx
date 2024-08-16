import {useEffect} from "react";

function ArtistCard({artist}) {
  useEffect(() => {
    console.log("Artist", artist);
  });
  return (
    <div className={`card has-background-dark`}>
      <div className="card-content">
        <div className="control">
          <div className="media-content">
            <p className={`title is-4 has-text-white`}>{artist.name}</p>
          </div>
          <div className="media-content">
            <p className={`Biografia is-4 has-text-white`}>{artist.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistCard;

