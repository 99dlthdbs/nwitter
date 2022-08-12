import Nweet from 'components/Nweet';
import { dbService } from 'fbase';
import { query, collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import NweetFactory from 'components/NweetFactory';

function Home({ userObj }) {
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const q = query(collection(dbService, 'nweets'));
    onSnapshot(q, (snapshot) => {
      // forEach보다 map을 사용하면(getDocs) re-render 발생 감소
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);

  return (
    <div>
      <div className='container'>
        <NweetFactory userObj={userObj} />
      </div>
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
