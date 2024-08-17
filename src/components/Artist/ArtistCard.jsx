function ArtistCard({artist}) {
  return (
    <div className={`card has-background-dark`}>
      <div
        className="card-content"
        style={{display: "flex", justifyContent: "space-between"}}
      >
        <div className="media">
          <div className="media-content">
            <p className={`title is-4 has-text-white`}>{artist.name}</p>
          </div>
        </div>
        <div className="media">
          <div className="media-content">
            <p className={`Biografia is-4 has-text-white`}>{artist.bio}</p>
          </div>
        </div>
        <div>
          <img src={artist.image} alt={artist.name} width={120} height={80} /> 
        </div>
      </div>
    </div>
  );
}

export default ArtistCard;