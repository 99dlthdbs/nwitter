import Nweet from 'components/Nweet';
import { dbService, storageService } from 'fbase';
import { query, collection, addDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';

function Home({ userObj }) {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');

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

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, 'nweets'), nweetObj);
    setNweet('');
    setAttachment('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type='text'
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type='file' accept='image/*' onChange={onFileChange} />
        <input type='submit' value='Nweet' />
        {attachment && (
          <div>
            <img src={attachment} width='50px' height='50px' alt='attachment' />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
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
