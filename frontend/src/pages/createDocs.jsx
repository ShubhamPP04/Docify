import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from "jodit-pro-react";
import { api_base_url } from '../Helper';
import '../styles.css'; // Import the CSS file

const createDocs = () => {
  let { docsId } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState("")

  const [data, setData] = useState("");

  const updateDoc = () => {
    fetch(api_base_url + "/uploadDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
        content: content
      })
    }).then(res => res.json()).then(data => {
      if (data.success === false) {
        setError(data.message)
      }
      else {
        setError("");
      }
    })
  }

  const getContent = () => {
    fetch(api_base_url + "/getDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setContent(data.doc.content);
        }
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
        setError("An error occurred while fetching the document.");
      });
  };

  const saveAndRedirect = () => {
    updateDoc();
    navigate('/');
  };

  useEffect(() => {
    getContent();
  }, [])
  

  return (
    <>
      <Navbar />
      <div className='container flex flex-col items-center justify-center min-h-screen relative px-4'>
        <div className='editor-container w-full max-w-6xl'>
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1} // tabIndex of textarea
            onChange={e => { setContent(e); updateDoc() }}
          />
        </div>
        <button 
          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={saveAndRedirect}
        >
          Save
        </button>
      </div>
    </>
  )
}

export default createDocs