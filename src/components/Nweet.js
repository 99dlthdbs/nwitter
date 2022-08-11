import React from 'react';

function Nweet({ nweetObj, isOwner }) {
  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        <>
          <button>Delet Nweet</button>
          <button>Edit Nweet</button>
        </>
      )}
    </div>
  );
}

export default Nweet;