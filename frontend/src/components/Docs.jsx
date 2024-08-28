import React, { useState } from 'react'
import docsIcon from "../images/docsIcon.png"
import { MdDelete } from "react-icons/md";
import deleteImg from "../images/delete.png"
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Docs = ({ docs }) => {
  const [error, setError] = useState("");
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);

  // Generate a unique ID for each document item
  const docID = `doc-${docs._id}`;

  const navigate = useNavigate();

  const deleteDoc = (id, docID) => {
    let doc = document.getElementById(docID);
    fetch(api_base_url + "/deleteDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docId: id,
        userId: localStorage.getItem("userId")
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success === false) {
        setError(data.message);
      } else {
        setIsDeleteModelShow(false);
        setTimeout(() => {
          alert(data.message);
        }, 100);
        doc.remove();
      }
    })
    .catch(error => {
      console.error("Error deleting document:", error);
      setError("An error occurred while deleting the document.");
    });
  };

  return (
    <>
      <div id={docID} className='docs cursor-pointer rounded-lg flex items-center mt-2 justify-between p-4 bg-gradient-to-r from-green-100 to-blue-100 transition-all hover:from-blue-200 hover:to-blue-200 shadow-md'>
        <div onClick={()=>{navigate(`/createDocs/${docs._id}`)}} className="left flex items-center gap-4">
          <img src={docsIcon} alt="" className="w-10 h-10" />
          <div>
            <h3 className='text-xl font-semibold'>{docs.title}</h3>
            <p className='text-sm text-gray-500'>
              Created: {new Date(docs.date).toDateString()} | Last Updated: {new Date(docs.lastUpdate).toDateString()}
            </p>
          </div>
        </div>
        <div className="docsRight">
          <i onClick={() => { setIsDeleteModelShow(true) }} className="delete text-2xl text-red-500 cursor-pointer transition-all hover:text-red-600"><MdDelete /></i>
        </div>
      </div>

      {isDeleteModelShow && (
        <div className="deleteDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 w-screen h-screen flex items-center justify-center">
          <div className="deleteModel flex flex-col justify-center p-6 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg w-1/3 shadow-lg">
            <h3 className='text-xl font-semibold mb-4'>Delete Document</h3>
            <div className="flex items-center gap-4 mb-4">
              <img src={deleteImg} alt="" className="w-12 h-12" />
              <div>
                <h3 className='text-lg'>Do You Want to Delete This Document?</h3>
                <p className='text-sm text-gray-500'>Delete / Cancel</p>
              </div>
            </div>
            <div className="flex mt-4 items-center gap-4 justify-between w-full">
              <button onClick={() => { deleteDoc(docs._id, docID) }} className='p-3 bg-red-500 transition-all hover:bg-red-600 text-white rounded-lg w-1/2'>Delete</button>
              <button onClick={() => { setIsDeleteModelShow(false) }} className='p-3 bg-gray-300 text-black rounded-lg w-1/2'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Docs;
